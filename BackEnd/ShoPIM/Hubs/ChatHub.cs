using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Globalization;
using System.Text;
using System.Text.Json;
using ShoPIM.Data;
using ShoPIM.Models;

namespace ShoPIM.Hubs
{
    public class ChatHub : Hub
    {
        private readonly IServiceScopeFactory _scopeFactory;
        private readonly IConfiguration _config;

        public ChatHub(IServiceScopeFactory scopeFactory, IConfiguration config)
        {
            _scopeFactory = scopeFactory;
            _config = config;
        }

        // Cliente ou admin entra na sala de uma conversa
        public async Task EntrarConversa(string conversaId)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, $"conversa_{conversaId}");
        }

        // Admin entra no grupo de notificações gerais
        public async Task EntrarComoAdmin()
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, "admins");
        }

        // Envia uma mensagem — salva no banco e transmite para a sala
        public async Task<bool> EnviarMensagem(int conversaId, string conteudo, string remetenteTipo, string remetenteNome)
        {
            using var scope = _scopeFactory.CreateScope();
            var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();

            var conversaCount = await db.Conversa
                .Where(c => c.Id == conversaId)
                .CountAsync();

            if (conversaCount == 0)
            {
                return false;
            }

            var nextId = db.Database
                .SqlQueryRaw<int>("SELECT SEQ_MENSAGEM.NEXTVAL AS \"Value\" FROM DUAL")
                .AsEnumerable()
                .First();

            var mensagem = new Mensagem
            {
                Id = nextId,
                ConversaId = conversaId,
                Conteudo = conteudo,
                RemetenteTipo = remetenteTipo,
                RemetenteNome = remetenteNome,
                EnviadoEm = DateTime.Now,
            };

            db.Mensagem.Add(mensagem);
            await db.SaveChangesAsync();

            await Clients.Group($"conversa_{conversaId}").SendAsync("ReceberMensagem", new
            {
                id = mensagem.Id,
                conversaId = mensagem.ConversaId,
                conteudo = mensagem.Conteudo,
                remetenteTipo = mensagem.RemetenteTipo,
                remetenteNome = mensagem.RemetenteNome,
                enviadoEm = mensagem.EnviadoEm,
            });

            await Clients.Group("admins").SendAsync("ConversaAtualizada", new
            {
                conversaId,
                ultimaMensagem = conteudo,
                remetenteNome,
                enviadoEm = mensagem.EnviadoEm,
            });

            return true;
        }

        // Novo método para o SignalR processar a IA e responder na sala
        public async Task PedirRespostaBot(int conversaId, string textoUsuario)
        {
            try
            {
                using var scope = _scopeFactory.CreateScope();
                var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();

                var produtosDisponiveis = await db.Product
                    .Take(50)
                    .Select(p => $"- {p.Descricao} | Preço: R$ {p.Preco.ToString("0.00", CultureInfo.InvariantCulture)} | Estoque: {p.Quantidade.ToString("0.##", CultureInfo.InvariantCulture)}")
                    .ToListAsync();

                var catalogoStr = string.Join("\n", produtosDisponiveis);

                var historico = await db.Mensagem
                    .Where(m => m.ConversaId == conversaId)
                    .OrderByDescending(m => m.EnviadoEm)
                    .Take(15)
                    .OrderBy(m => m.EnviadoEm)
                    .ToListAsync();

                var systemPrompt = $@"Você é um assistente virtual de vendas da loja ShoPIM. Você ajuda os clientes com informações sobre produtos, compras e dúvidas gerais da loja. Seja sempre educado, conciso e prestativo. IMPORTANTE: Se o cliente fizer uma pergunta muito técnica, reclamar de um problema no sistema, ou pedir expressamente para falar com uma pessoa/atendente humano, você DEVE responder EXATAMENTE a frase: TRANSFERIR_PARA_HUMANO

Aqui está o catálogo de produtos disponíveis na loja atualmente:
{catalogoStr}";

                var messages = new List<object>
                {
                    new { role = "system", content = systemPrompt }
                };

                var lastValidMsg = historico.LastOrDefault(m => m.RemetenteNome != "Sistema");
                var foundCurrentMessage = lastValidMsg != null &&
                                          lastValidMsg.RemetenteTipo == "cliente" &&
                                          lastValidMsg.Conteudo == textoUsuario;

                foreach (var msg in historico)
                {
                    if (msg.RemetenteNome != "Sistema")
                    {
                        messages.Add(new
                        {
                            role = msg.RemetenteTipo == "cliente" ? "user" : "assistant",
                            content = msg.Conteudo
                        });
                    }
                }

                if (!foundCurrentMessage && !string.IsNullOrWhiteSpace(textoUsuario))
                {
                    messages.Add(new { role = "user", content = textoUsuario });
                }

                var groqApiKey = _config["Groq:ApiKey"];
                if (string.IsNullOrWhiteSpace(groqApiKey))
                {
                    return;
                }

                var requestBody = new { model = "llama-3.1-8b-instant", messages, temperature = 0.7 };

                using var client = new HttpClient { Timeout = TimeSpan.FromSeconds(12) };
                client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", groqApiKey);

                var content = new StringContent(JsonSerializer.Serialize(requestBody), Encoding.UTF8, "application/json");
                var response = await client.PostAsync("https://api.groq.com/openai/v1/chat/completions", content);
                if (!response.IsSuccessStatusCode)
                {
                    return;
                }

                var responseString = await response.Content.ReadAsStringAsync();
                using var jsonDoc = JsonDocument.Parse(responseString);
                var respostaGroq = jsonDoc.RootElement
                    .GetProperty("choices")[0]
                    .GetProperty("message")
                    .GetProperty("content")
                    .GetString()
                    ?.Trim();

                if (string.IsNullOrEmpty(respostaGroq))
                {
                    return;
                }

                if (respostaGroq.Contains("TRANSFERIR_PARA_HUMANO"))
                {
                    await EnviarMensagem(conversaId, "Vou transferir você para um de nossos atendentes humanos. Por favor, aguarde um momento.", "admin", "Sistema");
                    await Clients.Group($"conversa_{conversaId}").SendAsync("DesativarBot");
                    return;
                }

                await EnviarMensagem(conversaId, respostaGroq, "admin", "Assistente Virtual");
            }
            catch
            {
                return;
            }
        }
    }
}

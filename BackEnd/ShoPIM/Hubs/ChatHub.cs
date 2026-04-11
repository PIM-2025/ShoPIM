using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using ShoPIM.Data;
using ShoPIM.Models;

namespace ShoPIM.Hubs
{
    public class ChatHub : Hub
    {
        private readonly IServiceScopeFactory _scopeFactory;

        public ChatHub(IServiceScopeFactory scopeFactory)
        {
            _scopeFactory = scopeFactory;
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
        public async Task EnviarMensagem(int conversaId, string conteudo, string remetenteTipo, string remetenteNome)
        {
            using var scope = _scopeFactory.CreateScope();
            var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();

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

            // Broadcast para todos na sala da conversa
            await Clients.Group($"conversa_{conversaId}").SendAsync("ReceberMensagem", new
            {
                mensagem.Id,
                mensagem.ConversaId,
                mensagem.Conteudo,
                mensagem.RemetenteTipo,
                mensagem.RemetenteNome,
                mensagem.EnviadoEm,
            });

            // Notifica admins sobre nova atividade na conversa
            await Clients.Group("admins").SendAsync("ConversaAtualizada", new
            {
                conversaId,
                ultimaMensagem = conteudo,
                remetenteNome,
                enviadoEm = mensagem.EnviadoEm,
            });
        }
    }
}

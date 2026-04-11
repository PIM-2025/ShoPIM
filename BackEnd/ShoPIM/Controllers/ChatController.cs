using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using ShoPIM.Data;
using ShoPIM.Hubs;
using ShoPIM.Models;

namespace ShoPIM.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ChatController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IHubContext<ChatHub> _hub;

        public ChatController(AppDbContext context, IHubContext<ChatHub> hub)
        {
            _context = context;
            _hub = hub;
        }

        #region GET: api/chat/conversas (admin — todas as conversas)
        [HttpGet("conversas")]
        public async Task<ActionResult<IEnumerable<object>>> GetConversas()
        {
            var conversas = await _context.Conversa
                .Include(c => c.Mensagens)
                .OrderByDescending(c => c.CriadoEm)
                .Select(c => new
                {
                    c.Id,
                    c.NomeCliente,
                    c.ClienteId,
                    c.Status,
                    c.CriadoEm,
                    UltimaMensagem = c.Mensagens
                        .OrderByDescending(m => m.EnviadoEm)
                        .Select(m => new { m.Conteudo, m.RemetenteTipo, m.EnviadoEm })
                        .FirstOrDefault(),
                    TotalMensagens = c.Mensagens.Count,
                })
                .ToListAsync();

            return Ok(conversas);
        }
        #endregion

        #region GET: api/chat/conversas/{id}/mensagens
        [HttpGet("conversas/{id}/mensagens")]
        public async Task<ActionResult<IEnumerable<Mensagem>>> GetMensagens(int id)
        {
            var mensagens = await _context.Mensagem
                .Where(m => m.ConversaId == id)
                .OrderBy(m => m.EnviadoEm)
                .ToListAsync();

            return Ok(mensagens);
        }
        #endregion

        #region POST: api/chat/conversas (cliente abre conversa)
        [HttpPost("conversas")]
        public async Task<ActionResult<Conversa>> CriarConversa([FromBody] CriarConversaRequest request)
        {
            var nextId = _context.Database
                .SqlQueryRaw<int>("SELECT SEQ_CONVERSA.NEXTVAL AS \"Value\" FROM DUAL")
                .AsEnumerable()
                .First();

            var conversa = new Conversa
            {
                Id = nextId,
                NomeCliente = request.NomeCliente,
                ClienteId = request.ClienteId,
                Status = "aberta",
                CriadoEm = DateTime.Now,
            };

            _context.Conversa.Add(conversa);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetConversas), new { id = conversa.Id }, conversa);
        }
        #endregion

        #region PUT: api/chat/conversas/{id}/fechar
        [HttpPut("conversas/{id}/fechar")]
        public async Task<ActionResult> FecharConversa(int id)
        {
            var conversa = await _context.Conversa.FindAsync(id);
            if (conversa == null) return NotFound();

            conversa.Status = "fechada";
            await _context.SaveChangesAsync();

            // Notifica o widget do cliente em tempo real
            await _hub.Clients
                .Group($"conversa_{id}")
                .SendAsync("ConversaFechada", id);

            return NoContent();
        }
        #endregion
    }

    public class CriarConversaRequest
    {
        public string NomeCliente { get; set; } = string.Empty;
        public int? ClienteId { get; set; }
    }
}

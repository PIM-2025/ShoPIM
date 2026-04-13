using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ShoPIM.Data;
using ShoPIM.Models;
using System.ComponentModel.DataAnnotations;
using System.Security.Claims;

namespace ShoPIM.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PerguntaController : ControllerBase
    {
        private readonly AppDbContext _context;

        public PerguntaController(AppDbContext context)
        {
            _context = context;
        }

        #region GET: api/pergunta/{idProduto}
        [HttpGet("{idProduto}")]
        public async Task<ActionResult> GetPerguntas(int idProduto)
        {
            var perguntas = await _context.Pergunta
                .Include(p => p.Usuario)
                .Where(p => p.IdProduto == idProduto)
                .OrderByDescending(p => p.CriadoEm)
                .Select(p => new
                {
                    p.Id,
                    p.IdProduto,
                    p.IdUser,
                    nomeUsuario = p.Usuario != null ? p.Usuario.Nome : "Anônimo",
                    p.Texto,
                    p.Resposta,
                    p.RespondidoEm,
                    p.CriadoEm,
                })
                .ToListAsync();

            return Ok(perguntas);
        }
        #endregion

        #region POST: api/pergunta
        [Authorize]
        [HttpPost]
        public async Task<ActionResult> FazerPergunta([FromBody] FazerPerguntaRequest request)
        {
            var idUser = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);

            var nextId = _context.Database
                .SqlQueryRaw<int>("SELECT SEQ_PERGUNTA.NEXTVAL AS \"Value\" FROM DUAL")
                .AsEnumerable()
                .First();

            _context.Pergunta.Add(new Pergunta
            {
                Id = nextId,
                IdProduto = request.IdProduto,
                IdUser = idUser,
                Texto = request.Texto.Trim(),
                CriadoEm = DateTime.Now,
            });

            await _context.SaveChangesAsync();
            return Created("", new { message = "Pergunta enviada!" });
        }
        #endregion

        #region POST: api/pergunta/{id}/resposta
        [Authorize(Roles = "1")]
        [HttpPost("{id}/resposta")]
        public async Task<ActionResult> Responder(int id, [FromBody] ResponderRequest request)
        {
            var pergunta = await _context.Pergunta.FindAsync(id);
            if (pergunta == null) return NotFound();

            pergunta.Resposta = request.Resposta.Trim();
            pergunta.RespondidoEm = DateTime.Now;

            await _context.SaveChangesAsync();
            return NoContent();
        }
        #endregion

        #region DELETE: api/pergunta/{id}
        [Authorize]
        [HttpDelete("{id}")]
        public async Task<ActionResult> DeletarPergunta(int id)
        {
            var idUser = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
            var isAdmin = User.FindFirst(ClaimTypes.Role)?.Value == "1";

            var pergunta = await _context.Pergunta.FindAsync(id);
            if (pergunta == null) return NotFound();

            if (!isAdmin && pergunta.IdUser != idUser)
                return Forbid();

            _context.Pergunta.Remove(pergunta);
            await _context.SaveChangesAsync();
            return NoContent();
        }
        #endregion
    }

    public class FazerPerguntaRequest
    {
        [Required]
        public int IdProduto { get; set; }

        [Required, MaxLength(2000)]
        public string Texto { get; set; } = string.Empty;
    }

    public class ResponderRequest
    {
        [Required, MaxLength(2000)]
        public string Resposta { get; set; } = string.Empty;
    }
}

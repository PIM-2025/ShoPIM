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
    public class AvaliacaoController : ControllerBase
    {
        private readonly AppDbContext _context;

        public AvaliacaoController(AppDbContext context)
        {
            _context = context;
        }

        #region GET: api/avaliacao/{idProduto}
        [HttpGet("{idProduto}")]
        public async Task<ActionResult> GetAvaliacoes(int idProduto)
        {
            var avaliacoes = await _context.Avaliacao
                .Include(a => a.Usuario)
                .Where(a => a.IdProduto == idProduto)
                .OrderByDescending(a => a.CriadoEm)
                .Select(a => new
                {
                    a.Id,
                    a.IdProduto,
                    a.IdUser,
                    nomeUsuario = a.Usuario!.Nome,
                    a.Nota,
                    a.Comentario,
                    a.CriadoEm,
                })
                .ToListAsync();

            var media = avaliacoes.Count > 0
                ? Math.Round(avaliacoes.Average(a => (double)a.Nota), 1)
                : 0.0;

            bool podeAvaliar = false;
            bool jaAvaliou = false;

            var claimId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (claimId != null)
            {
                var idUser = int.Parse(claimId);

                jaAvaliou = avaliacoes.Any(a => a.IdUser == idUser);

                if (!jaAvaliou)
                {
                    podeAvaliar = await _context.Pedido
                        .Where(p => p.IdUsuario == idUser && p.Status == "concluído")
                        .AnyAsync(p => p.Itens.Any(i => i.IdProduto == idProduto));
                }
            }

            return Ok(new { media, total = avaliacoes.Count, podeAvaliar, jaAvaliou, avaliacoes });
        }
        #endregion

        #region POST: api/avaliacao
        [Authorize]
        [HttpPost]
        public async Task<ActionResult> CriarAvaliacao([FromBody] CriarAvaliacaoRequest request)
        {
            var idUser = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);

            var comprouEConcluiu = await _context.Pedido
                .Where(p => p.IdUsuario == idUser && p.Status == "concluído")
                .AnyAsync(p => p.Itens.Any(i => i.IdProduto == request.IdProduto));

            if (!comprouEConcluiu)
                return Forbid();

            var jaAvaliou = await _context.Avaliacao
                .AnyAsync(a => a.IdProduto == request.IdProduto && a.IdUser == idUser);

            if (jaAvaliou)
                return Conflict(new { message = "Você já avaliou este produto." });

            var nextId = _context.Database
                .SqlQueryRaw<int>("SELECT SEQ_AVALIACAO.NEXTVAL AS \"Value\" FROM DUAL")
                .AsEnumerable()
                .First();

            _context.Avaliacao.Add(new Avaliacao
            {
                Id = nextId,
                IdProduto = request.IdProduto,
                IdUser = idUser,
                Nota = request.Nota,
                Comentario = request.Comentario?.Trim(),
                CriadoEm = DateTime.Now,
            });

            await _context.SaveChangesAsync();
            return Created("", new { message = "Avaliação registrada!" });
        }
        #endregion

        #region DELETE: api/avaliacao/{id}
        [Authorize]
        [HttpDelete("{id}")]
        public async Task<ActionResult> DeletarAvaliacao(int id)
        {
            var idUser = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
            var isAdmin = User.FindFirst(ClaimTypes.Role)?.Value == "1";

            var avaliacao = await _context.Avaliacao.FindAsync(id);
            if (avaliacao == null) return NotFound();

            if (!isAdmin && avaliacao.IdUser != idUser)
                return Forbid();

            _context.Avaliacao.Remove(avaliacao);
            await _context.SaveChangesAsync();
            return NoContent();
        }
        #endregion
    }

    public class CriarAvaliacaoRequest
    {
        [Required]
        public int IdProduto { get; set; }

        [Required, Range(1, 5)]
        public int Nota { get; set; }

        [MaxLength(1000)]
        public string? Comentario { get; set; }
    }
}

using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ShoPIM.Data;
using ShoPIM.Models;

namespace ShoPIM.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ConfiguracaoController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ConfiguracaoController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult> Get()
        {
            var config = await _context.Configuracao.FirstOrDefaultAsync();
            if (config == null)
                return Ok(new { id = 1, nome = "Minha Loja", descricao = (string?)null, email = (string?)null, telefone = (string?)null, whatsapp = (string?)null, freteGratisAcima = (decimal?)null, logoUrl = (string?)null });

            return Ok(new
            {
                config.Id,
                config.Nome,
                config.Descricao,
                config.Email,
                config.Telefone,
                config.Whatsapp,
                config.FreteGratisAcima,
                config.LogoUrl,
            });
        }

        [HttpPut]
        public async Task<ActionResult> Salvar([FromBody] SalvarConfiguracaoRequest request)
        {
            var config = await _context.Configuracao.FirstOrDefaultAsync();

            if (config == null)
            {
                config = new Configuracao { Id = 1 };
                _context.Configuracao.Add(config);
            }

            config.Nome = request.Nome ?? config.Nome;
            config.Descricao = request.Descricao;
            config.Email = request.Email;
            config.Telefone = request.Telefone;
            config.Whatsapp = request.Whatsapp;
            config.FreteGratisAcima = request.FreteGratisAcima;
            config.LogoUrl = request.LogoUrl;

            await _context.SaveChangesAsync();
            return NoContent();
        }
    }

    public class SalvarConfiguracaoRequest
    {
        public string? Nome { get; set; }
        public string? Descricao { get; set; }
        public string? Email { get; set; }
        public string? Telefone { get; set; }
        public string? Whatsapp { get; set; }
        public decimal? FreteGratisAcima { get; set; }
        public string? LogoUrl { get; set; }
    }
}

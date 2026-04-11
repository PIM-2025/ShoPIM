using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ShoPIM.Data;
using System.Globalization;

namespace ShoPIM.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DashboardController : ControllerBase
    {
        private readonly AppDbContext _context;

        public DashboardController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet("badges")]
        public async Task<ActionResult> GetBadges()
        {
            var conversasAbertas = await _context.Conversa.CountAsync(c => c.Status == "aberta");
            var pedidosPendentes = await _context.Pedido.CountAsync(p => p.Status == "pendente");
            return Ok(new { conversasAbertas, pedidosPendentes });
        }

        [HttpGet("stats")]
        public async Task<ActionResult> GetStats()
        {
            var totalClientes = await _context.Users.CountAsync(u => u.Role == 2);
            var totalProdutos = await _context.Product.CountAsync();
            var conversasAbertas = await _context.Conversa.CountAsync(c => c.Status == "aberta");
            var totalAdmins = await _context.Users.CountAsync(u => u.Role == 1);

            // Clientes cadastrados nos últimos 12 meses (carrega datas em memória)
            var inicio = new DateTime(DateTime.Now.Year, DateTime.Now.Month, 1).AddMonths(-11);
            var datas = await _context.Users
                .Where(u => u.Role == 2 && u.DataCadastro >= inicio)
                .Select(u => u.DataCadastro)
                .ToListAsync();

            var ptBR = new CultureInfo("pt-BR");
            var clientesPorMes = Enumerable.Range(0, 12)
                .Select(i => inicio.AddMonths(i))
                .Select(d => new
                {
                    mes = d.ToString("MMM/yy", ptBR),
                    total = datas.Count(dt => dt.Year == d.Year && dt.Month == d.Month)
                })
                .ToList();

            // Últimos 5 clientes cadastrados
            var ultimosClientes = await _context.Users
                .Where(u => u.Role == 2)
                .OrderByDescending(u => u.DataCadastro)
                .Take(5)
                .Select(u => new { u.Id, u.Nome, u.Email, u.DataCadastro })
                .ToListAsync();

            return Ok(new
            {
                totalClientes,
                totalProdutos,
                conversasAbertas,
                totalAdmins,
                clientesPorMes,
                ultimosClientes
            });
        }
    }
}

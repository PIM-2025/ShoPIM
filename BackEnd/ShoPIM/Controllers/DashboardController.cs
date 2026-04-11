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

            var inicio = new DateTime(DateTime.Now.Year, DateTime.Now.Month, 1).AddMonths(-11);
            var ptBR = new CultureInfo("pt-BR");

            // Clientes por mês
            var datasClientes = await _context.Users
                .Where(u => u.Role == 2 && u.DataCadastro >= inicio)
                .Select(u => u.DataCadastro)
                .ToListAsync();

            var clientesPorMes = Enumerable.Range(0, 12)
                .Select(i => inicio.AddMonths(i))
                .Select(d => new
                {
                    mes = d.ToString("MMM/yy", ptBR),
                    total = datasClientes.Count(dt => dt.Year == d.Year && dt.Month == d.Month)
                })
                .ToList();

            // Últimos 5 clientes cadastrados
            var ultimosClientes = await _context.Users
                .Where(u => u.Role == 2)
                .OrderByDescending(u => u.DataCadastro)
                .Take(5)
                .Select(u => new { u.Id, u.Nome, u.Email, u.DataCadastro })
                .ToListAsync();

            // Vendas
            var totalPedidos = await _context.Pedido.CountAsync();
            var pedidosPendentes = await _context.Pedido.CountAsync(p => p.Status == "pendente");
            var receitaTotal = await _context.Pedido
                .Where(p => p.Status != "cancelado")
                .SumAsync(p => (decimal?)p.Total) ?? 0m;
            var ticketMedio = totalPedidos > 0
                ? Math.Round(receitaTotal / totalPedidos, 2)
                : 0m;

            // Receita por mês (últimos 12 meses, excluindo cancelados)
            var pedidosRecentes = await _context.Pedido
                .Where(p => p.DataPedido >= inicio && p.Status != "cancelado")
                .Select(p => new { p.DataPedido, p.Total })
                .ToListAsync();

            var receitaPorMes = Enumerable.Range(0, 12)
                .Select(i => inicio.AddMonths(i))
                .Select(d => new
                {
                    mes = d.ToString("MMM/yy", ptBR),
                    total = pedidosRecentes
                        .Where(p => p.DataPedido.Year == d.Year && p.DataPedido.Month == d.Month)
                        .Sum(p => (double)p.Total)
                })
                .ToList();

            // Últimos 5 pedidos
            var ultimosPedidosRaw = await _context.Pedido
                .Include(p => p.Usuario)
                .OrderByDescending(p => p.DataPedido)
                .Take(5)
                .ToListAsync();

            var ultimosPedidos = ultimosPedidosRaw.Select(p => new
            {
                p.Id,
                p.Status,
                p.DataPedido,
                p.Total,
                Cliente = p.Usuario == null ? null : new { p.Usuario.Nome, p.Usuario.Email }
            }).ToList();

            return Ok(new
            {
                totalClientes,
                totalProdutos,
                conversasAbertas,
                totalPedidos,
                pedidosPendentes,
                receitaTotal,
                ticketMedio,
                clientesPorMes,
                ultimosClientes,
                receitaPorMes,
                ultimosPedidos
            });
        }
    }
}

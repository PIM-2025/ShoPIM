using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ShoPIM.Data;
using ShoPIM.Models;

namespace ShoPIM.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PedidoController : ControllerBase
    {
        private readonly AppDbContext _context;

        public PedidoController(AppDbContext context)
        {
            _context = context;
        }

        #region POST: api/pedido — finaliza compra a partir do carrinho
        [Authorize]
        [HttpPost]
        public async Task<ActionResult> CriarPedido([FromBody] CriarPedidoRequest request)
        {
            var itensCarrinho = await _context.Cart
                .Include(c => c.Produto)
                .Where(c => c.IdUsuario == request.IdUsuario)
                .ToListAsync();

            if (!itensCarrinho.Any())
                return BadRequest(new { message = "Carrinho vazio." });

            // Upsert endereço
            var endereco = await _context.Address
                .FirstOrDefaultAsync(a => a.IdUser == request.IdUsuario);

            if (endereco == null)
            {
                var nextAddressId = _context.Database
                    .SqlQueryRaw<int>("SELECT SEQ_ADDRESS.NEXTVAL AS \"Value\" FROM DUAL")
                    .AsEnumerable().First();

                endereco = new Address
                {
                    Id = nextAddressId,
                    IdUser = request.IdUsuario,
                    Rua = request.Rua,
                    Numero = request.Numero,
                    Complemento = request.Complemento,
                    Cidade = request.Cidade,
                    Estado = request.Estado,
                    Cep = request.Cep,
                };
                _context.Address.Add(endereco);
                await _context.SaveChangesAsync();
            }
            else
            {
                endereco.Rua = request.Rua;
                endereco.Numero = request.Numero;
                endereco.Complemento = request.Complemento;
                endereco.Cidade = request.Cidade;
                endereco.Estado = request.Estado;
                endereco.Cep = request.Cep;
                await _context.SaveChangesAsync();
            }

            var total = itensCarrinho.Sum(i => i.Produto!.Preco * i.Quantidade);

            var nextPedidoId = _context.Database
                .SqlQueryRaw<int>("SELECT SEQ_PEDIDO.NEXTVAL AS \"Value\" FROM DUAL")
                .AsEnumerable().First();

            var pedido = new Pedido
            {
                Id = nextPedidoId,
                IdUsuario = request.IdUsuario,
                IdAddress = endereco.Id,
                Status = "pendente",
                DataPedido = DateTime.Now,
                Total = total,
            };

            _context.Pedido.Add(pedido);

            foreach (var item in itensCarrinho)
            {
                var nextItemId = _context.Database
                    .SqlQueryRaw<int>("SELECT SEQ_ITEM_PEDIDO.NEXTVAL AS \"Value\" FROM DUAL")
                    .AsEnumerable().First();

                _context.ItemPedido.Add(new ItemPedido
                {
                    Id = nextItemId,
                    IdPedido = nextPedidoId,
                    IdProduto = item.IdProduto,
                    Quantidade = item.Quantidade,
                    PrecoUnitario = item.Produto!.Preco,
                });
            }

            _context.Cart.RemoveRange(itensCarrinho);
            await _context.SaveChangesAsync();

            return Ok(new { id = nextPedidoId });
        }
        #endregion

        #region GET: api/pedido/meus/{idUsuario}
        [Authorize]
        [HttpGet("meus/{idUsuario}")]
        public async Task<ActionResult> GetMeusPedidos(int idUsuario)
        {
            var pedidos = await _context.Pedido
                .Include(p => p.Itens).ThenInclude(i => i.Produto)
                .Where(p => p.IdUsuario == idUsuario)
                .OrderByDescending(p => p.DataPedido)
                .Select(p => new
                {
                    p.Id,
                    p.Status,
                    p.DataPedido,
                    p.Total,
                    TotalItens = p.Itens.Sum(i => i.Quantidade),
                    Itens = p.Itens.Select(i => new
                    {
                        i.IdProduto,
                        i.Quantidade,
                        i.PrecoUnitario,
                        Descricao = i.Produto!.Descricao,
                        Imagem = i.Produto.Imagem,
                    })
                })
                .ToListAsync();

            return Ok(pedidos);
        }
        #endregion

        #region GET: api/pedido/{id}
        [Authorize]
        [HttpGet("{id}")]
        public async Task<ActionResult> GetPedido(int id)
        {
            var pedido = await _context.Pedido
                .Include(p => p.Itens).ThenInclude(i => i.Produto)
                .Include(p => p.Endereco)
                .Where(p => p.Id == id)
                .FirstOrDefaultAsync();

            if (pedido == null) return NotFound();

            return Ok(new
            {
                pedido.Id,
                pedido.Status,
                pedido.DataPedido,
                pedido.Total,
                Endereco = pedido.Endereco == null ? null : new
                {
                    pedido.Endereco.Rua,
                    pedido.Endereco.Numero,
                    pedido.Endereco.Complemento,
                    pedido.Endereco.Cidade,
                    pedido.Endereco.Estado,
                    pedido.Endereco.Cep,
                },
                Itens = pedido.Itens.Select(i => new
                {
                    i.IdProduto,
                    i.Quantidade,
                    i.PrecoUnitario,
                    Descricao = i.Produto!.Descricao,
                    Imagem = i.Produto.Imagem,
                })
            });
        }
        #endregion

        #region GET: api/pedido/todos — admin
        [Authorize(Roles = "1")]
        [HttpGet("todos")]
        public async Task<ActionResult> GetTodosPedidos()
        {
            var pedidos = await _context.Pedido
                .Include(p => p.Usuario)
                .Include(p => p.Itens)
                .OrderByDescending(p => p.DataPedido)
                .ToListAsync();

            return Ok(pedidos.Select(p => new
            {
                p.Id,
                p.Status,
                p.DataPedido,
                p.Total,
                TotalItens = p.Itens.Sum(i => i.Quantidade),
                Cliente = p.Usuario == null ? null : new
                {
                    p.Usuario.Id,
                    p.Usuario.Nome,
                    p.Usuario.Email,
                }
            }));
        }
        #endregion

        #region PATCH: api/pedido/{id}/status — admin
        [Authorize(Roles = "1")]
        [HttpPatch("{id}/status")]
        public async Task<ActionResult> AtualizarStatus(int id, [FromBody] AtualizarStatusRequest request)
        {
            var pedido = await _context.Pedido.FindAsync(id);
            if (pedido == null) return NotFound();

            pedido.Status = request.Status;
            await _context.SaveChangesAsync();
            return NoContent();
        }
        #endregion

        #region GET: api/pedido/endereco/{idUsuario}
        [Authorize]
        [HttpGet("endereco/{idUsuario}")]
        public async Task<ActionResult> GetEndereco(int idUsuario)
        {
            var endereco = await _context.Address
                .FirstOrDefaultAsync(a => a.IdUser == idUsuario);

            if (endereco == null) return NoContent();

            return Ok(new
            {
                endereco.Rua,
                endereco.Numero,
                endereco.Complemento,
                endereco.Cidade,
                endereco.Estado,
                endereco.Cep,
            });
        }
        #endregion
    }

    public class AtualizarStatusRequest
    {
        public string Status { get; set; } = string.Empty;
    }

    public class CriarPedidoRequest
    {
        public int IdUsuario { get; set; }
        public string? Rua { get; set; }
        public string? Numero { get; set; }
        public string? Complemento { get; set; }
        public string? Cidade { get; set; }
        public string? Estado { get; set; }
        public string? Cep { get; set; }
    }
}

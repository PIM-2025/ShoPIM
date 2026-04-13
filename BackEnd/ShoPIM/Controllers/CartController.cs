using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ShoPIM.Data;
using ShoPIM.Models;
using ShoPIM.Models.DTOs;

namespace ShoPIM.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class CartController : ControllerBase
    {
        #region Propriedades privadas
        private readonly AppDbContext _context;
        #endregion

        #region Construtor
        public CartController(AppDbContext context)
        {
            _context = context;
        }
        #endregion

        #region GET: api/cart/{idUsuario}
        [HttpGet("{idUsuario}")]
        public async Task<ActionResult<IEnumerable<Cart>>> GetCarrinho(int idUsuario)
        {
            var itens = await _context.Cart
                .Include(c => c.Produto)
                .Where(c => c.IdUsuario == idUsuario)
                .ToListAsync();

            return Ok(itens);
        }
        #endregion

        #region POST: api/cart
        [HttpPost]
        public async Task<ActionResult> AdicionarItem([FromBody] CartRequest request)
        {
            var existente = await _context.Cart
                .FirstOrDefaultAsync(c => c.IdUsuario == request.IdUsuario && c.IdProduto == request.IdProduto);

            if (existente != null)
            {
                existente.Quantidade += request.Quantidade;
                await _context.SaveChangesAsync();
                return Ok(existente);
            }

            var nextId = _context.Database
                .SqlQueryRaw<int>("SELECT SEQ_CART.NEXTVAL AS \"Value\" FROM DUAL")
                .AsEnumerable()
                .First();

            var item = new Cart
            {
                Id = nextId,
                IdUsuario = request.IdUsuario,
                IdProduto = request.IdProduto,
                Quantidade = request.Quantidade,
                DataAdicao = DateTime.Now,
            };

            _context.Cart.Add(item);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetCarrinho), new { idUsuario = item.IdUsuario }, item);
        }
        #endregion

        #region PUT: api/cart/{id}
        [HttpPut("{id}")]
        public async Task<ActionResult> AtualizarQuantidade(int id, [FromBody] Cart item)
        {
            var existente = await _context.Cart.FindAsync(id);
            if (existente == null) return NotFound(new { message = "Item não encontrado no cart." });

            existente.Quantidade = item.Quantidade;
            await _context.SaveChangesAsync();

            return NoContent();
        }
        #endregion

        #region DELETE: api/cart/{id}
        [HttpDelete("{id}")]
        public async Task<ActionResult> RemoverItem(int id)
        {
            var item = await _context.Cart.FindAsync(id);
            if (item == null) return NotFound(new { message = "Item não encontrado no cart." });

            _context.Cart.Remove(item);
            await _context.SaveChangesAsync();

            return NoContent();
        }
        #endregion

        #region DELETE: api/cart/limpar/{idUsuario}
        [HttpDelete("limpar/{idUsuario}")]
        public async Task<ActionResult> LimparCarrinho(int idUsuario)
        {
            var itens = await _context.Cart
                .Where(c => c.IdUsuario == idUsuario)
                .ToListAsync();

            _context.Cart.RemoveRange(itens);
            await _context.SaveChangesAsync();

            return NoContent();
        }
        #endregion
    }
}
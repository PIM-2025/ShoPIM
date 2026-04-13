using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ShoPIM.Data;
using ShoPIM.Models;

namespace ShoPIM.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductController : ControllerBase
    {
        #region Propriedades privadas
        private readonly AppDbContext _context;
        #endregion

        #region Construtor
        public ProductController(AppDbContext context)
        {
            _context = context;
        }
        #endregion

        #region GET: api/product
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Product>>> GetProducts()
        {
            return await _context.Product.ToListAsync();
        }
        #endregion

        #region GET: api/product/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<Product>> GetProduct(int id)
        {
            var product = await _context.Product
                .FirstOrDefaultAsync(p => p.Id == id);

            if (product == null) return NotFound(new { message = "Produto não encontrado." });
            return product;
        }
        #endregion

        #region POST: api/product
        [Authorize(Roles = "1")]
        [HttpPost]
        public async Task<ActionResult> CreateProduct([FromBody] Product product)
        {
            var nextId = _context.Database
                .SqlQueryRaw<int>("SELECT SEQ_PRODUCT.NEXTVAL AS \"Value\" FROM DUAL")
                .AsEnumerable()
                .First();

            product.Id = nextId;

            _context.Product.Add(product);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetProduct), new { id = product.Id }, product);
        }
        #endregion

        #region PUT: api/product/{id}
        [Authorize(Roles = "1")]
        [HttpPut("{id}")]
        public async Task<ActionResult> UpdateProduct(int id, [FromBody] Product product)
        {
            if (id != product.Id)
                return BadRequest(new { message = "ID divergente." });

            var existing = await _context.Product.FindAsync(id);
            if (existing == null) return NotFound(new { message = "Produto não encontrado." });

            existing.Descricao = product.Descricao;
            existing.Preco = product.Preco;
            existing.Categoria = product.Categoria;
            existing.Quantidade = product.Quantidade;
            existing.Imagem = product.Imagem;
            existing.DescricaoDetalhada = product.DescricaoDetalhada;

            await _context.SaveChangesAsync();
            return NoContent();
        }
        #endregion

        #region DELETE: api/product/{id}
        [Authorize(Roles = "1")]
        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteProduct(int id)
        {
            var product = await _context.Product.FindAsync(id);
            if (product == null) return NotFound(new { message = "Produto não encontrado." });

            _context.Product.Remove(product);
            await _context.SaveChangesAsync();

            return NoContent();
        }
        #endregion
    }
}
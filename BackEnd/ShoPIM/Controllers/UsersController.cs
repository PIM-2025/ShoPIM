using BCrypt.Net;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using ShoPIM.Data;
using ShoPIM.Models;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace ShoPIM.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IConfiguration _config;

        public UsersController(AppDbContext context, IConfiguration config)
        {
            _context = context;
            _config = config;
        }

        // GET: api/users
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Users>>> GetUsers()
        {
            return await _context.Users
                .Include(u => u.Addresses)
                .Include(u => u.Contacts)
                .ToListAsync();
        }

        // GET: api/users/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Users>> GetUser(long id)
        {
            var user = await _context.Users
                .Include(u => u.Addresses)
                .Include(u => u.Contacts)
                .FirstOrDefaultAsync(u => u.Id == id);

            if (user == null) return NotFound();
            return user;
        }

        // POST: api/users/cadastro
        [HttpPost("cadastro")]
        public async Task<ActionResult> Cadastro([FromBody] CadastroRequest request)
        {
            // Verifica se email já existe
            var existe = await _context.Users.Where(u => u.Email == request.Email).CountAsync() > 0;
            if (existe)
                return BadRequest(new { message = "E-mail já cadastrado." });

            var nextId = _context.Database.SqlQueryRaw<int>("SELECT SEQ_USERS.NEXTVAL AS \"Value\" FROM DUAL").AsEnumerable().First();

            var user = new Users
            {
                Id = nextId,
                Nome = request.Nome,
                Email = request.Email,
                Senha = BCrypt.Net.BCrypt.HashPassword(request.Senha),
                Cpf = request.Cpf,
                Role = 2,
                DataCadastro = DateTime.Now,
                Ativo = 1,
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetUser), new { id = user.Id }, new { message = "Usuário criado com sucesso!" });
        }

        // POST: api/users/login
        [HttpPost("login")]
        public async Task<ActionResult> Login([FromBody] LoginRequest request)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == request.Email);

            if (user == null || user.Senha == null)
                return Unauthorized(new { message = "E-mail ou senha inválidos." });

            if (!BCrypt.Net.BCrypt.Verify(request.Senha, user.Senha))
                return Unauthorized(new { message = "E-mail ou senha inválidos." });

            var jwt = GerarJwt(user);
            return Ok(new { jwt, nome = user.Nome, email = user.Email, role = user.Role });
        }

        private string GerarJwt(Users user)
        {
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Secret"]!));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Email, user.Email),
                new Claim(ClaimTypes.Name, user.Nome),
                new Claim(ClaimTypes.Role, user.Role.ToString()),
            };

            var token = new JwtSecurityToken(
                expires: DateTime.UtcNow.AddHours(8),
                signingCredentials: creds,
                claims: claims
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }

    public class CadastroRequest
    {
        public string Nome { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Senha { get; set; } = string.Empty;
        public string? Cpf { get; set; }
    }

    public class LoginRequest
    {
        public string Email { get; set; } = string.Empty;
        public string Senha { get; set; } = string.Empty;
    }
}
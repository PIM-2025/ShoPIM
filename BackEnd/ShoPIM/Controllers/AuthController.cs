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
    public class AuthController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IConfiguration _config;

        public AuthController(AppDbContext context, IConfiguration config)
        {
            _context = context;
            _config = config;
        }

        [HttpPost("google")]
        public async Task<IActionResult> GoogleLogin([FromBody] GoogleUserRequest request)
        {
            try
            {
                // 1. Busca ou cria o usuário no Oracle
                var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == request.Email);

                if (user == null)
                {
                    var nextId = _context.Database.SqlQueryRaw<int>("SELECT SEQ_USERS.NEXTVAL AS \"Value\" FROM DUAL").AsEnumerable().First();
                    user = new Users
                    {
                        Id = nextId,
                        Nome = request.Nome,
                        Email = request.Email,
                        Role = 2,
                        DataCadastro = DateTime.Now,
                        Ativo = 1,
                    };

                    _context.Users.Add(user);
                    await _context.SaveChangesAsync();
                }

                // 2. Gera o JWT
                var jwt = GerarJwt(user);

                return Ok(new { jwt, nome = user.Nome, email = user.Email, role = user.Role });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Erro interno", erro = ex.Message });
            }
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

    public class GoogleUserRequest
    {
        public string Email { get; set; } = string.Empty;
        public string Nome { get; set; } = string.Empty;
    }
}
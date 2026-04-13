using BCrypt.Net;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using ShoPIM.Data;
using ShoPIM.Models;
using System.Collections.Concurrent;
using System.ComponentModel.DataAnnotations;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace ShoPIM.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        #region Propriedades privadas
        private readonly AppDbContext _context;
        private readonly IConfiguration _config;

        // token → (email, expiração) — armazenado em memória
        private static readonly ConcurrentDictionary<string, (string Email, DateTime Expiry)> _resetTokens = new();
        #endregion

        #region Construtor
        public UsersController(AppDbContext context, IConfiguration config)
        {
            _context = context;
            _config = config;
        }
        #endregion

        #region GET: api/users
        [Authorize(Roles = "1")]
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Users>>> GetUsers()
        {
            return await _context.Users
                .Include(u => u.Addresses)
                .Include(u => u.Contacts)
                .ToListAsync();
        }
        #endregion

        #region GET: api/users/{id}
        [Authorize]
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
        #endregion

        #region PUT: api/users/{id}
        [Authorize(Roles = "1")]
        [HttpPut("{id}")]
        public async Task<ActionResult> UpdateUser(int id, [FromBody] UpdateUserRequest request)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null) return NotFound(new { message = "Usuário não encontrado." });

            user.Nome = request.Nome;
            user.Email = request.Email;
            user.Cpf = request.Cpf;
            user.Ativo = request.Ativo;
            user.Role = request.Role;

            await _context.SaveChangesAsync();
            return NoContent();
        }
        #endregion

        #region DELETE: api/users/{id}
        [Authorize(Roles = "1")]
        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteUser(int id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null) return NotFound(new { message = "Usuário não encontrado." });

            _context.Users.Remove(user);
            await _context.SaveChangesAsync();
            return NoContent();
        }
        #endregion

        #region POST: api/users/cadastro
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
        #endregion

        #region POST: api/users/login
        [HttpPost("login")]
        public async Task<ActionResult> Login([FromBody] LoginRequest request)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == request.Email);

            if (user == null || user.Senha == null)
                return Unauthorized(new { message = "E-mail ou senha inválidos." });

            if (!BCrypt.Net.BCrypt.Verify(request.Senha, user.Senha))
                return Unauthorized(new { message = "E-mail ou senha inválidos." });

            var jwt = GerarJwt(user);
            return Ok(new { jwt, id = user.Id, nome = user.Nome, email = user.Email, role = user.Role });
        }
        #endregion

        #region POST: api/users/forgot-password
        [HttpPost("forgot-password")]
        public async Task<ActionResult> ForgotPassword([FromBody] ForgotPasswordRequest request)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == request.Email);

            // Retorna 200 mesmo quando o e-mail não existe (evita enumeração)
            if (user == null)
                return Ok(new { message = "Se o e-mail estiver cadastrado, você receberá um código em breve." });

            // Remove tokens anteriores do mesmo e-mail
            foreach (var kv in _resetTokens.Where(k => k.Value.Email == request.Email).ToList())
                _resetTokens.TryRemove(kv.Key, out _);

            var token = new Random().Next(100000, 999999).ToString();
            _resetTokens[token] = (request.Email, DateTime.UtcNow.AddHours(1));

            await EnviarEmailResetAsync(request.Email, user.Nome ?? "Cliente", token);

            return Ok(new { message = "Código enviado para o seu e-mail." });
        }
        #endregion

        #region Enviar e-mail de reset
        private async Task EnviarEmailResetAsync(string destinatario, string nome, string token)
        {
            var apiKey = _config["Brevo:ApiKey"]
                ?? throw new InvalidOperationException("Brevo:ApiKey não configurado.");

            var html = $"""
                <div style="font-family:sans-serif;max-width:480px;margin:auto;padding:32px;border:1px solid #e5e7eb;border-radius:12px">
                  <h2 style="margin:0 0 8px;font-size:20px">Redefinição de senha</h2>
                  <p style="color:#6b7280;margin:0 0 24px">Olá, <strong>{nome}</strong>. Use o código abaixo para redefinir sua senha:</p>
                  <div style="background:#f4f4f5;border-radius:8px;padding:20px;text-align:center;letter-spacing:8px;font-size:32px;font-weight:700;color:#ea580c">
                    {token}
                  </div>
                  <p style="color:#6b7280;margin:24px 0 0;font-size:13px">O código é válido por <strong>1 hora</strong>. Se você não solicitou a redefinição, ignore este e-mail.</p>
                </div>
                """;

            using var http = new HttpClient();
            http.DefaultRequestHeaders.Add("api-key", apiKey);

            var body = new
            {
                sender = new { name = "ShoPIM", email = "shopim.noreply@gmail.com" },
                to = new[] { new { email = destinatario, name = nome } },
                subject = "Seu código de redefinição de senha - ShoPIM",
                htmlContent = html
            };

            var response = await http.PostAsJsonAsync("https://api.brevo.com/v3/smtp/email", body);
            response.EnsureSuccessStatusCode();
        }
        #endregion

        #region POST: api/users/reset-password
        [HttpPost("reset-password")]
        public async Task<ActionResult> ResetPassword([FromBody] ResetPasswordRequest request)
        {
            if (!_resetTokens.TryGetValue(request.Token, out var entry))
                return BadRequest(new { message = "Código inválido ou expirado." });

            if (DateTime.UtcNow > entry.Expiry)
            {
                _resetTokens.TryRemove(request.Token, out _);
                return BadRequest(new { message = "Código expirado. Solicite um novo." });
            }

            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == entry.Email);
            if (user == null)
                return BadRequest(new { message = "Usuário não encontrado." });

            user.Senha = BCrypt.Net.BCrypt.HashPassword(request.NovaSenha);
            await _context.SaveChangesAsync();
            _resetTokens.TryRemove(request.Token, out _);

            return Ok(new { message = "Senha redefinida com sucesso!" });
        }
        #endregion

        #region Gerar JWT
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
        #endregion
    }

    #region Classes de request
    public class CadastroRequest
    {
        [Required(ErrorMessage = "Nome é obrigatório.")]
        [MaxLength(100, ErrorMessage = "Nome deve ter no máximo 100 caracteres.")]
        public string Nome { get; set; } = string.Empty;

        [Required(ErrorMessage = "E-mail é obrigatório.")]
        [EmailAddress(ErrorMessage = "E-mail inválido.")]
        public string Email { get; set; } = string.Empty;

        [Required(ErrorMessage = "Senha é obrigatória.")]
        [MinLength(6, ErrorMessage = "Senha deve ter no mínimo 6 caracteres.")]
        public string Senha { get; set; } = string.Empty;

        [StringLength(14, ErrorMessage = "CPF inválido.")]
        public string? Cpf { get; set; }
    }

    public class LoginRequest
    {
        [Required(ErrorMessage = "E-mail é obrigatório.")]
        [EmailAddress(ErrorMessage = "E-mail inválido.")]
        public string Email { get; set; } = string.Empty;

        [Required(ErrorMessage = "Senha é obrigatória.")]
        public string Senha { get; set; } = string.Empty;
    }

    public class ForgotPasswordRequest
    {
        [Required(ErrorMessage = "E-mail é obrigatório.")]
        [EmailAddress(ErrorMessage = "E-mail inválido.")]
        public string Email { get; set; } = string.Empty;
    }

    public class ResetPasswordRequest
    {
        [Required(ErrorMessage = "Código é obrigatório.")]
        public string Token { get; set; } = string.Empty;

        [Required(ErrorMessage = "Nova senha é obrigatória.")]
        [MinLength(6, ErrorMessage = "Senha deve ter no mínimo 6 caracteres.")]
        public string NovaSenha { get; set; } = string.Empty;
    }

    public class UpdateUserRequest
    {
        [Required(ErrorMessage = "Nome é obrigatório.")]
        [MaxLength(100, ErrorMessage = "Nome deve ter no máximo 100 caracteres.")]
        public string Nome { get; set; } = string.Empty;

        [Required(ErrorMessage = "E-mail é obrigatório.")]
        [EmailAddress(ErrorMessage = "E-mail inválido.")]
        public string Email { get; set; } = string.Empty;

        [StringLength(14, ErrorMessage = "CPF inválido.")]
        public string? Cpf { get; set; }

        public int Ativo { get; set; }
        public int Role { get; set; }
    }
    #endregion
}
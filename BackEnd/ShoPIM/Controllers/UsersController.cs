using BCrypt.Net;
using MailKit.Net.Smtp;
using MailKit.Security;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using MimeKit;
using ShoPIM.Data;
using ShoPIM.Models;
using System.Collections.Concurrent;
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
            var smtpHost  = _config["Email:Smtp"]!;
            var smtpPort  = int.Parse(_config["Email:Port"]!);
            var smtpUser  = _config["Email:User"]!;
            var smtpPass  = _config["Email:Password"]!;
            var remetente = _config["Email:NomeRemetente"] ?? "ShoPIM";

            var msg = new MimeMessage();
            msg.From.Add(new MailboxAddress(remetente, smtpUser));
            msg.To.Add(MailboxAddress.Parse(destinatario));
            msg.Subject = "Seu código de redefinição de senha - ShoPIM";

            msg.Body = new TextPart("html")
            {
                Text = $"""
                    <div style="font-family:sans-serif;max-width:480px;margin:auto;padding:32px;border:1px solid #e5e7eb;border-radius:12px">
                      <h2 style="margin:0 0 8px;font-size:20px">Redefinição de senha</h2>
                      <p style="color:#6b7280;margin:0 0 24px">Olá, <strong>{nome}</strong>. Use o código abaixo para redefinir sua senha:</p>
                      <div style="background:#f4f4f5;border-radius:8px;padding:20px;text-align:center;letter-spacing:8px;font-size:32px;font-weight:700;color:#ea580c">
                        {token}
                      </div>
                      <p style="color:#6b7280;margin:24px 0 0;font-size:13px">O código é válido por <strong>1 hora</strong>. Se você não solicitou a redefinição, ignore este e-mail.</p>
                    </div>
                    """
            };

            using var smtp = new SmtpClient();
            await smtp.ConnectAsync(smtpHost, smtpPort, SecureSocketOptions.StartTls);
            await smtp.AuthenticateAsync(smtpUser, smtpPass);
            await smtp.SendAsync(msg);
            await smtp.DisconnectAsync(true);
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

    public class ForgotPasswordRequest
    {
        public string Email { get; set; } = string.Empty;
    }

    public class ResetPasswordRequest
    {
        public string Token { get; set; } = string.Empty;
        public string NovaSenha { get; set; } = string.Empty;
    }
    #endregion
}
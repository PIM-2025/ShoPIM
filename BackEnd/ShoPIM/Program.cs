using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using ShoPIM.Data;
using System.Text;
using System.Text.Json.Serialization;

var builder = WebApplication.CreateBuilder(args);

// CORS — permite o frontend acessar o backend
builder.Services.AddCors(options =>
{
    options.AddPolicy("FrontendPolicy", policy =>
    {
        policy.WithOrigins(
            "http://localhost:5173",
            "https://shopim.vercel.app" // adicione sua URL do Vercel aqui
        )
        .AllowAnyHeader()
        .AllowAnyMethod();
    });
});

// JWT
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Secret"]!)
            ),
            ValidateIssuer = false,
            ValidateAudience = false,
        };
    });

builder.Services.AddControllers();
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseOracle(builder.Configuration.GetConnectionString("OracleConnection"))
);

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "ShoPIM API", Version = "v1" });
});

builder.Services.AddControllers().AddJsonOptions(options =>
{
    options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
});

var app = builder.Build();

app.UseSwagger();
app.UseSwaggerUI(c =>
{
    c.SwaggerEndpoint("/swagger/v1/swagger.json", "ShoPIM API V1");
    c.RoutePrefix = string.Empty;
});

app.UseHttpsRedirection();
app.UseCors("FrontendPolicy"); // <-- CORS antes do Authorization
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();
app.Run();
using CreditCard.Api.Infrastructure;
using CreditCard.Api.Services;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using AutoMapper;
using FluentValidation.AspNetCore;
using CreditCard.Api.Middleware;
using CreditCard.Application.Interfaces;
using CreditCard.Api.Infrastructure;
using CreditCard.Application.Services;
using CreditCard.Api.Mapping;

var builder = WebApplication.CreateBuilder(args);

// Añade servicios al dev contenedor
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddControllers().AddFluentValidation(cfg => cfg.RegisterValidatorsFromAssemblyContaining<Program>());

// CORS (conexión con el frontend)
var frontendUrl = builder.Configuration["Frontend:Url"] ?? "https://musical-space-guide-r4g4gqqgx49rhxpx4-5173.app.github.dev";
var localFrontendUrl = "http://127.0.0.1:5173";
builder.Services.AddCors(options =>
{
    options.AddPolicy("Frontend", policy =>
    {
        policy.WithOrigins(frontendUrl, localFrontendUrl)
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

AutoMapper
builder.Services.AddAutoMapper(typeof(MappingProfile));

// Configurar DbContext: preferir Postgres, recurrir a InMemory para local/desarrollo si falla la conexión
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
var useInMemoryEnv = Environment.GetEnvironmentVariable("USE_INMEMORY")?.ToLower() == "true";
var useInMemory = useInMemoryEnv;
if (!useInMemory && !string.IsNullOrWhiteSpace(connectionString))
{
    try
    {
        // Prueba de conectividad rápida con tiempo de espera corto
        using var conn = new Npgsql.NpgsqlConnection(connectionString);
        conn.Open();
        conn.Close();
        builder.Services.AddDbContext<AppDbContext>(options =>
            options.UseNpgsql(connectionString));
    }
    catch
    {
        useInMemory = true;
    }
}

if (useInMemory)
{
    builder.Services.AddDbContext<AppDbContext>(options =>
        options.UseInMemoryDatabase("InMemoryDb"));
}

// Repositorios y servicios de aplicaciones
builder.Services.AddScoped<ICardRepository, CardRepository>();
builder.Services.AddScoped<ITransactionRepository, TransactionRepository>();
builder.Services.AddScoped<CardService>();
builder.Services.AddScoped<PaymentService>();
builder.Services.AddScoped<TransactionService>();

// Configura JWT authentication
var jwtKey = builder.Configuration["Jwt:Key"] ?? "";
var jwtIssuer = builder.Configuration["Jwt:Issuer"] ?? "CreditCardApi";
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
    .AddJwtBearer(options =>
    {
        options.RequireHttpsMetadata = true;
        options.SaveToken = true;
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidIssuer = jwtIssuer,
            ValidateAudience = false,
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey))
        };
    });

builder.Services.AddAuthorization();
builder.Services.AddScoped<ITokenService, TokenService>();

var app = builder.Build();

// Configura la HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

// Middleware de manejo de excepciones globales
app.UseMiddleware<ExceptionMiddleware>();

// Usa CORS para frontend
app.UseCors("Frontend");

// Asegúrese de la compatibilidad del proveedor de base de datos. 
// Nota: ejecute las migraciones después de configurar la cadena de conexión.
app.UseAuthentication();
app.UseAuthorization();

// Base de datos en memoria de semillas en desarrollo cuando se utiliza
using (var scope = app.Services.CreateScope())
{
    var ctx = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    try
    {
        // Asegúrese de que la base de datos se cree para los proveedores que la necesitan
        ctx.Database.EnsureCreated();
    }
    catch
    {
        // Ignorar errores de creación de proveedores inalcanzables
    }
}

var summaries = new[]
{
    "Freezing", "Bracing", "Chilly", "Cool", "Mild", "Warm", "Balmy", "Hot", "Sweltering", "Scorching"
};

app.MapGet("/weatherforecast", () =>
{
    var forecast =  Enumerable.Range(1, 5).Select(index =>
        new WeatherForecast
        (
            DateOnly.FromDateTime(DateTime.Now.AddDays(index)),
            Random.Shared.Next(-20, 55),
            summaries[Random.Shared.Next(summaries.Length)]
        ))
        .ToArray();
    return forecast;
})
.WithName("GetWeatherForecast");

// Controladores enrutados por atributos del mapa
app.MapControllers();

app.Run();

record WeatherForecast(DateOnly Date, int TemperatureC, string? Summary)
{
    public int TemperatureF => 32 + (int)(TemperatureC / 0.5556);
}
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

// Add services to the container.
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddControllers().AddFluentValidation(cfg => cfg.RegisterValidatorsFromAssemblyContaining<Program>());

// CORS for frontend dev
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

builder.Services.AddAutoMapper(typeof(MappingProfile));

// Configure DbContext: prefer Postgres, fallback to InMemory for local/dev if connection fails
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
var useInMemoryEnv = Environment.GetEnvironmentVariable("USE_INMEMORY")?.ToLower() == "true";
var useInMemory = useInMemoryEnv;
if (!useInMemory && !string.IsNullOrWhiteSpace(connectionString))
{
    try
    {
        // Quick connectivity test with short timeout
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

// Repositories and application services
builder.Services.AddScoped<ICardRepository, CardRepository>();
builder.Services.AddScoped<ITransactionRepository, TransactionRepository>();
builder.Services.AddScoped<CardService>();
builder.Services.AddScoped<PaymentService>();
builder.Services.AddScoped<TransactionService>();

// Configure JWT authentication
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

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

// Global exception handler middleware
app.UseMiddleware<ExceptionMiddleware>();

// Use CORS for frontend
app.UseCors("Frontend");

// Ensure DB provider compatibility note: run migrations after configuring connection string.
app.UseAuthentication();
app.UseAuthorization();

// Seed in-memory DB in Development when used
using (var scope = app.Services.CreateScope())
{
    var ctx = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    try
    {
        // Ensure DB created for providers that need it
        ctx.Database.EnsureCreated();
    }
    catch
    {
        // ignore creation errors for unreachable providers
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

// Map attribute-routed controllers
app.MapControllers();

app.Run();

record WeatherForecast(DateOnly Date, int TemperatureC, string? Summary)
{
    public int TemperatureF => 32 + (int)(TemperatureC / 0.5556);
}
using System;
using System.Threading.Tasks;
using CreditCard.Application.Interfaces;
using CreditCard.Domain.Entities;

namespace CreditCard.Application.Services
{
    public class AuthResult
    {
        public bool Success { get; init; }
        public string? Error { get; init; }
        public string? Token { get; init; }
        public string? Username { get; init; }

        public static AuthResult Ok(string token, string username) =>
            new() { Success = true, Token = token, Username = username };

        public static AuthResult Fail(string error) =>
            new() { Success = false, Error = error };
    }

    public class AuthService
    {
        private readonly IUserRepository _users;
        private readonly ITokenService _tokenService;

        public AuthService(IUserRepository users, ITokenService tokenService)
        {
            _users = users;
            _tokenService = tokenService;
        }

        public async Task<AuthResult> RegisterAsync(string username, string email, string password)
        {
            if (await _users.ExistsByUsernameAsync(username))
                return AuthResult.Fail("USERNAME_TAKEN");

            var user = new User
            {
                Id = Guid.NewGuid(),
                Username = username,
                Email = email,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(password),
                CreatedAt = DateTime.UtcNow
            };

            await _users.AddAsync(user);

            return AuthResult.Ok(_tokenService.GenerateToken(user), user.Username);
        }

        public async Task<AuthResult> LoginAsync(string username, string password)
        {
            var user = await _users.GetByUsernameAsync(username);
            if (user == null || !BCrypt.Net.BCrypt.Verify(password, user.PasswordHash))
                return AuthResult.Fail("INVALID_CREDENTIALS");

            return AuthResult.Ok(_tokenService.GenerateToken(user), user.Username);
        }
    }
}

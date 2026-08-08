using CreditCard.Application.Services;
using CreditCard.Domain.Entities;
using CreditCard.Tests.Fakes;
using Xunit;

namespace CreditCard.Tests.Services
{
    public class AuthServiceTests
    {
        [Fact]
        public async Task RegisterAsync_ConUsuarioNuevo_CreaCuentaYDevuelveToken()
        {
            var users = new FakeUserRepository();
            var service = new AuthService(users, new FakeTokenService());

            var result = await service.RegisterAsync("valeria", "valeria@test.com", "supersegura");

            Assert.True(result.Success);
            Assert.Equal("valeria", result.Username);
            Assert.False(string.IsNullOrEmpty(result.Token));

            var stored = await users.GetByUsernameAsync("valeria");
            Assert.NotNull(stored);
            Assert.NotEqual("supersegura", stored!.PasswordHash); // debe quedar hasheada, no en texto plano
        }

        [Fact]
        public async Task RegisterAsync_ConUsuarioExistente_Falla()
        {
            var users = new FakeUserRepository();
            users.Seed(new User { Id = Guid.NewGuid(), Username = "valeria", Email = "v@test.com", PasswordHash = BCrypt.Net.BCrypt.HashPassword("x") });
            var service = new AuthService(users, new FakeTokenService());

            var result = await service.RegisterAsync("valeria", "otro@test.com", "otrapass");

            Assert.False(result.Success);
            Assert.Equal("USERNAME_TAKEN", result.Error);
        }

        [Fact]
        public async Task LoginAsync_ConCredencialesCorrectas_DevuelveToken()
        {
            var users = new FakeUserRepository();
            users.Seed(new User
            {
                Id = Guid.NewGuid(),
                Username = "valeria",
                Email = "v@test.com",
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("miClave123")
            });
            var service = new AuthService(users, new FakeTokenService());

            var result = await service.LoginAsync("valeria", "miClave123");

            Assert.True(result.Success);
            Assert.Equal("valeria", result.Username);
        }

        [Fact]
        public async Task LoginAsync_ConPasswordIncorrecto_Falla()
        {
            var users = new FakeUserRepository();
            users.Seed(new User
            {
                Id = Guid.NewGuid(),
                Username = "valeria",
                Email = "v@test.com",
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("miClave123")
            });
            var service = new AuthService(users, new FakeTokenService());

            var result = await service.LoginAsync("valeria", "incorrecta");

            Assert.False(result.Success);
            Assert.Equal("INVALID_CREDENTIALS", result.Error);
        }

        [Fact]
        public async Task LoginAsync_ConUsuarioInexistente_Falla()
        {
            var users = new FakeUserRepository();
            var service = new AuthService(users, new FakeTokenService());

            var result = await service.LoginAsync("no-existe", "cualquiera");

            Assert.False(result.Success);
            Assert.Equal("INVALID_CREDENTIALS", result.Error);
        }
    }
}

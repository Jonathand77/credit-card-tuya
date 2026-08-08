using CreditCard.Application.Interfaces;
using CreditCard.Domain.Entities;

namespace CreditCard.Tests.Fakes
{
    public class FakeTokenService : ITokenService
    {
        public string GenerateToken(User user) => $"fake-token-for-{user.Username}";
    }
}

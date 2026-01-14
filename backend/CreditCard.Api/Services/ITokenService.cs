using CreditCard.Domain.Entities;

namespace CreditCard.Api.Services
{
    public interface ITokenService
    {
        string GenerateToken(User user);
    }
}

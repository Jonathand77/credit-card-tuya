using CreditCard.Domain.Entities;

namespace CreditCard.Application.Interfaces
{
    public interface ITokenService
    {
        string GenerateToken(User user);
    }
}

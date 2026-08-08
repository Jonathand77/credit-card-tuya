using System.Threading.Tasks;
using CreditCard.Domain.Entities;

namespace CreditCard.Application.Interfaces
{
    public interface IUserRepository
    {
        Task<User?> GetByUsernameAsync(string username);
        Task<bool> ExistsByUsernameAsync(string username);
        Task AddAsync(User user);
    }
}

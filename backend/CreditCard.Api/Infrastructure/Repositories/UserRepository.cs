using System.Threading.Tasks;
using CreditCard.Application.Interfaces;
using CreditCard.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace CreditCard.Api.Infrastructure
{
    public class UserRepository : IUserRepository
    {
        private readonly AppDbContext _db;

        public UserRepository(AppDbContext db) => _db = db;

        public Task<User?> GetByUsernameAsync(string username)
            => _db.Users.FirstOrDefaultAsync(u => u.Username == username);

        public Task<bool> ExistsByUsernameAsync(string username)
            => _db.Users.AnyAsync(u => u.Username == username);

        public async Task AddAsync(User user)
        {
            _db.Users.Add(user);
            await _db.SaveChangesAsync();
        }
    }
}

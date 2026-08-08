using CreditCard.Application.Interfaces;
using CreditCard.Domain.Entities;

namespace CreditCard.Tests.Fakes
{
    public class FakeUserRepository : IUserRepository
    {
        private readonly Dictionary<string, User> _usersByUsername = new();

        public void Seed(User user) => _usersByUsername[user.Username] = user;

        public Task<User?> GetByUsernameAsync(string username) =>
            Task.FromResult(_usersByUsername.TryGetValue(username, out var user) ? user : null);

        public Task<bool> ExistsByUsernameAsync(string username) =>
            Task.FromResult(_usersByUsername.ContainsKey(username));

        public Task AddAsync(User user)
        {
            _usersByUsername[user.Username] = user;
            return Task.CompletedTask;
        }
    }
}

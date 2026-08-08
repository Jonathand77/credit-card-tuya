using CreditCard.Application.Interfaces;

namespace CreditCard.Tests.Fakes
{
    public class FakeCardRepository : ICardRepository
    {
        private readonly Dictionary<Guid, CreditCard.Domain.Entities.CreditCard> _cards = new();

        public void Seed(CreditCard.Domain.Entities.CreditCard card) => _cards[card.Id] = card;

        public Task<CreditCard.Domain.Entities.CreditCard> GetByIdAsync(Guid id) =>
            Task.FromResult(_cards.TryGetValue(id, out var card) ? card : null!);

        public Task<IEnumerable<CreditCard.Domain.Entities.CreditCard>> GetByUserAsync(Guid userId) =>
            Task.FromResult(_cards.Values.Where(c => c.UserId == userId));

        public Task AddAsync(CreditCard.Domain.Entities.CreditCard card)
        {
            _cards[card.Id] = card;
            return Task.CompletedTask;
        }

        public Task UpdateAsync(CreditCard.Domain.Entities.CreditCard card)
        {
            _cards[card.Id] = card;
            return Task.CompletedTask;
        }

        public Task DeleteAsync(CreditCard.Domain.Entities.CreditCard card)
        {
            _cards.Remove(card.Id);
            return Task.CompletedTask;
        }
    }
}

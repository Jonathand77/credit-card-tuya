using CreditCard.Application.Interfaces;
using CreditCard.Domain.Entities;

namespace CreditCard.Tests.Fakes
{
    public class FakeTransactionRepository : ITransactionRepository
    {
        public List<Transaction> Transactions { get; } = new();

        public Task AddAsync(Transaction tx)
        {
            Transactions.Add(tx);
            return Task.CompletedTask;
        }

        public Task<IEnumerable<Transaction>> GetByFilterAsync(Guid userId, Guid? cardId, int page, int size) =>
            Task.FromResult(Transactions.Where(t =>
                t.UserId == userId && (cardId == null || t.CardId == cardId)));

        public Task<int> CountByFilterAsync(Guid userId, Guid? cardId) =>
            Task.FromResult(Transactions.Count(t =>
                t.UserId == userId && (cardId == null || t.CardId == cardId)));
    }
}

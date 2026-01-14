using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using CreditCard.Application.Interfaces;
using CreditCard.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace CreditCard.Api.Infrastructure
{
    public class TransactionRepository : ITransactionRepository
    {
        private readonly AppDbContext _db;

        public TransactionRepository(AppDbContext db) => _db = db;

        public async Task AddAsync(CreditCard.Domain.Entities.Transaction tx)
        {
            _db.Transactions.Add(tx);
            await _db.SaveChangesAsync();
        }

        public async Task<int> CountByFilterAsync(Guid userId, Guid? cardId)
        {
            var q = _db.Transactions.AsQueryable().Where(t => t.UserId == userId);
            if (cardId.HasValue) q = q.Where(t => t.CardId == cardId.Value);
            return await q.CountAsync();
        }

        public async Task<IEnumerable<CreditCard.Domain.Entities.Transaction>> GetByFilterAsync(Guid userId, Guid? cardId, int page, int size)
        {
            var q = _db.Transactions.AsQueryable().Where(t => t.UserId == userId);
            if (cardId.HasValue) q = q.Where(t => t.CardId == cardId.Value);
            return await q.OrderByDescending(t => t.Timestamp)
                .Skip((Math.Max(1, page) - 1) * Math.Max(1, size))
                .Take(Math.Max(1, size))
                .ToListAsync();
        }
    }
}

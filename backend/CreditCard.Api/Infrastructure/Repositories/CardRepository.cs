using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using CreditCard.Application.Interfaces;
using CreditCard.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace CreditCard.Api.Infrastructure
{
    public class CardRepository : ICardRepository
    {
        private readonly AppDbContext _db;

        public CardRepository(AppDbContext db) => _db = db;

        public async Task AddAsync(CreditCard.Domain.Entities.CreditCard card)
        {
            _db.CreditCards.Add(card);
            await _db.SaveChangesAsync();
        }

        public async Task DeleteAsync(CreditCard.Domain.Entities.CreditCard card)
        {
            _db.CreditCards.Remove(card);
            await _db.SaveChangesAsync();
        }

        public async Task<CreditCard.Domain.Entities.CreditCard> GetByIdAsync(Guid id)
            => await _db.CreditCards.FirstOrDefaultAsync(c => c.Id == id);

        public async Task<IEnumerable<CreditCard.Domain.Entities.CreditCard>> GetByUserAsync(Guid userId)
            => await _db.CreditCards.Where(c => c.UserId == userId).ToListAsync();

        public async Task UpdateAsync(CreditCard.Domain.Entities.CreditCard card)
        {
            _db.CreditCards.Update(card);
            await _db.SaveChangesAsync();
        }
    }
}

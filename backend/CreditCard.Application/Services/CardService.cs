using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using CreditCard.Application.Interfaces;
using CreditCard.Domain.Entities;

namespace CreditCard.Application.Services
{
    public class CardService
    {
        private readonly ICardRepository _repo;

        public CardService(ICardRepository repo)
        {
            _repo = repo;
        }

        public Task<IEnumerable<CreditCard.Domain.Entities.CreditCard>> GetByUserAsync(Guid userId) => _repo.GetByUserAsync(userId);

        public Task<CreditCard.Domain.Entities.CreditCard> GetByIdAsync(Guid id) => _repo.GetByIdAsync(id);

        public Task AddAsync(CreditCard.Domain.Entities.CreditCard card) => _repo.AddAsync(card);

        public Task UpdateAsync(CreditCard.Domain.Entities.CreditCard card) => _repo.UpdateAsync(card);

        public Task DeleteAsync(CreditCard.Domain.Entities.CreditCard card) => _repo.DeleteAsync(card);
    }
}

using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using CreditCard.Domain.Entities;

namespace CreditCard.Application.Interfaces
{
    public interface ICardRepository
    {
        Task<CreditCard.Domain.Entities.CreditCard> GetByIdAsync(Guid id);
        Task<IEnumerable<CreditCard.Domain.Entities.CreditCard>> GetByUserAsync(Guid userId);
        Task AddAsync(CreditCard.Domain.Entities.CreditCard card);
        Task UpdateAsync(CreditCard.Domain.Entities.CreditCard card);
        Task DeleteAsync(CreditCard.Domain.Entities.CreditCard card);
    }
}

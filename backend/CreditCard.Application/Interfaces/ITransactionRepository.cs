using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using CreditCard.Domain.Entities;

namespace CreditCard.Application.Interfaces
{
    public interface ITransactionRepository
    {
        Task AddAsync(CreditCard.Domain.Entities.Transaction tx);
        Task<IEnumerable<CreditCard.Domain.Entities.Transaction>> GetByFilterAsync(Guid userId, Guid? cardId, int page, int size);
        Task<int> CountByFilterAsync(Guid userId, Guid? cardId);
    }
}

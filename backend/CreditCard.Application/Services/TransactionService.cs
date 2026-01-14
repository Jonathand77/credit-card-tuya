using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using CreditCard.Application.Interfaces;
using CreditCard.Domain.Entities;

namespace CreditCard.Application.Services
{
    public class TransactionService
    {
        private readonly ITransactionRepository _txRepo;

        public TransactionService(ITransactionRepository txRepo)
        {
            _txRepo = txRepo;
        }

        public Task<IEnumerable<CreditCard.Domain.Entities.Transaction>> GetByFilterAsync(Guid userId, Guid? cardId, int page, int size)
            => _txRepo.GetByFilterAsync(userId, cardId, page, size);

        public Task<int> CountByFilterAsync(Guid userId, Guid? cardId)
            => _txRepo.CountByFilterAsync(userId, cardId);
    }
}

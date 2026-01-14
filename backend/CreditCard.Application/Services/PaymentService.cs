using System;
using System.Threading.Tasks;
using CreditCard.Application.Interfaces;
using CreditCard.Domain.Entities;

namespace CreditCard.Application.Services
{
    public class PaymentService
    {
        private readonly ICardRepository _cardRepo;
        private readonly ITransactionRepository _txRepo;

        public PaymentService(ICardRepository cardRepo, ITransactionRepository txRepo)
        {
            _cardRepo = cardRepo;
            _txRepo = txRepo;
        }

        public async Task<CreditCard.Domain.Entities.Transaction> ChargeAsync(Guid userId, Guid cardId, decimal amount, string? description)
        {
            var card = await _cardRepo.GetByIdAsync(cardId);
            if (card == null || card.UserId != userId) throw new InvalidOperationException("Card not found");
            if (amount <= 0) throw new ArgumentException("Amount must be positive", nameof(amount));
            var projected = card.Balance + amount;
            if (projected > card.Limit) throw new InvalidOperationException("Insufficient available credit");

            var tx = new CreditCard.Domain.Entities.Transaction
            {
                Id = Guid.NewGuid(),
                CardId = card.Id,
                UserId = userId,
                Amount = amount,
                Type = "charge",
                Description = description,
                Timestamp = DateTime.UtcNow
            };

            card.Balance = projected;

            await _txRepo.AddAsync(tx);
            await _cardRepo.UpdateAsync(card);

            return tx;
        }
    }
}

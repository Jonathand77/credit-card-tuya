using System;

namespace CreditCard.Domain.Entities
{
    public class Transaction
    {
        public Guid Id { get; set; }
        public Guid CardId { get; set; }
        public Guid UserId { get; set; }
        public decimal Amount { get; set; }
        public string Type { get; set; } = null!;
        public DateTime Timestamp { get; set; } = DateTime.UtcNow;
        public string? Description { get; set; }
        public decimal BalanceAfter { get; set; }

        public CreditCard? Card { get; set; }
        public User? User { get; set; }
    }
}

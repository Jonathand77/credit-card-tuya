using System;
using System.Collections.Generic;

namespace CreditCard.Domain.Entities
{
    public class CreditCard
    {
        public Guid Id { get; set; }
        public Guid UserId { get; set; }
        public string CardNumber { get; set; } = null!;
        public string HolderName { get; set; } = null!;
        public string Expiry { get; set; } = null!;
        public string CvvHash { get; set; } = null!;
        public decimal Limit { get; set; }
        public decimal Balance { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public User? User { get; set; }
        public List<Transaction> Transactions { get; set; } = new();
    }
}

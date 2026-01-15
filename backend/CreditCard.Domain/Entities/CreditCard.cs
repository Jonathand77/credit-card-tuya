using System;
using System.Collections.Generic;

namespace CreditCard.Domain.Entities
{
    public class CreditCard
    {
        public Guid Id { get; set; }
        public Guid UserId { get; set; }

        public string CardNumberMasked { get; set; } = null!;
        public string CardNumberHash { get; set; } = null!;
        public string Last4 { get; set; } = null!;

        public string HolderName { get; set; } = null!;
        public string Expiry { get; set; } = null!;
        public decimal Limit { get; set; }
        public decimal Balance { get; set; }

        public string CvvHash { get; set; } = null!;
        public DateTime CreatedAt { get; set; }

        public User User { get; set; } = null!;
        public ICollection<Transaction> Transactions { get; set; } = new List<Transaction>();
    }
}
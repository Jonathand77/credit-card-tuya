using System;

namespace CreditCard.Api.DTOs
{
    public class CardCreateDto
    {
        public string CardNumber { get; set; } = null!;
        public string HolderName { get; set; } = null!;
        public string Expiry { get; set; } = null!;
        public string Cvv { get; set; } = null!;
        public decimal Limit { get; set; }
    }

    public class CardUpdateDto
    {
        public string HolderName { get; set; } = null!;
        public string Expiry { get; set; } = null!;
        public decimal Limit { get; set; }
    }

    public class CardDto
    {
        public Guid Id { get; set; }
        public string CardNumber { get; set; } = null!;
        public string HolderName { get; set; } = null!;
        public string Expiry { get; set; } = null!;
        public decimal Limit { get; set; }
        public decimal Balance { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}

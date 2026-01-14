using System;

namespace CreditCard.Api.DTOs
{
    public class PaymentCreateDto
    {
        public Guid CardId { get; set; }
        public decimal Amount { get; set; }
        public string? Description { get; set; }
    }

    public class TransactionDto
    {
        public Guid Id { get; set; }
        public Guid CardId { get; set; }
        public Guid UserId { get; set; }
        public decimal Amount { get; set; }
        public string Type { get; set; } = null!;
        public string? Description { get; set; }
        public DateTime Timestamp { get; set; }
    }
}

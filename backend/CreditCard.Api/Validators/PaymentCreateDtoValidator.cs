using FluentValidation;
using CreditCard.Api.DTOs;

namespace CreditCard.Api.Validators
{
    public class PaymentCreateDtoValidator : AbstractValidator<PaymentCreateDto>
    {
        public PaymentCreateDtoValidator()
        {
            RuleFor(x => x.CardId).NotEmpty();
            RuleFor(x => x.Amount).GreaterThan(0);
        }
    }
}

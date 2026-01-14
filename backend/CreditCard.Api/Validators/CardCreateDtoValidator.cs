using FluentValidation;
using CreditCard.Api.DTOs;

namespace CreditCard.Api.Validators
{
    public class CardCreateDtoValidator : AbstractValidator<CardCreateDto>
    {
        public CardCreateDtoValidator()
        {
            RuleFor(x => x.CardNumber).NotEmpty().CreditCard();
            RuleFor(x => x.HolderName).NotEmpty();
            RuleFor(x => x.Expiry).NotEmpty();
            RuleFor(x => x.Cvv).NotEmpty().Length(3,4);
            RuleFor(x => x.Limit).GreaterThan(0);
        }
    }
}

using AutoMapper;
using CreditCard.Api.DTOs;
using CreditCard.Domain.Entities;

namespace CreditCard.Api.Mapping
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap<CreditCard.Domain.Entities.CreditCard, CardDto>()
                .ForMember(d => d.CardNumber, opt => opt.MapFrom(s => s.CardNumberMasked));
            CreateMap<Transaction, TransactionDto>();
        }
    }
}

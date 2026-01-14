using AutoMapper;
using CreditCard.Api.DTOs;
using CreditCard.Domain.Entities;

namespace CreditCard.Api.Mapping
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap<CreditCard.Domain.Entities.CreditCard, CardDto>();
            CreateMap<Transaction, TransactionDto>();
        }
    }
}

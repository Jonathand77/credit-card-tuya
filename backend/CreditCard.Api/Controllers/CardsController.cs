using System;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CreditCard.Api.DTOs;
using CreditCard.Api.Infrastructure;
using CreditCard.Domain.Entities;

namespace CreditCard.Api.Controllers
{
    [ApiController]
    // Ruta base: api/cards
    [Route("api/[controller]")]
    // Todos los endpoints requieren autenticación JWT
    [Authorize]
    public class CardsController : ControllerBase
    {
        // Servicio de aplicación que encapsula la lógica de negocio
        private readonly CreditCard.Application.Services.CardService _service;
        private readonly AutoMapper.IMapper _mapper;

        public CardsController(CreditCard.Application.Services.CardService service, AutoMapper.IMapper mapper)
        {
            _service = service;
            _mapper = mapper;
        }

        // Obtiene el UserId desde el JWT
        private Guid GetUserId()
        {
            var sub = User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? User.FindFirst("sub")?.Value;
            return Guid.Parse(sub!);
        }

        // Obtiene todas las tarjetas del usuario autenticado
        [HttpGet]
        public async Task<IActionResult> GetUserCards()
        {
            var userId = GetUserId();
            var cards = await _service.GetByUserAsync(userId);
            var list = _mapper.Map<System.Collections.Generic.IEnumerable<CardDto>>(cards);
            return Ok(list);
        }

        // Obtiene una tarjeta por Id
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(Guid id)
        {
            var userId = GetUserId();
            var card = await _service.GetByIdAsync(id);
            if (card == null || card.UserId != userId) return NotFound();
            return Ok(_mapper.Map<CardDto>(card));
        }

        // Crea una nueva tarjeta de crédito
        [HttpPost]
        public async Task<IActionResult> Create(CardCreateDto input)
        {
            var userId = GetUserId();

            var trimmed = input.CardNumber.Replace(" ", "");

            if (!System.Text.RegularExpressions.Regex.IsMatch(trimmed, @"^\d{16}$"))
                return BadRequest("La tarjeta debe tener 16 dígitos");

            var card = new CreditCard.Domain.Entities.CreditCard
            {
                Id = Guid.NewGuid(),
                UserId = userId,

                CardNumberMasked = MaskCardNumber(trimmed),
                CardNumberHash = BCrypt.Net.BCrypt.HashPassword(trimmed),
                Last4 = trimmed[^4..],

                HolderName = input.HolderName,
                Expiry = input.Expiry,
                Limit = input.Limit,
                Balance = 0m,

                CvvHash = BCrypt.Net.BCrypt.HashPassword(input.Cvv),
                CreatedAt = DateTime.UtcNow
            };

            await _service.AddAsync(card);

            return CreatedAtAction(nameof(GetById), new { id = card.Id }, new CardDto
            {
                Id = card.Id,
                CardNumber = card.CardNumberMasked,
                HolderName = card.HolderName,
                Expiry = card.Expiry,
                Limit = card.Limit,
                Balance = card.Balance,
                CreatedAt = card.CreatedAt
            });
        }

        // Actualiza una tarjeta existente
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(Guid id, CardUpdateDto input)
        {
            var userId = GetUserId();
            var card = await _service.GetByIdAsync(id);
            if (card == null || card.UserId != userId) return NotFound();

            card.HolderName = input.HolderName;
            card.Expiry = input.Expiry;
            card.Limit = input.Limit;

            await _service.UpdateAsync(card);

            return NoContent();
        }

        // Elimina una tarjeta
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            var userId = GetUserId();
            var card = await _service.GetByIdAsync(id);
            if (card == null || card.UserId != userId) return NotFound();

            await _service.DeleteAsync(card);

            return NoContent();
        }

        // Enmascara el número de tarjeta dejando visibles solo los últimos 4 dígitos
        private string MaskCardNumber(string number)
        {
            if (string.IsNullOrWhiteSpace(number)) return number;
            var trimmed = number.Replace(" ", "");
            if (trimmed.Length <= 4) return trimmed;
            var last4 = trimmed.Substring(trimmed.Length - 4);
            return new string('*', Math.Max(0, trimmed.Length - 4)) + last4;
        }
    }
}

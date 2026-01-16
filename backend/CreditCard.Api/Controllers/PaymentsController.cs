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
    // Ruta base: api/payments
    [Route("api/[controller]")]
    [Authorize]
    public class PaymentsController : ControllerBase
    {
        private readonly CreditCard.Application.Services.PaymentService _service;

        public PaymentsController(CreditCard.Application.Services.PaymentService service)
        {
            _service = service;
        }

        private Guid GetUserId()
        {
            var sub = User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? User.FindFirst("sub")?.Value;
            return Guid.Parse(sub!);
        }

        // Registra un cargo (pago) en una tarjeta de crédito
        [HttpPost]
        public async Task<IActionResult> Charge(PaymentCreateDto input)
        {
            var userId = GetUserId();
            var tx = await _service.ChargeAsync(userId, input.CardId, input.Amount, input.Description);
            return Ok(new TransactionDto
            {
                Id = tx.Id,
                CardId = tx.CardId,
                UserId = tx.UserId,
                Amount = tx.Amount,
                Type = tx.Type,
                Description = tx.Description,
                Timestamp = tx.Timestamp
            });
        }
    }
}

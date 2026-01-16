using System;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CreditCard.Api.DTOs;
using CreditCard.Api.Infrastructure;

namespace CreditCard.Api.Controllers
{
    [ApiController]
    // Ruta base: api/transactions
    [Route("api/[controller]")]
    [Authorize]
    public class TransactionsController : ControllerBase
    {
        private readonly CreditCard.Application.Services.TransactionService _service;
        private readonly AutoMapper.IMapper _mapper;

        public TransactionsController(CreditCard.Application.Services.TransactionService service, AutoMapper.IMapper mapper)
        {
            _service = service;
            _mapper = mapper;
        }

        private Guid GetUserId()
        {
            var sub = User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? User.FindFirst("sub")?.Value;
            return Guid.Parse(sub!);
        }

        // Obtiene el historial de transacciones con filtros y paginación
        [HttpGet]
        public async Task<IActionResult> Get([FromQuery] Guid? cardId, [FromQuery] Guid? userId, [FromQuery] int page = 1, [FromQuery] int size = 20)
        {
            var callerId = GetUserId();
            if (userId.HasValue && userId.Value != callerId) return Forbid();
            var actualUser = userId ?? callerId;

            var total = await _service.CountByFilterAsync(actualUser, cardId);
            var items = await _service.GetByFilterAsync(actualUser, cardId, page, size);
            var dto = _mapper.Map<System.Collections.Generic.IEnumerable<TransactionDto>>(items);
            // Respuesta paginada
            return Ok(new { total, page, size, items = dto });
        }
    }
}

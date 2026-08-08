using System.Threading.Tasks;
using CreditCard.Api.DTOs;
using CreditCard.Application.Services;
using Microsoft.AspNetCore.Mvc;

namespace CreditCard.Api.Controllers
{
    [ApiController]
    // Ruta base del controlador: api/auth
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly AuthService _authService;

        public AuthController(AuthService authService)
        {
            _authService = authService;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterDto dto)
        {
            var result = await _authService.RegisterAsync(dto.Username, dto.Email, dto.Password);

            if (!result.Success)
                return Conflict(new { message = "Username already exists" });

            return Ok(new AuthResponseDto { Token = result.Token!, Username = result.Username! });
        }

        // Login de usuario
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto dto)
        {
            var result = await _authService.LoginAsync(dto.Username, dto.Password);

            if (!result.Success)
                return Unauthorized(new { message = "Invalid credentials" });

            return Ok(new AuthResponseDto { Token = result.Token!, Username = result.Username! });
        }
    }
}

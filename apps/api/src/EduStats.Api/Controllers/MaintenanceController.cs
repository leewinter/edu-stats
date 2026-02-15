using EduStats.Infrastructure.Persistence;
using Microsoft.AspNetCore.Mvc;

namespace EduStats.Api.Controllers;

[ApiController]
[Route("api/maintenance")]
public sealed class MaintenanceController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly IConfiguration _configuration;

    public MaintenanceController(ApplicationDbContext context, IConfiguration configuration)
    {
        _context = context;
        _configuration = configuration;
    }

    [HttpPost("reset-seed")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    public async Task<IActionResult> ResetSeedData(CancellationToken cancellationToken)
    {
        var token = _configuration["Maintenance:ResetSeedToken"];
        if (!string.IsNullOrWhiteSpace(token))
        {
            if (!Request.Headers.TryGetValue("X-Reset-Token", out var provided) ||
                !string.Equals(provided.ToString(), token, StringComparison.Ordinal))
            {
                return Unauthorized(new { message = "Invalid reset token." });
            }
        }

        await SeedData.ResetAsync(_context, cancellationToken);
        return NoContent();
    }
}

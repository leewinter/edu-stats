using EduStats.Application.Common.Models;
using EduStats.Application.Institutions.Dtos;
using EduStats.Application.Institutions.Queries.GetInstitutions;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace EduStats.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class InstitutionsController : ControllerBase
{
    private readonly ISender _sender;

    public InstitutionsController(ISender sender)
    {
        _sender = sender;
    }

    [HttpGet]
    [ProducesResponseType(typeof(PagedResult<InstitutionDto>), StatusCodes.Status200OK)]
    public async Task<ActionResult<PagedResult<InstitutionDto>>> GetInstitutions([FromQuery] PaginationRequest pagination, CancellationToken cancellationToken)
    {
        var result = await _sender.Send(new GetInstitutionsQuery(pagination), cancellationToken);
        return Ok(result);
    }
}

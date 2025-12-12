using EduStats.Api.Contracts;
using EduStats.Application.Common.Models;
using EduStats.Application.Institutions.Commands.CreateInstitution;
using EduStats.Application.Institutions.Commands.Shared;
using EduStats.Application.Institutions.Commands.UpdateInstitution;
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

    [HttpPost]
    [ProducesResponseType(typeof(Guid), StatusCodes.Status201Created)]
    public async Task<ActionResult<Guid>> CreateInstitution([FromBody] CreateInstitutionRequest request, CancellationToken cancellationToken)
    {
        var addressInputs = (request.Addresses ?? System.Array.Empty<InstitutionAddressRequest>())
            .Select(MapAddress)
            .ToArray();
        var command = new CreateInstitutionCommand(request.Name, request.Enrollment, addressInputs);
        var id = await _sender.Send(command, cancellationToken);
        return CreatedAtAction(nameof(GetInstitutions), new { id }, id);
    }

    [HttpPut("{id:guid}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    public async Task<IActionResult> UpdateInstitution(Guid id, [FromBody] UpdateInstitutionRequest request, CancellationToken cancellationToken)
    {
        var addressInputs = (request.Addresses ?? System.Array.Empty<InstitutionAddressRequest>())
            .Select(MapAddress)
            .ToArray();
        var command = new UpdateInstitutionCommand(id, request.Name, request.Enrollment, addressInputs);
        await _sender.Send(command, cancellationToken);
        return NoContent();
    }

    private static InstitutionAddressInput MapAddress(InstitutionAddressRequest request) =>
        new(request.Line1, request.Line2, request.City, request.County, request.Country, request.PostalCode);
}

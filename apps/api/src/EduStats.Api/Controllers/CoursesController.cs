using EduStats.Api.Contracts;
using EduStats.Application.Common.Models;
using EduStats.Application.Courses.Commands.CreateCourse;
using EduStats.Application.Courses.Commands.UpdateCourse;
using EduStats.Application.Courses.Dtos;
using EduStats.Application.Courses.Queries.GetCourses;
using EduStats.Application.Courses.Commands.DeleteCourse;
using EduStats.Application.Courses.Queries.GetCourseStats;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace EduStats.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public sealed class CoursesController : ControllerBase
{
    private readonly ISender _sender;

    public CoursesController(ISender sender)
    {
        _sender = sender;
    }

    [HttpGet]
    [ProducesResponseType(typeof(PagedResult<CourseDto>), StatusCodes.Status200OK)]
    public async Task<ActionResult<PagedResult<CourseDto>>> GetCourses(
        [FromQuery] PaginationRequest pagination,
        [FromQuery] Guid? institutionId,
        CancellationToken cancellationToken)
    {
        var result = await _sender.Send(new GetCoursesQuery(pagination, institutionId), cancellationToken);
        return Ok(result);
    }

    [HttpPost]
    [ProducesResponseType(typeof(Guid), StatusCodes.Status201Created)]
    public async Task<ActionResult<Guid>> CreateCourse(
        [FromBody] CreateCourseRequest request,
        CancellationToken cancellationToken)
    {
        var command = new CreateCourseCommand(
            request.InstitutionId,
            request.Title,
            request.Code,
            request.Level,
            request.Credits,
            request.Description);

        var id = await _sender.Send(command, cancellationToken);
        return CreatedAtAction(nameof(GetCourses), new { id }, id);
    }

    [HttpPut("{id:guid}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    public async Task<IActionResult> UpdateCourse(Guid id, [FromBody] UpdateCourseRequest request, CancellationToken cancellationToken)
    {
        var command = new UpdateCourseCommand(
            id,
            request.Title,
            request.Code,
            request.Level,
            request.Credits,
            request.Description);

        await _sender.Send(command, cancellationToken);
        return NoContent();
    }

    [HttpDelete("{id:guid}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    public async Task<IActionResult> DeleteCourse(Guid id, CancellationToken cancellationToken)
    {
        await _sender.Send(new DeleteCourseCommand(id), cancellationToken);
        return NoContent();
    }

    [HttpGet("stats")]
    [ProducesResponseType(typeof(IEnumerable<CourseStatsResponse>), StatusCodes.Status200OK)]
    public async Task<ActionResult<IEnumerable<CourseStatsResponse>>> GetCourseStats(
        [FromQuery] Guid? institutionId,
        CancellationToken cancellationToken)
    {
        var stats = await _sender.Send(new GetCourseStatsQuery(institutionId), cancellationToken);
        var response = stats.Select(s => new CourseStatsResponse(
            s.CourseId,
            s.InstitutionId,
            s.InstitutionName,
            s.Title,
            s.Code,
            s.ActiveEnrollments,
            s.CompletedEnrollments,
            s.DroppedEnrollments));
        return Ok(response);
    }
}

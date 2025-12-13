using System.Linq;
using EduStats.Api.Contracts;
using EduStats.Application.Common.Models;
using EduStats.Application.Enrollments.Commands.EnrollStudentInCourse;
using EduStats.Application.Enrollments.Dtos;
using EduStats.Application.Enrollments.Queries.GetStudentEnrollments;
using EduStats.Application.Students.Commands.CreateStudent;
using EduStats.Application.Students.Commands.DeleteStudent;
using EduStats.Application.Students.Commands.UpdateStudent;
using EduStats.Application.Students.Dtos;
using EduStats.Application.Students.Queries.GetStudents;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace EduStats.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public sealed class StudentsController : ControllerBase
{
    private readonly ISender _sender;

    public StudentsController(ISender sender)
    {
        _sender = sender;
    }

    [HttpGet]
    [ProducesResponseType(typeof(PagedResult<StudentDto>), StatusCodes.Status200OK)]
    public async Task<ActionResult<PagedResult<StudentDto>>> GetStudents(
        [FromQuery] PaginationRequest pagination,
        [FromQuery] Guid? institutionId,
        CancellationToken cancellationToken)
    {
        var result = await _sender.Send(new GetStudentsQuery(pagination, institutionId), cancellationToken);
        return Ok(result);
    }

    [HttpPost]
    [ProducesResponseType(typeof(Guid), StatusCodes.Status201Created)]
    public async Task<ActionResult<Guid>> CreateStudent([FromBody] CreateStudentRequest request, CancellationToken cancellationToken)
    {
        var command = new CreateStudentCommand(
            request.InstitutionId,
            request.FirstName,
            request.LastName,
            request.Email,
            request.EnrollmentYear,
            request.CourseFocus);

        var id = await _sender.Send(command, cancellationToken);
        return CreatedAtAction(nameof(GetStudents), new { id }, id);
    }

    [HttpPut("{id:guid}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    public async Task<IActionResult> UpdateStudent(Guid id, [FromBody] UpdateStudentRequest request, CancellationToken cancellationToken)
    {
        var command = new UpdateStudentCommand(
            id,
            request.InstitutionId,
            request.FirstName,
            request.LastName,
            request.Email,
            request.EnrollmentYear,
            request.CourseFocus);

        await _sender.Send(command, cancellationToken);
        return NoContent();
    }

    [HttpDelete("{id:guid}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    public async Task<IActionResult> DeleteStudent(Guid id, CancellationToken cancellationToken)
    {
        await _sender.Send(new DeleteStudentCommand(id), cancellationToken);
        return NoContent();
    }

    [HttpGet("{id:guid}/enrollments")]
    [ProducesResponseType(typeof(IEnumerable<CourseEnrollmentResponse>), StatusCodes.Status200OK)]
    public async Task<ActionResult<IEnumerable<CourseEnrollmentResponse>>> GetStudentEnrollments(Guid id, CancellationToken cancellationToken)
    {
        var enrollments = await _sender.Send(new GetStudentEnrollmentsQuery(id), cancellationToken);
        return Ok(enrollments.Select(MapEnrollment));
    }

    [HttpPost("{id:guid}/enrollments")]
    [ProducesResponseType(typeof(Guid), StatusCodes.Status201Created)]
    public async Task<ActionResult<Guid>> EnrollStudent(Guid id, [FromBody] EnrollStudentRequest request, CancellationToken cancellationToken)
    {
        var enrollmentId = await _sender.Send(new EnrollStudentInCourseCommand(id, request.CourseId), cancellationToken);
        return CreatedAtAction(nameof(GetStudentEnrollments), new { id }, enrollmentId);
    }

    private static CourseEnrollmentResponse MapEnrollment(CourseEnrollmentDto dto) =>
        new(dto.Id, dto.StudentId, dto.CourseId, dto.CourseTitle, dto.CourseCode, dto.Status, dto.EnrolledAtUtc);
}

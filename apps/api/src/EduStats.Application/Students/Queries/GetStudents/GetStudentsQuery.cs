using System.Linq;
using EduStats.Application.Common.Interfaces;
using EduStats.Application.Common.Models;
using EduStats.Application.Students.Dtos;
using EduStats.Domain.Students;
using MediatR;

namespace EduStats.Application.Students.Queries.GetStudents;

public sealed record GetStudentsQuery(PaginationRequest Pagination, Guid? InstitutionId = null)
    : IRequest<PagedResult<StudentDto>>;

public sealed class GetStudentsQueryHandler : IRequestHandler<GetStudentsQuery, PagedResult<StudentDto>>
{
    private readonly IReadRepository<Student> _repository;

    public GetStudentsQueryHandler(IReadRepository<Student> repository)
    {
        _repository = repository;
    }

    public async Task<PagedResult<StudentDto>> Handle(GetStudentsQuery request, CancellationToken cancellationToken)
    {
        var items = await _repository.ListAsync(request.Pagination.PageNumber, request.Pagination.PageSize, cancellationToken);

        if (request.InstitutionId.HasValue)
        {
            items = items.Where(s => s.InstitutionId == request.InstitutionId.Value).ToList();
        }

        var dtos = items
            .Select(student => new StudentDto(
                student.Id,
                student.InstitutionId,
                student.Institution?.Name ?? string.Empty,
                student.FirstName,
                student.LastName,
                student.Email,
                student.EnrollmentYear,
                student.CourseFocus))
            .ToArray();

        return new PagedResult<StudentDto>(dtos, dtos.Length, request.Pagination.PageNumber, request.Pagination.PageSize);
    }
}

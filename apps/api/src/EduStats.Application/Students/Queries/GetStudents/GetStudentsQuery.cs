using System.Linq;
using System.Linq.Expressions;
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
        Expression<Func<Student, bool>>? predicate = null;
        if (request.InstitutionId.HasValue)
        {
            var institutionId = request.InstitutionId.Value;
            predicate = student => student.InstitutionId == institutionId;
        }

        var items = await _repository.ListAsync(
            request.Pagination.PageNumber,
            request.Pagination.PageSize,
            predicate,
            cancellationToken);

        var totalCount = await _repository.CountAsync(
            predicate,
            cancellationToken);

        var dtos = items
            .Select(student => new StudentDto(
                student.Id,
                student.InstitutionId,
                student.Institution?.Name ?? string.Empty,
                student.FirstName,
                student.LastName,
                student.Email,
                student.EnrollmentYear,
                student.CourseFocus,
                student.ActiveEnrollmentCount))
            .ToArray();

        return new PagedResult<StudentDto>(dtos, totalCount, request.Pagination.PageNumber, request.Pagination.PageSize);
    }
}

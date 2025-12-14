using System.Linq;
using System.Linq.Expressions;
using EduStats.Application.Common.Interfaces;
using EduStats.Application.Common.Models;
using EduStats.Application.Courses.Dtos;
using EduStats.Domain.Courses;
using MediatR;

namespace EduStats.Application.Courses.Queries.GetCourses;

public sealed record GetCoursesQuery(PaginationRequest Pagination, Guid? InstitutionId = null)
    : IRequest<PagedResult<CourseDto>>;

public sealed class GetCoursesQueryHandler : IRequestHandler<GetCoursesQuery, PagedResult<CourseDto>>
{
    private readonly IReadRepository<Course> _repository;

    public GetCoursesQueryHandler(IReadRepository<Course> repository)
    {
        _repository = repository;
    }

    public async Task<PagedResult<CourseDto>> Handle(GetCoursesQuery request, CancellationToken cancellationToken)
    {
        Expression<Func<Course, bool>>? predicate = null;
        if (request.InstitutionId.HasValue)
        {
            var institutionId = request.InstitutionId.Value;
            predicate = course => course.InstitutionId == institutionId;
        }

        var items = await _repository.ListAsync(
            request.Pagination.PageNumber,
            request.Pagination.PageSize,
            predicate,
            cancellationToken);

        var totalCount = await _repository.CountAsync(predicate, cancellationToken);

        var dtos = items
            .Select(course => new CourseDto(
                course.Id,
                course.InstitutionId,
                course.Title,
                course.Code,
                course.Level,
                course.Credits,
                course.Description,
                course.Capacity))
            .ToArray();

        return new PagedResult<CourseDto>(
            dtos,
            totalCount,
            request.Pagination.PageNumber,
            request.Pagination.PageSize);
    }
}

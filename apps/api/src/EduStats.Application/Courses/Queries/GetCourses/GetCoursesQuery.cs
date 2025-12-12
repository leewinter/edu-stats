using System.Linq;
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
        var items = await _repository.ListAsync(
            request.Pagination.PageNumber,
            request.Pagination.PageSize,
            cancellationToken);

        var filtered = request.InstitutionId.HasValue
            ? items.Where(course => course.InstitutionId == request.InstitutionId.Value).ToArray()
            : items.ToArray();

        var dtos = filtered
            .Select(course => new CourseDto(
                course.Id,
                course.InstitutionId,
                course.Title,
                course.Code,
                course.Level,
                course.Credits,
                course.Description))
            .ToArray();

        return new PagedResult<CourseDto>(
            dtos,
            dtos.Length,
            request.Pagination.PageNumber,
            request.Pagination.PageSize);
    }
}

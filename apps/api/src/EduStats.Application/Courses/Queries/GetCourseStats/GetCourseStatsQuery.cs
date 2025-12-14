using EduStats.Application.Common.Interfaces;
using EduStats.Application.Courses.Dtos;
using MediatR;

namespace EduStats.Application.Courses.Queries.GetCourseStats;

public sealed record GetCourseStatsQuery(Guid? InstitutionId = null) : IRequest<IReadOnlyList<CourseStatsDto>>;

public sealed class GetCourseStatsQueryHandler : IRequestHandler<GetCourseStatsQuery, IReadOnlyList<CourseStatsDto>>
{
    private readonly ICourseStatisticsProvider _provider;

    public GetCourseStatsQueryHandler(ICourseStatisticsProvider provider)
    {
        _provider = provider;
    }

    public Task<IReadOnlyList<CourseStatsDto>> Handle(GetCourseStatsQuery request, CancellationToken cancellationToken)
    {
        return _provider.GetCourseStatisticsAsync(request.InstitutionId, cancellationToken);
    }
}

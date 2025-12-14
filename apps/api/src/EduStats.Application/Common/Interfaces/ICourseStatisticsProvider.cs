using EduStats.Application.Courses.Dtos;

namespace EduStats.Application.Common.Interfaces;

public interface ICourseStatisticsProvider
{
    Task<IReadOnlyList<CourseStatsDto>> GetCourseStatisticsAsync(Guid? institutionId, CancellationToken cancellationToken = default);
}

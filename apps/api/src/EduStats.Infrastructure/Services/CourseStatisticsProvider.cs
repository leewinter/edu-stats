using EduStats.Application.Common.Interfaces;
using EduStats.Application.Courses.Dtos;
using EduStats.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace EduStats.Infrastructure.Services;

public sealed class CourseStatisticsProvider : ICourseStatisticsProvider
{
    private readonly ApplicationDbContext _context;

    public CourseStatisticsProvider(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<IReadOnlyList<CourseStatsDto>> GetCourseStatisticsAsync(Guid? institutionId, CancellationToken cancellationToken = default)
    {
        var query = _context.Courses
            .AsNoTracking()
            .Include(c => c.Institution)
            .Select(course => new
            {
                course.Id,
                course.InstitutionId,
                InstitutionName = course.Institution.Name,
                course.Title,
                course.Code,
                Active = _context.CourseEnrollments.Count(e =>
                    e.CourseId == course.Id && e.Status == Domain.Enrollments.CourseEnrollmentStatus.Active),
                Completed = _context.CourseEnrollments.Count(e =>
                    e.CourseId == course.Id && e.Status == Domain.Enrollments.CourseEnrollmentStatus.Completed),
                Dropped = _context.CourseEnrollments.Count(e =>
                    e.CourseId == course.Id && e.Status == Domain.Enrollments.CourseEnrollmentStatus.Dropped)
            });

        if (institutionId.HasValue)
        {
            query = query.Where(c => c.InstitutionId == institutionId.Value);
        }

        var results = await query
            .OrderByDescending(c => c.Active)
            .ThenBy(c => c.Title)
            .ToListAsync(cancellationToken);

        return results
            .Select(c => new CourseStatsDto(c.Id, c.InstitutionId, c.InstitutionName, c.Title, c.Code, c.Active, c.Completed, c.Dropped))
            .ToList();
    }
}

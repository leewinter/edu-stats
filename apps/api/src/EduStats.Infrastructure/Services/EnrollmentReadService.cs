using EduStats.Application.Common.Interfaces;
using EduStats.Domain.Enrollments;
using EduStats.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace EduStats.Infrastructure.Services;

public sealed class EnrollmentReadService : IEnrollmentReadService
{
    private readonly ApplicationDbContext _context;

    public EnrollmentReadService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<IReadOnlyList<CourseEnrollment>> GetByStudentIdAsync(Guid studentId, CancellationToken cancellationToken = default)
    {
        return await _context.CourseEnrollments
            .AsNoTracking()
            .Include(e => e.Course)
            .Where(e => e.StudentId == studentId)
            .OrderByDescending(e => e.EnrolledAtUtc)
            .ToListAsync(cancellationToken);
    }

    public async Task<bool> ExistsAsync(Guid studentId, Guid courseId, CancellationToken cancellationToken = default)
    {
        return await _context.CourseEnrollments
            .AnyAsync(e => e.StudentId == studentId && e.CourseId == courseId, cancellationToken);
    }
}

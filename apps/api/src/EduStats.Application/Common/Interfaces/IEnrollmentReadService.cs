using EduStats.Domain.Enrollments;

namespace EduStats.Application.Common.Interfaces;

public interface IEnrollmentReadService
{
    Task<IReadOnlyList<CourseEnrollment>> GetByStudentIdAsync(Guid studentId, CancellationToken cancellationToken = default);
    Task<bool> ExistsAsync(Guid studentId, Guid courseId, CancellationToken cancellationToken = default);
}

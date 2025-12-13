using EduStats.Domain.Common;
using EduStats.Domain.Courses;
using EduStats.Domain.Students;

namespace EduStats.Domain.Enrollments;

public sealed class CourseEnrollment : AuditableEntity<Guid>, IAggregateRoot
{
    public Guid StudentId { get; private set; }
    public Student Student { get; private set; } = null!;
    public Guid CourseId { get; private set; }
    public Course Course { get; private set; } = null!;
    public DateTime EnrolledAtUtc { get; private set; }
    public DateTime? CompletedAtUtc { get; private set; }
    public CourseEnrollmentStatus Status { get; private set; }

    private CourseEnrollment()
    {
    }

    public CourseEnrollment(Guid studentId, Guid courseId)
    {
        Id = Guid.NewGuid();
        StudentId = studentId;
        CourseId = courseId;
        EnrolledAtUtc = DateTime.UtcNow;
        Status = CourseEnrollmentStatus.Active;
    }

    public void Complete()
    {
        Status = CourseEnrollmentStatus.Completed;
        CompletedAtUtc = DateTime.UtcNow;
    }

    public void Drop()
    {
        Status = CourseEnrollmentStatus.Dropped;
        CompletedAtUtc = DateTime.UtcNow;
    }
}

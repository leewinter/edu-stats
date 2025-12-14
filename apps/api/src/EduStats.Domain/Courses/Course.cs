using System;
using EduStats.Domain.Common;
using EduStats.Domain.Institutions;
using EduStats.Domain.Enrollments;

namespace EduStats.Domain.Courses;

public sealed class Course : AuditableEntity<Guid>, IAggregateRoot
{
    public Guid InstitutionId { get; private set; }
    public Institution Institution { get; private set; } = null!;

    public string Title { get; private set; }
    public string Code { get; private set; }
    public string Level { get; private set; }
    public int Credits { get; private set; }
    public string? Description { get; private set; }
    public ICollection<CourseEnrollment> CourseEnrollments { get; private set; } = new List<CourseEnrollment>();

    private Course()
    {
        Title = string.Empty;
        Code = string.Empty;
        Level = string.Empty;
    }

    public Course(Guid institutionId, string title, string code, string level, int credits, string? description)
    {
        Id = Guid.NewGuid();
        InstitutionId = institutionId;
        Title = title;
        Code = code;
        Level = level;
        Credits = credits;
        Description = description;
    }

    public void Update(string title, string code, string level, int credits, string? description)
    {
        Title = title;
        Code = code;
        Level = level;
        Credits = credits;
        Description = description;
    }
}

using EduStats.Domain.Common;
using EduStats.Domain.Institutions;

namespace EduStats.Domain.Students;

public sealed class Student : AuditableEntity<Guid>, IAggregateRoot
{
    public Guid InstitutionId { get; private set; }
    public Institution Institution { get; private set; } = null!;
    public string FirstName { get; private set; }
    public string LastName { get; private set; }
    public string Email { get; private set; }
    public int EnrollmentYear { get; private set; }
    public string? CourseFocus { get; private set; }

    private Student()
    {
        FirstName = string.Empty;
        LastName = string.Empty;
        Email = string.Empty;
    }

    public Student(
        Guid institutionId,
        string firstName,
        string lastName,
        string email,
        int enrollmentYear,
        string? courseFocus = null)
    {
        Id = Guid.NewGuid();
        InstitutionId = institutionId;
        FirstName = firstName;
        LastName = lastName;
        Email = email;
        EnrollmentYear = enrollmentYear;
        CourseFocus = courseFocus;
    }

    public void UpdateDetails(
        string firstName,
        string lastName,
        string email,
        int enrollmentYear,
        string? courseFocus)
    {
        FirstName = firstName;
        LastName = lastName;
        Email = email;
        EnrollmentYear = enrollmentYear;
        CourseFocus = courseFocus;
    }

    public void ChangeInstitution(Guid institutionId)
    {
        InstitutionId = institutionId;
    }
}

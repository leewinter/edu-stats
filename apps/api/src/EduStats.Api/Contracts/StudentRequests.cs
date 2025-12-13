using System.ComponentModel.DataAnnotations;

namespace EduStats.Api.Contracts;

public sealed record CreateStudentRequest(
    [Required] Guid InstitutionId,
    [Required] string FirstName,
    [Required] string LastName,
    [Required, EmailAddress] string Email,
    [Range(1950, 2100)] int EnrollmentYear,
    string? CourseFocus);

public sealed record UpdateStudentRequest(
    [Required] Guid InstitutionId,
    [Required] string FirstName,
    [Required] string LastName,
    [Required, EmailAddress] string Email,
    [Range(1950, 2100)] int EnrollmentYear,
    string? CourseFocus);

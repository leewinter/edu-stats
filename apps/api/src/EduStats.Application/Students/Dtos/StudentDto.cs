namespace EduStats.Application.Students.Dtos;

public sealed record StudentDto(
    Guid Id,
    Guid InstitutionId,
    string InstitutionName,
    string FirstName,
    string LastName,
    string Email,
    int EnrollmentYear,
    string? CourseFocus);

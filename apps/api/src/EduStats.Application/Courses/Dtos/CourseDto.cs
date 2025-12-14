namespace EduStats.Application.Courses.Dtos;

public sealed record CourseDto(
    Guid Id,
    Guid InstitutionId,
    string Title,
    string Code,
    string Level,
    int Credits,
    string? Description,
    int? Capacity);

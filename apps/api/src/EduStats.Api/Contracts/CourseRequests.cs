namespace EduStats.Api.Contracts;

public sealed record CreateCourseRequest(
    Guid InstitutionId,
    string Title,
    string Code,
    string Level,
    int Credits,
    string? Description);

public sealed record UpdateCourseRequest(
    string Title,
    string Code,
    string Level,
    int Credits,
    string? Description);

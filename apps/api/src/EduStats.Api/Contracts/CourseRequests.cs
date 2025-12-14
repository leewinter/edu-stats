namespace EduStats.Api.Contracts;

public sealed record CreateCourseRequest(
    Guid InstitutionId,
    string Title,
    string Code,
    string Level,
    int Credits,
    string? Description,
    int? Capacity);

public sealed record UpdateCourseRequest(
    string Title,
    string Code,
    string Level,
    int Credits,
    string? Description,
    int? Capacity);

public sealed record CourseStatsResponse(
    Guid CourseId,
    Guid InstitutionId,
    string InstitutionName,
    string Title,
    string Code,
    int ActiveEnrollments,
    int CompletedEnrollments,
    int DroppedEnrollments,
    int? Capacity);

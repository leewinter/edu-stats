namespace EduStats.Application.Courses.Dtos;

public sealed record CourseStatsDto(
    Guid CourseId,
    Guid InstitutionId,
    string InstitutionName,
    string Title,
    string Code,
    int ActiveEnrollments,
    int CompletedEnrollments,
    int DroppedEnrollments);

using EduStats.Domain.Enrollments;

namespace EduStats.Application.Enrollments.Dtos;

public sealed record CourseEnrollmentDto(
    Guid Id,
    Guid StudentId,
    Guid CourseId,
    string CourseTitle,
    string CourseCode,
    CourseEnrollmentStatus Status,
    DateTime EnrolledAtUtc);

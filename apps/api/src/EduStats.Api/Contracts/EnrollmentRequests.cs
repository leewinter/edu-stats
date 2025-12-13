using EduStats.Domain.Enrollments;

namespace EduStats.Api.Contracts;

public sealed record EnrollStudentRequest(Guid CourseId);

public sealed record CourseEnrollmentResponse(
    Guid Id,
    Guid StudentId,
    Guid CourseId,
    string CourseTitle,
    string CourseCode,
    CourseEnrollmentStatus Status,
    DateTime EnrolledAtUtc);

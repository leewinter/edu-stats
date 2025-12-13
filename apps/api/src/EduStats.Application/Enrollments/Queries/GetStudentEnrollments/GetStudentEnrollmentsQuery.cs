using EduStats.Application.Common.Interfaces;
using EduStats.Application.Enrollments.Dtos;
using MediatR;

namespace EduStats.Application.Enrollments.Queries.GetStudentEnrollments;

public sealed record GetStudentEnrollmentsQuery(Guid StudentId) : IRequest<IReadOnlyList<CourseEnrollmentDto>>;

public sealed class GetStudentEnrollmentsQueryHandler : IRequestHandler<GetStudentEnrollmentsQuery, IReadOnlyList<CourseEnrollmentDto>>
{
    private readonly IEnrollmentReadService _enrollmentReadService;

    public GetStudentEnrollmentsQueryHandler(IEnrollmentReadService enrollmentReadService)
    {
        _enrollmentReadService = enrollmentReadService;
    }

    public async Task<IReadOnlyList<CourseEnrollmentDto>> Handle(GetStudentEnrollmentsQuery request, CancellationToken cancellationToken)
    {
        var enrollments = await _enrollmentReadService.GetByStudentIdAsync(request.StudentId, cancellationToken);

        return enrollments
            .Select(e => new CourseEnrollmentDto(
                e.Id,
                e.StudentId,
                e.CourseId,
                e.Course?.Title ?? string.Empty,
                e.Course?.Code ?? string.Empty,
                e.Status,
                e.EnrolledAtUtc))
            .ToList();
    }
}

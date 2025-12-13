using EduStats.Application.Common.Interfaces;
using EduStats.Domain.Courses;
using EduStats.Domain.Enrollments;
using EduStats.Domain.Students;
using MediatR;

namespace EduStats.Application.Enrollments.Commands.EnrollStudentInCourse;

public sealed record EnrollStudentInCourseCommand(Guid StudentId, Guid CourseId) : IRequest<Guid>;

public sealed class EnrollStudentInCourseCommandHandler : IRequestHandler<EnrollStudentInCourseCommand, Guid>
{
    private readonly IReadRepository<Student> _studentRepository;
    private readonly IReadRepository<Course> _courseRepository;
    private readonly IRepository<CourseEnrollment> _enrollmentRepository;
    private readonly IEnrollmentReadService _enrollmentReadService;
    private readonly IUnitOfWork _unitOfWork;

    public EnrollStudentInCourseCommandHandler(
        IReadRepository<Student> studentRepository,
        IReadRepository<Course> courseRepository,
        IRepository<CourseEnrollment> enrollmentRepository,
        IEnrollmentReadService enrollmentReadService,
        IUnitOfWork unitOfWork)
    {
        _studentRepository = studentRepository;
        _courseRepository = courseRepository;
        _enrollmentRepository = enrollmentRepository;
        _enrollmentReadService = enrollmentReadService;
        _unitOfWork = unitOfWork;
    }

    public async Task<Guid> Handle(EnrollStudentInCourseCommand request, CancellationToken cancellationToken)
    {
        var student = await _studentRepository.GetByIdAsync(request.StudentId, cancellationToken)
            ?? throw new InvalidOperationException($"Student {request.StudentId} was not found.");

        var course = await _courseRepository.GetByIdAsync(request.CourseId, cancellationToken)
            ?? throw new InvalidOperationException($"Course {request.CourseId} was not found.");

        if (student.InstitutionId != course.InstitutionId)
        {
            throw new InvalidOperationException("Students may only enroll in courses offered by their institution.");
        }

        var alreadyEnrolled = await _enrollmentReadService.ExistsAsync(student.Id, course.Id, cancellationToken);
        if (alreadyEnrolled)
        {
            throw new InvalidOperationException("Student is already enrolled in this course.");
        }

        var enrollment = new CourseEnrollment(student.Id, course.Id);
        await _enrollmentRepository.AddAsync(enrollment, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);
        return enrollment.Id;
    }
}

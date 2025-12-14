using EduStats.Application.Common.Interfaces;
using EduStats.Domain.Courses;
using EduStats.Domain.Institutions;
using MediatR;

namespace EduStats.Application.Courses.Commands.CreateCourse;

public sealed record CreateCourseCommand(
    Guid InstitutionId,
    string Title,
    string Code,
    string Level,
    int Credits,
    string? Description,
    int? Capacity) : IRequest<Guid>;

public sealed class CreateCourseCommandHandler : IRequestHandler<CreateCourseCommand, Guid>
{
    private readonly IRepository<Course> _courseRepository;
    private readonly IReadRepository<Institution> _institutionRepository;
    private readonly IUnitOfWork _unitOfWork;

    public CreateCourseCommandHandler(
        IRepository<Course> courseRepository,
        IReadRepository<Institution> institutionRepository,
        IUnitOfWork unitOfWork)
    {
        _courseRepository = courseRepository;
        _institutionRepository = institutionRepository;
        _unitOfWork = unitOfWork;
    }

    public async Task<Guid> Handle(CreateCourseCommand request, CancellationToken cancellationToken)
    {
        var institution = await _institutionRepository.GetByIdAsync(request.InstitutionId, cancellationToken)
            ?? throw new InvalidOperationException($"Institution {request.InstitutionId} was not found.");

        var course = new Course(
            institution.Id,
            request.Title,
            request.Code,
            request.Level,
            request.Credits,
            request.Description,
            request.Capacity);

        await _courseRepository.AddAsync(course, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return course.Id;
    }
}

using EduStats.Application.Common.Interfaces;
using EduStats.Domain.Courses;
using MediatR;

namespace EduStats.Application.Courses.Commands.UpdateCourse;

public sealed record UpdateCourseCommand(
    Guid Id,
    string Title,
    string Code,
    string Level,
    int Credits,
    string? Description,
    int? Capacity) : IRequest;

public sealed class UpdateCourseCommandHandler : IRequestHandler<UpdateCourseCommand>
{
    private readonly IRepository<Course> _repository;
    private readonly IUnitOfWork _unitOfWork;

    public UpdateCourseCommandHandler(IRepository<Course> repository, IUnitOfWork unitOfWork)
    {
        _repository = repository;
        _unitOfWork = unitOfWork;
    }

    public async Task<Unit> Handle(UpdateCourseCommand request, CancellationToken cancellationToken)
    {
        var course = await _repository.GetByIdAsync(request.Id, cancellationToken)
            ?? throw new InvalidOperationException($"Course {request.Id} was not found.");

        course.Update(request.Title, request.Code, request.Level, request.Credits, request.Description, request.Capacity);

        await _unitOfWork.SaveChangesAsync(cancellationToken);
        return Unit.Value;
    }
}

using EduStats.Application.Common.Interfaces;
using EduStats.Domain.Courses;
using MediatR;

namespace EduStats.Application.Courses.Commands.DeleteCourse;

public sealed record DeleteCourseCommand(Guid Id) : IRequest;

public sealed class DeleteCourseCommandHandler : IRequestHandler<DeleteCourseCommand>
{
    private readonly IRepository<Course> _repository;
    private readonly IUnitOfWork _unitOfWork;

    public DeleteCourseCommandHandler(IRepository<Course> repository, IUnitOfWork unitOfWork)
    {
        _repository = repository;
        _unitOfWork = unitOfWork;
    }

    public async Task<Unit> Handle(DeleteCourseCommand request, CancellationToken cancellationToken)
    {
        var course = await _repository.GetByIdAsync(request.Id, cancellationToken)
            ?? throw new InvalidOperationException($"Course {request.Id} was not found.");

        await _repository.RemoveAsync(course, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);
        return Unit.Value;
    }
}

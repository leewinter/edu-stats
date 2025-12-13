using EduStats.Application.Common.Interfaces;
using EduStats.Domain.Students;
using MediatR;

namespace EduStats.Application.Students.Commands.DeleteStudent;

public sealed record DeleteStudentCommand(Guid Id) : IRequest;

public sealed class DeleteStudentCommandHandler : IRequestHandler<DeleteStudentCommand>
{
    private readonly IRepository<Student> _repository;
    private readonly IUnitOfWork _unitOfWork;

    public DeleteStudentCommandHandler(IRepository<Student> repository, IUnitOfWork unitOfWork)
    {
        _repository = repository;
        _unitOfWork = unitOfWork;
    }

    public async Task<Unit> Handle(DeleteStudentCommand request, CancellationToken cancellationToken)
    {
        var student = await _repository.GetByIdAsync(request.Id, cancellationToken)
            ?? throw new InvalidOperationException($"Student {request.Id} was not found.");

        await _repository.RemoveAsync(student, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);
        return Unit.Value;
    }
}

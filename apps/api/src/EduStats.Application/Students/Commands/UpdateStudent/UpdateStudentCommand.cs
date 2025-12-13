using EduStats.Application.Common.Interfaces;
using EduStats.Domain.Students;
using MediatR;

namespace EduStats.Application.Students.Commands.UpdateStudent;

public sealed record UpdateStudentCommand(
    Guid Id,
    Guid InstitutionId,
    string FirstName,
    string LastName,
    string Email,
    int EnrollmentYear,
    string? CourseFocus) : IRequest;

public sealed class UpdateStudentCommandHandler : IRequestHandler<UpdateStudentCommand>
{
    private readonly IRepository<Student> _repository;
    private readonly IUnitOfWork _unitOfWork;

    public UpdateStudentCommandHandler(IRepository<Student> repository, IUnitOfWork unitOfWork)
    {
        _repository = repository;
        _unitOfWork = unitOfWork;
    }

    public async Task<Unit> Handle(UpdateStudentCommand request, CancellationToken cancellationToken)
    {
        var student = await _repository.GetByIdAsync(request.Id, cancellationToken)
            ?? throw new InvalidOperationException($"Student {request.Id} was not found.");

        student.UpdateDetails(
            request.FirstName,
            request.LastName,
            request.Email,
            request.EnrollmentYear,
            request.CourseFocus);

        if (student.InstitutionId != request.InstitutionId)
        {
            student.ChangeInstitution(request.InstitutionId);
        }

        await _unitOfWork.SaveChangesAsync(cancellationToken);
        return Unit.Value;
    }
}

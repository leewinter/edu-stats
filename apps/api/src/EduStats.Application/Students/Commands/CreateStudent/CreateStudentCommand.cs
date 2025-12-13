using EduStats.Application.Common.Interfaces;
using EduStats.Domain.Students;
using MediatR;

namespace EduStats.Application.Students.Commands.CreateStudent;

public sealed record CreateStudentCommand(
    Guid InstitutionId,
    string FirstName,
    string LastName,
    string Email,
    int EnrollmentYear,
    string? CourseFocus) : IRequest<Guid>;

public sealed class CreateStudentCommandHandler : IRequestHandler<CreateStudentCommand, Guid>
{
    private readonly IRepository<Student> _repository;
    private readonly IUnitOfWork _unitOfWork;

    public CreateStudentCommandHandler(IRepository<Student> repository, IUnitOfWork unitOfWork)
    {
        _repository = repository;
        _unitOfWork = unitOfWork;
    }

    public async Task<Guid> Handle(CreateStudentCommand request, CancellationToken cancellationToken)
    {
        var student = new Student(
            request.InstitutionId,
            request.FirstName,
            request.LastName,
            request.Email,
            request.EnrollmentYear,
            request.CourseFocus);

        await _repository.AddAsync(student, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);
        return student.Id;
    }
}

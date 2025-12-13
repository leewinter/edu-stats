using EduStats.Application.Common.Interfaces;
using EduStats.Domain.Enrollments;
using MediatR;

namespace EduStats.Application.Enrollments.Commands.DropStudentEnrollment;

public sealed record DropStudentEnrollmentCommand(Guid StudentId, Guid EnrollmentId) : IRequest;

public sealed class DropStudentEnrollmentCommandHandler : IRequestHandler<DropStudentEnrollmentCommand>
{
    private readonly IRepository<CourseEnrollment> _repository;
    private readonly IReadRepository<CourseEnrollment> _readRepository;
    private readonly IUnitOfWork _unitOfWork;

    public DropStudentEnrollmentCommandHandler(
        IRepository<CourseEnrollment> repository,
        IReadRepository<CourseEnrollment> readRepository,
        IUnitOfWork unitOfWork)
    {
        _repository = repository;
        _readRepository = readRepository;
        _unitOfWork = unitOfWork;
    }

    public async Task<Unit> Handle(DropStudentEnrollmentCommand request, CancellationToken cancellationToken)
    {
        var enrollment = await _readRepository.GetByIdAsync(request.EnrollmentId, cancellationToken)
            ?? throw new InvalidOperationException($"Enrollment {request.EnrollmentId} was not found.");

        if (enrollment.StudentId != request.StudentId)
        {
            throw new InvalidOperationException("Enrollment does not belong to the specified student.");
        }

        enrollment.Drop();
        await _repository.UpdateAsync(enrollment, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return Unit.Value;
    }
}

using EduStats.Application.Common.Interfaces;
using EduStats.Application.Institutions.Events;
using EduStats.Domain.Institutions;
using MediatR;

namespace EduStats.Application.Institutions.Commands.UpdateInstitution;

public sealed record UpdateInstitutionCommand(Guid Id, string Name, string Country, string County, int Enrollment) : IRequest;

public sealed class UpdateInstitutionCommandHandler : IRequestHandler<UpdateInstitutionCommand>
{
    private readonly IRepository<Institution> _repository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly IEventPublisher _eventPublisher;

    public UpdateInstitutionCommandHandler(IRepository<Institution> repository, IUnitOfWork unitOfWork, IEventPublisher eventPublisher)
    {
        _repository = repository;
        _unitOfWork = unitOfWork;
        _eventPublisher = eventPublisher;
    }

    public async Task<Unit> Handle(UpdateInstitutionCommand request, CancellationToken cancellationToken)
    {
        var institution = await _repository.GetByIdAsync(request.Id, cancellationToken)
            ?? throw new InvalidOperationException($"Institution {request.Id} was not found");

        institution.Update(request.Name, request.Country, request.County, request.Enrollment);

        await _repository.UpdateAsync(institution, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        var @event = new InstitutionChangedEvent(institution.Id, institution.Name, institution.Country, institution.County, institution.Enrollment, "Updated");
        await _eventPublisher.PublishAsync(@event, routingKey: "institutions.updated", cancellationToken);

        return Unit.Value;
    }
}

using EduStats.Application.Common.Interfaces;
using EduStats.Application.Institutions.Events;
using EduStats.Domain.Institutions;
using MediatR;

namespace EduStats.Application.Institutions.Commands.DeleteInstitution;

public sealed record DeleteInstitutionCommand(Guid Id) : IRequest;

public sealed class DeleteInstitutionCommandHandler : IRequestHandler<DeleteInstitutionCommand>
{
    private readonly IRepository<Institution> _repository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly IEventPublisher _eventPublisher;

    public DeleteInstitutionCommandHandler(
        IRepository<Institution> repository,
        IUnitOfWork unitOfWork,
        IEventPublisher eventPublisher)
    {
        _repository = repository;
        _unitOfWork = unitOfWork;
        _eventPublisher = eventPublisher;
    }

    public async Task<Unit> Handle(DeleteInstitutionCommand request, CancellationToken cancellationToken)
    {
        var institution = await _repository.GetByIdAsync(request.Id, cancellationToken)
            ?? throw new InvalidOperationException($"Institution {request.Id} was not found");

        var addressSnapshots = institution.Addresses
            .Select(a => new InstitutionChangedEventAddress(a.Line1, a.Line2, a.City, a.County, a.Country, a.PostalCode))
            .ToArray();

        await _repository.RemoveAsync(institution, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        var @event = new InstitutionChangedEvent(
            institution.Id,
            institution.Name,
            addressSnapshots.FirstOrDefault()?.Country ?? string.Empty,
            addressSnapshots.FirstOrDefault()?.County ?? string.Empty,
            institution.Enrollment,
            "Deleted",
            addressSnapshots);

        await _eventPublisher.PublishAsync(@event, routingKey: "institutions.deleted", cancellationToken);

        return Unit.Value;
    }
}

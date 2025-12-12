using System.Collections.Generic;
using System.Linq;
using EduStats.Application.Common.Interfaces;
using EduStats.Application.Institutions.Commands.Shared;
using EduStats.Application.Institutions.Events;
using EduStats.Domain.Institutions;
using MediatR;

namespace EduStats.Application.Institutions.Commands.CreateInstitution;

public sealed record CreateInstitutionCommand(string Name, int Enrollment, IReadOnlyCollection<InstitutionAddressInput> Addresses) : IRequest<Guid>;

public sealed class CreateInstitutionCommandHandler : IRequestHandler<CreateInstitutionCommand, Guid>
{
    private readonly IRepository<Institution> _repository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly IEventPublisher _eventPublisher;

    public CreateInstitutionCommandHandler(IRepository<Institution> repository, IUnitOfWork unitOfWork, IEventPublisher eventPublisher)
    {
        _repository = repository;
        _unitOfWork = unitOfWork;
        _eventPublisher = eventPublisher;
    }

    public async Task<Guid> Handle(CreateInstitutionCommand request, CancellationToken cancellationToken)
    {
        var addresses = MapAddresses(request.Addresses);
        var institution = new Institution(request.Name, request.Enrollment, addresses);
        await _repository.AddAsync(institution, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        var primaryAddress = institution.Addresses.FirstOrDefault();

        var @event = new InstitutionChangedEvent(
            institution.Id,
            institution.Name,
            primaryAddress?.Country ?? string.Empty,
            primaryAddress?.County ?? string.Empty,
            institution.Enrollment,
            "Created",
            institution.Addresses.Select(a => new InstitutionChangedEventAddress(a.Line1, a.Line2, a.City, a.County, a.Country, a.PostalCode)).ToArray());

        await _eventPublisher.PublishAsync(@event, routingKey: "institutions.created", cancellationToken);

        return institution.Id;
    }

    private static IEnumerable<InstitutionAddress> MapAddresses(IReadOnlyCollection<InstitutionAddressInput> inputs) =>
        inputs.Select(a => new InstitutionAddress(a.Line1, a.Line2, a.City, a.County, a.Country, a.PostalCode))
            .ToArray();
}

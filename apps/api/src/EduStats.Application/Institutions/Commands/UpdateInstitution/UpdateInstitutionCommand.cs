using EduStats.Application.Common.Interfaces;
using System.Collections.Generic;
using System.Linq;
using EduStats.Application.Institutions.Commands.Shared;
using EduStats.Application.Institutions.Events;
using EduStats.Domain.Institutions;
using MediatR;

namespace EduStats.Application.Institutions.Commands.UpdateInstitution;

public sealed record UpdateInstitutionCommand(Guid Id, string Name, int Enrollment, IReadOnlyCollection<InstitutionAddressInput> Addresses) : IRequest;

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

        institution.Update(request.Name, request.Enrollment);
        var addressInputs = request.Addresses
            .Select(a => new InstitutionAddress(a.Line1, a.Line2, a.City, a.County, a.Country, a.PostalCode))
            .ToArray();

        if (institution.Addresses.Any())
        {
            var existing = institution.Addresses.First();
            var updated = addressInputs.FirstOrDefault();

            if (updated is not null)
            {
                existing.Update(updated.Line1, updated.Line2, updated.City, updated.County, updated.Country, updated.PostalCode);
            }
        }
        else if (addressInputs.Length > 0)
        {
            institution.SetAddresses(addressInputs);
        }

        await _unitOfWork.SaveChangesAsync(cancellationToken);

        var primaryAddress = institution.Addresses.FirstOrDefault();

        var @event = new InstitutionChangedEvent(
            institution.Id,
            institution.Name,
            primaryAddress?.Country ?? string.Empty,
            primaryAddress?.County ?? string.Empty,
            institution.Enrollment,
            "Updated",
            institution.Addresses.Select(a => new InstitutionChangedEventAddress(a.Line1, a.Line2, a.City, a.County, a.Country, a.PostalCode)).ToArray());

        await _eventPublisher.PublishAsync(@event, routingKey: "institutions.updated", cancellationToken);

        return Unit.Value;
    }
}

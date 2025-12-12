using EduStats.Application.Common.Interfaces;
using EduStats.Application.Institutions.Events;
using EduStats.Domain.Institutions;
using MediatR;

namespace EduStats.Application.Institutions.Commands.CreateInstitution;

public sealed record CreateInstitutionCommand(string Name, string Country, string County, int Enrollment) : IRequest<Guid>;

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
        var institution = new Institution(request.Name, request.Country, request.County, request.Enrollment);
        await _repository.AddAsync(institution, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        var @event = new InstitutionChangedEvent(institution.Id, institution.Name, institution.Country, institution.County, institution.Enrollment, "Created");
        await _eventPublisher.PublishAsync(@event, routingKey: "institutions.created", cancellationToken);

        return institution.Id;
    }
}

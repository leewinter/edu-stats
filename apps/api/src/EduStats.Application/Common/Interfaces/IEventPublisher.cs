namespace EduStats.Application.Common.Interfaces;

public interface IEventPublisher
{
    Task PublishAsync<T>(T message, string routingKey, CancellationToken cancellationToken = default);
}

using EduStats.Domain.Common;

namespace EduStats.Application.Common.Interfaces;

public interface IRepository<TEntity> : IReadRepository<TEntity> where TEntity : class, IAggregateRoot
{
    Task AddAsync(TEntity entity, CancellationToken cancellationToken = default);
    Task UpdateAsync(TEntity entity, CancellationToken cancellationToken = default);
    Task RemoveAsync(TEntity entity, CancellationToken cancellationToken = default);
}

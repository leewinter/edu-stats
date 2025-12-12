using EduStats.Domain.Common;

namespace EduStats.Application.Common.Interfaces;

public interface IReadRepository<TEntity> where TEntity : class, IAggregateRoot
{
    Task<TEntity?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);
    Task<IReadOnlyList<TEntity>> ListAsync(int pageNumber, int pageSize, CancellationToken cancellationToken = default);
}

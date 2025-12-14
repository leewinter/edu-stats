using System.Linq.Expressions;
using EduStats.Domain.Common;

namespace EduStats.Application.Common.Interfaces;

public interface IReadRepository<TEntity> where TEntity : class, IAggregateRoot
{
    Task<TEntity?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);
    Task<IReadOnlyList<TEntity>> ListAsync(int pageNumber, int pageSize, Expression<Func<TEntity, bool>>? predicate = null, CancellationToken cancellationToken = default);
    Task<int> CountAsync(Expression<Func<TEntity, bool>>? predicate = null, CancellationToken cancellationToken = default);
}

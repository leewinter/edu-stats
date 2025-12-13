using System.Linq;
using EduStats.Application.Common.Interfaces;
using EduStats.Domain.Common;
using EduStats.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace EduStats.Infrastructure.Repositories;

public class EfRepository<TEntity> : IRepository<TEntity> where TEntity : class, IAggregateRoot
{
    private readonly ApplicationDbContext _context;
    private readonly DbSet<TEntity> _dbSet;

    public EfRepository(ApplicationDbContext context)
    {
        _context = context;
        _dbSet = context.Set<TEntity>();
    }

    public async Task AddAsync(TEntity entity, CancellationToken cancellationToken = default)
    {
        await _dbSet.AddAsync(entity, cancellationToken);
    }

    public Task<TEntity?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        if (typeof(TEntity) == typeof(EduStats.Domain.Institutions.Institution))
        {
            return (Task<TEntity?>)(object)_context.Institutions
                .Include(x => x.Addresses)
                .FirstOrDefaultAsync(x => x.Id == id, cancellationToken);
        }
        if (typeof(TEntity) == typeof(EduStats.Domain.Students.Student))
        {
            return (Task<TEntity?>)(object)_context.Students
                .Include(x => x.Institution)
                .FirstOrDefaultAsync(x => x.Id == id, cancellationToken);
        }

        return _dbSet.FindAsync(new object[] { id }, cancellationToken).AsTask();
    }

    public Task RemoveAsync(TEntity entity, CancellationToken cancellationToken = default)
    {
        _dbSet.Remove(entity);
        return Task.CompletedTask;
    }

    public Task UpdateAsync(TEntity entity, CancellationToken cancellationToken = default)
    {
        _dbSet.Update(entity);
        return Task.CompletedTask;
    }

    public async Task<IReadOnlyList<TEntity>> ListAsync(int pageNumber, int pageSize, CancellationToken cancellationToken = default)
    {
        IQueryable<TEntity> query = _dbSet.AsNoTracking();

        if (typeof(TEntity) == typeof(EduStats.Domain.Institutions.Institution))
        {
            query = (IQueryable<TEntity>)((IQueryable<EduStats.Domain.Institutions.Institution>)query)
                .Include(x => x.Addresses);
        }
        else if (typeof(TEntity) == typeof(EduStats.Domain.Students.Student))
        {
            query = (IQueryable<TEntity>)((IQueryable<EduStats.Domain.Students.Student>)query)
                .Include(x => x.Institution);
        }

        return await query
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync(cancellationToken);
    }
}

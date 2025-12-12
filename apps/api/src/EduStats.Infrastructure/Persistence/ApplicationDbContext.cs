using EduStats.Application.Common.Interfaces;
using EduStats.Domain.Courses;
using EduStats.Domain.Institutions;
using Microsoft.EntityFrameworkCore;

namespace EduStats.Infrastructure.Persistence;

public sealed class ApplicationDbContext : DbContext, IUnitOfWork
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
    {
    }

    public DbSet<Institution> Institutions => Set<Institution>();
    public DbSet<Course> Courses => Set<Course>();
    public DbSet<InstitutionAddress> InstitutionAddresses => Set<InstitutionAddress>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(ApplicationDbContext).Assembly);
        base.OnModelCreating(modelBuilder);
    }
}

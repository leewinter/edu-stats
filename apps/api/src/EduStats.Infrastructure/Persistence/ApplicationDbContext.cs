using EduStats.Application.Common.Interfaces;
using EduStats.Domain.Courses;
using EduStats.Domain.Enrollments;
using EduStats.Domain.Institutions;
using EduStats.Domain.Students;
using Microsoft.EntityFrameworkCore;

namespace EduStats.Infrastructure.Persistence;

public sealed class ApplicationDbContext : DbContext, IUnitOfWork
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
    {
    }

    public DbSet<Institution> Institutions => Set<Institution>();
    public DbSet<Course> Courses => Set<Course>();
    public DbSet<Student> Students => Set<Student>();
    public DbSet<InstitutionAddress> InstitutionAddresses => Set<InstitutionAddress>();
    public DbSet<CourseEnrollment> CourseEnrollments => Set<CourseEnrollment>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(ApplicationDbContext).Assembly);
        base.OnModelCreating(modelBuilder);
    }
}

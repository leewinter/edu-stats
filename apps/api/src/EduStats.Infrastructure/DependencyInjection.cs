using EduStats.Application.Common.Interfaces;
using EduStats.Infrastructure.Messaging;
using EduStats.Infrastructure.Persistence;
using EduStats.Infrastructure.Repositories;
using EduStats.Infrastructure.Services;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace EduStats.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration configuration)
    {
        var connectionString = configuration.GetConnectionString("Main")
            ?? throw new InvalidOperationException("Connection string 'Main' not found.");

        services.AddDbContext<ApplicationDbContext>(options =>
            options.UseNpgsql(connectionString));

        services.AddScoped<IUnitOfWork>(sp => sp.GetRequiredService<ApplicationDbContext>());
        services.AddScoped(typeof(IReadRepository<>), typeof(EfRepository<>));
        services.AddScoped(typeof(IRepository<>), typeof(EfRepository<>));
        services.AddScoped<IEnrollmentReadService, EnrollmentReadService>();

        services.Configure<RabbitMqOptions>(configuration.GetSection(RabbitMqOptions.SectionName));
        services.AddSingleton<IEventPublisher, RabbitMqEventPublisher>();

        services.AddHealthChecks();

        return services;
    }
}

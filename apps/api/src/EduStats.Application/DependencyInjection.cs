using System.Reflection;
using EduStats.Application.Institutions.Queries.GetInstitutions;
using FluentValidation;
using MediatR;
using Microsoft.Extensions.DependencyInjection;

namespace EduStats.Application;

public static class DependencyInjection
{
    public static IServiceCollection AddApplication(this IServiceCollection services)
    {
        services.AddMediatR(typeof(GetInstitutionsQuery).Assembly);
        services.AddValidatorsFromAssembly(Assembly.GetExecutingAssembly());
        return services;
    }
}

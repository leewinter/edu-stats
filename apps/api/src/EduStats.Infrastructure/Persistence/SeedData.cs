using System.Collections.Generic;
using EduStats.Domain.Institutions;
using Microsoft.EntityFrameworkCore;

namespace EduStats.Infrastructure.Persistence;

public static class SeedData
{
    public static async Task SeedAsync(ApplicationDbContext context, CancellationToken cancellationToken = default)
    {
        if (await context.Institutions.AnyAsync(cancellationToken))
        {
            return;
        }

        var institutions = new List<Institution>
        {
            new("Northwind University", "USA", "WA", 12000),
            new("Contoso College", "USA", "NY", 9000),
            new("Fabrikam Institute", "Canada", "ON", 15000),
            new("Tailspin Tech", "Australia", "NSW", 6000),
            new("Adventure Works Academy", "UK", "England", 11000)
        };

        await context.Institutions.AddRangeAsync(institutions, cancellationToken);
        await context.SaveChangesAsync(cancellationToken);
    }
}

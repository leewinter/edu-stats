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
            new("University of Oxford", "UK", "Oxfordshire", 24000),
            new("University of Cambridge", "UK", "Cambridgeshire", 22000),
            new("Imperial College London", "UK", "Greater London", 19000),
            new("University of Edinburgh", "UK", "City of Edinburgh", 33000),
            new("University of Manchester", "UK", "Greater Manchester", 40000)
        };

        await context.Institutions.AddRangeAsync(institutions, cancellationToken);
        await context.SaveChangesAsync(cancellationToken);
    }
}

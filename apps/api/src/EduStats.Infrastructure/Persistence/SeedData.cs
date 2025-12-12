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
            CreateInstitutionWithAddress(
                "University of Oxford",
                24000,
                ("Wellington Square", null, "Oxford", "Oxfordshire", "UK", "OX1 2JD")),
            CreateInstitutionWithAddress(
                "University of Cambridge",
                22000,
                ("The Old Schools", null, "Cambridge", "Cambridgeshire", "UK", "CB2 1TN")),
            CreateInstitutionWithAddress(
                "Imperial College London",
                19000,
                ("Exhibition Road", null, "London", "Greater London", "UK", "SW7 2BX")),
            CreateInstitutionWithAddress(
                "University of Edinburgh",
                33000,
                ("Old College", null, "Edinburgh", "City of Edinburgh", "UK", "EH8 9YL")),
            CreateInstitutionWithAddress(
                "University of Manchester",
                40000,
                ("Oxford Road", null, "Manchester", "Greater Manchester", "UK", "M13 9PL"))
        };

        await context.Institutions.AddRangeAsync(institutions, cancellationToken);
        await context.SaveChangesAsync(cancellationToken);
    }

    private static Institution CreateInstitutionWithAddress(string name, int enrollment, (string Line1, string? Line2, string City, string County, string Country, string PostalCode) address)
    {
        var institution = new Institution(name, enrollment);
        institution.AddAddress(new InstitutionAddress(address.Line1, address.Line2, address.City, address.County, address.Country, address.PostalCode));
        return institution;
    }
}

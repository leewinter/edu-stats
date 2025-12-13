using System;
using System.Collections.Generic;
using System.Linq;
using EduStats.Domain.Courses;
using EduStats.Domain.Institutions;
using Microsoft.EntityFrameworkCore;

namespace EduStats.Infrastructure.Persistence;

public static class SeedData
{
    public static async Task SeedAsync(ApplicationDbContext context, CancellationToken cancellationToken = default)
    {
        var institutionSeeds = new[]
        {
            new InstitutionSeed(
                "University of Oxford",
                24000,
                ("Wellington Square", null, "Oxford", "Oxfordshire, UK", "United Kingdom", "OX1 2JD")),
            new InstitutionSeed(
                "University of Cambridge",
                22000,
                ("The Old Schools", null, "Cambridge", "Cambridgeshire", "United Kingdom", "CB2 1TN")),
            new InstitutionSeed(
                "Imperial College London",
                19000,
                ("Exhibition Road", null, "London", "Greater London", "United Kingdom", "SW7 2BX")),
            new InstitutionSeed(
                "University of Edinburgh",
                33000,
                ("Old College", null, "Edinburgh", "City of Edinburgh", "United Kingdom", "EH8 9YL")),
            new InstitutionSeed(
                "University of Manchester",
                40000,
                ("Oxford Road", null, "Manchester", "Greater Manchester", "United Kingdom", "M13 9PL"))
        };

        var institutionLookup = new Dictionary<string, Institution>(StringComparer.OrdinalIgnoreCase);

        foreach (var seed in institutionSeeds)
        {
            var institution = await context.Institutions
                .Include(i => i.Addresses)
                .FirstOrDefaultAsync(i => i.Name == seed.Name, cancellationToken);

            if (institution is null)
            {
                institution = CreateInstitutionWithAddress(seed);
                await context.Institutions.AddAsync(institution, cancellationToken);
            }
            else
            {
                institution.Update(seed.Name, seed.Enrollment);

                if (!institution.Addresses.Any())
                {
                    institution.AddAddress(CreateAddress(seed.Address));
                }
            }

            institutionLookup[seed.Name] = institution;
        }

        await context.SaveChangesAsync(cancellationToken);

        var courseSeeds = new[]
        {
            new CourseSeed("University of Oxford", "Computer Science BSc", "CS101", "Undergraduate", 120, "Foundational degree in computing."),
            new CourseSeed("University of Oxford", "Data Science MSc", "DS501", "Postgraduate", 90, "Advanced analytics and ML."),
            new CourseSeed("University of Cambridge", "Engineering MEng", "ENG401", "Undergraduate", 140, "Four-year integrated engineering course."),
            new CourseSeed("Imperial College London", "Medicine MBBS", "MED601", "Postgraduate", 180, "Clinical medicine program."),
            new CourseSeed("University of Edinburgh", "Informatics MSc", "INF520", "Postgraduate", 120, "Human-computer interaction and AI."),
            new CourseSeed("University of Manchester", "Business Analytics MBA", "MBA710", "Postgraduate", 100, "Analytics for business leaders.")
        };

        foreach (var courseSeed in courseSeeds)
        {
            if (await context.Courses.AnyAsync(c => c.Code == courseSeed.Code, cancellationToken))
            {
                continue;
            }

            if (institutionLookup.TryGetValue(courseSeed.InstitutionName, out var institution))
            {
                var course = new Course(
                    institution.Id,
                    courseSeed.Title,
                    courseSeed.Code,
                    courseSeed.Level,
                    courseSeed.Credits,
                    courseSeed.Description);

                await context.Courses.AddAsync(course, cancellationToken);
            }
        }

        await context.SaveChangesAsync(cancellationToken);
    }

    private static Institution CreateInstitutionWithAddress(InstitutionSeed seed)
    {
        var institution = new Institution(seed.Name, seed.Enrollment);
        institution.AddAddress(CreateAddress(seed.Address));
        return institution;
    }

    private static InstitutionAddress CreateAddress((string Line1, string? Line2, string City, string County, string Country, string PostalCode) address) =>
        new(address.Line1, address.Line2, address.City, address.County, address.Country, address.PostalCode);

    private sealed record InstitutionSeed(
        string Name,
        int Enrollment,
        (string Line1, string? Line2, string City, string County, string Country, string PostalCode) Address);

    private sealed record CourseSeed(
        string InstitutionName,
        string Title,
        string Code,
        string Level,
        int Credits,
        string Description);
}

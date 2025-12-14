using System;
using System.Collections.Generic;
using System.Linq;
using EduStats.Domain.Courses;
using EduStats.Domain.Enrollments;
using EduStats.Domain.Institutions;
using EduStats.Domain.Students;
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
                ("Wellington Square", null, "Oxford", "Oxfordshire", "United Kingdom", "OX1 2JD")),
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
                ("Oxford Road", null, "Manchester", "Greater Manchester", "United Kingdom", "M13 9PL")),
            new InstitutionSeed(
                "London School of Economics",
                12000,
                ("Houghton Street", null, "London", "Greater London", "United Kingdom", "WC2A 2AE")),
            new InstitutionSeed(
                "University College London",
                36000,
                ("Gower Street", null, "London", "Greater London", "United Kingdom", "WC1E 6BT")),
            new InstitutionSeed(
                "King's College London",
                32000,
                ("Strand", null, "London", "Greater London", "United Kingdom", "WC2R 2LS")),
            new InstitutionSeed(
                "University of Warwick",
                28000,
                ("Gibbet Hill Road", null, "Coventry", "West Midlands", "United Kingdom", "CV4 7AL")),
            new InstitutionSeed(
                "University of Bristol",
                27000,
                ("Queens Road", null, "Bristol", "Bristol", "United Kingdom", "BS8 1RJ")),
            new InstitutionSeed(
                "University of Glasgow",
                29000,
                ("University Avenue", null, "Glasgow", "Glasgow City", "United Kingdom", "G12 8QQ")),
            new InstitutionSeed(
                "Durham University",
                20000,
                ("The Palatine Centre", null, "Durham", "County Durham", "United Kingdom", "DH1 3LE"))
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

        var studentSeeds = new[]
        {
            new StudentSeed("University of Oxford", "Amelia", "Hughes", "amelia.hughes@oxford.ac.uk", 2023, "Computer Science"),
            new StudentSeed("University of Cambridge", "Noah", "Patel", "noah.patel@cambridge.ac.uk", 2022, "Mechanical Engineering"),
            new StudentSeed("Imperial College London", "Isla", "Foster", "isla.foster@imperial.ac.uk", 2024, "Medicine"),
            new StudentSeed("University of Edinburgh", "Leo", "Macdonald", "leo.macdonald@ed.ac.uk", 2021, "Informatics"),
            new StudentSeed("University of Manchester", "Olivia", "Khan", "olivia.khan@manchester.ac.uk", 2023, "Business Analytics"),
            new StudentSeed("King's College London", "Mia", "Clark", "mia.clark@kcl.ac.uk", 2022, "Global Health"),
            new StudentSeed("University College London", "Ethan", "Wright", "ethan.wright@ucl.ac.uk", 2023, "Architecture"),
            new StudentSeed("London School of Economics", "Grace", "Chen", "grace.chen@lse.ac.uk", 2024, "International Relations"),
            new StudentSeed("University of Warwick", "Henry", "Davis", "henry.davis@warwick.ac.uk", 2021, "Economics"),
            new StudentSeed("University of Bristol", "Sophia", "Lee", "sophia.lee@bristol.ac.uk", 2022, "Mechanical Engineering"),
            new StudentSeed("University of Glasgow", "Benjamin", "Reed", "benjamin.reed@glasgow.ac.uk", 2023, "Physics"),
            new StudentSeed("Durham University", "Ava", "Morgan", "ava.morgan@durham.ac.uk", 2024, "Law"),
            new StudentSeed("University College London", "Chloe", "Adams", "chloe.adams@ucl.ac.uk", 2021, "Urban Planning"),
            new StudentSeed("London School of Economics", "Liam", "Bennett", "liam.bennett@lse.ac.uk", 2023, "Finance"),
            new StudentSeed("University of Warwick", "Ella", "Shaw", "ella.shaw@warwick.ac.uk", 2022, "Data Science")
        };

        foreach (var student in studentSeeds)
        {
            if (await context.Students.AnyAsync(s => s.Email == student.Email, cancellationToken) ||
                !institutionLookup.TryGetValue(student.InstitutionName, out var institution))
            {
                continue;
            }

            await context.Students.AddAsync(
                new Student(
                    institution.Id,
                    student.FirstName,
                    student.LastName,
                    student.Email,
                    student.EnrollmentYear,
                    student.CourseFocus),
                cancellationToken);
        }

        await context.SaveChangesAsync(cancellationToken);

        var courseSeeds = new[]
        {
            new CourseSeed("University of Oxford", "Computer Science BSc", "CS101", "Undergraduate", 120, "Foundational degree in computing.", 60),
            new CourseSeed("University of Oxford", "Data Science MSc", "DS501", "Postgraduate", 90, "Advanced analytics and ML.", 45),
            new CourseSeed("University of Oxford", "AI & Robotics MSc", "AI605", "Postgraduate", 95, "Intelligent systems and robotics.", 45),
            new CourseSeed("University of Cambridge", "Engineering MEng", "ENG401", "Undergraduate", 140, "Four-year integrated engineering course.", 80),
            new CourseSeed("University of Cambridge", "Mathematics Tripos", "MTH300", "Undergraduate", 130, "Pure and applied mathematics.", 70),
            new CourseSeed("Imperial College London", "Medicine MBBS", "MED601", "Postgraduate", 180, "Clinical medicine program.", 150),
            new CourseSeed("Imperial College London", "Biomedical Engineering MSc", "BME540", "Postgraduate", 120, "Bioinstrumentation and design.", 55),
            new CourseSeed("University of Edinburgh", "Informatics MSc", "INF520", "Postgraduate", 120, "Human-computer interaction and AI.", 65),
            new CourseSeed("University of Edinburgh", "Cybersecurity MSc", "CYB515", "Postgraduate", 110, "Resilience and digital security.", 50),
            new CourseSeed("University of Manchester", "Business Analytics MBA", "MBA710", "Postgraduate", 100, "Analytics for business leaders.", 55),
            new CourseSeed("University of Manchester", "Digital Marketing MSc", "DM630", "Postgraduate", 80, "Brand strategy and analytics.", 45),
            new CourseSeed("London School of Economics", "Finance MSc", "FIN610", "Postgraduate", 100, "Corporate finance and valuation.", 120),
            new CourseSeed("London School of Economics", "International Relations MSc", "IR520", "Postgraduate", 90, "Global policy and governance.", 100),
            new CourseSeed("University College London", "Architecture BArch", "ARC210", "Undergraduate", 110, "Studio-based architecture.", 90),
            new CourseSeed("University College London", "Urban Planning MSc", "URB550", "Postgraduate", 80, "Future cities and mobility.", 60),
            new CourseSeed("King's College London", "Pharmacy MPharm", "PHM700", "Postgraduate", 160, "Clinical pharmacy practice.", 80),
            new CourseSeed("King's College London", "Nursing BSc", "NUR205", "Undergraduate", 100, "Adult nursing programme.", 110),
            new CourseSeed("University of Warwick", "Economics BSc", "ECO220", "Undergraduate", 120, "Micro and macroeconomics.", 95),
            new CourseSeed("University of Bristol", "Mechanical Engineering MEng", "MECH450", "Postgraduate", 140, "Design and dynamics.", 70),
            new CourseSeed("University of Glasgow", "Physics BSc", "PHY200", "Undergraduate", 110, "Astrophysics and applied physics.", 80),
            new CourseSeed("Durham University", "Law LLB", "LAW230", "Undergraduate", 120, "Foundations of UK law.", 120)
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
                    courseSeed.Description,
                    courseSeed.Capacity);

                await context.Courses.AddAsync(course, cancellationToken);
            }
        }

        await context.SaveChangesAsync(cancellationToken);

        var enrollmentSeeds = new[]
        {
            new EnrollmentSeed("amelia.hughes@oxford.ac.uk", "CS101", CourseEnrollmentStatus.Active),
            new EnrollmentSeed("amelia.hughes@oxford.ac.uk", "AI605", CourseEnrollmentStatus.Completed),
            new EnrollmentSeed("noah.patel@cambridge.ac.uk", "ENG401", CourseEnrollmentStatus.Active),
            new EnrollmentSeed("noah.patel@cambridge.ac.uk", "MTH300", CourseEnrollmentStatus.Completed),
            new EnrollmentSeed("isla.foster@imperial.ac.uk", "MED601", CourseEnrollmentStatus.Active),
            new EnrollmentSeed("isla.foster@imperial.ac.uk", "BME540", CourseEnrollmentStatus.Dropped),
            new EnrollmentSeed("leo.macdonald@ed.ac.uk", "INF520", CourseEnrollmentStatus.Completed),
            new EnrollmentSeed("leo.macdonald@ed.ac.uk", "CYB515", CourseEnrollmentStatus.Active),
            new EnrollmentSeed("olivia.khan@manchester.ac.uk", "MBA710", CourseEnrollmentStatus.Active),
            new EnrollmentSeed("olivia.khan@manchester.ac.uk", "DM630", CourseEnrollmentStatus.Completed),
            new EnrollmentSeed("mia.clark@kcl.ac.uk", "PHM700", CourseEnrollmentStatus.Active),
            new EnrollmentSeed("ethan.wright@ucl.ac.uk", "ARC210", CourseEnrollmentStatus.Active),
            new EnrollmentSeed("ethan.wright@ucl.ac.uk", "URB550", CourseEnrollmentStatus.Completed),
            new EnrollmentSeed("grace.chen@lse.ac.uk", "FIN610", CourseEnrollmentStatus.Active),
            new EnrollmentSeed("grace.chen@lse.ac.uk", "IR520", CourseEnrollmentStatus.Active),
            new EnrollmentSeed("henry.davis@warwick.ac.uk", "ECO220", CourseEnrollmentStatus.Completed),
            new EnrollmentSeed("sophia.lee@bristol.ac.uk", "MECH450", CourseEnrollmentStatus.Active),
            new EnrollmentSeed("benjamin.reed@glasgow.ac.uk", "PHY200", CourseEnrollmentStatus.Active),
            new EnrollmentSeed("ava.morgan@durham.ac.uk", "LAW230", CourseEnrollmentStatus.Active),
            new EnrollmentSeed("chloe.adams@ucl.ac.uk", "URB550", CourseEnrollmentStatus.Dropped),
            new EnrollmentSeed("liam.bennett@lse.ac.uk", "FIN610", CourseEnrollmentStatus.Completed),
            new EnrollmentSeed("ella.shaw@warwick.ac.uk", "ECO220", CourseEnrollmentStatus.Active)
        };

        var studentsByEmail = await context.Students
            .AsNoTracking()
            .ToDictionaryAsync(s => s.Email, s => s.Id, cancellationToken);

        var coursesByCode = await context.Courses
            .AsNoTracking()
            .ToDictionaryAsync(c => c.Code, c => c.Id, cancellationToken);

        foreach (var seed in enrollmentSeeds)
        {
            if (!studentsByEmail.TryGetValue(seed.StudentEmail, out var studentId) ||
                !coursesByCode.TryGetValue(seed.CourseCode, out var courseId))
            {
                continue;
            }

            var alreadyExists = await context.CourseEnrollments
                .AnyAsync(e => e.StudentId == studentId && e.CourseId == courseId, cancellationToken);

            if (alreadyExists)
            {
                continue;
            }

            var enrollmentEntity = new CourseEnrollment(studentId, courseId);
            switch (seed.Status)
            {
                case CourseEnrollmentStatus.Completed:
                    enrollmentEntity.Complete();
                    break;
                case CourseEnrollmentStatus.Dropped:
                    enrollmentEntity.Drop();
                    break;
            }

            await context.CourseEnrollments.AddAsync(enrollmentEntity, cancellationToken);
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
        string Description,
        int Capacity);

    private sealed record StudentSeed(
        string InstitutionName,
        string FirstName,
        string LastName,
        string Email,
        int EnrollmentYear,
        string CourseFocus);

    private sealed record EnrollmentSeed(string StudentEmail, string CourseCode, CourseEnrollmentStatus Status);
}

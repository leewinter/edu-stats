using EduStats.Domain.Institutions;
using FluentAssertions;

namespace EduStats.Application.Tests;

public sealed class InstitutionTests
{
    [Fact]
    public void SetAddresses_replaces_existing_addresses_and_attaches_institution()
    {
        var initialAddresses = new[]
        {
            new InstitutionAddress("Old College", null, "Edinburgh", "City of Edinburgh", "UK", "EH8 9YL")
        };

        var institution = new Institution("Test University", 1000, initialAddresses);

        var newAddresses = new[]
        {
            new InstitutionAddress("1 New Road", null, "Manchester", "Greater Manchester", "UK", "M13 9PL"),
            new InstitutionAddress("2 Campus Way", "Suite 10", "Birmingham", "West Midlands", "UK", "B1 1AA")
        };

        institution.SetAddresses(newAddresses);

        institution.Addresses.Should().HaveCount(2);
        institution.Addresses.Select(a => a.Line1)
            .Should().Contain(new[] { "1 New Road", "2 Campus Way" });
        institution.Addresses.Should().OnlyContain(address => address.InstitutionId == institution.Id);
    }
}

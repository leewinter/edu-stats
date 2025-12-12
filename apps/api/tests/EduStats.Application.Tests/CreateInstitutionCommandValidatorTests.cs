using EduStats.Application.Institutions.Commands.CreateInstitution;
using EduStats.Application.Institutions.Commands.Shared;
using FluentAssertions;

namespace EduStats.Application.Tests;

public sealed class CreateInstitutionCommandValidatorTests
{
    private readonly CreateInstitutionCommandValidator _validator = new();

    [Fact]
    public void Should_fail_when_no_addresses_provided()
    {
        var command = new CreateInstitutionCommand(
            "Test University",
            12345,
            Array.Empty<InstitutionAddressInput>());

        var result = _validator.Validate(command);

        result.IsValid.Should().BeFalse();
        result.Errors.Should().Contain(e => e.PropertyName == "Addresses");
    }

    [Fact]
    public void Should_succeed_with_valid_address()
    {
        var command = new CreateInstitutionCommand(
            "Test University",
            12345,
            new[]
            {
                new InstitutionAddressInput(
                    "1 College Way",
                    null,
                    "Glasgow",
                    "Glasgow City",
                    "United Kingdom",
                    "G12 8QQ")
            });

        var result = _validator.Validate(command);

        result.IsValid.Should().BeTrue();
    }
}

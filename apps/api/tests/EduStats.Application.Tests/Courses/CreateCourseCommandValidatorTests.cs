using EduStats.Application.Courses.Commands.CreateCourse;
using FluentAssertions;

namespace EduStats.Application.Tests.Courses;

public sealed class CreateCourseCommandValidatorTests
{
    private readonly CreateCourseCommandValidator _validator = new();

    [Fact]
    public void Should_fail_when_missing_title()
    {
        var command = new CreateCourseCommand(
            Guid.NewGuid(),
            string.Empty,
            "CS101",
            "Undergraduate",
            120,
            null,
            null);

        var result = _validator.Validate(command);

        result.IsValid.Should().BeFalse();
    }

    [Fact]
    public void Should_pass_with_valid_payload()
    {
        var command = new CreateCourseCommand(
            Guid.NewGuid(),
            "Computer Science",
            "CS101",
            "Undergraduate",
            120,
            "Intro to computing",
            40);

        var result = _validator.Validate(command);

        result.IsValid.Should().BeTrue();
    }
}

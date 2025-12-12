using FluentValidation;

namespace EduStats.Application.Courses.Commands.UpdateCourse;

public sealed class UpdateCourseCommandValidator : AbstractValidator<UpdateCourseCommand>
{
    public UpdateCourseCommandValidator()
    {
        RuleFor(x => x.Id).NotEmpty();
        RuleFor(x => x.Title).NotEmpty().MaximumLength(256);
        RuleFor(x => x.Code).NotEmpty().MaximumLength(32);
        RuleFor(x => x.Level).NotEmpty().MaximumLength(64);
        RuleFor(x => x.Credits).GreaterThan(0);
        RuleFor(x => x.Description).MaximumLength(1024);
    }
}

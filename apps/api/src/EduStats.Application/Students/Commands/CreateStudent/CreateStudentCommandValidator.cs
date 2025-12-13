using FluentValidation;

namespace EduStats.Application.Students.Commands.CreateStudent;

public sealed class CreateStudentCommandValidator : AbstractValidator<CreateStudentCommand>
{
    public CreateStudentCommandValidator()
    {
        RuleFor(x => x.InstitutionId).NotEmpty();
        RuleFor(x => x.FirstName).NotEmpty().MaximumLength(128);
        RuleFor(x => x.LastName).NotEmpty().MaximumLength(128);
        RuleFor(x => x.Email).NotEmpty().EmailAddress().MaximumLength(256);
        RuleFor(x => x.EnrollmentYear).InclusiveBetween(1950, DateTime.UtcNow.Year + 1);
        RuleFor(x => x.CourseFocus).MaximumLength(256).When(x => x.CourseFocus != null);
    }
}

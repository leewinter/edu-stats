using FluentValidation;

namespace EduStats.Application.Institutions.Commands.CreateInstitution;

public sealed class CreateInstitutionCommandValidator : AbstractValidator<CreateInstitutionCommand>
{
    public CreateInstitutionCommandValidator()
    {
        RuleFor(x => x.Name).NotEmpty().MaximumLength(256);
        RuleFor(x => x.Country).NotEmpty().MaximumLength(128);
        RuleFor(x => x.County).MaximumLength(128);
        RuleFor(x => x.Enrollment).GreaterThanOrEqualTo(0);
    }
}

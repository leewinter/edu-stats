using EduStats.Application.Institutions.Commands.Shared;
using FluentValidation;

namespace EduStats.Application.Institutions.Commands.CreateInstitution;

public sealed class CreateInstitutionCommandValidator : AbstractValidator<CreateInstitutionCommand>
{
    public CreateInstitutionCommandValidator()
    {
        RuleFor(x => x.Name).NotEmpty().MaximumLength(256);
        RuleFor(x => x.Enrollment).GreaterThanOrEqualTo(0);
        RuleFor(x => x.Addresses)
            .NotEmpty();

        RuleForEach(x => x.Addresses)
            .SetValidator(new InstitutionAddressInputValidator());
    }
}

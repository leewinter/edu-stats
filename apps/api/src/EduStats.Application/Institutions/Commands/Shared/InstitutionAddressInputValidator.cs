using FluentValidation;

namespace EduStats.Application.Institutions.Commands.Shared;

public sealed class InstitutionAddressInputValidator : AbstractValidator<InstitutionAddressInput>
{
    public InstitutionAddressInputValidator()
    {
        RuleFor(a => a.Line1).NotEmpty().MaximumLength(256);
        RuleFor(a => a.Line2).MaximumLength(256);
        RuleFor(a => a.City).NotEmpty().MaximumLength(128);
        RuleFor(a => a.County).NotEmpty().MaximumLength(128);
        RuleFor(a => a.Country).NotEmpty().MaximumLength(128);
        RuleFor(a => a.PostalCode).NotEmpty().MaximumLength(32);
    }
}

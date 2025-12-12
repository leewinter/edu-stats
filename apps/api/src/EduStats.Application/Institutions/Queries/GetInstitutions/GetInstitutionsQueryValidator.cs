using EduStats.Application.Common.Models;
using FluentValidation;

namespace EduStats.Application.Institutions.Queries.GetInstitutions;

public sealed class GetInstitutionsQueryValidator : AbstractValidator<GetInstitutionsQuery>
{
    public GetInstitutionsQueryValidator()
    {
        RuleFor(q => q.Pagination)
            .NotNull();

        RuleFor(q => q.Pagination.PageNumber)
            .GreaterThanOrEqualTo(1);

        RuleFor(q => q.Pagination.PageSize)
            .InclusiveBetween(1, 500);
    }
}

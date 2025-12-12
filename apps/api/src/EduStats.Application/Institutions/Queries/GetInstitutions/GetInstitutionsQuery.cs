using EduStats.Application.Common.Interfaces;
using EduStats.Application.Common.Models;
using EduStats.Application.Institutions.Dtos;
using EduStats.Domain.Institutions;
using MediatR;

namespace EduStats.Application.Institutions.Queries.GetInstitutions;

public sealed record GetInstitutionsQuery(PaginationRequest Pagination) : IRequest<PagedResult<InstitutionDto>>;

public sealed class GetInstitutionsQueryHandler : IRequestHandler<GetInstitutionsQuery, PagedResult<InstitutionDto>>
{
    private readonly IReadRepository<Institution> _repository;

    public GetInstitutionsQueryHandler(IReadRepository<Institution> repository)
    {
        _repository = repository;
    }

    public async Task<PagedResult<InstitutionDto>> Handle(GetInstitutionsQuery request, CancellationToken cancellationToken)
    {
        var pageNumber = request.Pagination.PageNumber;
        var pageSize = request.Pagination.PageSize;

        var items = await _repository.ListAsync(pageNumber, pageSize, cancellationToken);
        var dtos = items.Select(ToDto).ToArray();

        // For now we only know the count of returned items; Infrastructure will extend to include real totals.
        var totalCount = dtos.Length;
        return new PagedResult<InstitutionDto>(dtos, totalCount, pageNumber, pageSize);
    }

    private static InstitutionDto ToDto(Institution institution) =>
        new(institution.Id, institution.Name, institution.Country, institution.County, institution.Enrollment);
}

using System.Linq;
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

        var items = await _repository.ListAsync(pageNumber, pageSize, null, cancellationToken);
        var totalCount = await _repository.CountAsync(null, cancellationToken);
        var dtos = items.Select(ToDto).ToArray();

        return new PagedResult<InstitutionDto>(dtos, totalCount, pageNumber, pageSize);
    }

    private static InstitutionDto ToDto(Institution institution)
    {
        var addresses = institution.Addresses
            .Select(address => new InstitutionAddressDto(address.Line1, address.Line2, address.City, address.County, address.Country, address.PostalCode))
            .ToArray();

        var primaryAddress = addresses.FirstOrDefault();
        var country = primaryAddress?.Country ?? string.Empty;
        var county = primaryAddress?.County ?? string.Empty;

        return new InstitutionDto(institution.Id, institution.Name, country, county, institution.Enrollment, addresses);
    }
}

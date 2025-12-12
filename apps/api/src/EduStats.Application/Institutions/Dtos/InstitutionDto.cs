using System.Collections.Generic;

namespace EduStats.Application.Institutions.Dtos;

public record InstitutionDto(Guid Id, string Name, string Country, string County, int Enrollment, IReadOnlyCollection<InstitutionAddressDto> Addresses);

public record InstitutionAddressDto(string Line1, string? Line2, string City, string County, string Country, string PostalCode);

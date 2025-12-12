using System.Collections.Generic;

namespace EduStats.Api.Contracts;

public sealed record InstitutionAddressRequest(string Line1, string? Line2, string City, string County, string Country, string PostalCode);

public sealed record CreateInstitutionRequest(string Name, int Enrollment, IReadOnlyCollection<InstitutionAddressRequest> Addresses);

public sealed record UpdateInstitutionRequest(string Name, int Enrollment, IReadOnlyCollection<InstitutionAddressRequest> Addresses);

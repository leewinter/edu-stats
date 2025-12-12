namespace EduStats.Application.Institutions.Commands.Shared;

public sealed record InstitutionAddressInput(string Line1, string? Line2, string City, string County, string Country, string PostalCode);

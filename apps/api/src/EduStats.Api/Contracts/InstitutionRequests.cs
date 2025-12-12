namespace EduStats.Api.Contracts;

public sealed record CreateInstitutionRequest(string Name, string Country, string County, int Enrollment);

public sealed record UpdateInstitutionRequest(string Name, string Country, string County, int Enrollment);

namespace EduStats.Application.Institutions.Dtos;

public record InstitutionDto(Guid Id, string Name, string Country, string StateProvince, int Enrollment);

namespace EduStats.Application.Institutions.Events;

public record InstitutionChangedEvent(Guid Id, string Name, string Country, string StateProvince, int Enrollment, string ChangeType);

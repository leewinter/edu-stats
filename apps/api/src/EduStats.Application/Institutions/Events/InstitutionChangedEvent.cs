using System.Collections.Generic;

namespace EduStats.Application.Institutions.Events;

public record InstitutionChangedEvent(Guid Id, string Name, string Country, string County, int Enrollment, string ChangeType, IReadOnlyCollection<InstitutionChangedEventAddress> Addresses);

public record InstitutionChangedEventAddress(string Line1, string? Line2, string City, string County, string Country, string PostalCode);

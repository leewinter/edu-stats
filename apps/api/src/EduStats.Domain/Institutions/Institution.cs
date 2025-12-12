using EduStats.Domain.Common;

namespace EduStats.Domain.Institutions;

public sealed class Institution : AuditableEntity<Guid>, IAggregateRoot
{
    public string Name { get; private set; }
    public string Country { get; private set; }
    public string StateProvince { get; private set; }
    public int Enrollment { get; private set; }

    private Institution()
    {
        Name = string.Empty;
        Country = string.Empty;
        StateProvince = string.Empty;
    }

    public Institution(string name, string country, string stateProvince, int enrollment)
    {
        Id = Guid.NewGuid();
        Name = name;
        Country = country;
        StateProvince = stateProvince;
        Enrollment = enrollment;
    }

    public void UpdateEnrollment(int enrollment)
    {
        Enrollment = enrollment;
    }
}

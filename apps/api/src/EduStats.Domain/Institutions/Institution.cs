using EduStats.Domain.Common;

namespace EduStats.Domain.Institutions;

public sealed class Institution : AuditableEntity<Guid>, IAggregateRoot
{
    public string Name { get; private set; }
    public string Country { get; private set; }
    public string County { get; private set; }
    public int Enrollment { get; private set; }

    private Institution()
    {
        Name = string.Empty;
        Country = string.Empty;
        County = string.Empty;
    }

    public Institution(string name, string country, string county, int enrollment)
    {
        Id = Guid.NewGuid();
        Name = name;
        Country = country;
        County = county;
        Enrollment = enrollment;
    }

    public void UpdateEnrollment(int enrollment)
    {
        Enrollment = enrollment;
    }

    public void Update(string name, string country, string county, int enrollment)
    {
        Name = name;
        Country = country;
        County = county;
        Enrollment = enrollment;
    }
}

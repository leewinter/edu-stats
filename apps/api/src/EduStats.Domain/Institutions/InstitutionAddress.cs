using EduStats.Domain.Common;

namespace EduStats.Domain.Institutions;

public sealed class InstitutionAddress : AuditableEntity<Guid>
{
    public Guid InstitutionId { get; private set; }
    public Institution Institution { get; private set; } = null!;

    public string Line1 { get; private set; }
    public string? Line2 { get; private set; }
    public string City { get; private set; }
    public string County { get; private set; }
    public string Country { get; private set; }
    public string PostalCode { get; private set; }

    private InstitutionAddress()
    {
        Line1 = string.Empty;
        City = string.Empty;
        County = string.Empty;
        Country = string.Empty;
        PostalCode = string.Empty;
    }

    public InstitutionAddress(string line1, string? line2, string city, string county, string country, string postalCode)
    {
        Line1 = line1;
        Line2 = line2;
        City = city;
        County = county;
        Country = country;
        PostalCode = postalCode;
    }

    internal void AttachToInstitution(Institution institution)
    {
        Institution = institution;
        InstitutionId = institution.Id;
    }

    public void Update(string line1, string? line2, string city, string county, string country, string postalCode)
    {
        Line1 = line1;
        Line2 = line2;
        City = city;
        County = county;
        Country = country;
        PostalCode = postalCode;
    }
}

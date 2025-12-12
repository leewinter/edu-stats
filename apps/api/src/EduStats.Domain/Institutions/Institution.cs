using System.Collections.Generic;
using EduStats.Domain.Common;

namespace EduStats.Domain.Institutions;

public sealed class Institution : AuditableEntity<Guid>, IAggregateRoot
{
    public string Name { get; private set; }
    public int Enrollment { get; private set; }
    private readonly List<InstitutionAddress> _addresses = new();
    public IReadOnlyCollection<InstitutionAddress> Addresses => _addresses.AsReadOnly();

    private Institution()
    {
        Name = string.Empty;
    }

    public Institution(string name, int enrollment, IEnumerable<InstitutionAddress>? addresses = null)
    {
        Id = Guid.NewGuid();
        Name = name;
        Enrollment = enrollment;
        if (addresses is not null)
        {
            SetAddresses(addresses);
        }
    }

    public void UpdateEnrollment(int enrollment)
    {
        Enrollment = enrollment;
    }

    public void Update(string name, int enrollment)
    {
        Name = name;
        Enrollment = enrollment;
    }

    public void SetAddresses(IEnumerable<InstitutionAddress> addresses)
    {
        _addresses.Clear();
        foreach (var address in addresses)
        {
            AddAddress(address);
        }
    }

    public void AddAddress(InstitutionAddress address)
    {
        address.AttachToInstitution(this);
        _addresses.Add(address);
    }
}

namespace EduStats.Domain.Common;

public abstract class AuditableEntity<TId> : BaseEntity<TId>
{
    public DateTime CreatedAtUtc { get; protected set; } = DateTime.UtcNow;
    public string CreatedBy { get; protected set; } = "system";
    public DateTime? UpdatedAtUtc { get; protected set; }
    public string? UpdatedBy { get; protected set; }

    public void SetAudit(string userId)
    {
        UpdatedAtUtc = DateTime.UtcNow;
        UpdatedBy = userId;
    }
}

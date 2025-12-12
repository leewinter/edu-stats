using EduStats.Domain.Institutions;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace EduStats.Infrastructure.Persistence.Configurations;

public sealed class InstitutionAddressConfiguration : IEntityTypeConfiguration<InstitutionAddress>
{
    public void Configure(EntityTypeBuilder<InstitutionAddress> builder)
    {
        builder.ToTable("institution_addresses");
        builder.HasKey(x => x.Id);

        builder.Property(x => x.Line1)
            .IsRequired()
            .HasMaxLength(256);

        builder.Property(x => x.Line2)
            .HasMaxLength(256);

        builder.Property(x => x.City)
            .IsRequired()
            .HasMaxLength(128);

        builder.Property(x => x.County)
            .IsRequired()
            .HasMaxLength(128);

        builder.Property(x => x.Country)
            .IsRequired()
            .HasMaxLength(128);

        builder.Property(x => x.PostalCode)
            .IsRequired()
            .HasMaxLength(32);

        builder.Property(x => x.CreatedAtUtc)
            .HasColumnName("created_at_utc");

        builder.Property(x => x.UpdatedAtUtc)
            .HasColumnName("updated_at_utc");
    }
}

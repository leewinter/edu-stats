using EduStats.Domain.Enrollments;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace EduStats.Infrastructure.Persistence.Configurations;

public sealed class CourseEnrollmentConfiguration : IEntityTypeConfiguration<CourseEnrollment>
{
    public void Configure(EntityTypeBuilder<CourseEnrollment> builder)
    {
        builder.ToTable("course_enrollments");
        builder.HasKey(x => x.Id);

        builder.Property(x => x.EnrolledAtUtc)
            .HasColumnName("enrolled_at_utc");

        builder.Property(x => x.CompletedAtUtc)
            .HasColumnName("completed_at_utc");

        builder.Property(x => x.Status)
            .HasConversion<string>()
            .HasMaxLength(32)
            .IsRequired();

        builder.HasIndex(x => new { x.StudentId, x.CourseId })
            .IsUnique();

        builder
            .HasOne(x => x.Student)
            .WithMany()
            .HasForeignKey(x => x.StudentId)
            .OnDelete(DeleteBehavior.Cascade);

        builder
            .HasOne(x => x.Course)
            .WithMany()
            .HasForeignKey(x => x.CourseId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}

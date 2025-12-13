using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace EduStats.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class DropEnrollmentUniqueIndex : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("DROP INDEX IF EXISTS \"IX_course_enrollments_StudentId_CourseId\";");
            migrationBuilder.Sql(
                "CREATE UNIQUE INDEX \"IX_course_enrollments_Active\" ON course_enrollments (\"StudentId\", \"CourseId\") WHERE \"Status\" = 'Active';");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("DROP INDEX IF EXISTS \"IX_course_enrollments_Active\";");
            migrationBuilder.Sql(
                "CREATE UNIQUE INDEX \"IX_course_enrollments_StudentId_CourseId\" ON course_enrollments (\"StudentId\", \"CourseId\");");
        }
    }
}

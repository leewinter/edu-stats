using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace EduStats.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class AddActiveEnrollmentCount : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "ActiveEnrollmentCount",
                table: "students",
                type: "integer",
                nullable: false,
                defaultValue: 0);
            migrationBuilder.Sql(
                @"
                    UPDATE students s
                    SET ""ActiveEnrollmentCount"" = sub.count
                    FROM (
                        SELECT ""StudentId"", COUNT(*) AS count
                        FROM course_enrollments
                        WHERE ""Status"" = 'Active'
                        GROUP BY ""StudentId""
                    ) AS sub
                    WHERE sub.""StudentId"" = s.""Id"";
                ");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ActiveEnrollmentCount",
                table: "students");
        }
    }
}

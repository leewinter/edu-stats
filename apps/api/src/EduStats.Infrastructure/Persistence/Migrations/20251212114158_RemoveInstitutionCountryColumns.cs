using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace EduStats.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class RemoveInstitutionCountryColumns : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Country",
                table: "institutions");

            migrationBuilder.DropColumn(
                name: "County",
                table: "institutions");

            migrationBuilder.AddColumn<string>(
                name: "Country",
                table: "institution_addresses",
                type: "character varying(128)",
                maxLength: 128,
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Country",
                table: "institution_addresses");

            migrationBuilder.AddColumn<string>(
                name: "Country",
                table: "institutions",
                type: "character varying(128)",
                maxLength: 128,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "County",
                table: "institutions",
                type: "character varying(128)",
                maxLength: 128,
                nullable: true);
        }
    }
}

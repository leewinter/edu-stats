using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace EduStats.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class RenameStateProvinceToCounty : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "StateProvince",
                table: "institutions",
                newName: "County");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "County",
                table: "institutions",
                newName: "StateProvince");
        }
    }
}

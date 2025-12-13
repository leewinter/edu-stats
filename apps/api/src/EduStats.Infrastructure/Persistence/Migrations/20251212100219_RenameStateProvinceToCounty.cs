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
            migrationBuilder.Sql(
                @"DO $$
                  BEGIN
                    IF EXISTS (
                        SELECT 1 FROM information_schema.columns
                        WHERE table_name = 'institutions' AND column_name = 'StateProvince'
                    ) THEN
                        ALTER TABLE ""institutions"" RENAME COLUMN ""StateProvince"" TO ""County"";
                    END IF;
                  END $$;");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql(
                @"DO $$
                  BEGIN
                    IF EXISTS (
                        SELECT 1 FROM information_schema.columns
                        WHERE table_name = 'institutions' AND column_name = 'County'
                    ) THEN
                        ALTER TABLE ""institutions"" RENAME COLUMN ""County"" TO ""StateProvince"";
                    END IF;
                  END $$;");
        }
    }
}

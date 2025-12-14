using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace EduStats.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class SyncModelAfterCourseStats : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "CourseId1",
                table: "course_enrollments",
                type: "uuid",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_course_enrollments_CourseId1",
                table: "course_enrollments",
                column: "CourseId1");

            migrationBuilder.AddForeignKey(
                name: "FK_course_enrollments_courses_CourseId1",
                table: "course_enrollments",
                column: "CourseId1",
                principalTable: "courses",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_course_enrollments_courses_CourseId1",
                table: "course_enrollments");

            migrationBuilder.DropIndex(
                name: "IX_course_enrollments_CourseId1",
                table: "course_enrollments");

            migrationBuilder.DropColumn(
                name: "CourseId1",
                table: "course_enrollments");
        }
    }
}

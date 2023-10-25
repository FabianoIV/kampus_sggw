using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace KampusSggwBackend.Data.Migrations
{
    public partial class AddCreatedDateAndUpdatedDateToLecturerTable : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTime>(
                name: "Created",
                table: "Lecturers",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<DateTime>(
                name: "Updated",
                table: "Lecturers",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Created",
                table: "Lecturers");

            migrationBuilder.DropColumn(
                name: "Updated",
                table: "Lecturers");
        }
    }
}

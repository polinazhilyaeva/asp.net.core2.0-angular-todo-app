using Microsoft.EntityFrameworkCore.Migrations;
using System;
using System.Collections.Generic;

namespace TodoApp.Migrations
{
    public partial class Users : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Todos_AspNetUsers_TodoUserId",
                table: "Todos");

            migrationBuilder.DropIndex(
                name: "IX_Todos_TodoUserId",
                table: "Todos");

            migrationBuilder.DropColumn(
                name: "TodoUserId",
                table: "Todos");

            migrationBuilder.AddColumn<string>(
                name: "Username",
                table: "Todos",
                type: "nvarchar(max)",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Username",
                table: "Todos");

            migrationBuilder.AddColumn<string>(
                name: "TodoUserId",
                table: "Todos",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Todos_TodoUserId",
                table: "Todos",
                column: "TodoUserId");

            migrationBuilder.AddForeignKey(
                name: "FK_Todos_AspNetUsers_TodoUserId",
                table: "Todos",
                column: "TodoUserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}

using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CreditCard.Api.Migrations
{
    /// <inheritdoc />
    public partial class SecureCardNumberStorage : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_CreditCards_UserId",
                table: "CreditCards");

            migrationBuilder.RenameColumn(
                name: "CardNumber",
                table: "CreditCards",
                newName: "Last4");

            migrationBuilder.AddColumn<string>(
                name: "CardNumberHash",
                table: "CreditCards",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "CardNumberMasked",
                table: "CreditCards",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.CreateIndex(
                name: "IX_CreditCards_UserId_Last4",
                table: "CreditCards",
                columns: new[] { "UserId", "Last4" },
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_CreditCards_UserId_Last4",
                table: "CreditCards");

            migrationBuilder.DropColumn(
                name: "CardNumberHash",
                table: "CreditCards");

            migrationBuilder.DropColumn(
                name: "CardNumberMasked",
                table: "CreditCards");

            migrationBuilder.RenameColumn(
                name: "Last4",
                table: "CreditCards",
                newName: "CardNumber");

            migrationBuilder.CreateIndex(
                name: "IX_CreditCards_UserId",
                table: "CreditCards",
                column: "UserId");
        }
    }
}

using Entities = CreditCard.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace CreditCard.Api.Infrastructure;

// DbContext principal de la aplicación
// Encargado de mapear las entidades del dominio a la base de datos
public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }

    public DbSet<Entities.User> Users { get; set; } = null!;
    public DbSet<Entities.CreditCard> CreditCards { get; set; } = null!;
    public DbSet<Entities.Transaction> Transactions { get; set; } = null!;

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Configuración de User
        modelBuilder.Entity<Entities.User>(b =>
        {
            b.HasKey(u => u.Id);
            b.HasIndex(u => u.Username).IsUnique();
            b.Property(u => u.Email).IsRequired();
        });

        // Configuración de CreditCard
        modelBuilder.Entity<Entities.CreditCard>(b =>
        {
            b.HasKey(c => c.Id);

            b.Property(c => c.CardNumberMasked).IsRequired();
            b.Property(c => c.CardNumberHash).IsRequired();
            b.Property(c => c.Last4).IsRequired();

            b.HasIndex(c => new { c.UserId, c.Last4 }).IsUnique();

            b.HasOne(c => c.User)
            .WithMany()
            .HasForeignKey(c => c.UserId)
            .OnDelete(DeleteBehavior.Cascade);
        });

        // Configuración de Transaction
        modelBuilder.Entity<Entities.Transaction>(b =>
        {
            b.HasKey(t => t.Id);
            // Relación: Transaction → CreditCard (muchas transacciones por tarjeta)
            b.HasOne(t => t.Card).WithMany(c => c.Transactions).HasForeignKey(t => t.CardId);
            b.HasOne(t => t.User).WithMany().HasForeignKey(t => t.UserId);
        });
    }
}

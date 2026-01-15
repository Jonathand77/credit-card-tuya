using Entities = CreditCard.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace CreditCard.Api.Infrastructure;

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

        modelBuilder.Entity<Entities.User>(b =>
        {
            b.HasKey(u => u.Id);
            b.HasIndex(u => u.Username).IsUnique();
            b.Property(u => u.Email).IsRequired();
        });

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

        modelBuilder.Entity<Entities.Transaction>(b =>
        {
            b.HasKey(t => t.Id);
            b.HasOne(t => t.Card).WithMany(c => c.Transactions).HasForeignKey(t => t.CardId);
            b.HasOne(t => t.User).WithMany().HasForeignKey(t => t.UserId);
        });
    }
}

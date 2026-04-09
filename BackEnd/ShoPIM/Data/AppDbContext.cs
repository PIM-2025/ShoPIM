using Microsoft.EntityFrameworkCore;
using Oracle.EntityFrameworkCore.Metadata;
using ShoPIM.Models;

namespace ShoPIM.Data
{
    public class AppDbContext : DbContext
    {
        #region Propriedades publicas
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }
        public DbSet<Users> Users { get; set; }
        public DbSet<Address> Address { get; set; }
        public DbSet<Contact> Contact { get; set; }
        public DbSet<Product> Product { get; set; }
        #endregion

        #region OnModelCreating
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // USERS
            modelBuilder.Entity<Users>(entity =>
            {
                entity.ToTable("USERS");
                entity.HasKey(u => u.Id);
                entity.Property(u => u.Id)
                    .HasColumnName("ID_USER");
            });

            // ADDRESS
            modelBuilder.Entity<Address>(entity =>
            {
                entity.ToTable("ADDRESS");
                entity.HasKey(a => a.Id);
                entity.Property(a => a.Id)
                    .HasColumnName("ID_ADDRESS");

                entity.HasOne(a => a.User)
                    .WithMany(u => u.Addresses)
                    .HasForeignKey(a => a.IdUser)
                    .HasConstraintName("USERS_ADDRESS");
            });

            // CONTACT
            modelBuilder.Entity<Contact>(entity =>
            {
                entity.ToTable("CONTACT");
                entity.HasKey(c => c.Id);
                entity.Property(c => c.Id)
                    .HasColumnName("ID_CONTACT");

                entity.HasOne(c => c.User)
                    .WithMany(u => u.Contacts)
                    .HasForeignKey(c => c.IdUser)
                    .HasConstraintName("USERS_CONTACT");
            });

            // PRODUCT
            modelBuilder.Entity<Product>(entity =>
            {
                entity.ToTable("PRODUCT");
                entity.HasKey(p => p.Id);
                entity.Property(p => p.Id)
                    .HasColumnName("ID_PRODUTO");
            });
        }
        #endregion
    }
}
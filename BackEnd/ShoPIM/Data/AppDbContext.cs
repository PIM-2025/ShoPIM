using Microsoft.EntityFrameworkCore;
using Oracle.EntityFrameworkCore.Metadata;
using ShoPIM.Models;

namespace ShoPIM.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<Users> Users { get; set; }
        public DbSet<Address> Address { get; set; }
        public DbSet<Contact> Contact { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.HasSequence<int>("SEQ_USERS").StartsAt(1).IncrementsBy(1);
            modelBuilder.HasSequence<int>("SEQ_ADDRESS").StartsAt(1).IncrementsBy(1);
            modelBuilder.HasSequence<int>("SEQ_CONTACT").StartsAt(1).IncrementsBy(1);

            // USERS
            modelBuilder.Entity<Users>(entity =>
            {
                entity.ToTable("USERS");
                entity.HasKey(u => u.Id);
                entity.Property(u => u.Id)
                    .HasColumnName("ID_USER")
                    .ValueGeneratedOnAdd()
                    .HasDefaultValueSql("SEQ_USERS.NEXTVAL");
            });

            // ADDRESS
            modelBuilder.Entity<Address>(entity =>
            {
                entity.ToTable("ADDRESS");
                entity.HasKey(a => a.Id);
                entity.Property(a => a.Id)
                    .HasColumnName("ID_ADDRESS")
                    .ValueGeneratedOnAdd()
                    .HasDefaultValueSql("SEQ_ADDRESS.NEXTVAL");

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
                    .HasColumnName("ID_CONTACT")
                    .ValueGeneratedOnAdd()
                    .HasDefaultValueSql("SEQ_CONTACT.NEXTVAL");

                entity.HasOne(c => c.User)
                    .WithMany(u => u.Contacts)
                    .HasForeignKey(c => c.IdUser)
                    .HasConstraintName("USERS_CONTACT");
            });
        }
    }
}
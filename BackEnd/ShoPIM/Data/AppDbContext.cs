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
        public DbSet<Cart> Cart { get; set; }
        public DbSet<Conversa> Conversa { get; set; }
        public DbSet<Mensagem> Mensagem { get; set; }
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

            // CONVERSA
            modelBuilder.Entity<Conversa>(entity =>
            {
                entity.ToTable("CONVERSA");
                entity.HasKey(c => c.Id);
                entity.Property(c => c.Id).HasColumnName("ID").ValueGeneratedNever();
                entity.Property(c => c.NomeCliente).HasColumnName("NOME_CLIENTE");
                entity.Property(c => c.ClienteId).HasColumnName("CLIENTE_ID");
                entity.Property(c => c.Status).HasColumnName("STATUS");
                entity.Property(c => c.CriadoEm).HasColumnName("CRIADO_EM");
            });

            // MENSAGEM
            modelBuilder.Entity<Mensagem>(entity =>
            {
                entity.ToTable("MENSAGEM");
                entity.HasKey(m => m.Id);
                entity.Property(m => m.Id).HasColumnName("ID").ValueGeneratedNever();
                entity.Property(m => m.ConversaId).HasColumnName("CONVERSA_ID");
                entity.Property(m => m.Conteudo).HasColumnName("CONTEUDO");
                entity.Property(m => m.RemetenteTipo).HasColumnName("REMETENTE_TIPO");
                entity.Property(m => m.RemetenteNome).HasColumnName("REMETENTE_NOME");
                entity.Property(m => m.EnviadoEm).HasColumnName("ENVIADO_EM");
                entity.HasOne(m => m.Conversa)
                    .WithMany(c => c.Mensagens)
                    .HasForeignKey(m => m.ConversaId)
                    .HasConstraintName("CONVERSA_MENSAGEM");
            });

            // CART
            modelBuilder.Entity<Cart>(entity =>
            {
                entity.ToTable("CART");
                entity.HasKey(c => c.Id);
                entity.Property(c => c.Id)
                    .HasColumnName("ID_CART")
                    .ValueGeneratedNever();
                entity.Property(c => c.IdUsuario)
                    .HasColumnName("ID_USER");
                entity.Property(c => c.IdProduto)
                    .HasColumnName("ID_PRODUTO");
                entity.Property(c => c.Quantidade)
                    .HasColumnName("QUANTIDADE");
                entity.Property(c => c.DataAdicao)
                    .HasColumnName("DATAADICAO");
                entity.HasOne(c => c.Usuario)
                    .WithMany(u => u.Cart)
                    .HasForeignKey(c => c.IdUsuario)
                    .HasConstraintName("USERS_CART");
                entity.HasOne(c => c.Produto)
                    .WithMany()
                    .HasForeignKey(c => c.IdProduto)
                    .HasConstraintName("PRODUCT_CART");
            });
        }
        #endregion
    }
}
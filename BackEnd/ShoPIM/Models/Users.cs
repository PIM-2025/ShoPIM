using Humanizer;
using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Runtime.CompilerServices;

namespace ShoPIM.Models
{
    [Table("USERS")]
    public class Users
    {
        [Key]
        [Column("ID_USER")]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        [Column("NOME")]
        [Required]
        [MaxLength(150)]
        public string Nome { get; set; }

        [Column("EMAIL")]
        [Required]
        [MaxLength(255)]
        public string Email { get; set; }

        [Column("SENHA")]
        [MaxLength(255)]
        public string? Senha { get; set; }

        [Column("ROLE")]
        public int Role { get; set; } = 2;

        [Column("DATACADASTRO")]
        public DateTime DataCadastro { get; set; }

        [Column("ATIVO")]
        public int? Ativo { get; set; }

        [Column("CPF")]
        [MaxLength(11)]
        public string? Cpf { get; set; }

        // Navegação
        public ICollection<Address> Addresses { get; set; }
        public ICollection<Contact> Contacts { get; set; }
    }
}

using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ShoPIM.Models
{
    [Table("ADDRESS")]
    public class Address
    {
        [Key]
        [Column("ID_ADDRESS")]
        public int Id { get; set; }

        [Column("RUA")]
        [Required]
        [MaxLength(50)]
        public string? Rua { get; set; }

        [Column("NUMERO")]
        [Required]
        [MaxLength(40)]
        public string? Numero { get; set; }

        [Column("CIDADE")]
        [Required]
        [MaxLength(40)]
        public string? Cidade { get; set; }

        [Column("ESTADO")]
        [Required]
        [MaxLength(40)]
        public string? Estado { get; set; }

        [Column("CEP")]
        [MaxLength(40)]
        public string? Cep { get; set; }

        [Column("ID_USER")]
        public int? IdUser { get; set; }

        // Navegação
        [ForeignKey("IdUser")]
        public Users? User { get; set; }
    }
}

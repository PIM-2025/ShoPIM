using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ShoPIM.Models
{
    [Table("CART")]
    public class Cart
    {
        [Key]
        [Column("ID_CART")]
        [DatabaseGenerated(DatabaseGeneratedOption.None)]
        public int Id { get; set; }

        [Column("ID_USER")]
        [Required]
        public int IdUsuario { get; set; }

        [Column("ID_PRODUTO")]
        [Required]
        public int IdProduto { get; set; }

        [Column("QUANTIDADE")]
        public int Quantidade { get; set; } = 1;

        [Column("DATAADICAO")]
        public DateTime DataAdicao { get; set; } = DateTime.Now;

        // Navegação
        [ForeignKey("IdUsuario")]
        public Users? Usuario { get; set; }

        [ForeignKey("IdProduto")]
        public Product? Produto { get; set; }
    }
}
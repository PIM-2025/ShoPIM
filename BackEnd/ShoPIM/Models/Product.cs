using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ShoPIM.Models
{
    public class Product
    {
        [Key]
        [Column("ID_PRODUTO")]
        [DatabaseGenerated(DatabaseGeneratedOption.None)]
        public int Id { get; set; }

        [Column("DESCRICAO")]
        [Required]
        [MaxLength(255)]
        public string? Descricao { get; set; }

        [Column("PRECO")]
        [Required]
        [MaxLength(255)]
        public decimal Preco { get; set; }

        [Column("CATEGORIA")]
        [MaxLength(255)]
        public string? Categoria { get; set; }

        [Column("QUANTIDADE")]
        public decimal Quantidade { get; set; } = 2;

        [Column("IMAGEM")]
        public string? Imagem { get; set; }

        [Column("DESCRICAO_DETALHADA")]
        [MaxLength(4000)]
        public string? DescricaoDetalhada { get; set; }

        [Column("IMAGENS")]
        [MaxLength(2000)]
        public string? Imagens { get; set; }
    }
}

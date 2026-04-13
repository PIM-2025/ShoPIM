using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ShoPIM.Models
{
    [Table("PERGUNTA")]
    public class Pergunta
    {
        [Key]
        [Column("ID")]
        [DatabaseGenerated(DatabaseGeneratedOption.None)]
        public int Id { get; set; }

        [Column("ID_PRODUTO")]
        [Required]
        public int IdProduto { get; set; }

        [Column("ID_USER")]
        public int? IdUser { get; set; }

        [Column("TEXTO")]
        [Required]
        [MaxLength(2000)]
        public string Texto { get; set; } = string.Empty;

        [Column("RESPOSTA")]
        [MaxLength(2000)]
        public string? Resposta { get; set; }

        [Column("RESPONDIDO_EM")]
        public DateTime? RespondidoEm { get; set; }

        [Column("CRIADO_EM")]
        public DateTime CriadoEm { get; set; }

        [ForeignKey("IdProduto")]
        public Product? Produto { get; set; }

        [ForeignKey("IdUser")]
        public Users? Usuario { get; set; }
    }
}

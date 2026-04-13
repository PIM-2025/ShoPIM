using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ShoPIM.Models
{
    [Table("AVALIACAO")]
    public class Avaliacao
    {
        [Key]
        [Column("ID")]
        [DatabaseGenerated(DatabaseGeneratedOption.None)]
        public int Id { get; set; }

        [Column("ID_PRODUTO")]
        public int IdProduto { get; set; }

        [Column("ID_USER")]
        public int IdUser { get; set; }

        [Column("NOTA")]
        [Range(1, 5)]
        public int Nota { get; set; }

        [Column("COMENTARIO")]
        public string? Comentario { get; set; }

        [Column("CRIADO_EM")]
        public DateTime CriadoEm { get; set; }

        [ForeignKey("IdProduto")]
        public Product? Produto { get; set; }

        [ForeignKey("IdUser")]
        public Users? Usuario { get; set; }
    }
}

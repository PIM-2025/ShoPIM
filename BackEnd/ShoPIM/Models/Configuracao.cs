using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ShoPIM.Models
{
    [Table("CONFIGURACAO")]
    public class Configuracao
    {
        [Key]
        [Column("ID")]
        [DatabaseGenerated(DatabaseGeneratedOption.None)]
        public int Id { get; set; } = 1;

        [Column("NOME")]
        [MaxLength(100)]
        public string Nome { get; set; } = "Minha Loja";

        [Column("DESCRICAO")]
        [MaxLength(500)]
        public string? Descricao { get; set; }

        [Column("EMAIL")]
        [MaxLength(100)]
        public string? Email { get; set; }

        [Column("TELEFONE")]
        [MaxLength(20)]
        public string? Telefone { get; set; }

        [Column("WHATSAPP")]
        [MaxLength(20)]
        public string? Whatsapp { get; set; }

        [Column("FRETE_GRATIS_ACIMA")]
        public decimal? FreteGratisAcima { get; set; }

        [Column("LOGO_URL")]
        [MaxLength(500)]
        public string? LogoUrl { get; set; }
    }
}

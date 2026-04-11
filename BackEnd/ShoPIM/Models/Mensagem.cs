using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ShoPIM.Models
{
    [Table("MENSAGEM")]
    public class Mensagem
    {
        [Key]
        [Column("ID")]
        [DatabaseGenerated(DatabaseGeneratedOption.None)]
        public int Id { get; set; }

        [Column("CONVERSA_ID")]
        public int ConversaId { get; set; }

        [Column("CONTEUDO")]
        [Required]
        [MaxLength(4000)]
        public string Conteudo { get; set; } = string.Empty;

        [Column("REMETENTE_TIPO")]
        [MaxLength(20)]
        public string RemetenteTipo { get; set; } = "cliente"; // cliente | admin

        [Column("REMETENTE_NOME")]
        [MaxLength(200)]
        public string RemetenteNome { get; set; } = string.Empty;

        [Column("ENVIADO_EM")]
        public DateTime EnviadoEm { get; set; } = DateTime.Now;

        public Conversa Conversa { get; set; } = null!;
    }
}

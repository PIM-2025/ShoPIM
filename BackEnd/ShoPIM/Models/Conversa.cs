using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ShoPIM.Models
{
    [Table("CONVERSA")]
    public class Conversa
    {
        [Key]
        [Column("ID")]
        [DatabaseGenerated(DatabaseGeneratedOption.None)]
        public int Id { get; set; }

        [Column("NOME_CLIENTE")]
        [Required]
        [MaxLength(200)]
        public string NomeCliente { get; set; } = string.Empty;

        [Column("CLIENTE_ID")]
        public int? ClienteId { get; set; }

        [Column("STATUS")]
        [MaxLength(20)]
        public string Status { get; set; } = "aberta";

        [Column("CRIADO_EM")]
        public DateTime CriadoEm { get; set; } = DateTime.Now;

        public ICollection<Mensagem> Mensagens { get; set; } = new List<Mensagem>();
    }
}

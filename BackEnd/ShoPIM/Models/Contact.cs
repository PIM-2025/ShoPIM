using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ShoPIM.Models
{
    [Table("CONTACT")]
    public class Contact
    {
        [Key]
        [Column("ID_CONTACT")]
        public int Id { get; set; }

        [Column("NUMERO")]
        [Required]
        [MaxLength(11)]
        public string Numero { get; set; }

        [Column("ID_USER")]
        public int? IdUser { get; set; }

        // Navegação
        [ForeignKey("IdUser")]
        public Users? User { get; set; }
    }
}

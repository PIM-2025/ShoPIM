using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ShoPIM.Models
{
    [Table("PEDIDO")]
    public class Pedido
    {
        [Key]
        [Column("ID")]
        [DatabaseGenerated(DatabaseGeneratedOption.None)]
        public int Id { get; set; }

        [Column("ID_USER")]
        public int IdUsuario { get; set; }

        [Column("ID_ADDRESS")]
        public int? IdAddress { get; set; }

        [Column("STATUS")]
        [MaxLength(20)]
        public string Status { get; set; } = "pendente";

        [Column("DATA_PEDIDO")]
        public DateTime DataPedido { get; set; } = DateTime.Now;

        [Column("TOTAL")]
        public decimal Total { get; set; }

        [ForeignKey("IdUsuario")]
        public Users? Usuario { get; set; }

        [ForeignKey("IdAddress")]
        public Address? Endereco { get; set; }

        public ICollection<ItemPedido> Itens { get; set; } = new List<ItemPedido>();
    }
}

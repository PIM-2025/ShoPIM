using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ShoPIM.Models
{
    [Table("ITEM_PEDIDO")]
    public class ItemPedido
    {
        [Key]
        [Column("ID")]
        [DatabaseGenerated(DatabaseGeneratedOption.None)]
        public int Id { get; set; }

        [Column("ID_PEDIDO")]
        public int IdPedido { get; set; }

        [Column("ID_PRODUTO")]
        public int IdProduto { get; set; }

        [Column("QUANTIDADE")]
        public int Quantidade { get; set; }

        [Column("PRECO_UNITARIO")]
        public decimal PrecoUnitario { get; set; }

        [ForeignKey("IdPedido")]
        public Pedido? Pedido { get; set; }

        [ForeignKey("IdProduto")]
        public Product? Produto { get; set; }
    }
}

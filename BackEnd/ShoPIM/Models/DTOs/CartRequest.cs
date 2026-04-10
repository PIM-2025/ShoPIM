namespace ShoPIM.Models.DTOs
{
    public class CartRequest
    {
        public int IdUsuario { get; set; }
        public int IdProduto { get; set; }
        public int Quantidade { get; set; } = 1;
    }
}
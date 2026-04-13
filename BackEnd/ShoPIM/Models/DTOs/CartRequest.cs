using System.ComponentModel.DataAnnotations;

namespace ShoPIM.Models.DTOs
{
    public class CartRequest
    {
        [Required]
        [Range(1, int.MaxValue, ErrorMessage = "IdUsuario inválido.")]
        public int IdUsuario { get; set; }

        [Required]
        [Range(1, int.MaxValue, ErrorMessage = "IdProduto inválido.")]
        public int IdProduto { get; set; }

        [Range(1, 999, ErrorMessage = "Quantidade deve ser entre 1 e 999.")]
        public int Quantidade { get; set; } = 1;
    }
}
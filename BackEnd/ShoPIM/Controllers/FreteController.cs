using Microsoft.AspNetCore.Mvc;

namespace ShoPIM.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FreteController : ControllerBase
    {
        // Regiões baseadas no prefixo do CEP (2 primeiros dígitos)
        // Quanto maior o "nível", mais longe da origem (SP = nível 0)
        private static int ObterNivelRegiao(string cep)
        {
            var prefixo = int.Parse(cep[..2]);
            return prefixo switch
            {
                // São Paulo capital/interior
                >= 1 and <= 19 => 0,
                // Rio de Janeiro, ES, MG
                >= 20 and <= 39 => 1,
                // BA, SE
                >= 40 and <= 49 => 2,
                // PE, AL, PB, RN
                >= 50 and <= 59 => 3,
                // CE, PI, MA
                >= 60 and <= 65 => 4,
                // PA, AM, RR, AP, AC, RO
                >= 66 and <= 69 => 5,
                // DF, GO, TO
                >= 70 and <= 77 => 2,
                // MS, MT
                >= 78 and <= 79 => 2,
                // PR, SC
                >= 80 and <= 89 => 1,
                // RS
                >= 90 and <= 99 => 2,
                _ => 1
            };
        }

        [HttpGet]
        public IActionResult CalcularFrete(
            [FromQuery] string cepOrigem,
            [FromQuery] string cepDestino)
        {
            var origem = cepOrigem.Replace("-", "").Trim();
            var destino = cepDestino.Replace("-", "").Trim();

            if (origem.Length != 8 || destino.Length != 8 ||
                !origem.All(char.IsDigit) || !destino.All(char.IsDigit))
                return BadRequest("CEP inválido. Informe 8 dígitos numéricos.");

            var nivel = ObterNivelRegiao(destino);

            // Tabela simulada: [valorPAC, valorSEDEX, prazoPAC, prazoSEDEX]
            var tabela = nivel switch
            {
                0 => (pac: 18.50m, sedex: 29.90m, prazoPac: 3, prazoSedex: 1),
                1 => (pac: 23.80m, sedex: 38.50m, prazoPac: 5, prazoSedex: 2),
                2 => (pac: 28.40m, sedex: 46.20m, prazoPac: 7, prazoSedex: 3),
                3 => (pac: 33.60m, sedex: 55.00m, prazoPac: 9, prazoSedex: 4),
                4 => (pac: 38.90m, sedex: 64.80m, prazoPac: 12, prazoSedex: 5),
                _ => (pac: 45.00m, sedex: 78.50m, prazoPac: 15, prazoSedex: 7),
            };

            var resultado = new[]
            {
                new { Codigo = "04510", Nome = "PAC",   Valor = tabela.pac,   PrazoEntrega = tabela.prazoPac },
                new { Codigo = "04014", Nome = "SEDEX", Valor = tabela.sedex, PrazoEntrega = tabela.prazoSedex },
            };

            return Ok(resultado);
        }
    }
}

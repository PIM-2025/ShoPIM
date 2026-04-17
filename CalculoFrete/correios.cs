using System;
using System.Net.Http;
using System.Text.Json;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

// ─── 1. Classes de modelo ───────────────────────────────────────
public class ViaCepResponse
{
    public string logradouro { get; set; }
    public string bairro     { get; set; }
    public string localidade { get; set; }
    public string uf         { get; set; }
    public bool   erro       { get; set; }
}

public class EnderecoResult
{
    public string Logradouro { get; set; }
    public string Bairro     { get; set; }
    public string Cidade     { get; set; }
    public string Estado     { get; set; }
}

// ─── 2. Serviço de consulta ─────────────────────────────────────
public class CepService
{
    private static readonly HttpClient _httpClient = new HttpClient();

    public static async Task<object> ConsultarCep(string cep)
    {
        cep = Regex.Replace(cep, @"\D", "");

        if (cep.Length != 8)
            return "CEP inválido. O CEP deve conter 8 dígitos.";

        string url = $"https://viacep.com.br/ws/{cep}/json/";

        try
        {
            HttpResponseMessage response = await _httpClient.GetAsync(url);
            response.EnsureSuccessStatusCode();

            string json = await response.Content.ReadAsStringAsync();
            var data = JsonSerializer.Deserialize<ViaCepResponse>(json);

            if (data.erro)
                return "CEP não encontrado.";

            return new EnderecoResult
            {
                Logradouro = data.logradouro ?? "",
                Bairro     = data.bairro     ?? "",
                Cidade     = data.localidade ?? "",
                Estado     = data.uf         ?? ""
            };
        }
        catch (HttpRequestException)
        {
            return "Erro ao consultar o CEP. Tente novamente mais tarde.";
        }
    }
}

// ─── 3. Chamada da função (Main) ─────────────────────────────────
class Program
{
    static async Task Main(string[] args)
    {
        var resultado = await CepService.ConsultarCep("01310-100");

        if (resultado is EnderecoResult endereco)
        {
            Console.WriteLine($"Logradouro: {endereco.Logradouro}");
            Console.WriteLine($"Bairro:     {endereco.Bairro}");
            Console.WriteLine($"Cidade:     {endereco.Cidade}");
            Console.WriteLine($"Estado:     {endereco.Estado}");
        }
        else
        {
            Console.WriteLine(resultado);
        }
    }
}
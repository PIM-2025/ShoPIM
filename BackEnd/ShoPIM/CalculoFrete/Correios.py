import requests

def consutar_cep(cep):
    #remove qual quer caracter que não seja número
    cep = ''.join(filter(str.isdigit, cep))

    if len(cep) != 8:
        return "CEP inválido. O CEP deve conter 8 dígitos."
    
    url = f"https://viacep.com.br/ws/{cep}/json/"

    try:
        response = requests.get(url)
        response.raise_for_status()  # Verifica se a requisição foi bem-sucedida

        data = response.json()

        if "erro" in data:
            return "CEP não encontrado."

        return {
            "logradouro": data.get("logradouro", ""),
            "bairro": data.get("bairro", ""),
            "cidade": data.get("localidade", ""),
            "estado": data.get("uf", "")
        }
    except requests.exceptions.RequestException:
        return "Erro ao consultar o CEP. Tente novamente mais tarde."
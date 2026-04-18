import { useState } from 'react'
import { calcularFrete, ServicoFrete } from '@/service/freteService'

export function useFrete() {
  const [resultado, setResultado] = useState<ServicoFrete[] | null>(null)
  const [carregando, setCarregando] = useState(false)
  const [erro, setErro] = useState<string | null>(null)

  async function buscarFrete(cepDestino: string) {
    setCarregando(true)
    setErro(null)
    setResultado(null)
    try {
      const data = await calcularFrete({ cepOrigem: '01310100', cepDestino })
      setResultado(data)
      localStorage.setItem('frete_cep', cepDestino)
    } catch {
      setErro('Não foi possível calcular o frete. Tente novamente.')
    } finally {
      setCarregando(false)
    }
  }

  return { resultado, carregando, erro, buscarFrete }
}

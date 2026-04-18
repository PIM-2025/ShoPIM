import { api } from '@/service/api'

export type ServicoFrete = {
  codigo: string
  nome: string
  valor: number
  prazoEntrega: number
}

export type FreteParams = {
  cepOrigem: string
  cepDestino: string
}

export async function calcularFrete(params: FreteParams): Promise<ServicoFrete[]> {
  const { data } = await api.get<ServicoFrete[]>('/Frete', { params })
  return data
}

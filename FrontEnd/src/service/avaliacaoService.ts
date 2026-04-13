import { api } from './api'

export interface AvaliacaoItem {
  id: number
  idProduto: number
  idUser: number
  nomeUsuario: string
  nota: number
  comentario: string | null
  criadoEm: string
}

export interface AvaliacaoResponse {
  media: number
  total: number
  podeAvaliar: boolean
  jaAvaliou: boolean
  avaliacoes: AvaliacaoItem[]
}

export async function getAvaliacoes(idProduto: number): Promise<AvaliacaoResponse> {
  const { data } = await api.get<AvaliacaoResponse>(`/avaliacao/${idProduto}`)
  return data
}

export async function criarAvaliacao(payload: {
  idProduto: number
  nota: number
  comentario?: string
}): Promise<void> {
  await api.post('/avaliacao', payload)
}

export async function deletarAvaliacao(id: number): Promise<void> {
  await api.delete(`/avaliacao/${id}`)
}

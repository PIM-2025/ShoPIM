import { api } from './api'

export interface PerguntaItem {
  id: number
  idProduto: number
  idUser: number | null
  nomeUsuario: string
  texto: string
  resposta: string | null
  respondidoEm: string | null
  criadoEm: string
}

export async function getPerguntas(idProduto: number): Promise<PerguntaItem[]> {
  const { data } = await api.get<PerguntaItem[]>(`/pergunta/${idProduto}`)
  return data
}

export async function fazerPergunta(payload: {
  idProduto: number
  texto: string
}): Promise<void> {
  await api.post('/pergunta', payload)
}

export async function responderPergunta(id: number, resposta: string): Promise<void> {
  await api.post(`/pergunta/${id}/resposta`, { resposta })
}

export async function deletarPergunta(id: number): Promise<void> {
  await api.delete(`/pergunta/${id}`)
}

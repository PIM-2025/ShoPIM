import { api } from './api'

export interface Configuracao {
  id: number
  nome: string
  descricao?: string
  email?: string
  telefone?: string
  whatsapp?: string
  freteGratisAcima?: number
  logoUrl?: string
}

export async function getConfiguracao(): Promise<Configuracao> {
  const { data } = await api.get<Configuracao>('/configuracao')
  return data
}

export async function salvarConfiguracao(payload: Omit<Configuracao, 'id'>): Promise<void> {
  await api.put('/configuracao', payload)
}

import { api } from './api'

export interface ClienteAPI {
  id: number
  nome: string
  email: string
  cpf?: string | null
  dataCadastro: string
  ativo: number
  role: number
}

export async function getClientes(): Promise<ClienteAPI[]> {
  const { data } = await api.get<ClienteAPI[]>('/users')
  return data
}

export async function createCliente(payload: {
  nome: string
  email: string
  senha: string
  cpf?: string
}): Promise<void> {
  await api.post('/users/cadastro', payload)
}

export async function updateCliente(
  id: number,
  payload: { nome: string; email: string; cpf?: string | null; ativo: number; role: number }
): Promise<void> {
  await api.put(`/users/${id}`, payload)
}

export async function deleteCliente(id: number): Promise<void> {
  await api.delete(`/users/${id}`)
}

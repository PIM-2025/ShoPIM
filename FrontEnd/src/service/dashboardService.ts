import { api } from './api'

export interface ClienteMes {
  mes: string
  total: number
}

export interface UltimoCliente {
  id: number
  nome: string
  email: string
  dataCadastro: string
}

export interface DashboardStats {
  totalClientes: number
  totalProdutos: number
  conversasAbertas: number
  totalAdmins: number
  clientesPorMes: ClienteMes[]
  ultimosClientes: UltimoCliente[]
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const { data } = await api.get<DashboardStats>('/dashboard/stats')
  return data
}

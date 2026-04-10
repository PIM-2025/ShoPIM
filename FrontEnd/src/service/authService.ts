import { api } from './api'

export async function login(email: string, senha: string) {
  const { data } = await api.post('/users/login', { email, senha })
  return data
}

export async function forgotPassword(email: string): Promise<{ message: string; token?: string }> {
  const { data } = await api.post('/users/forgot-password', { email })
  return data
}

export async function resetPassword(token: string, novaSenha: string): Promise<{ message: string }> {
  const { data } = await api.post('/users/reset-password', { token, novaSenha })
  return data
}

export async function cadastro(
  nome: string,
  email: string,
  senha: string,
  cpf?: string
) {
  const { data } = await api.post('/users/cadastro', {
    nome,
    email,
    senha,
    cpf,
  })
  return data
}

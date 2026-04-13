import axios from 'axios'
import { getCookie } from '@/lib/cookies'

const ACCESS_TOKEN = 'thisisjustarandomstring'

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL + '/api',
})

// Injeta o JWT em toda requisição automaticamente
api.interceptors.request.use((config) => {
  const raw = getCookie(ACCESS_TOKEN)
  if (raw) {
    try {
      const token = JSON.parse(raw) as string
      if (token) config.headers.Authorization = `Bearer ${token}`
    } catch {
      // cookie inválido — ignora
    }
  }
  return config
})

// Redireciona para login em caso de 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      window.location.href = '/sign-in'
    }
    return Promise.reject(error)
  }
)

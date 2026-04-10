import { create } from 'zustand'
import { getCookie, setCookie, removeCookie } from '@/lib/cookies'

const ACCESS_TOKEN = 'thisisjustarandomstring'
const AVATAR_KEY = 'shopim_avatar'

interface AuthUser {
  id: number
  accountNo: string
  email: string
  role: string[]
  exp: number
  name: string
  avatar?: string
}

interface AuthState {
  auth: {
    user: AuthUser | null
    setUser: (user: AuthUser | null) => void
    accessToken: string
    setAccessToken: (accessToken: string) => void
    resetAccessToken: () => void
    reset: () => void
  }
}

// .NET JwtSecurityTokenHandler pode usar nomes curtos ou URIs completos dependendo da versão.
// Tentamos as duas formas para garantir compatibilidade.
function decodeJwt(token: string): AuthUser | null {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    if (!payload.exp || Date.now() / 1000 > payload.exp) return null

    const id = Number(
      payload.nameid ??
      payload.sub ??
      payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'] ??
      0
    )
    const email =
      payload.email ||
      payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'] ||
      ''
    const name =
      payload.unique_name ||
      payload.name ||
      payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'] ||
      ''
    const roleRaw =
      payload.role ??
      payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] ??
      '2'

    if (!email && !name) return null

    return {
      id,
      accountNo: email,
      email,
      name,
      role: [String(roleRaw) === '1' ? 'admin' : 'user'],
      exp: payload.exp * 1000,
    }
  } catch {
    return null
  }
}

export const useAuthStore = create<AuthState>()((set) => {
  const cookieState = getCookie(ACCESS_TOKEN)
  const initToken = cookieState ? JSON.parse(cookieState) : ''
  const initUser = initToken ? decodeJwt(initToken) : null
  const savedAvatar = localStorage.getItem(AVATAR_KEY) ?? undefined
  if (initUser && savedAvatar) initUser.avatar = savedAvatar
  return {
    auth: {
      user: initUser,
      setUser: (user) => {
        if (user?.avatar) localStorage.setItem(AVATAR_KEY, user.avatar)
        else localStorage.removeItem(AVATAR_KEY)
        set((state) => ({ ...state, auth: { ...state.auth, user } }))
      },
      accessToken: initToken,
      setAccessToken: (accessToken) =>
        set((state) => {
          setCookie(ACCESS_TOKEN, JSON.stringify(accessToken))
          return { ...state, auth: { ...state.auth, accessToken } }
        }),
      resetAccessToken: () =>
        set((state) => {
          removeCookie(ACCESS_TOKEN)
          return { ...state, auth: { ...state.auth, accessToken: '' } }
        }),
      reset: () =>
        set((state) => {
          removeCookie(ACCESS_TOKEN)
          localStorage.removeItem(AVATAR_KEY)
          return {
            ...state,
            auth: { ...state.auth, user: null, accessToken: '' },
          }
        }),
    },
  }
})

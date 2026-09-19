import { create } from 'zustand'
import { api } from '@/lib/api'
import {
  getCookie,
  setCookie,
  removeCookie,
} from '@/lib/cookies'

export interface StockFlowUser {
  id: number
  name: string
  email: string
  role: string
  status: string
  createdAt: string
  updatedAt: string
}

interface AuthResponse {
  success: boolean
  data: {
    user: StockFlowUser
    tokens: {
      accessToken: string
      refreshToken: string
    }
  }
}

interface MeResponse {
  success: boolean
  data: {
    user: StockFlowUser
  }
}

interface AuthStore {
  user: StockFlowUser | null
  accessToken: string
  refreshToken: string
  isLoading: boolean

  setUser: (user: StockFlowUser | null) => void
  setTokens: (accessToken: string, refreshToken: string) => void
  clearAuth: () => void

  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string) => Promise<void>
  refreshSession: () => Promise<void>
  fetchCurrentUser: () => Promise<void>
  logout: () => Promise<void>
  initializeAuth: () => Promise<void>
}

const ACCESS_TOKEN_KEY = 'sf_access_token'
const REFRESH_TOKEN_KEY = 'sf_refresh_token'
const USER_KEY = 'sf_user'

export const useAuthStore = create<AuthStore>()((set, get) => {
  const storedAccessToken = getCookie(ACCESS_TOKEN_KEY) || ''
  const storedRefreshToken = getCookie(REFRESH_TOKEN_KEY) || ''
  const storedUser = (() => {
    try {
      const raw = getCookie(USER_KEY)
      if (raw) return JSON.parse(raw) as StockFlowUser
    } catch {
      removeCookie(USER_KEY)
    }
    return null
  })()

  return {
    user: storedUser,
    accessToken: storedAccessToken,
    refreshToken: storedRefreshToken,
    isLoading: false,

    setUser: (user) => {
      if (user) {
        setCookie(USER_KEY, JSON.stringify(user))
      } else {
        removeCookie(USER_KEY)
      }
      set({ user })
    },

    setTokens: (accessToken, refreshToken) => {
      setCookie(ACCESS_TOKEN_KEY, accessToken)
      setCookie(REFRESH_TOKEN_KEY, refreshToken)
      set({ accessToken, refreshToken })
    },

    clearAuth: () => {
      removeCookie(ACCESS_TOKEN_KEY)
      removeCookie(REFRESH_TOKEN_KEY)
      removeCookie(USER_KEY)
      set({ user: null, accessToken: '', refreshToken: '' })
    },

    login: async (email, password) => {
      const { data } = await api.post<AuthResponse>('/auth/login', {
        email,
        password,
      })
      const { user, tokens } = data.data
      get().setUser(user)
      get().setTokens(tokens.accessToken, tokens.refreshToken)
    },

    register: async (name, email, password) => {
      const { data } = await api.post<AuthResponse>('/auth/register', {
        name,
        email,
        password,
      })
      const { user, tokens } = data.data
      get().setUser(user)
      get().setTokens(tokens.accessToken, tokens.refreshToken)
    },

    refreshSession: async () => {
      const currentRefreshToken = get().refreshToken
      if (!currentRefreshToken) {
        get().clearAuth()
        return
      }

      const { data } = await api.post<AuthResponse>('/auth/refresh', {
        refreshToken: currentRefreshToken,
      })
      const { user, tokens } = data.data
      get().setUser(user)
      get().setTokens(tokens.accessToken, tokens.refreshToken)
    },

    fetchCurrentUser: async () => {
      const { data } = await api.get<MeResponse>('/auth/me')
      const { user } = data.data
      get().setUser(user)
    },

    logout: async () => {
      try {
        await api.post('/auth/logout')
      } finally {
        get().clearAuth()
      }
    },

    initializeAuth: async () => {
      if (!get().refreshToken && !get().accessToken) {
        return
      }

      set({ isLoading: true })

      try {
        // Try to get current user with existing access token
        await get().fetchCurrentUser()
      } catch {
        // Access token expired, try refresh
        try {
          await get().refreshSession()
        } catch {
          // Both tokens invalid, clear auth
          get().clearAuth()
        }
      } finally {
        set({ isLoading: false })
      }
    },
  }
})
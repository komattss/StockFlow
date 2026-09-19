import axios from 'axios'
import { useAuthStore } from '@/stores/auth-store'

const BASE_URL = import.meta.env.VITE_API_URL || '/api'

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

let isRefreshing = false
let failedQueue: Array<{
  resolve: (token: string) => void
  reject: (error: unknown) => void
}> = []

function processQueue(error: unknown, token: string | null) {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error)
    } else if (token) {
      resolve(token)
    }
  })
  failedQueue = []
}

const AUTH_ROUTES = ['/auth/login', '/auth/register', '/auth/refresh', '/auth/logout']

function isAuthRoute(url: string | undefined): boolean {
  if (!url) return false
  return AUTH_ROUTES.some((route) => url.includes(route))
}

api.interceptors.request.use((config) => {
  if (isAuthRoute(config.url)) return config

  const { accessToken } = useAuthStore.getState()
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    if (
      error.response?.status !== 401 ||
      originalRequest._retry ||
      isAuthRoute(originalRequest.url)
    ) {
      return Promise.reject(error)
    }

    if (isRefreshing) {
      return new Promise<string>((resolve, reject) => {
        failedQueue.push({ resolve, reject })
      })
        .then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`
          return api(originalRequest)
        })
        .catch((err) => Promise.reject(err))
    }

    originalRequest._retry = true
    isRefreshing = true

    const { refreshToken } = useAuthStore.getState()
    if (!refreshToken) {
      isRefreshing = false
      useAuthStore.getState().clearAuth()
      return Promise.reject(error)
    }

    try {
      const { data } = await axios.post(`${BASE_URL}/auth/refresh`, {
        refreshToken,
      })

      if (!data.success || !data.data?.tokens) {
        throw new Error('Refresh failed')
      }

      const { accessToken, refreshToken: newRefreshToken } = data.data.tokens

      useAuthStore.getState().setTokens(accessToken, newRefreshToken)

      processQueue(null, accessToken)

      originalRequest.headers.Authorization = `Bearer ${accessToken}`
      return api(originalRequest)
    } catch (refreshError) {
      processQueue(refreshError, null)
      useAuthStore.getState().clearAuth()
      return Promise.reject(refreshError)
    } finally {
      isRefreshing = false
    }
  }
)

export { api }
export default api
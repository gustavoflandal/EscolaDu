import axios, { type AxiosError, type AxiosInstance, type InternalAxiosRequestConfig } from 'axios'
import { useAuthStore } from '@/stores/auth'
import { useToast } from 'vue-toastification'

const toast = useToast()

const api: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001/api/v1',
  headers: {
    'Content-Type': 'application/json'
  }
})

// Request interceptor
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const authStore = useAuthStore()
    if (authStore.token) {
      config.headers.Authorization = `Bearer ${authStore.token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor
let isRefreshing = false
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const authStore = useAuthStore()
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean }
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      // Evitar tentativa de refresh na própria rota de refresh
      if (originalRequest.url?.includes('/auth/refresh')) {
        authStore.logout()
        window.location.href = '/login'
        return Promise.reject(error)
      }

      // Evitar múltiplas tentativas simultâneas
      if (isRefreshing) {
        return Promise.reject(error)
      }

      originalRequest._retry = true
      isRefreshing = true

      try {
        await authStore.refreshToken()
        isRefreshing = false
        // Retentar requisição original com novo token
        return api.request(originalRequest)
      } catch (refreshError) {
        isRefreshing = false
        // Refresh falhou, fazer logout
        authStore.logout()
        window.location.href = '/login'
        return Promise.reject(refreshError)
      }
    }

    // Mostrar mensagem de erro apenas se não for erro 401 (já tratado)
    if (error.response?.status !== 401) {
      const message = (error.response?.data as any)?.message || 'Erro ao processar requisição'
      toast.error(message)
    }

    return Promise.reject(error)
  }
)

export default api

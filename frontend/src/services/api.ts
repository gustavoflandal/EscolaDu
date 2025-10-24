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
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const authStore = useAuthStore()
    
    if (error.response?.status === 401) {
      // Token expirado, tentar refresh
      try {
        await authStore.refreshToken()
        // Retentar requisição original
        if (error.config) {
          return api.request(error.config)
        }
      } catch (refreshError) {
        // Refresh falhou, fazer logout
        authStore.logout()
        window.location.href = '/login'
      }
    }

    // Mostrar mensagem de erro
    const message = (error.response?.data as any)?.message || 'Erro ao processar requisição'
    toast.error(message)

    return Promise.reject(error)
  }
)

export default api

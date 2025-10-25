import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { authService } from '@/services/auth.service'
import type { User, LoginRequest } from '@/types'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const token = ref<string | null>(localStorage.getItem('token'))
  const refreshTokenValue = ref<string | null>(localStorage.getItem('refreshToken'))
  const loading = ref(false)

  const isAuthenticated = computed(() => !!token.value && !!user.value)

  async function login(credentials: LoginRequest) {
    loading.value = true
    try {
      console.log('💾 Store: Iniciando login...')
      const response = await authService.login(credentials)
      console.log('💾 Store: Resposta recebida', response)
      
      token.value = response.accessToken
      refreshTokenValue.value = response.refreshToken
      user.value = response.user

      localStorage.setItem('token', response.accessToken)
      localStorage.setItem('refreshToken', response.refreshToken)
      
      console.log('✅ Store: Login completo', {
        hasToken: !!token.value,
        hasUser: !!user.value,
        isAuthenticated: isAuthenticated.value
      })

      return response
    } finally {
      loading.value = false
    }
  }

  async function refreshToken() {
    if (!refreshTokenValue.value) {
      throw new Error('No refresh token available')
    }

    const response = await authService.refreshToken(refreshTokenValue.value)
    token.value = response.accessToken
    refreshTokenValue.value = response.refreshToken
    user.value = response.user

    localStorage.setItem('token', response.accessToken)
    localStorage.setItem('refreshToken', response.refreshToken)
  }

  async function fetchUser() {
    if (!token.value) return

    try {
      user.value = await authService.me()
    } catch (error) {
      logout()
    }
  }

  function logout() {
    user.value = null
    token.value = null
    refreshTokenValue.value = null
    localStorage.removeItem('token')
    localStorage.removeItem('refreshToken')
    
    authService.logout().catch(() => {
      // Ignorar erros no logout
    })
  }

  // Carregar usuário na inicialização se houver token
  // Usar setTimeout para evitar múltiplas requisições simultâneas
  if (token.value) {
    setTimeout(() => {
      fetchUser()
    }, 100)
  }

  return {
    user,
    token,
    loading,
    isAuthenticated,
    login,
    refreshToken,
    fetchUser,
    logout
  }
})

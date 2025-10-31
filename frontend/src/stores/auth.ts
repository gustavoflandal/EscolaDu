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
      const response = await authService.login(credentials)
      token.value = response.accessToken
      refreshTokenValue.value = response.refreshToken

      localStorage.setItem('token', response.accessToken)
      localStorage.setItem('refreshToken', response.refreshToken)

      // Carregar dados completos do usuário (com permissões)
      await fetchUser()

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
  if (token.value) {
    fetchUser()
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

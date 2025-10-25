import api from './api'
import type { LoginRequest, LoginResponse, User } from '@/types'

export const authService = {
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response = await api.post('/auth/login', credentials)
    return response.data.data // Backend retorna { success: true, data: {...} }
  },

  async refreshToken(refreshToken: string): Promise<LoginResponse> {
    const response = await api.post('/auth/refresh', { refreshToken })
    return response.data.data
  },

  async me(): Promise<User> {
    const response = await api.get('/auth/me')
    return response.data.data
  },

  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    await api.post('/auth/change-password', { currentPassword, newPassword })
  },

  async logout(): Promise<void> {
    await api.post('/auth/logout')
  }
}

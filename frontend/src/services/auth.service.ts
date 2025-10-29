import api from './api'
import type { LoginRequest, LoginResponse, User } from '@/types'

export const authService = {
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const { data } = await api.post<{ data: LoginResponse }>('/auth/login', credentials)
    return data.data
  },

  async refreshToken(refreshToken: string): Promise<LoginResponse> {
    const { data } = await api.post<{ data: LoginResponse }>('/auth/refresh', { refreshToken })
    return data.data
  },

  async me(): Promise<User> {
    const { data } = await api.get<{ data: User }>('/auth/me')
    return data.data
  },

  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    await api.post('/auth/change-password', { currentPassword, newPassword })
  },

  async logout(): Promise<void> {
    await api.post('/auth/logout')
  }
}

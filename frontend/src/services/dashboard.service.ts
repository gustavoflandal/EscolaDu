import api from './api'

export interface DashboardStats {
  totalAlunos: number
  totalTurmas: number
  frequenciaMedia: number
  desempenhoMedio: number
}

export const dashboardService = {
  async getStats(): Promise<DashboardStats> {
    const response = await api.get('/dashboard/stats')
    return response.data.data
  }
}

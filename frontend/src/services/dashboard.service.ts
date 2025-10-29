import api from './api'

export interface DashboardStats {
  totalAlunos: number
  totalTurmas: number
  frequenciaMedia: number
  desempenhoMedio: number
  alertas: {
    frequenciaBaixa: number
    desempenhoCritico: number
  }
}

export interface Alert {
  tipo: string
  severidade: string
  mensagem: string
  detalhes: any[]
}

export interface Activity {
  id: string
  action: string
  entity: string
  userName: string
  timestamp: string
}

export const dashboardService = {
  async getStats(): Promise<DashboardStats> {
    const { data } = await api.get<{ data: DashboardStats }>('/dashboard/stats')
    return data.data
  },

  async getAlerts(): Promise<Alert[]> {
    const { data } = await api.get<{ data: Alert[] }>('/dashboard/alerts')
    return data.data
  },

  async getRecentActivities(limit: number = 10): Promise<Activity[]> {
    const { data } = await api.get<{ data: Activity[] }>('/dashboard/recent-activities', { 
      params: { limit } 
    })
    return data.data
  }
}

import api from './api'
import type { Aluno, AlunoStats, PaginatedResponse } from '@/types'

export interface AlunosFilters {
  search?: string
  active?: boolean
  page?: number
  limit?: number
}

export const alunosService = {
  async list(filters: AlunosFilters = {}): Promise<PaginatedResponse<Aluno>> {
    const response = await api.get('/alunos', { params: filters })
    return response.data.data
  },

  async getById(id: string): Promise<Aluno> {
    const response = await api.get(`/alunos/${id}`)
    return response.data.data
  },

  async create(aluno: Partial<Aluno>): Promise<Aluno> {
    const response = await api.post('/alunos', aluno)
    return response.data.data
  },

  async update(id: string, aluno: Partial<Aluno>): Promise<Aluno> {
    const response = await api.put(`/alunos/${id}`, aluno)
    return response.data.data
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/alunos/${id}`)
  },

  async getStats(id: string): Promise<AlunoStats> {
    const response = await api.get(`/alunos/${id}/stats`)
    return response.data.data
  }
}

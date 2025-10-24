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
    const { data } = await api.get<PaginatedResponse<Aluno>>('/alunos', { params: filters })
    return data
  },

  async getById(id: string): Promise<Aluno> {
    const { data } = await api.get<Aluno>(`/alunos/${id}`)
    return data
  },

  async create(aluno: Partial<Aluno>): Promise<Aluno> {
    const { data } = await api.post<Aluno>('/alunos', aluno)
    return data
  },

  async update(id: string, aluno: Partial<Aluno>): Promise<Aluno> {
    const { data } = await api.put<Aluno>(`/alunos/${id}`, aluno)
    return data
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/alunos/${id}`)
  },

  async getStats(id: string): Promise<AlunoStats> {
    const { data } = await api.get<AlunoStats>(`/alunos/${id}/stats`)
    return data
  }
}

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
    const { data } = await api.get<{ data: PaginatedResponse<Aluno> }>('/alunos', { params: filters })
    return data.data
  },

  async getById(id: string): Promise<Aluno> {
    const { data } = await api.get<{ data: Aluno }>(`/alunos/${id}`)
    return data.data
  },

  async create(aluno: Partial<Aluno>): Promise<Aluno> {
    const { data } = await api.post<{ data: Aluno }>('/alunos', aluno)
    return data.data
  },

  async update(id: string, aluno: Partial<Aluno>): Promise<Aluno> {
    const { data } = await api.put<{ data: Aluno }>(`/alunos/${id}`, aluno)
    return data.data
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/alunos/${id}`)
  },

  async getStats(id: string): Promise<AlunoStats> {
    const { data } = await api.get<{ data: AlunoStats }>(`/alunos/${id}/stats`)
    return data.data
  }
}

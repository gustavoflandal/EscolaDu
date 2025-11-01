import api from './api'
import type { Professor, Formacao, PaginatedResponse } from '@/types'

export interface ProfessoresFilters {
  search?: string
  active?: boolean
  page?: number
  limit?: number
}

export interface ProfessorStats {
  total: number
  ativos: number
  inativos: number
  totalFormacoes: number
}

export const professoresService = {
  async list(filters: ProfessoresFilters = {}): Promise<{ data: PaginatedResponse<Professor> }> {
    const { data } = await api.get<{ data: PaginatedResponse<Professor> }>('/professores', {
      params: filters
    })
    return data
  },

  async getById(id: string): Promise<Professor> {
    const { data } = await api.get<{ data: Professor }>(`/professores/${id}`)
    return data.data
  },

  async getByUserId(userId: string): Promise<Professor> {
    const { data } = await api.get<{ data: Professor }>(`/professores/user/${userId}`)
    return data.data
  },

  async create(professor: {
    userId: string
    registroProfissional: string
    cargaHoraria: number
    active?: boolean
  }): Promise<Professor> {
    const { data } = await api.post<{ data: Professor }>('/professores', professor)
    return data.data
  },

  async update(
    id: string,
    professor: {
      registroProfissional?: string
      cargaHoraria?: number
      active?: boolean
    }
  ): Promise<Professor> {
    const { data } = await api.put<{ data: Professor }>(`/professores/${id}`, professor)
    return data.data
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/professores/${id}`)
  },

  async getStats(): Promise<ProfessorStats> {
    const { data } = await api.get<{ data: ProfessorStats }>('/professores/stats')
    return data.data
  },

  // Formações
  async listFormacoes(professorId: string): Promise<Formacao[]> {
    const { data } = await api.get<{ data: Formacao[] }>(`/professores/${professorId}/formacoes`)
    return data.data
  },

  async createFormacao(formacao: {
    professorId: string
    nome: string
    descricao?: string
  }): Promise<Formacao> {
    const { data } = await api.post<{ data: Formacao }>('/professores/formacoes', formacao)
    return data.data
  },

  async updateFormacao(
    id: string,
    formacao: {
      nome?: string
      descricao?: string
    }
  ): Promise<Formacao> {
    const { data } = await api.put<{ data: Formacao }>(`/professores/formacoes/${id}`, formacao)
    return data.data
  },

  async deleteFormacao(id: string): Promise<void> {
    await api.delete(`/professores/formacoes/${id}`)
  },

  async getAgenda(professorId: string, filters?: {
    dataInicio?: string
    dataFim?: string
  }): Promise<any> {
    const { data } = await api.get(`/professores/${professorId}/agenda`, {
      params: filters
    })
    return data.data
  }
}

export default professoresService

import api from './api'
import type { PaginatedResponse } from '@/types'

export interface Professor {
  id: string
  userId: string
  registroProfissional?: string
  especialidade?: string
  cargaHoraria?: number
  active: boolean
  createdAt: string
  updatedAt: string
  user: {
    id: string
    name: string
    email: string
    cpf?: string
    phone?: string
    active: boolean
  }
  formacoes?: Formacao[]
}

export interface Formacao {
  id: string
  professorId: string
  nivel: string // FUNDAMENTAL, MEDIO, TECNICO, GRADUACAO, POS_GRADUACAO, MESTRADO, DOUTORADO
  curso: string
  instituicao: string
  areaConhecimento?: string
  dataInicio: string
  dataConclusao?: string
  emAndamento: boolean
  cargaHoraria?: number
  observacoes?: string
  createdAt: string
  updatedAt: string
}

export interface CreateProfessorDTO {
  nome: string
  email: string
  senha: string
  cpf?: string
  telefone?: string
  registroProfissional?: string
  especialidade?: string
  cargaHoraria?: number
}

export interface UpdateProfessorDTO {
  nome?: string
  telefone?: string
  registroProfissional?: string
  especialidade?: string
  cargaHoraria?: number
  active?: boolean
}

export interface CreateFormacaoDTO {
  nivel: string
  curso: string
  instituicao: string
  areaConhecimento?: string
  dataInicio: string
  dataConclusao?: string
  emAndamento: boolean
  cargaHoraria?: number
  observacoes?: string
}

export interface UpdateFormacaoDTO {
  nivel?: string
  curso?: string
  instituicao?: string
  areaConhecimento?: string
  dataInicio?: string
  dataConclusao?: string
  emAndamento?: boolean
  cargaHoraria?: number
  observacoes?: string
}

export interface ProfessoresFilters {
  search?: string
  page?: number
  limit?: number
}

export const professoresService = {
  async list(filters: ProfessoresFilters = {}): Promise<PaginatedResponse<Professor>> {
    const response = await api.get('/professores', { params: filters })
    return response.data.data
  },

  async getById(id: string): Promise<Professor> {
    const response = await api.get(`/professores/${id}`)
    return response.data.data
  },

  async create(data: CreateProfessorDTO): Promise<Professor> {
    const response = await api.post('/professores', data)
    return response.data.data
  },

  async update(id: string, data: UpdateProfessorDTO): Promise<Professor> {
    const response = await api.put(`/professores/${id}`, data)
    return response.data.data
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/professores/${id}`)
  },

  // Métodos de formações
  async getFormacoes(professorId: string): Promise<Formacao[]> {
    const response = await api.get(`/professores/${professorId}/formacoes`)
    return response.data.data
  },

  async addFormacao(professorId: string, data: CreateFormacaoDTO): Promise<Formacao> {
    const response = await api.post(`/professores/${professorId}/formacoes`, data)
    return response.data.data
  },

  async updateFormacao(
    professorId: string,
    formacaoId: string,
    data: UpdateFormacaoDTO
  ): Promise<Formacao> {
    const response = await api.put(`/professores/${professorId}/formacoes/${formacaoId}`, data)
    return response.data.data
  },

  async deleteFormacao(professorId: string, formacaoId: string): Promise<void> {
    await api.delete(`/professores/${professorId}/formacoes/${formacaoId}`)
  },
}

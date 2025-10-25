import api from './api'
import type { PaginatedResponse } from '@/types'

export interface Responsavel {
  id: string
  userId: string
  cpf: string
  rg?: string
  telefonePrincipal: string
  telefoneSecundario?: string
  email: string
  profissao?: string
  endereco?: string
  createdAt: string
  updatedAt: string
  user: {
    id: string
    name: string
    email: string
    phone?: string
    active: boolean
  }
  vinculos?: VinculoResponsabilidade[]
}

export interface VinculoResponsabilidade {
  id: string
  alunoId: string
  responsavelId: string
  tipoVinculo: string
  prioridadeContato: number
  active: boolean
  aluno: {
    id: string
    nome: string
    matricula: string
  }
}

export interface CreateResponsavelDTO {
  nome: string
  email: string
  senha: string
  cpf: string
  rg?: string
  tipoVinculo: string
  telefonePrincipal: string
  telefoneSecundario?: string
  profissao?: string
  endereco?: string
}

export interface UpdateResponsavelDTO {
  nome?: string
  cpf?: string
  rg?: string
  tipoVinculo?: string
  telefonePrincipal?: string
  telefoneSecundario?: string
  profissao?: string
  endereco?: string
}

export interface ResponsaveisFilters {
  search?: string
  page?: number
  limit?: number
}

export const responsaveisService = {
  async list(filters: ResponsaveisFilters = {}): Promise<PaginatedResponse<Responsavel>> {
    const response = await api.get('/responsaveis', { params: filters })
    // Backend retorna { success: true, data: { data: [...], meta: {...} } }
    return response.data.data
  },

  async getById(id: string): Promise<Responsavel> {
    const response = await api.get(`/responsaveis/${id}`)
    return response.data.data
  },

  async create(data: CreateResponsavelDTO): Promise<Responsavel> {
    const response = await api.post('/responsaveis', data)
    return response.data.data
  },

  async update(id: string, data: UpdateResponsavelDTO): Promise<Responsavel> {
    const response = await api.put(`/responsaveis/${id}`, data)
    return response.data.data
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/responsaveis/${id}`)
  },

  async vincularAluno(
    responsavelId: string,
    alunoId: string,
    prioridadeContato: number = 1
  ): Promise<VinculoResponsabilidade> {
    const response = await api.post(`/responsaveis/${responsavelId}/alunos`, {
      alunoId,
      prioridadeContato,
    })
    return response.data.data
  },

  async desvincularAluno(responsavelId: string, alunoId: string): Promise<void> {
    await api.delete(`/responsaveis/${responsavelId}/alunos/${alunoId}`)
  },

  async getAlunos(responsavelId: string): Promise<any[]> {
    const response = await api.get(`/responsaveis/${responsavelId}/alunos`)
    return response.data.data
  },
}

import api from './api'
import type { PaginatedResponse } from '@/types'

export interface Turma {
  id: string
  codigo: string
  nome: string
  anoLetivoId: string
  serie: string
  turno: string
  capacidadeMaxima: number
  sala?: string
  professorRegenteId?: string
  active: boolean
  createdAt: string
  updatedAt: string
  anoLetivo: {
    id: string
    ano: number
    status: string
  }
  professorRegente?: {
    id: string
    user: {
      id: string
      name: string
      email: string
    }
  }
  matriculas?: Matricula[]
  _count?: {
    matriculas: number
  }
}

export interface Matricula {
  id: string
  alunoId: string
  turmaId: string
  dataMatricula: string
  dataSaida?: string
  status: string
  aluno: {
    id: string
    nome: string
    matricula: string
    dataNascimento?: string
    genero?: string
    status?: string
  }
}

export interface AnoLetivo {
  id: string
  ano: number
  dataInicio: string
  dataFim: string
  divisao: string
  status: string
}

export interface CreateTurmaDTO {
  codigo: string
  nome: string
  anoLetivoId: string
  serie: string
  turno: string
  capacidadeMaxima?: number
  sala?: string
  professorRegenteId?: string
}

export interface UpdateTurmaDTO {
  nome?: string
  serie?: string
  turno?: string
  capacidadeMaxima?: number
  sala?: string
  professorRegenteId?: string
  active?: boolean
}

export interface TurmasFilters {
  search?: string
  anoLetivoId?: string
  serie?: string
  turno?: string
  page?: number
  limit?: number
}

export const turmasService = {
  async list(filters: TurmasFilters = {}): Promise<PaginatedResponse<Turma>> {
    const response = await api.get('/turmas', { params: filters })
    return response.data.data
  },

  async getById(id: string): Promise<Turma> {
    const response = await api.get(`/turmas/${id}`)
    return response.data.data
  },

  async create(data: CreateTurmaDTO): Promise<Turma> {
    const response = await api.post('/turmas', data)
    return response.data.data
  },

  async update(id: string, data: UpdateTurmaDTO): Promise<Turma> {
    const response = await api.put(`/turmas/${id}`, data)
    return response.data.data
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/turmas/${id}`)
  },

  async getAnosLetivos(): Promise<AnoLetivo[]> {
    const response = await api.get('/turmas/anos-letivos')
    return response.data.data
  },

  async matricularAluno(turmaId: string, alunoId: string): Promise<Matricula> {
    const response = await api.post(`/turmas/${turmaId}/alunos`, {
      alunoId,
    })
    return response.data.data
  },

  async desmatricularAluno(turmaId: string, alunoId: string): Promise<void> {
    await api.delete(`/turmas/${turmaId}/alunos/${alunoId}`)
  },

  async getAlunos(turmaId: string): Promise<any[]> {
    const response = await api.get(`/turmas/${turmaId}/alunos`)
    return response.data.data
  },
}

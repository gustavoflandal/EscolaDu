import api from './api'
import type {
  Turma,
  AnoLetivo,
  Aluno,
  Professor,
  TurmaStats,
  MatriculaTurma,
  ApiResponse,
  PaginatedResponse
} from '@/types'

export interface TurmaFilters {
  page?: number
  limit?: number
  search?: string
  ano?: number
  periodo?: string
  ativa?: boolean
}

export interface CreateTurmaData {
  codigo: string
  nome: string
  anoLetivoId: string
  serie: string
  turno: 'MANHA' | 'TARDE' | 'NOITE' | 'INTEGRAL'
  capacidadeMaxima?: number
  sala?: string | null
  professorRegenteId?: string | null
}

export interface UpdateTurmaData {
  codigo?: string
  nome?: string
  anoLetivoId?: string
  serie?: string
  turno?: 'MANHA' | 'TARDE' | 'NOITE' | 'INTEGRAL'
  capacidadeMaxima?: number
  sala?: string | null
  professorRegenteId?: string | null
  active?: boolean
}

export interface AddAlunoData {
  alunoId: string
  dataMatricula?: string
}

const turmasService = {
  /**
   * Lista turmas com filtros e paginação
   */
  async list(filters: TurmaFilters = {}): Promise<PaginatedResponse<Turma>> {
    const { data } = await api.get<ApiResponse<PaginatedResponse<Turma>>>('/turmas', {
      params: filters
    })
    return data.data
  },

  /**
   * Busca uma turma por ID
   */
  async getById(id: string): Promise<Turma> {
    const { data } = await api.get<ApiResponse<Turma>>(`/turmas/${id}`)
    return data.data
  },

  /**
   * Cria uma nova turma
   */
  async create(turma: CreateTurmaData): Promise<Turma> {
    const { data } = await api.post<ApiResponse<Turma>>('/turmas', turma)
    return data.data
  },

  /**
   * Atualiza uma turma
   */
  async update(id: string, turma: UpdateTurmaData): Promise<Turma> {
    const { data } = await api.put<ApiResponse<Turma>>(`/turmas/${id}`, turma)
    return data.data
  },

  /**
   * Exclui uma turma
   */
  async delete(id: string): Promise<void> {
    await api.delete(`/turmas/${id}`)
  },

  /**
   * Adiciona um aluno à turma
   */
  async addAluno(turmaId: string, alunoData: AddAlunoData): Promise<MatriculaTurma> {
    const { data } = await api.post<ApiResponse<MatriculaTurma>>(
      `/turmas/${turmaId}/alunos`,
      alunoData
    )
    return data.data
  },

  /**
   * Remove um aluno da turma
   */
  async removeAluno(turmaId: string, alunoId: string): Promise<void> {
    await api.delete(`/turmas/${turmaId}/alunos/${alunoId}`)
  },

  /**
   * Lista alunos disponíveis para adicionar à turma
   */
  async getAlunosDisponiveis(turmaId: string, search?: string): Promise<Aluno[]> {
    const { data } = await api.get<ApiResponse<Aluno[]>>(
      `/turmas/${turmaId}/alunos-disponiveis`,
      {
        params: { search }
      }
    )
    return data.data
  },

  /**
   * Obtém estatísticas da turma
   */
  async getStats(turmaId: string): Promise<TurmaStats> {
    const { data } = await api.get<ApiResponse<TurmaStats>>(`/turmas/${turmaId}/stats`)
    return data.data
  },

  /**
   * Lista anos letivos disponíveis
   */
  async getAnosLetivos(): Promise<AnoLetivo[]> {
    const { data } = await api.get<ApiResponse<AnoLetivo[]>>('/turmas/anos-letivos')
    return data.data
  },

  /**
   * Lista professores disponíveis para ser regente
   */
  async getProfessoresDisponiveis(): Promise<Professor[]> {
    const { data } = await api.get<ApiResponse<Professor[]>>('/turmas/professores-disponiveis')
    return data.data
  }
}

export default turmasService

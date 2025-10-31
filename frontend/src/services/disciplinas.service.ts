import api from './api'
import type {
  Disciplina,
  ObjetivoAprendizagem,
  ApiResponse,
  PaginatedResponse
} from '@/types'

export interface DisciplinaFilters {
  page?: number
  limit?: number
  search?: string
  areaConhecimento?: string
  ativa?: boolean
}

export interface CreateDisciplinaData {
  codigo: string
  nome: string
  areaConhecimento?: string
  cargaHorariaSemanal: number
  descricao?: string
}

export interface UpdateDisciplinaData {
  codigo?: string
  nome?: string
  areaConhecimento?: string
  cargaHorariaSemanal?: number
  descricao?: string
  active?: boolean
}

export interface ObjetivoFilters {
  page?: number
  limit?: number
  search?: string
  disciplinaId?: string
  serie?: string
  periodo?: string
}

export interface CreateObjetivoData {
  codigoBNCC: string
  descricao: string
  serie: string
  periodo: string
  competencia?: string
  habilidade?: string
}

export interface UpdateObjetivoData {
  codigoBNCC?: string
  descricao?: string
  serie?: string
  periodo?: string
  competencia?: string
  habilidade?: string
  active?: boolean
}

const disciplinasService = {
  // ==================== DISCIPLINAS ====================

  /**
   * Lista disciplinas com filtros e paginação
   */
  async list(filters: DisciplinaFilters = {}): Promise<PaginatedResponse<Disciplina>> {
    const { data } = await api.get<ApiResponse<PaginatedResponse<Disciplina>>>('/disciplinas', {
      params: filters
    })
    return data.data
  },

  /**
   * Busca uma disciplina por ID
   */
  async getById(id: string): Promise<Disciplina> {
    const { data } = await api.get<ApiResponse<Disciplina>>(`/disciplinas/${id}`)
    return data.data
  },

  /**
   * Cria uma nova disciplina
   */
  async create(disciplina: CreateDisciplinaData): Promise<Disciplina> {
    const { data } = await api.post<ApiResponse<Disciplina>>('/disciplinas', disciplina)
    return data.data
  },

  /**
   * Atualiza uma disciplina
   */
  async update(id: string, disciplina: UpdateDisciplinaData): Promise<Disciplina> {
    const { data } = await api.put<ApiResponse<Disciplina>>(`/disciplinas/${id}`, disciplina)
    return data.data
  },

  /**
   * Exclui uma disciplina
   */
  async delete(id: string): Promise<void> {
    await api.delete(`/disciplinas/${id}`)
  },

  /**
   * Lista áreas de conhecimento disponíveis
   */
  async getAreasConhecimento(): Promise<string[]> {
    const { data } = await api.get<ApiResponse<string[]>>('/disciplinas/areas-conhecimento')
    return data.data
  },

  // ==================== OBJETIVOS ====================

  /**
   * Lista objetivos com filtros e paginação
   */
  async listObjetivos(filters: ObjetivoFilters = {}): Promise<PaginatedResponse<ObjetivoAprendizagem>> {
    const { data } = await api.get<ApiResponse<PaginatedResponse<ObjetivoAprendizagem>>>(
      '/disciplinas/objetivos/list',
      { params: filters }
    )
    return data.data
  },

  /**
   * Busca um objetivo por ID
   */
  async getObjetivoById(id: string): Promise<ObjetivoAprendizagem> {
    const { data } = await api.get<ApiResponse<ObjetivoAprendizagem>>(`/disciplinas/objetivos/${id}`)
    return data.data
  },

  /**
   * Cria um novo objetivo para uma disciplina
   */
  async createObjetivo(
    disciplinaId: string,
    objetivo: CreateObjetivoData
  ): Promise<ObjetivoAprendizagem> {
    const { data } = await api.post<ApiResponse<ObjetivoAprendizagem>>(
      `/disciplinas/${disciplinaId}/objetivos`,
      objetivo
    )
    return data.data
  },

  /**
   * Atualiza um objetivo
   */
  async updateObjetivo(id: string, objetivo: UpdateObjetivoData): Promise<ObjetivoAprendizagem> {
    const { data } = await api.put<ApiResponse<ObjetivoAprendizagem>>(
      `/disciplinas/objetivos/${id}`,
      objetivo
    )
    return data.data
  },

  /**
   * Exclui um objetivo
   */
  async deleteObjetivo(id: string): Promise<void> {
    await api.delete(`/disciplinas/objetivos/${id}`)
  },

  /**
   * Lista séries disponíveis
   */
  async getSeries(): Promise<string[]> {
    const { data } = await api.get<ApiResponse<string[]>>('/disciplinas/series')
    return data.data
  },

  /**
   * Lista períodos disponíveis
   */
  async getPeriodos(): Promise<string[]> {
    const { data } = await api.get<ApiResponse<string[]>>('/disciplinas/periodos')
    return data.data
  },

  /**
   * Lista objetivos de uma disciplina específica
   */
  async getObjetivosPorDisciplina(disciplinaId: string): Promise<ObjetivoAprendizagem[]> {
    const { data } = await api.get<ApiResponse<ObjetivoAprendizagem[]>>(
      `/disciplinas/${disciplinaId}/objetivos`
    )
    return data.data
  }
}

export default disciplinasService

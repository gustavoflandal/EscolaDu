import api from './api'

export interface ProgramaEnsino {
  id: string
  codigo: string
  nome: string
  descricao?: string
  disciplinaId: string
  serie: string
  periodo?: string
  anoLetivo: number
  cargaHoraria?: number
  observacoes?: string
  active: boolean
  createdAt: string
  updatedAt: string
  _count?: {
    objetivos: number
  }
  disciplina?: {
    id: string
    codigo: string
    nome: string
    areaConhecimento?: string
  }
}

export interface CreateProgramaEnsinoInput {
  codigo: string
  nome: string
  descricao?: string | null
  disciplinaId: string
  serie: string
  periodo?: string | null
  anoLetivo: number
  cargaHoraria?: number | null
  observacoes?: string | null
  active?: boolean
}

export interface UpdateProgramaEnsinoInput {
  codigo?: string
  nome?: string
  descricao?: string | null
  serie?: string
  periodo?: string | null
  anoLetivo?: number
  cargaHoraria?: number | null
  observacoes?: string | null
  active?: boolean
}

export interface ListProgramasEnsinoParams {
  search?: string
  disciplinaId?: string
  serie?: string
  periodo?: string
  anoLetivo?: number
  active?: boolean
  page?: number
  limit?: number
}

class ProgramasEnsinoService {
  private baseUrl = '/programas-ensino'

  /**
   * Listar programas de ensino com filtros
   */
  async list(params?: ListProgramasEnsinoParams) {
    const response = await api.get(this.baseUrl, { params })
    return response.data.data
  }

  /**
   * Buscar programa de ensino por ID
   */
  async getById(id: string): Promise<ProgramaEnsino> {
    const response = await api.get(`${this.baseUrl}/${id}`)
    return response.data.data
  }

  /**
   * Buscar programas de ensino por disciplina
   */
  async getByDisciplina(disciplinaId: string): Promise<ProgramaEnsino[]> {
    console.log('📡 API call: GET /programas-ensino?disciplinaId=', disciplinaId)
    const response = await api.get(this.baseUrl, {
      params: { disciplinaId, limit: 100 }
    })
    console.log('📡 API response:', response.data)
    // A resposta do backend pode ser { data: [...] } ou { data: { data: [...], ... } }
    const result = Array.isArray(response.data.data) 
      ? response.data.data 
      : response.data.data?.data || []
    console.log('📡 Returning programas:', result.length, 'items')
    return result
  }

  /**
   * Criar novo programa de ensino
   */
  async create(data: CreateProgramaEnsinoInput): Promise<ProgramaEnsino> {
    const response = await api.post(this.baseUrl, data)
    return response.data.data
  }

  /**
   * Atualizar programa de ensino
   */
  async update(id: string, data: UpdateProgramaEnsinoInput): Promise<ProgramaEnsino> {
    const response = await api.put(`${this.baseUrl}/${id}`, data)
    return response.data.data
  }

  /**
   * Desativar programa de ensino
   */
  async deactivate(id: string): Promise<void> {
    await api.patch(`${this.baseUrl}/${id}/deactivate`)
  }

  /**
   * Reativar programa de ensino
   */
  async activate(id: string): Promise<void> {
    await api.patch(`${this.baseUrl}/${id}/activate`)
  }

  /**
   * Excluir programa de ensino
   */
  async delete(id: string): Promise<void> {
    await api.delete(`${this.baseUrl}/${id}`)
  }

  /**
   * Listar séries disponíveis
   */
  async getSeries(): Promise<string[]> {
    const response = await api.get(`${this.baseUrl}/series`)
    return response.data.data
  }

  /**
   * Listar anos letivos disponíveis
   */
  async getAnosLetivos(): Promise<number[]> {
    const response = await api.get(`${this.baseUrl}/anos-letivos`)
    return response.data.data
  }
}

export default new ProgramasEnsinoService()

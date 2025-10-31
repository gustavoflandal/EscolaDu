import api from './api'

export interface ObjetivoAprendizagem {
  id: string
  codigoBNCC: string
  descricao: string
  programaEnsinoId: string
  ordem: number
  competencia?: string
  habilidade?: string
  pontuacaoMeta?: number | null
  active: boolean
  createdAt: string
  updatedAt: string
  programaEnsino?: {
    id: string
    codigo: string
    nome: string
    serie: string
    periodo?: string
    disciplina?: {
      id: string
      codigo: string
      nome: string
    }
  }
}

export interface CreateObjetivoInput {
  codigoBNCC: string
  descricao: string
  programaEnsinoId: string
  ordem?: number
  competencia?: string | null
  habilidade?: string | null
  pontuacaoMeta?: number | null
}

export interface UpdateObjetivoInput {
  codigoBNCC?: string
  descricao?: string
  ordem?: number
  competencia?: string | null
  habilidade?: string | null
  pontuacaoMeta?: number | null
  active?: boolean
}

export interface ListObjetivosParams {
  programaEnsinoId?: string
  search?: string
  active?: boolean
  page?: number
  limit?: number
}

class ObjetivosAprendizagemService {
  private baseUrl = '/objetivos-aprendizagem'

  /**
   * Listar objetivos de aprendizagem com filtros
   */
  async list(params?: ListObjetivosParams): Promise<ObjetivoAprendizagem[]> {
    const response = await api.get(this.baseUrl, { params })
    return response.data.data
  }

  /**
   * Buscar objetivo por ID
   */
  async getById(id: string): Promise<ObjetivoAprendizagem> {
    const response = await api.get(`${this.baseUrl}/${id}`)
    return response.data.data
  }

  /**
   * Buscar objetivos por programa de ensino
   */
  async getByPrograma(programaEnsinoId: string): Promise<ObjetivoAprendizagem[]> {
    console.log('📡 API call: GET /objetivos-aprendizagem?programaEnsinoId=', programaEnsinoId)
    const response = await api.get(this.baseUrl, {
      params: { programaEnsinoId, limit: 100 }
    })
    console.log('📡 API response:', response.data)
    return response.data.data
  }

  /**
   * Criar novo objetivo
   */
  async create(data: CreateObjetivoInput): Promise<ObjetivoAprendizagem> {
    console.log('📡 Creating objetivo:', data)
    const response = await api.post(this.baseUrl, data)
    console.log('✅ Objetivo created:', response.data)
    return response.data.data
  }

  /**
   * Atualizar objetivo
   */
  async update(id: string, data: UpdateObjetivoInput): Promise<ObjetivoAprendizagem> {
    console.log('📡 Updating objetivo:', id, data)
    const response = await api.put(`${this.baseUrl}/${id}`, data)
    console.log('✅ Objetivo updated:', response.data)
    return response.data.data
  }

  /**
   * Desativar objetivo
   */
  async deactivate(id: string): Promise<void> {
    await api.patch(`${this.baseUrl}/${id}/deactivate`)
  }

  /**
   * Reativar objetivo
   */
  async activate(id: string): Promise<void> {
    await api.patch(`${this.baseUrl}/${id}/activate`)
  }

  /**
   * Excluir objetivo
   */
  async delete(id: string): Promise<void> {
    await api.delete(`${this.baseUrl}/${id}`)
  }

  /**
   * Reordenar objetivos de um programa
   */
  async reorder(programaEnsinoId: string, objetivosOrdem: { id: string; ordem: number }[]): Promise<void> {
    await api.post(`${this.baseUrl}/programas/${programaEnsinoId}/reorder`, {
      objetivosOrdem
    })
  }
}

export default new ObjetivosAprendizagemService()

import api from './api'

export interface Serie {
  id: string
  codigo: string
  nome: string
  ordem: number
  nivelEnsino: string
  active: boolean
  createdAt: string
  updatedAt: string
}

export interface SerieCreateInput {
  codigo: string
  nome: string
  ordem: number
  nivelEnsino: string
  active?: boolean
}

export interface SerieUpdateInput {
  codigo?: string
  nome?: string
  ordem?: number
  nivelEnsino?: string
  active?: boolean
}

export interface SeriesFilters {
  active?: boolean
}

export const seriesService = {
  async list(filters: SeriesFilters = {}): Promise<Serie[]> {
    const { data } = await api.get<{ data: Serie[] }>('/cadastros/series', {
      params: filters
    })
    return data.data
  },

  async getById(id: string): Promise<Serie> {
    const { data } = await api.get<{ data: Serie }>(`/cadastros/series/${id}`)
    return data.data
  },

  async create(serie: SerieCreateInput): Promise<Serie> {
    const { data } = await api.post<{ data: Serie }>('/cadastros/series', serie)
    return data.data
  },

  async update(id: string, serie: SerieUpdateInput): Promise<Serie> {
    const { data } = await api.put<{ data: Serie }>(`/cadastros/series/${id}`, serie)
    return data.data
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/cadastros/series/${id}`)
  }
}

export default seriesService

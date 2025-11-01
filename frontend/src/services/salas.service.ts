import api from './api'

export interface Sala {
  id: string
  codigo: string
  nome: string
  capacidade: number
  andar?: string
  bloco?: string
  recursos?: string
  active: boolean
  createdAt: string
  updatedAt: string
}

export interface SalaCreateInput {
  codigo: string
  nome: string
  capacidade: number
  andar?: string
  bloco?: string
  recursos?: string
  active?: boolean
}

export interface SalaUpdateInput {
  codigo?: string
  nome?: string
  capacidade?: number
  andar?: string
  bloco?: string
  recursos?: string
  active?: boolean
}

export interface SalasFilters {
  active?: boolean
}

export const salasService = {
  async list(filters: SalasFilters = {}): Promise<Sala[]> {
    const { data } = await api.get<{ data: Sala[] }>('/cadastros/salas', {
      params: filters
    })
    return data.data
  },

  async getById(id: string): Promise<Sala> {
    const { data } = await api.get<{ data: Sala }>(`/cadastros/salas/${id}`)
    return data.data
  },

  async create(sala: SalaCreateInput): Promise<Sala> {
    const { data } = await api.post<{ data: Sala }>('/cadastros/salas', sala)
    return data.data
  },

  async update(id: string, sala: SalaUpdateInput): Promise<Sala> {
    const { data } = await api.put<{ data: Sala }>(`/cadastros/salas/${id}`, sala)
    return data.data
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/cadastros/salas/${id}`)
  }
}

export default salasService

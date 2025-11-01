import api from './api'

export enum TipoFeriado {
  NACIONAL = 'NACIONAL',
  ESTADUAL = 'ESTADUAL',
  MUNICIPAL = 'MUNICIPAL',
  ESCOLAR = 'ESCOLAR'
}

export interface Feriado {
  id: string
  nome: string
  data: string
  tipo: TipoFeriado
  recorrente: boolean
  active: boolean
  createdAt: string
  updatedAt: string
}

export interface FeriadoCreateInput {
  nome: string
  data: string
  tipo: TipoFeriado
  recorrente?: boolean
  active?: boolean
}

export interface FeriadoUpdateInput {
  nome?: string
  data?: string
  tipo?: TipoFeriado
  recorrente?: boolean
  active?: boolean
}

export interface FeriadosFilters {
  tipo?: TipoFeriado
  ano?: number
  active?: boolean
}

export const feriadosService = {
  async list(filters: FeriadosFilters = {}): Promise<Feriado[]> {
    const { data } = await api.get<{ data: Feriado[] }>('/cadastros/feriados', {
      params: filters
    })
    return data.data
  },

  async getById(id: string): Promise<Feriado> {
    const { data } = await api.get<{ data: Feriado }>(`/cadastros/feriados/${id}`)
    return data.data
  },

  async create(feriado: FeriadoCreateInput): Promise<Feriado> {
    const { data } = await api.post<{ data: Feriado }>('/cadastros/feriados', feriado)
    return data.data
  },

  async update(id: string, feriado: FeriadoUpdateInput): Promise<Feriado> {
    const { data } = await api.put<{ data: Feriado }>(`/cadastros/feriados/${id}`, feriado)
    return data.data
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/cadastros/feriados/${id}`)
  }
}

export default feriadosService

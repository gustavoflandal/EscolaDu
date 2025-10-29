export interface User {
  id: string
  email: string
  name: string
  active: boolean
  createdAt: string
  updatedAt: string
  roles?: Role[]
}

export interface Role {
  id: string
  name: string
  description: string
  permissions?: Permission[]
}

export interface Permission {
  id: string
  resource: string
  action: string
  description: string
}

export interface LoginRequest {
  email: string
  senha: string
}

export interface LoginResponse {
  accessToken: string
  refreshToken: string
  user: User
}

export interface Aluno {
  id: string
  nome: string
  dataNascimento: string
  cpf?: string
  rg?: string
  matricula: string
  genero?: 'M' | 'F' | 'Outro'
  telefone?: string
  email?: string
  endereco?: string
  bairro?: string
  cidade?: string
  estado?: string
  cep?: string
  necessidadesEspeciais?: string
  status: 'ATIVO' | 'INATIVO' | 'TRANSFERIDO' | 'EVADIDO' | 'CONCLUIDO'
  createdAt: string
  updatedAt: string
}

export interface AlunoStats {
  totalAulas: number
  aulasPresentes: number
  aulasFaltas: number
  percentualFrequencia: number
  totalObjetivos: number
  objetivosAlcancados: number
  objetivosEmDesenvolvimento: number
  objetivosNaoAlcancados: number
  percentualDesempenho: number
}

export interface Turma {
  id: string
  nome: string
  anoLetivoId: string
  periodoLetivoId?: string
  nivel: string
  turno: 'Matutino' | 'Vespertino' | 'Noturno' | 'Integral'
  capacidadeMaxima: number
  active: boolean
  createdAt: string
  updatedAt: string
}

export interface Disciplina {
  id: string
  nome: string
  codigo: string
  cargaHoraria: number
  active: boolean
}

export interface ApiResponse<T = any> {
  data: T
  message?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface ApiError {
  message: string
  errors?: Record<string, string[]>
}

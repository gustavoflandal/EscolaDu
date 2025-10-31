export interface User {
  id: string
  email: string
  name: string
  cpf?: string
  phone?: string
  avatar?: string
  active: boolean
  createdAt: string
  updatedAt: string
  roles?: Role[]
  permissions?: Permission[]
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
  codigo: string
  nome: string
  serie: string
  turno: 'MANHA' | 'TARDE' | 'NOITE' | 'INTEGRAL'
  sala?: string | null
  capacidadeMaxima: number
  active: boolean
  ano: number
  anoLetivoId: string
  anoLetivoStatus?: string
  professorRegenteId?: string | null
  professorRegente?: {
    id: string
    userId: string
    nome: string
  } | null
  quantidadeAlunos: number
  alunos?: MatriculaTurma[]
  createdAt: string
  updatedAt: string
}

export interface MatriculaTurma {
  id: string
  alunoId: string
  turmaId?: string
  dataMatricula: string
  dataSaida?: string | null
  status: 'ATIVO' | 'TRANSFERIDO' | 'CONCLUIDO'
  aluno: {
    id: string
    matricula: string
    nome: string
    dataNascimento: string
    status: string
    telefone?: string | null
  }
}

export interface AnoLetivo {
  id: string
  ano: number
  dataInicio: string
  dataFim: string
  status: 'PLANEJAMENTO' | 'EM_ANDAMENTO' | 'ENCERRADO'
}

export interface TurmaStats {
  totalAlunos: number
  alunosAtivos: number
  alunosInativos: number
  vagasDisponiveis: number
  percentualOcupacao: number
  capacidade: number
  generos: Record<string, number>
}

export interface Disciplina {
  id: string
  codigo: string
  nome: string
  areaConhecimento?: string
  cargaHorariaSemanal: number
  descricao?: string
  active: boolean
  quantidadeProgramas?: number
  quantidadeTurmas?: number
  objetivos?: ObjetivoAprendizagem[]
  turmas?: TurmaDisciplina[]
  createdAt: string
  updatedAt: string
}

export interface ObjetivoAprendizagem {
  id: string
  codigoBNCC: string
  descricao: string
  serie: string
  periodo: string
  competencia?: string
  habilidade?: string
  disciplinaId: string
  disciplina?: {
    id: string
    codigo: string
    nome: string
  }
  active: boolean
  quantidadeAvaliacoes?: number
  createdAt: string
  updatedAt: string
}

export interface TurmaDisciplina {
  id: string
  turmaId: string
  disciplinaId: string
  professorId?: string
  turma?: Turma
  disciplina?: Disciplina
  professor?: Professor
  createdAt: string
  updatedAt: string
}

export interface Professor {
  id: string
  userId: string
  registroProfissional: string
  cargaHoraria: number
  active: boolean
  createdAt: string
  updatedAt: string
  user?: User
  formacoes?: Formacao[]
  turmas?: Turma[]
  _count?: {
    turmas: number
    formacoes: number
  }
}

export interface Formacao {
  id: string
  professorId: string
  nome: string
  descricao?: string
  createdAt: string
  updatedAt: string
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

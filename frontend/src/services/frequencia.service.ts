import api from './api';

// Types
export interface Aula {
  id: string;
  turmaDisciplinaId: string;
  turmaId: string;
  data: string;
  horaInicio: string;
  horaFim: string;
  conteudo?: string;
  professorId?: string;
  status: 'PLANEJADA' | 'REALIZADA' | 'CANCELADA' | 'REPOSTA';
  createdAt: string;
  updatedAt: string;
  turmaDisciplina?: any;
  turma?: any;
  professor?: any;
  frequencias?: any[];
  frequenciaLancada?: boolean;
}

export interface RegistroFrequencia {
  alunoId: string;
  status: 'P' | 'F' | 'J';
  observacao?: string;
}

export interface Justificativa {
  id: string;
  alunoId: string;
  aluno?: {
    id: string;
    nome: string;
    matricula: string;
  };
  dataInicio: string;
  dataFim: string;
  motivo: string;
  documentoUrl?: string;
  aprovada: boolean;
  aprovadaPor?: string | { id: string; nome: string; email: string };
  aprovadaEm?: string;
  createdAt: string;
}

export interface CreateAulaInput {
  turmaDisciplinaId: string;
  turmaId: string;
  data: string;
  horaInicio: string;
  horaFim: string;
  conteudo?: string;
  professorId?: string;
}

export interface LancarChamadaInput {
  aulaId: string;
  registros: RegistroFrequencia[];
}

export interface CreateJustificativaInput {
  alunoId: string;
  dataInicio: string;
  dataFim: string;
  motivo: string;
  documentoUrl?: string;
}

export interface AulasFilters {
  turmaId?: string;
  turmaDisciplinaId?: string;
  professorId?: string;
  data?: string; // Filtro por data específica
  dataInicio?: string;
  dataFim?: string;
  status?: string;
  page?: number;
  limit?: number;
}

export interface JustificativasFilters {
  alunoId?: string;
  turmaId?: string;
  aprovada?: boolean;
  dataInicio?: string;
  dataFim?: string;
  page?: number;
  limit?: number;
}

/**
 * Service para módulo de Frequência
 */
class FrequenciaService {
  // =====================
  // AULAS
  // =====================

  /**
   * Lista aulas com filtros
   */
  async listAulas(filters?: AulasFilters) {
    const { data } = await api.get('/frequencia/aulas', { params: filters });
    return data;
  }

  /**
   * Busca aula por ID
   */
  async getAula(id: string) {
    const { data } = await api.get(`/frequencia/aulas/${id}`);
    return data;
  }

  /**
   * Busca aulas do dia para uma turma
   */
  async getAulasDoDia(turmaId: string, data: string) {
    const { data: response } = await api.get(`/frequencia/aulas/turma/${turmaId}/dia/${data}`);
    return response;
  }

  /**
   * Cria nova aula
   */
  async createAula(aulaData: CreateAulaInput) {
    const { data } = await api.post('/frequencia/aulas', aulaData);
    return data;
  }

  /**
   * Atualiza aula
   */
  async updateAula(id: string, aulaData: Partial<CreateAulaInput>) {
    const { data } = await api.put(`/frequencia/aulas/${id}`, aulaData);
    return data;
  }

  /**
   * Cancela aula
   */
  async cancelAula(id: string, motivo?: string) {
    const { data } = await api.patch(`/frequencia/aulas/${id}/cancelar`, { motivo });
    return data;
  }

  /**
   * Deleta aula
   */
  async deleteAula(id: string) {
    const { data } = await api.delete(`/frequencia/aulas/${id}`);
    return data;
  }

  // =====================
  // FREQUÊNCIA
  // =====================

  /**
   * Lança chamada para uma aula
   */
  async lancarChamada(chamadaData: LancarChamadaInput) {
    const { data } = await api.post('/frequencia/lancar-chamada', chamadaData);
    return data;
  }

  /**
   * Busca frequência de uma aula específica
   */
  async getFrequenciaAula(aulaId: string) {
    const { data } = await api.get(`/frequencia/aula/${aulaId}`);
    return data;
  }

  /**
   * Busca frequência de um aluno
   */
  async getFrequenciaAluno(
    alunoId: string,
    filters?: {
      dataInicio?: string;
      dataFim?: string;
      turmaId?: string;
      disciplinaId?: string;
    }
  ) {
    const { data } = await api.get(`/frequencia/aluno/${alunoId}`, { params: filters });
    return data;
  }

  /**
   * Busca frequência consolidada de uma turma
   */
  async getFrequenciaTurma(
    turmaId: string,
    filters?: {
      dataInicio?: string;
      dataFim?: string;
      disciplinaId?: string;
    }
  ) {
    const { data } = await api.get(`/frequencia/turma/${turmaId}`, { params: filters });
    return data;
  }

  // =====================
  // JUSTIFICATIVAS
  // =====================

  /**
   * Lista justificativas com filtros
   */
  async listJustificativas(filters?: JustificativasFilters) {
    const { data } = await api.get('/frequencia/justificativas', { params: filters });
    return data;
  }

  /**
   * Lista justificativas pendentes de aprovação
   */
  async getPendentes(turmaId?: string) {
    const { data } = await api.get('/frequencia/justificativas/pendentes', {
      params: { turmaId }
    });
    return data;
  }

  /**
   * Busca justificativa por ID
   */
  async getJustificativa(id: string) {
    const { data } = await api.get(`/frequencia/justificativas/${id}`);
    return data;
  }

  /**
   * Cria nova justificativa
   */
  async createJustificativa(justificativaData: CreateJustificativaInput) {
    const { data } = await api.post('/frequencia/justificativas', justificativaData);
    return data;
  }

  /**
   * Atualiza justificativa
   */
  async updateJustificativa(id: string, justificativaData: Partial<CreateJustificativaInput>) {
    const { data } = await api.put(`/frequencia/justificativas/${id}`, justificativaData);
    return data;
  }

  /**
   * Aprova ou reprova justificativa
   */
  async aprovarJustificativa(id: string, aprovada: boolean) {
    const { data } = await api.patch(`/frequencia/justificativas/${id}/aprovar`, { aprovada });
    return data;
  }

  /**
   * Deleta justificativa
   */
  async deleteJustificativa(id: string) {
    const { data } = await api.delete(`/frequencia/justificativas/${id}`);
    return data;
  }
}

export default new FrequenciaService();

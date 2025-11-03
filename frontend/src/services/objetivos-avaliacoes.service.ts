import api from './api';

// ========================================
// TYPES & INTERFACES
// ========================================

export type StatusAvaliacao = 'A' | 'D' | 'N' | 'NA';
export type TipoEvidencia = 'FOTO' | 'VIDEO' | 'DOCUMENTO' | 'TEXTO' | 'ATIVIDADE' | 'PROJETO';

export interface ObjetivoAprendizagem {
  id: string;
  codigo: string;
  descricao: string;
  pontuacaoMeta?: number;
  ordem: number;
  ativo: boolean;
  programaEnsinoId: string;
  programaEnsino?: {
    id: string;
    nome: string;
    disciplina?: {
      id: string;
      nome: string;
    };
  };
  createdAt: string;
  updatedAt: string;
}

export interface AvaliacaoObjetivo {
  id: string;
  objetivoId: string;
  objetivo: ObjetivoAprendizagem;
  alunoId: string;
  aluno: {
    id: string;
    nome: string;
    matricula: string;
  };
  turmaId: string;
  turma: {
    id: string;
    nome: string;
    serieId: string;
    serie: {
      id: string;
      nome: string;
    };
  };
  status: StatusAvaliacao;
  observacao?: string;
  dataAvaliacao: string;
  avaliadoPorId: string;
  avaliadoPor: {
    id: string;
    nome: string;
  };
  evidencias?: EvidenciaAprendizagem[];
  _count?: {
    evidencias: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface EvidenciaAprendizagem {
  id: string;
  avaliacaoObjetivoId: string;
  avaliacaoObjetivo?: AvaliacaoObjetivo;
  alunoId: string;
  aluno?: {
    id: string;
    nome: string;
    matricula: string;
  };
  tipo: TipoEvidencia;
  arquivoUrl?: string;
  descricao: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAvaliacaoInput {
  objetivoId: string;
  alunoId: string;
  turmaId: string;
  status: StatusAvaliacao;
  observacao?: string;
  dataAvaliacao?: string;
}

export interface AvaliarLoteInput {
  turmaId: string;
  programaEnsinoId: string;
  avaliacoes: {
    objetivoId: string;
    alunoId: string;
    status: StatusAvaliacao;
    observacao?: string;
  }[];
}

export interface AvaliarLoteResult {
  sucesso: number;
  erro: number;
  erros: Array<{
    objetivoId: string;
    alunoId: string;
    mensagem: string;
  }>;
}

export interface UpdateAvaliacaoInput {
  status?: StatusAvaliacao;
  observacao?: string;
  dataAvaliacao?: string;
}

export interface ListAvaliacoesFilters {
  turmaId?: string;
  alunoId?: string;
  objetivoId?: string;
  programaEnsinoId?: string;
  status?: StatusAvaliacao;
  page?: number;
  limit?: number;
}

export interface PaginatedAvaliacoes {
  data: AvaliacaoObjetivo[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface MapaProficiencia {
  aluno: {
    id: string;
    nome: string;
    matricula: string;
  };
  turma: {
    id: string;
    nome: string;
    serie: {
      id: string;
      nome: string;
    };
  };
  programaEnsino: {
    id: string;
    nome: string;
    disciplina: {
      id: string;
      nome: string;
    };
  };
  objetivos: ObjetivoAprendizagem[];
  avaliacoes: AvaliacaoObjetivo[];
  estatisticas: {
    totalObjetivos: number;
    atingidos: number;
    emDesenvolvimento: number;
    naoAtingidos: number;
    naoAvaliados: number;
    percentualAtingido: number;
  };
}

export interface AnoLetivo {
  ano: number;
  avaliacoes: AvaliacaoObjetivo[];
  estatisticas: {
    totalObjetivos: number;
    atingidos: number;
    emDesenvolvimento: number;
    naoAtingidos: number;
    naoAvaliados: number;
    percentualAtingido: number;
  };
}

export interface AcompanhamentoLongitudinal {
  aluno: {
    id: string;
    nome: string;
    matricula: string;
  };
  anosLetivos: AnoLetivo[];
}

export interface EstatisticasAluno {
  aluno: {
    id: string;
    nome: string;
    matricula: string;
  };
  totalObjetivos: number;
  atingidos: number;
  emDesenvolvimento: number;
  naoAtingidos: number;
  naoAvaliados: number;
  percentualAtingido: number;
}

export interface EstatisticasTurma {
  turma: {
    id: string;
    nome: string;
    serie: {
      id: string;
      nome: string;
    };
  };
  programaEnsino: {
    id: string;
    nome: string;
    disciplina: {
      id: string;
      nome: string;
    };
  };
  totalObjetivos: number;
  estatisticas: {
    totalAlunos: number;
    mediaAtingidos: number;
    mediaEmDesenvolvimento: number;
    mediaNaoAtingidos: number;
    mediaNaoAvaliados: number;
    mediaPercentualAtingido: number;
  };
  ranking: EstatisticasAluno[];
}

export interface CreateEvidenciaInput {
  avaliacaoObjetivoId: string;
  alunoId: string;
  tipo: TipoEvidencia;
  arquivoUrl?: string;
  descricao: string;
}

export interface UpdateEvidenciaInput {
  tipo?: TipoEvidencia;
  arquivoUrl?: string;
  descricao?: string;
}

export interface ListEvidenciasFilters {
  avaliacaoObjetivoId?: string;
  alunoId?: string;
  tipo?: TipoEvidencia;
  page?: number;
  limit?: number;
}

export interface PaginatedEvidencias {
  data: EvidenciaAprendizagem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface EvidenciasPorObjetivo {
  objetivo: ObjetivoAprendizagem;
  avaliacao: AvaliacaoObjetivo;
  evidencias: EvidenciaAprendizagem[];
}

export interface EstatisticasEvidencias {
  total: number;
  porTipo: {
    tipo: TipoEvidencia;
    quantidade: number;
  }[];
  porMes: {
    mes: string;
    quantidade: number;
  }[];
}

// ========================================
// API SERVICE
// ========================================

class ObjetivosAvaliacoesService {
  // ========================================
  // AVALIAÇÕES
  // ========================================

  /**
   * Criar ou atualizar avaliação de objetivo
   */
  async createOrUpdateAvaliacao(data: CreateAvaliacaoInput): Promise<AvaliacaoObjetivo> {
    const response = await api.post('/objetivos-aprendizagem/avaliacoes', data);
    return response.data;
  }

  /**
   * Avaliar objetivos em lote
   */
  async avaliarLote(data: AvaliarLoteInput): Promise<AvaliarLoteResult> {
    const response = await api.post('/objetivos-aprendizagem/avaliacoes/lote', data);
    return response.data;
  }

  /**
   * Listar avaliações com filtros
   */
  async listAvaliacoes(filters: ListAvaliacoesFilters = {}): Promise<PaginatedAvaliacoes> {
    const response = await api.get('/objetivos-aprendizagem/avaliacoes', { params: filters });
    return response.data;
  }

  /**
   * Buscar avaliação por ID
   */
  async getAvaliacaoById(id: string): Promise<AvaliacaoObjetivo> {
    const response = await api.get(`/objetivos-aprendizagem/avaliacoes/${id}`);
    return response.data;
  }

  /**
   * Atualizar avaliação
   */
  async updateAvaliacao(id: string, data: UpdateAvaliacaoInput): Promise<AvaliacaoObjetivo> {
    const response = await api.put(`/objetivos-aprendizagem/avaliacoes/${id}`, data);
    return response.data;
  }

  /**
   * Excluir avaliação
   */
  async deleteAvaliacao(id: string): Promise<void> {
    await api.delete(`/objetivos-aprendizagem/avaliacoes/${id}`);
  }

  /**
   * Obter mapa de proficiência do aluno
   */
  async getMapaProficiencia(
    alunoId: string,
    turmaId: string,
    programaEnsinoId: string
  ): Promise<MapaProficiencia> {
    const response = await api.get(`/objetivos-aprendizagem/avaliacoes/aluno/${alunoId}/mapa`, {
      params: { turmaId, programaEnsinoId }
    });
    return response.data;
  }

  /**
   * Obter acompanhamento longitudinal do aluno
   */
  async getAcompanhamentoLongitudinal(
    alunoId: string,
    programaEnsinoId?: string
  ): Promise<AcompanhamentoLongitudinal> {
    const response = await api.get(
      `/objetivos-aprendizagem/avaliacoes/aluno/${alunoId}/longitudinal`,
      { params: programaEnsinoId ? { programaEnsinoId } : {} }
    );
    return response.data;
  }

  /**
   * Obter estatísticas da turma
   */
  async getEstatisticasTurma(turmaId: string, programaEnsinoId: string): Promise<EstatisticasTurma> {
    const response = await api.get(
      `/objetivos-aprendizagem/avaliacoes/turma/${turmaId}/estatisticas`,
      { params: { programaEnsinoId } }
    );
    return response.data;
  }

  // ========================================
  // EVIDÊNCIAS
  // ========================================

  /**
   * Criar evidência de aprendizagem
   */
  async createEvidencia(data: CreateEvidenciaInput): Promise<EvidenciaAprendizagem> {
    const response = await api.post('/objetivos-aprendizagem/evidencias', data);
    return response.data;
  }

  /**
   * Listar evidências com filtros
   */
  async listEvidencias(filters: ListEvidenciasFilters = {}): Promise<PaginatedEvidencias> {
    const response = await api.get('/objetivos-aprendizagem/evidencias', { params: filters });
    return response.data;
  }

  /**
   * Buscar evidência por ID
   */
  async getEvidenciaById(id: string): Promise<EvidenciaAprendizagem> {
    const response = await api.get(`/objetivos-aprendizagem/evidencias/${id}`);
    return response.data;
  }

  /**
   * Atualizar evidência
   */
  async updateEvidencia(id: string, data: UpdateEvidenciaInput): Promise<EvidenciaAprendizagem> {
    const response = await api.put(`/objetivos-aprendizagem/evidencias/${id}`, data);
    return response.data;
  }

  /**
   * Excluir evidência
   */
  async deleteEvidencia(id: string): Promise<void> {
    await api.delete(`/objetivos-aprendizagem/evidencias/${id}`);
  }

  /**
   * Obter evidências do aluno agrupadas por objetivo
   */
  async getEvidenciasPorAluno(alunoId: string, turmaId?: string): Promise<EvidenciasPorObjetivo[]> {
    const response = await api.get(
      `/objetivos-aprendizagem/evidencias/aluno/${alunoId}/por-objetivo`,
      { params: turmaId ? { turmaId } : {} }
    );
    return response.data;
  }

  /**
   * Obter estatísticas de evidências
   */
  async getEstatisticasEvidencias(filters: {
    turmaId?: string;
    alunoId?: string;
  } = {}): Promise<EstatisticasEvidencias> {
    const response = await api.get('/objetivos-aprendizagem/evidencias/estatisticas', {
      params: filters
    });
    return response.data;
  }
}

export const objetivosAvaliacoesService = new ObjetivosAvaliacoesService();
export default objetivosAvaliacoesService;

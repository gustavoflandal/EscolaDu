import api from './api';

export interface Responsavel {
  id: string;
  userId: string;
  name: string;
  email: string;
  phone: string;
  cpf: string;
  rg?: string;
  tipoVinculo: 'PAI' | 'MAE' | 'AVO' | 'TUTOR' | 'OUTRO';
  telefonePrincipal: string;
  telefoneSecundario?: string;
  profissao?: string;
  endereco?: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
  alunosVinculados?: number;
  alunos?: AlunoVinculo[];
}

export interface AlunoVinculo {
  vinculoId?: string;
  alunoId: string;
  nome: string;
  matricula: string;
  status: string;
  foto?: string;
  dataNascimento?: string;
  prioridadeContato: number;
  createdAt?: string;
}

export interface CreateResponsavelData {
  name: string;
  email: string;
  password: string;
  cpf: string;
  phone: string;
  tipoVinculo: 'PAI' | 'MAE' | 'AVO' | 'TUTOR' | 'OUTRO';
  rg?: string;
  telefoneSecundario?: string;
  profissao?: string;
  endereco?: string;
}

export interface UpdateResponsavelData {
  name?: string;
  email?: string;
  phone?: string;
  tipoVinculo?: 'PAI' | 'MAE' | 'AVO' | 'TUTOR' | 'OUTRO';
  rg?: string;
  telefoneSecundario?: string;
  profissao?: string;
  endereco?: string;
  active?: boolean;
}

export interface ListResponsaveisParams {
  page?: number;
  limit?: number;
  search?: string;
  active?: boolean;
}

export interface ListResponsaveisResponse {
  data: Responsavel[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface CreateVinculoData {
  alunoId: string;
  prioridadeContato?: number;
}

export interface UpdateVinculoData {
  prioridadeContato?: number;
}

class ResponsaveisService {
  /**
   * Lista responsáveis com filtros e paginação
   */
  async list(params?: ListResponsaveisParams): Promise<ListResponsaveisResponse> {
    const response = await api.get('/responsaveis', { params });
    const result = response.data;
    return {
      data: result.data,
      pagination: result.meta
    };
  }

  /**
   * Busca responsável por ID
   */
  async getById(id: string): Promise<Responsavel> {
    const response = await api.get(`/responsaveis/${id}`);
    return response.data.data;
  }

  /**
   * Busca responsável por CPF
   */
  async getByCPF(cpf: string): Promise<Responsavel | null> {
    try {
      const response = await api.get(`/responsaveis/cpf/${cpf}`);
      return response.data.data;
    } catch (error: any) {
      if (error.response?.status === 404) {
        return null;
      }
      throw error;
    }
  }

  /**
   * Cria novo responsável
   */
  async create(data: CreateResponsavelData): Promise<Responsavel> {
    const response = await api.post('/responsaveis', data);
    return response.data.data;
  }

  /**
   * Atualiza responsável
   */
  async update(id: string, data: UpdateResponsavelData): Promise<Responsavel> {
    const response = await api.put(`/responsaveis/${id}`, data);
    return response.data.data;
  }

  /**
   * Deleta responsável (soft delete)
   */
  async delete(id: string): Promise<void> {
    await api.delete(`/responsaveis/${id}`);
  }

  /**
   * Lista alunos de um responsável
   */
  async getAlunos(id: string): Promise<AlunoVinculo[]> {
    const response = await api.get(`/responsaveis/${id}/alunos`);
    return response.data.data;
  }

  /**
   * Cria vínculo entre responsável e aluno
   */
  async createVinculo(responsavelId: string, data: CreateVinculoData): Promise<any> {
    const response = await api.post(`/responsaveis/${responsavelId}/vinculos`, data);
    return response.data.data;
  }

  /**
   * Atualiza vínculo
   */
  async updateVinculo(vinculoId: string, data: UpdateVinculoData): Promise<any> {
    const response = await api.patch(`/responsaveis/vinculos/${vinculoId}`, data);
    return response.data.data;
  }

  /**
   * Remove vínculo
   */
  async removeVinculo(vinculoId: string): Promise<void> {
    await api.delete(`/responsaveis/vinculos/${vinculoId}`);
  }
}

export default new ResponsaveisService();

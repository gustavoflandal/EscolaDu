import api from './api';
import type { User, Role } from '@/types';

export interface CreateUserData {
  email: string;
  password: string;
  name: string;
  cpf?: string;
  phone?: string;
  avatar?: string;
  roleIds: string[];
}

export interface UpdateUserData {
  email?: string;
  password?: string;
  name?: string;
  cpf?: string;
  phone?: string;
  avatar?: string;
  active?: boolean;
  roleIds?: string[];
}

export interface ListUsersParams {
  page?: number;
  limit?: number;
  search?: string;
  active?: boolean;
  roleId?: string;
}

export interface ListUsersResponse {
  data: User[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

class UsersService {
  /**
   * Lista usuários com filtros e paginação
   */
  async list(params?: ListUsersParams): Promise<ListUsersResponse> {
    const response = await api.get('/users', { params });
    // Backend retorna: { success: true, data: { data: [], meta: {} } }
    const result = response.data.data;
    return {
      data: result.data,
      pagination: result.meta
    };
  }

  /**
   * Busca usuário por ID
   */
  async getById(id: string): Promise<User> {
    const response = await api.get(`/users/${id}`);
    return response.data.data;
  }

  /**
   * Cria novo usuário
   */
  async create(data: CreateUserData): Promise<User> {
    const response = await api.post('/users', data);
    return response.data.data;
  }

  /**
   * Atualiza usuário
   */
  async update(id: string, data: UpdateUserData): Promise<User> {
    const response = await api.put(`/users/${id}`, data);
    return response.data.data;
  }

  /**
   * Deleta usuário (soft delete)
   */
  async delete(id: string): Promise<void> {
    await api.delete(`/users/${id}`);
  }

  /**
   * Busca permissões de um usuário
   */
  async getPermissions(id: string): Promise<string[]> {
    const response = await api.get(`/users/${id}/permissions`);
    return response.data.data;
  }
}

export default new UsersService();

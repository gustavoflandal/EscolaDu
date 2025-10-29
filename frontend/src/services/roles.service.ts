import api from './api';

export interface Permission {
  id: string;
  resource: string;
  action: string;
  description?: string;
}

export interface PermissionGroup {
  resource: string;
  permissions: Permission[];
}

export interface Role {
  id: string;
  name: string;
  description?: string;
  active: boolean;
  permissions: Permission[];
  _count?: {
    users: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface CreateRoleData {
  name: string;
  description?: string;
  permissionIds: string[];
}

export interface UpdateRoleData {
  name?: string;
  description?: string;
  active?: boolean;
  permissionIds?: string[];
}

class RolesService {
  /**
   * Lista todos os perfis
   */
  async list(): Promise<Role[]> {
    const response = await api.get('/roles');
    return response.data.data;
  }

  /**
   * Busca perfil por ID
   */
  async getById(id: string): Promise<Role> {
    const response = await api.get(`/roles/${id}`);
    return response.data.data;
  }

  /**
   * Cria novo perfil
   */
  async create(data: CreateRoleData): Promise<Role> {
    const response = await api.post('/roles', data);
    return response.data.data;
  }

  /**
   * Atualiza perfil
   */
  async update(id: string, data: UpdateRoleData): Promise<Role> {
    const response = await api.put(`/roles/${id}`, data);
    return response.data.data;
  }

  /**
   * Deleta perfil
   */
  async delete(id: string): Promise<void> {
    await api.delete(`/roles/${id}`);
  }
}

class PermissionsService {
  /**
   * Lista todas as permissões
   */
  async list(): Promise<Permission[]> {
    const response = await api.get('/roles/permissions/all');
    return response.data.data;
  }

  /**
   * Lista permissões agrupadas por recurso
   */
  async listGrouped(): Promise<PermissionGroup[]> {
    const response = await api.get('/roles/permissions/grouped');
    return response.data.data;
  }

  /**
   * Busca permissão por ID
   */
  async getById(id: string): Promise<Permission> {
    const response = await api.get(`/roles/permissions/${id}`);
    return response.data.data;
  }
}

export const rolesService = new RolesService();
export const permissionsService = new PermissionsService();

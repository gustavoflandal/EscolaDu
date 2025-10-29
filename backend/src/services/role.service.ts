import { prisma } from '../config/database';
import { logger } from '../config/logger';

export interface CreateRoleData {
  name: string;
  description?: string;
  permissionIds?: string[];
}

export interface UpdateRoleData {
  name?: string;
  description?: string;
  active?: boolean;
  permissionIds?: string[];
}

export class RoleService {
  /**
   * Lista todos os perfis
   */
  async list() {
    const roles = await prisma.role.findMany({
      where: { active: true },
      select: {
        id: true,
        name: true,
        description: true,
        active: true,
        createdAt: true,
        updatedAt: true,
        permissions: {
          select: {
            permission: {
              select: {
                id: true,
                resource: true,
                action: true,
                description: true,
              },
            },
          },
        },
        _count: {
          select: {
            users: true,
          },
        },
      },
      orderBy: { name: 'asc' },
    });

    // Transformar estrutura de permissions
    return roles.map(role => ({
      ...role,
      permissions: role.permissions.map(rp => rp.permission)
    }));
  }

  /**
   * Busca perfil por ID
   */
  async findById(id: string) {
    const role = await prisma.role.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        description: true,
        active: true,
        createdAt: true,
        updatedAt: true,
        permissions: {
          select: {
            permission: {
              select: {
                id: true,
                resource: true,
                action: true,
                description: true,
              },
            },
          },
        },
        users: {
          select: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
    });

    if (!role) {
      throw new Error('Perfil não encontrado');
    }

    // Transformar estrutura de permissions e users
    return {
      ...role,
      permissions: role.permissions.map(rp => rp.permission),
      users: role.users.map(ru => ru.user)
    };
  }

  /**
   * Cria novo perfil
   */
  async create(data: CreateRoleData) {
    // Verifica se nome já existe
    const existingRole = await prisma.role.findUnique({
      where: { name: data.name },
    });

    if (existingRole) {
      throw new Error('Já existe um perfil com este nome');
    }

    const role = await prisma.role.create({
      data: {
        name: data.name,
        description: data.description,
        permissions: data.permissionIds
          ? {
              create: data.permissionIds.map((permissionId) => ({
                permissionId,
              })),
            }
          : undefined,
      },
      select: {
        id: true,
        name: true,
        description: true,
        active: true,
        permissions: {
          select: {
            permission: {
              select: {
                id: true,
                resource: true,
                action: true,
                description: true,
              },
            },
          },
        },
      },
    });

    logger.info(`Perfil criado: ${role.name}`);

    return role;
  }

  /**
   * Atualiza perfil
   */
  async update(id: string, data: UpdateRoleData) {
    const existingRole = await prisma.role.findUnique({
      where: { id },
    });

    if (!existingRole) {
      throw new Error('Perfil não encontrado');
    }

    // Verifica nome se sendo alterado
    if (data.name && data.name !== existingRole.name) {
      const nameInUse = await prisma.role.findUnique({
        where: { name: data.name },
      });

      if (nameInUse) {
        throw new Error('Já existe um perfil com este nome');
      }
    }

    // Atualiza permissões se fornecidas
    if (data.permissionIds) {
      await prisma.rolePermission.deleteMany({
        where: { roleId: id },
      });

      await prisma.rolePermission.createMany({
        data: data.permissionIds.map((permissionId) => ({
          roleId: id,
          permissionId,
        })),
      });
    }

    const role = await prisma.role.update({
      where: { id },
      data: {
        name: data.name,
        description: data.description,
        active: data.active,
      },
      select: {
        id: true,
        name: true,
        description: true,
        active: true,
        permissions: {
          select: {
            permission: {
              select: {
                id: true,
                resource: true,
                action: true,
                description: true,
              },
            },
          },
        },
      },
    });

    logger.info(`Perfil atualizado: ${role.name}`);

    return role;
  }

  /**
   * Deleta perfil (soft delete)
   */
  async delete(id: string) {
    const role = await prisma.role.findUnique({
      where: { id },
      select: {
        name: true,
        _count: {
          select: {
            users: true,
          },
        },
      },
    });

    if (!role) {
      throw new Error('Perfil não encontrado');
    }

    if (role._count.users > 0) {
      throw new Error('Não é possível excluir um perfil que possui usuários vinculados');
    }

    await prisma.role.update({
      where: { id },
      data: { active: false },
    });

    logger.info(`Perfil inativado: ${role.name}`);
  }
}

export class PermissionService {
  /**
   * Lista todas as permissões
   */
  async list() {
    const permissions = await prisma.permission.findMany({
      select: {
        id: true,
        resource: true,
        action: true,
        description: true,
        createdAt: true,
      },
      orderBy: [{ resource: 'asc' }, { action: 'asc' }],
    });

    return permissions;
  }

  /**
   * Busca permissão por ID
   */
  async findById(id: string) {
    const permission = await prisma.permission.findUnique({
      where: { id },
    });

    if (!permission) {
      throw new Error('Permissão não encontrada');
    }

    return permission;
  }

  /**
   * Lista permissões agrupadas por recurso
   */
  async listGroupedByResource() {
    const permissions = await this.list();

    const grouped = permissions.reduce((acc, permission) => {
      if (!acc[permission.resource]) {
        acc[permission.resource] = [];
      }
      acc[permission.resource].push(permission);
      return acc;
    }, {} as Record<string, typeof permissions>);

    return Object.entries(grouped).map(([resource, perms]) => ({
      resource,
      permissions: perms,
    }));
  }
}

export const roleService = new RoleService();
export const permissionService = new PermissionService();

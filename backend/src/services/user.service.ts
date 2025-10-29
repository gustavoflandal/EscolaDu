import { prisma } from '../config/database';
import { logger } from '../config/logger';
import { hashPassword } from '../utils/password.util';

export interface CreateUserData {
  email: string;
  password: string;
  name: string;
  cpf?: string | null;
  phone?: string | null;
  avatar?: string | null;
  roleIds?: string[];
}

export interface UpdateUserData {
  email?: string;
  name?: string;
  cpf?: string | null;
  phone?: string | null;
  avatar?: string | null;
  active?: boolean;
  roleIds?: string[];
}

export interface ListUsersFilters {
  page?: number;
  limit?: number;
  search?: string;
  active?: boolean;
  roleId?: string;
}

export class UserService {
  /**
   * Lista usuários com filtros e paginação
   */
  async list(filters: ListUsersFilters) {
    const page = filters.page || 1;
    const limit = typeof filters.limit === 'number' ? filters.limit : 20;
    const isPaginated = limit > 0;
    const skip = isPaginated ? (page - 1) * limit : undefined;

    const where: any = {};

    if (filters.active !== undefined) {
      where.active = filters.active;
    }

    if (filters.search) {
      where.OR = [
        { name: { contains: filters.search } },
        { email: { contains: filters.search } },
        { cpf: { contains: filters.search } },
      ];
    }

    if (filters.roleId) {
      where.roles = {
        some: {
          roleId: filters.roleId,
        },
      };
    }

    const [usersRaw, total] = await Promise.all([
      prisma.user.findMany({
        where,
        ...(isPaginated ? { skip } : {}),
        ...(isPaginated ? { take: limit } : {}),
        select: {
          id: true,
          email: true,
          name: true,
          cpf: true,
          phone: true,
          avatar: true,
          active: true,
          createdAt: true,
          updatedAt: true,
          roles: {
            select: {
              role: {
                select: {
                  id: true,
                  name: true,
                  description: true,
                },
              },
            },
          },
        },
        orderBy: { name: 'asc' },
      }),
      prisma.user.count({ where }),
    ]);

    // Transformar estrutura de roles
    const users = usersRaw.map(user => ({
      ...user,
      roles: user.roles.map(ur => ur.role)
    }));

    if (!isPaginated) {
      return {
        data: users,
        meta: {
          page: 1,
          limit: total,
          total,
          totalPages: 1,
        },
      };
    }

    return {
      data: users,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Busca usuário por ID
   */
  async findById(id: string) {
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
        cpf: true,
        phone: true,
        avatar: true,
        active: true,
        createdAt: true,
        updatedAt: true,
        roles: {
          select: {
            role: {
              select: {
                id: true,
                name: true,
                description: true,
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
            },
          },
        },
        professor: {
          select: {
            id: true,
          },
        },
        responsavel: {
          select: {
            id: true,
          },
        },
      },
    });

    if (!user) {
      throw new Error('Usuário não encontrado');
    }

    // Transformar estrutura de roles
    return {
      ...user,
      roles: user.roles.map(ur => ({
        ...ur.role,
        permissions: ur.role.permissions.map(rp => rp.permission)
      }))
    };
  }

  /**
   * Cria novo usuário
   */
  async create(data: CreateUserData) {
    // Verifica se email já existe
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      throw new Error('Email já está em uso');
    }

    // Verifica CPF se fornecido
    if (data.cpf) {
      const existingCpf = await prisma.user.findUnique({
        where: { cpf: data.cpf },
      });

      if (existingCpf) {
        throw new Error('CPF já está cadastrado');
      }
    }

    // Hash da senha
    const hashedPassword = await hashPassword(data.password);

    // Cria usuário
    const user = await prisma.user.create({
      data: {
        email: data.email,
        password: hashedPassword,
        name: data.name,
        cpf: data.cpf,
        phone: data.phone,
        avatar: data.avatar,
        roles: data.roleIds
          ? {
              create: data.roleIds.map((roleId) => ({
                roleId,
              })),
            }
          : undefined,
      },
      select: {
        id: true,
        email: true,
        name: true,
        cpf: true,
        phone: true,
        avatar: true,
        active: true,
        createdAt: true,
        roles: {
          select: {
            role: {
              select: {
                id: true,
                name: true,
                description: true,
              },
            },
          },
        },
      },
    });

    logger.info(`Usuário criado: ${user.name} (${user.email})`);

    return user;
  }

  /**
   * Atualiza usuário
   */
  async update(id: string, data: UpdateUserData) {
    // Verifica se usuário existe
    const existingUser = await prisma.user.findUnique({
      where: { id },
    });

    if (!existingUser) {
      throw new Error('Usuário não encontrado');
    }

    // Verifica email se sendo alterado
    if (data.email && data.email !== existingUser.email) {
      const emailInUse = await prisma.user.findUnique({
        where: { email: data.email },
      });

      if (emailInUse) {
        throw new Error('Email já está em uso');
      }
    }

    // Verifica CPF se sendo alterado
    if (data.cpf && data.cpf !== existingUser.cpf) {
      const cpfInUse = await prisma.user.findUnique({
        where: { cpf: data.cpf },
      });

      if (cpfInUse) {
        throw new Error('CPF já está cadastrado');
      }
    }

    // Atualiza roles se fornecidos
    if (data.roleIds) {
      await prisma.userRole.deleteMany({
        where: { userId: id },
      });

      await prisma.userRole.createMany({
        data: data.roleIds.map((roleId) => ({
          userId: id,
          roleId,
        })),
      });
    }

    // Atualiza usuário
    const user = await prisma.user.update({
      where: { id },
      data: {
        email: data.email,
        name: data.name,
        cpf: data.cpf,
        phone: data.phone,
        avatar: data.avatar,
        active: data.active,
      },
      select: {
        id: true,
        email: true,
        name: true,
        cpf: true,
        phone: true,
        avatar: true,
        active: true,
        updatedAt: true,
        roles: {
          select: {
            role: {
              select: {
                id: true,
                name: true,
                description: true,
              },
            },
          },
        },
      },
    });

    logger.info(`Usuário atualizado: ${user.name} (${user.email})`);

    return user;
  }

  /**
   * Deleta usuário (soft delete)
   */
  async delete(id: string) {
    const user = await prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new Error('Usuário não encontrado');
    }

    await prisma.user.update({
      where: { id },
      data: { active: false },
    });

    logger.info(`Usuário inativado: ${user.name} (${user.email})`);
  }

  /**
   * Busca permissões de um usuário
   */
  async getUserPermissions(userId: string): Promise<string[]> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        roles: {
          select: {
            role: {
              select: {
                permissions: {
                  select: {
                    permission: {
                      select: {
                        resource: true,
                        action: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!user) {
      return [];
    }

    const permissions = new Set<string>();

    user.roles.forEach((userRole) => {
      userRole.role.permissions.forEach((rolePermission) => {
        const { resource, action } = rolePermission.permission;
        permissions.add(`${resource}:${action}`);
      });
    });

    return Array.from(permissions);
  }

  /**
   * Verifica se usuário tem permissão específica
   */
  async hasPermission(userId: string, resource: string, action: string): Promise<boolean> {
    const permissions = await this.getUserPermissions(userId);
    return permissions.includes(`${resource}:${action}`);
  }
}

export const userService = new UserService();

import { Response, NextFunction } from 'express';
import { AuthRequest } from './auth.middleware';
import { forbiddenResponse } from '../utils/response.util';
import { prisma } from '../config/database';
import { logger } from '../config/logger';

/**
 * Middleware de permissões
 * Verifica se o usuário tem a permissão necessária
 */
export function requirePermission(resource: string, action: string) {
  return async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const userId = req.userId;

      if (!userId) {
        forbiddenResponse(res, 'Usuário não autenticado');
        return;
      }

      // Busca usuário com roles e permissões
      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: {
          roles: {
            include: {
              role: {
                include: {
                  permissions: {
                    include: {
                      permission: true,
                    },
                  },
                },
              },
            },
          },
        },
      });

      if (!user || !user.active) {
        forbiddenResponse(res, 'Usuário inativo ou não encontrado');
        return;
      }

      // Verifica se tem a permissão
      const hasPermission = user.roles.some((userRole) =>
        userRole.role.permissions.some(
          (rolePermission) =>
            rolePermission.permission.resource === resource &&
            rolePermission.permission.action === action
        )
      );

      if (!hasPermission) {
        logger.warn(
          `Usuário ${user.email} tentou acessar ${resource}:${action} sem permissão`
        );
        forbiddenResponse(
          res,
          `Você não tem permissão para ${action} ${resource}`
        );
        return;
      }

      next();
    } catch (error) {
      logger.error('Erro ao verificar permissões:', error);
      forbiddenResponse(res, 'Erro ao verificar permissões');
    }
  };
}

/**
 * Verifica se o usuário tem qualquer uma das permissões
 */
export function requireAnyPermission(permissions: Array<{ resource: string; action: string }>) {
  return async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const userId = req.userId;

      if (!userId) {
        forbiddenResponse(res, 'Usuário não autenticado');
        return;
      }

      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: {
          roles: {
            include: {
              role: {
                include: {
                  permissions: {
                    include: {
                      permission: true,
                    },
                  },
                },
              },
            },
          },
        },
      });

      if (!user || !user.active) {
        forbiddenResponse(res, 'Usuário inativo ou não encontrado');
        return;
      }

      // Verifica se tem pelo menos uma das permissões
      const hasPermission = user.roles.some((userRole) =>
        userRole.role.permissions.some((rolePermission) =>
          permissions.some(
            (p) =>
              rolePermission.permission.resource === p.resource &&
              rolePermission.permission.action === p.action
          )
        )
      );

      if (!hasPermission) {
        forbiddenResponse(res, 'Você não tem permissão para acessar este recurso');
        return;
      }

      next();
    } catch (error) {
      logger.error('Erro ao verificar permissões:', error);
      forbiddenResponse(res, 'Erro ao verificar permissões');
    }
  };
}

/**
 * Verifica se o usuário tem um role específico
 */
export function requireRole(roleName: string) {
  return async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const userId = req.userId;

      if (!userId) {
        forbiddenResponse(res, 'Usuário não autenticado');
        return;
      }

      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: {
          roles: {
            include: {
              role: true,
            },
          },
        },
      });

      if (!user || !user.active) {
        forbiddenResponse(res, 'Usuário inativo ou não encontrado');
        return;
      }

      const hasRole = user.roles.some((userRole) => userRole.role.name === roleName);

      if (!hasRole) {
        forbiddenResponse(res, `Você precisa ter o perfil de ${roleName}`);
        return;
      }

      next();
    } catch (error) {
      logger.error('Erro ao verificar role:', error);
      forbiddenResponse(res, 'Erro ao verificar permissões');
    }
  };
}

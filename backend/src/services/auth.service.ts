import { prisma } from '../config/database';
import { hashPassword, comparePassword } from '../utils/password.util';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../utils/jwt.util';
import { logger } from '../config/logger';

export interface LoginCredentials {
  email: string;
  senha: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    email: string;
    name: string;
  };
}

export class AuthService {
  /**
   * Realiza login do usuário
   */
  async login(credentials: LoginCredentials): Promise<AuthTokens> {
    const { email, senha } = credentials;

    // Busca usuário
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        password: true,
        name: true,
        active: true,
      },
    });

    if (!user) {
      throw new Error('Email ou senha incorretos');
    }

    if (!user.active) {
      throw new Error('Usuário inativo');
    }

    // Verifica senha
    const passwordMatch = await comparePassword(senha, user.password);

    if (!passwordMatch) {
      throw new Error('Email ou senha incorretos');
    }

    // Gera tokens
    const accessToken = generateAccessToken({
      userId: user.id,
      email: user.email,
    });

    const refreshToken = generateRefreshToken({
      userId: user.id,
      email: user.email,
    });

    logger.info(`Login bem-sucedido: ${user.email}`);

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    };
  }

  /**
   * Atualiza tokens usando refresh token
   */
  async refreshTokens(refreshToken: string): Promise<AuthTokens> {
    try {
      // Verifica refresh token
      const payload = verifyRefreshToken(refreshToken);

      // Busca usuário
      const user = await prisma.user.findUnique({
        where: { id: payload.userId },
        select: {
          id: true,
          email: true,
          name: true,
          active: true,
        },
      });

      if (!user || !user.active) {
        throw new Error('Usuário não encontrado ou inativo');
      }

      // Gera novos tokens
      const newAccessToken = generateAccessToken({
        userId: user.id,
        email: user.email,
      });

      const newRefreshToken = generateRefreshToken({
        userId: user.id,
        email: user.email,
      });

      return {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
        },
      };
    } catch (error) {
      throw new Error('Refresh token inválido ou expirado');
    }
  }

  /**
   * Busca dados do usuário autenticado
   */
  async me(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
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
          include: {
            role: {
              select: {
                id: true,
                name: true,
                description: true,
                permissions: {
                  include: {
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
      },
    });

    if (!user) {
      throw new Error('Usuário não encontrado');
    }

    // Mapeia roles e suas permissões
    const rolesWithPermissions = user.roles.map((ur) => ({
      ...ur.role,
      permissions: ur.role.permissions.map((rp) => rp.permission),
    }));

    // Coleta todas as permissões únicas do usuário
    const allPermissions = rolesWithPermissions.reduce((acc, role) => {
      role.permissions.forEach((permission) => {
        const key = `${permission.resource}:${permission.action}`;
        if (!acc.some((p) => `${p.resource}:${p.action}` === key)) {
          acc.push(permission);
        }
      });
      return acc;
    }, [] as any[]);

    return {
      ...user,
      roles: rolesWithPermissions,
      permissions: allPermissions,
    };
  }

  /**
   * Altera senha do usuário
   */
  async changePassword(
    userId: string,
    currentPassword: string,
    newPassword: string
  ): Promise<void> {
    // Busca usuário
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { password: true },
    });

    if (!user) {
      throw new Error('Usuário não encontrado');
    }

    // Verifica senha atual
    const passwordMatch = await comparePassword(currentPassword, user.password);

    if (!passwordMatch) {
      throw new Error('Senha atual incorreta');
    }

    // Hash nova senha
    const hashedPassword = await hashPassword(newPassword);

    // Atualiza senha
    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });

    logger.info(`Senha alterada: userId=${userId}`);
  }
}

export const authService = new AuthService();

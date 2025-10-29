import { Request, Response } from 'express';
import { authService } from '../services/auth.service';
import { successResponse, errorResponse } from '../utils/response.util';
import { AuthRequest } from '../middleware/auth.middleware';
import { logger } from '../config/logger';

export class AuthController {
  /**
   * POST /api/auth/login
   * Login do usuário
   */
  async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, senha, password } = req.body;

      const result = await authService.login({ email, senha: senha || password });

      successResponse(res, result, 'Login realizado com sucesso');
    } catch (error: any) {
      logger.error('Erro no login:', error);
      errorResponse(res, 'LOGIN_ERROR', error.message, 401);
    }
  }

  /**
   * POST /api/auth/refresh
   * Atualiza tokens
   */
  async refreshToken(req: Request, res: Response): Promise<void> {
    try {
      const { refreshToken } = req.body;

      const result = await authService.refreshTokens(refreshToken);

      successResponse(res, result, 'Tokens atualizados com sucesso');
    } catch (error: any) {
      logger.error('Erro ao atualizar token:', error);
      errorResponse(res, 'REFRESH_TOKEN_ERROR', error.message, 401);
    }
  }

  /**
   * GET /api/auth/me
   * Busca dados do usuário autenticado
   */
  async me(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.userId!;

      const user = await authService.me(userId);

      successResponse(res, user);
    } catch (error: any) {
      logger.error('Erro ao buscar usuário:', error);
      errorResponse(res, 'ME_ERROR', error.message, 400);
    }
  }

  /**
   * POST /api/auth/change-password
   * Altera senha do usuário
   */
  async changePassword(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.userId!;
      const { currentPassword, newPassword } = req.body;

      await authService.changePassword(userId, currentPassword, newPassword);

      successResponse(res, null, 'Senha alterada com sucesso');
    } catch (error: any) {
      logger.error('Erro ao alterar senha:', error);
      errorResponse(res, 'CHANGE_PASSWORD_ERROR', error.message, 400);
    }
  }

  /**
   * POST /api/auth/logout
   * Logout (client-side token removal)
   */
  async logout(_req: AuthRequest, res: Response): Promise<void> {
    successResponse(res, null, 'Logout realizado com sucesso');
  }
}

export const authController = new AuthController();

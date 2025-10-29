import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '../utils/jwt.util';
import { unauthorizedResponse } from '../utils/response.util';
import { logger } from '../config/logger';

export interface AuthRequest extends Request {
  userId?: string;
  userEmail?: string;
}

/**
 * Middleware de autenticação
 * Verifica se o token JWT é válido e extrai o userId
 */
export function authMiddleware(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void {
  try {
    // Extrai token do header
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      unauthorizedResponse(res, 'Token não fornecido');
      return;
    }

    // Formato: "Bearer {token}"
    const [bearer, token] = authHeader.split(' ');

    if (bearer !== 'Bearer' || !token) {
      unauthorizedResponse(res, 'Formato de token inválido');
      return;
    }

    // Verifica token
    const payload = verifyAccessToken(token);

    // Anexa userId na requisição
    req.userId = payload.userId;
    req.userEmail = payload.email;

    next();
  } catch (error: any) {
    logger.error('Erro na autenticação:', error);

    if (error.name === 'TokenExpiredError') {
      unauthorizedResponse(res, 'Token expirado');
      return;
    }

    if (error.name === 'JsonWebTokenError') {
      unauthorizedResponse(res, 'Token inválido');
      return;
    }

    unauthorizedResponse(res, 'Erro na autenticação');
  }
}

/**
 * Middleware opcional de autenticação
 * Tenta autenticar, mas não bloqueia se falhar
 */
export function optionalAuthMiddleware(
  req: AuthRequest,
  _res: Response,
  next: NextFunction
): void {
  try {
    const authHeader = req.headers.authorization;

    if (authHeader) {
      const [bearer, token] = authHeader.split(' ');

      if (bearer === 'Bearer' && token) {
        const payload = verifyAccessToken(token);
        req.userId = payload.userId;
        req.userEmail = payload.email;
      }
    }

    next();
  } catch (error) {
    // Ignora erro e continua sem autenticação
    next();
  }
}

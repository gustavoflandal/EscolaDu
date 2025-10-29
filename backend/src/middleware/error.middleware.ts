import { Request, Response, NextFunction } from 'express';
import { errorResponse } from '../utils/response.util';
import { logger } from '../config/logger';
import { Prisma } from '@prisma/client';

/**
 * Middleware de tratamento de erros
 * Deve ser o último middleware registrado
 */
export function errorMiddleware(
  error: Error,
  req: Request,
  res: Response,
  _next: NextFunction
): void {
  logger.error('Erro capturado:', {
    error: error.message,
    stack: error.stack,
    path: req.path,
    method: req.method,
  });

  // Erro do Prisma
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    // Violação de unique constraint
    if (error.code === 'P2002') {
      const field = (error.meta?.target as string[])?.join(', ') || 'campo';
      errorResponse(
        res,
        'DUPLICATE_ENTRY',
        `${field} já está em uso`,
        409
      );
      return;
    }

    // Registro não encontrado
    if (error.code === 'P2025') {
      errorResponse(
        res,
        'NOT_FOUND',
        'Registro não encontrado',
        404
      );
      return;
    }

    // Violação de foreign key
    if (error.code === 'P2003') {
      errorResponse(
        res,
        'FOREIGN_KEY_VIOLATION',
        'Operação violaria integridade referencial',
        400
      );
      return;
    }
  }

  // Erro de validação do Prisma
  if (error instanceof Prisma.PrismaClientValidationError) {
    errorResponse(
      res,
      'VALIDATION_ERROR',
      'Erro de validação dos dados',
      400
    );
    return;
  }

  // Erro genérico
  errorResponse(
    res,
    'INTERNAL_ERROR',
    process.env.NODE_ENV === 'production'
      ? 'Erro interno do servidor'
      : error.message,
    500,
    process.env.NODE_ENV === 'development' ? error.stack : undefined
  );
}

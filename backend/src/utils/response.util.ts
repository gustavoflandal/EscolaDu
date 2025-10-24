import { Response } from 'express';

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
  };
}

/**
 * Resposta de sucesso
 */
export function successResponse<T>(
  res: Response,
  data: T,
  message?: string,
  statusCode: number = 200,
  meta?: ApiResponse['meta']
): Response {
  const response: ApiResponse<T> = {
    success: true,
    data,
    message,
    meta,
  };
  return res.status(statusCode).json(response);
}

/**
 * Resposta de erro
 */
export function errorResponse(
  res: Response,
  code: string,
  message: string,
  statusCode: number = 400,
  details?: any
): Response {
  const response: ApiResponse = {
    success: false,
    error: {
      code,
      message,
      details,
    },
  };
  return res.status(statusCode).json(response);
}

/**
 * Resposta de validação
 */
export function validationErrorResponse(
  res: Response,
  errors: any[]
): Response {
  return errorResponse(
    res,
    'VALIDATION_ERROR',
    'Erro de validação',
    400,
    errors
  );
}

/**
 * Resposta não autorizado
 */
export function unauthorizedResponse(
  res: Response,
  message: string = 'Não autorizado'
): Response {
  return errorResponse(res, 'UNAUTHORIZED', message, 401);
}

/**
 * Resposta proibido
 */
export function forbiddenResponse(
  res: Response,
  message: string = 'Acesso negado'
): Response {
  return errorResponse(res, 'FORBIDDEN', message, 403);
}

/**
 * Resposta não encontrado
 */
export function notFoundResponse(
  res: Response,
  message: string = 'Recurso não encontrado'
): Response {
  return errorResponse(res, 'NOT_FOUND', message, 404);
}

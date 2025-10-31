import { Request, Response, NextFunction } from 'express';
import { Schema } from 'joi';
import { ZodSchema, ZodError } from 'zod';
import { validationErrorResponse } from '../utils/response.util';

/**
 * Middleware de validação Joi
 * Valida body, query ou params usando schema Joi
 */
export function validation(schema: Schema, property: 'body' | 'query' | 'params' = 'body') {
  return (req: Request, res: Response, next: NextFunction): void => {
    const { error, value } = schema.validate(req[property], {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const errors = error.details.map((detail) => ({
        field: detail.path.join('.'),
        message: detail.message,
      }));

      validationErrorResponse(res, errors);
      return;
    }

    // Substitui o objeto validado
    req[property] = value;

    next();
  };
}

/**
 * Middleware de validação Zod
 * Valida request inteiro (body, query, params) usando schema Zod
 */
export function validateZod(schema: ZodSchema) {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const validated = await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      }) as any;

      // Substitui os objetos validados
      req.body = validated.body || req.body;
      req.query = validated.query || req.query;
      req.params = validated.params || req.params;

      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errors = error.issues.map((err) => ({
          field: err.path.join('.'),
          message: err.message,
        }));

        validationErrorResponse(res, errors);
        return;
      }

      next(error);
    }
  };
}

// Alias para compatibilidade
export const validate = validation;

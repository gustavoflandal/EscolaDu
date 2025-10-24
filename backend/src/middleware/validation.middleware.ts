import { Request, Response, NextFunction } from 'express';
import { Schema } from 'joi';
import { validationErrorResponse } from '../utils/response.util';

/**
 * Middleware de validação
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

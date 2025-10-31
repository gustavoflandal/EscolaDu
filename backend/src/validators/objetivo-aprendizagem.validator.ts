import { z } from 'zod';

/**
 * Schema para criar objetivo de aprendizagem
 */
export const createObjetivoSchema = z.object({
  body: z.object({
    codigoBNCC: z
      .string()
      .min(1, 'Código BNCC é obrigatório')
      .max(50, 'Código BNCC deve ter no máximo 50 caracteres')
      .regex(/^[A-Z0-9-]+$/, 'Código BNCC deve conter apenas letras maiúsculas, números e hífens')
      .transform((val) => val.toUpperCase().trim()),
    descricao: z
      .string()
      .min(10, 'Descrição deve ter no mínimo 10 caracteres')
      .max(5000, 'Descrição deve ter no máximo 5000 caracteres')
      .transform((val) => val.trim()),
    programaEnsinoId: z
      .string()
      .uuid('ID do programa de ensino inválido'),
    ordem: z
      .number()
      .int('Ordem deve ser um número inteiro')
      .min(1, 'Ordem deve ser maior que zero')
      .optional(),
    competencia: z
      .union([
        z.string().max(1000, 'Competência deve ter no máximo 1000 caracteres').transform((val) => val.trim()),
        z.null(),
      ])
      .optional(),
    habilidade: z
      .union([
        z.string().max(1000, 'Habilidade deve ter no máximo 1000 caracteres').transform((val) => val.trim()),
        z.null(),
      ])
      .optional(),
    pontuacaoMeta: z
      .union([
        z.number().min(0, 'Pontuação meta deve ser maior ou igual a zero').max(999.99, 'Pontuação meta deve ser menor que 1000'),
        z.null(),
      ])
      .optional(),
  }),
});

/**
 * Schema para atualizar objetivo de aprendizagem
 */
export const updateObjetivoSchema = z.object({
  body: z.object({
    codigoBNCC: z
      .string()
      .min(1, 'Código BNCC é obrigatório')
      .max(50, 'Código BNCC deve ter no máximo 50 caracteres')
      .regex(/^[A-Z0-9-]+$/, 'Código BNCC deve conter apenas letras maiúsculas, números e hífens')
      .transform((val) => val.toUpperCase().trim())
      .optional(),
    descricao: z
      .string()
      .min(10, 'Descrição deve ter no mínimo 10 caracteres')
      .max(5000, 'Descrição deve ter no máximo 5000 caracteres')
      .transform((val) => val.trim())
      .optional(),
    ordem: z
      .number()
      .int('Ordem deve ser um número inteiro')
      .min(1, 'Ordem deve ser maior que zero')
      .optional(),
    competencia: z
      .union([
        z.string().max(1000, 'Competência deve ter no máximo 1000 caracteres').transform((val) => val.trim()),
        z.null(),
      ])
      .optional(),
    habilidade: z
      .union([
        z.string().max(1000, 'Habilidade deve ter no máximo 1000 caracteres').transform((val) => val.trim()),
        z.null(),
      ])
      .optional(),
    pontuacaoMeta: z
      .union([
        z.number().min(0, 'Pontuação meta deve ser maior ou igual a zero').max(999.99, 'Pontuação meta deve ser menor que 1000'),
        z.null(),
      ])
      .optional(),
    active: z
      .boolean()
      .optional(),
  }),
});

/**
 * Schema para listar objetivos de aprendizagem
 */
export const listObjetivosSchema = z.object({
  query: z.object({
    programaEnsinoId: z
      .string()
      .uuid('ID do programa de ensino inválido')
      .optional(),
    search: z
      .string()
      .optional(),
    active: z
      .string()
      .transform((val) => val === 'true')
      .optional(),
    page: z
      .string()
      .transform((val) => parseInt(val, 10))
      .refine((val) => val > 0, 'Página deve ser maior que zero')
      .optional(),
    limit: z
      .string()
      .transform((val) => parseInt(val, 10))
      .refine((val) => val > 0 && val <= 100, 'Limite deve estar entre 1 e 100')
      .optional(),
  }).optional(),
});

/**
 * Schema para reordenar objetivos
 */
export const reorderObjetivosSchema = z.object({
  body: z.object({
    objetivosOrdem: z.array(
      z.object({
        id: z.string().uuid('ID do objetivo inválido'),
        ordem: z.number().int('Ordem deve ser um número inteiro').min(1),
      })
    ),
  }),
});

export type CreateObjetivoInput = z.infer<typeof createObjetivoSchema>['body'];
export type UpdateObjetivoInput = z.infer<typeof updateObjetivoSchema>['body'];
export type ListObjetivosQuery = z.infer<typeof listObjetivosSchema>['query'];
export type ReorderObjetivosInput = z.infer<typeof reorderObjetivosSchema>['body'];

import { z } from 'zod';

// Schema para criar programa de ensino
export const createProgramaEnsinoSchema = z.object({
  body: z.object({
    codigo: z
      .string({ message: 'Código é obrigatório' })
      .min(3, 'Código deve ter no mínimo 3 caracteres')
      .max(50, 'Código deve ter no máximo 50 caracteres')
      .regex(/^[A-Z0-9-]+$/, 'Código deve conter apenas letras maiúsculas, números e hífens'),
    nome: z
      .string({ message: 'Nome é obrigatório' })
      .min(3, 'Nome deve ter no mínimo 3 caracteres')
      .max(200, 'Nome deve ter no máximo 200 caracteres'),
    descricao: z
      .string()
      .max(2000, 'Descrição deve ter no máximo 2000 caracteres')
      .optional(),
    disciplinaId: z
      .string({ message: 'ID da disciplina é obrigatório' })
      .uuid('ID da disciplina inválido'),
    serie: z
      .string({ message: 'Série é obrigatória' })
      .min(1, 'Série é obrigatória')
      .max(50, 'Série deve ter no máximo 50 caracteres'),
    periodo: z
      .string()
      .max(50, 'Período deve ter no máximo 50 caracteres')
      .optional()
      .nullable(),
    anoLetivo: z
      .number({ message: 'Ano letivo é obrigatório' })
      .int('Ano letivo deve ser um número inteiro')
      .min(2020, 'Ano letivo deve ser maior ou igual a 2020')
      .max(2100, 'Ano letivo deve ser menor ou igual a 2100'),
    cargaHoraria: z
      .number()
      .int('Carga horária deve ser um número inteiro')
      .positive('Carga horária deve ser positiva')
      .optional()
      .nullable(),
    observacoes: z
      .string()
      .max(2000, 'Observações devem ter no máximo 2000 caracteres')
      .optional()
      .nullable(),
    active: z
      .boolean()
      .optional(),
  }),
});

// Schema para atualizar programa de ensino
export const updateProgramaEnsinoSchema = z.object({
  params: z.object({
    id: z.string().uuid('ID inválido'),
  }),
  body: z.object({
    codigo: z
      .string()
      .min(3, 'Código deve ter no mínimo 3 caracteres')
      .max(50, 'Código deve ter no máximo 50 caracteres')
      .regex(/^[A-Z0-9-]+$/, 'Código deve conter apenas letras maiúsculas, números e hífens')
      .optional(),
    nome: z
      .string()
      .min(3, 'Nome deve ter no mínimo 3 caracteres')
      .max(200, 'Nome deve ter no máximo 200 caracteres')
      .optional(),
    descricao: z
      .string()
      .max(2000, 'Descrição deve ter no máximo 2000 caracteres')
      .optional()
      .nullable(),
    disciplinaId: z
      .string()
      .uuid('ID da disciplina inválido')
      .optional(),
    serie: z
      .string()
      .min(1, 'Série é obrigatória')
      .max(50, 'Série deve ter no máximo 50 caracteres')
      .optional(),
    periodo: z
      .string()
      .max(50, 'Período deve ter no máximo 50 caracteres')
      .optional()
      .nullable(),
    anoLetivo: z
      .number()
      .int('Ano letivo deve ser um número inteiro')
      .min(2020, 'Ano letivo deve ser maior ou igual a 2020')
      .max(2100, 'Ano letivo deve ser menor ou igual a 2100')
      .optional(),
    cargaHoraria: z
      .number()
      .int('Carga horária deve ser um número inteiro')
      .positive('Carga horária deve ser positiva')
      .optional()
      .nullable(),
    observacoes: z
      .string()
      .max(2000, 'Observações devem ter no máximo 2000 caracteres')
      .optional()
      .nullable(),
    active: z
      .boolean()
      .optional(),
  }),
});

// Schema para buscar programa de ensino por ID
export const getProgramaEnsinoSchema = z.object({
  params: z.object({
    id: z.string().uuid('ID inválido'),
  }),
});

// Schema para listar programas de ensino com filtros
export const listProgramasEnsinoSchema = z.object({
  query: z.object({
    page: z
      .string()
      .optional()
      .transform((val) => (val ? parseInt(val, 10) : 1)),
    limit: z
      .string()
      .optional()
      .transform((val) => (val ? parseInt(val, 10) : 10)),
    search: z
      .string()
      .optional(),
    disciplinaId: z
      .string()
      .uuid('ID da disciplina inválido')
      .optional(),
    serie: z
      .string()
      .optional(),
    periodo: z
      .string()
      .optional(),
    anoLetivo: z
      .string()
      .optional()
      .transform((val) => (val ? parseInt(val, 10) : undefined)),
    active: z
      .string()
      .optional()
      .transform((val) => {
        if (val === undefined) return undefined;
        return val === 'true';
      }),
  }),
});

// Schema para deletar programa de ensino
export const deleteProgramaEnsinoSchema = z.object({
  params: z.object({
    id: z.string().uuid('ID inválido'),
  }),
});

// Tipos TypeScript inferidos dos schemas
export type CreateProgramaEnsinoInput = z.infer<typeof createProgramaEnsinoSchema>['body'];
export type UpdateProgramaEnsinoInput = z.infer<typeof updateProgramaEnsinoSchema>['body'];
export type ListProgramasEnsinoQuery = z.infer<typeof listProgramasEnsinoSchema>['query'];

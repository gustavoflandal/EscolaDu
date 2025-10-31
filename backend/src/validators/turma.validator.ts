import { z } from 'zod';

/**
 * Schema de validação para criação de turma
 */
export const createTurmaSchema = z.object({
  body: z.object({
    codigo: z
      .string({ message: 'Código da turma é obrigatório' })
      .min(2, 'Código deve ter no mínimo 2 caracteres')
      .max(20, 'Código deve ter no máximo 20 caracteres'),

    nome: z
      .string({ message: 'Nome da turma é obrigatório' })
      .min(2, 'Nome da turma deve ter no mínimo 2 caracteres')
      .max(100, 'Nome da turma deve ter no máximo 100 caracteres'),

    anoLetivoId: z
      .string({ message: 'Ano letivo é obrigatório' })
      .uuid('ID do ano letivo deve ser um UUID válido'),

    serie: z
      .string({ message: 'Série é obrigatória' })
      .min(1, 'Série deve ter no mínimo 1 caractere')
      .max(50, 'Série deve ter no máximo 50 caracteres'),

    turno: z
      .enum(['MANHA', 'TARDE', 'NOITE', 'INTEGRAL'], {
        message: 'Turno é obrigatório. Valores válidos: MANHA, TARDE, NOITE, INTEGRAL',
      }),

    capacidadeMaxima: z
      .number()
      .int('Capacidade deve ser um número inteiro')
      .min(1, 'Capacidade deve ser no mínimo 1')
      .max(100, 'Capacidade deve ser no máximo 100')
      .optional(),

    sala: z
      .string()
      .max(50, 'Nome da sala deve ter no máximo 50 caracteres')
      .optional()
      .nullable(),

    professorRegenteId: z
      .string()
      .uuid('ID do professor deve ser um UUID válido')
      .optional()
      .nullable(),
  }),
});

/**
 * Schema de validação para atualização de turma
 */
export const updateTurmaSchema = z.object({
  body: z.object({
    codigo: z
      .string()
      .min(2, 'Código deve ter no mínimo 2 caracteres')
      .max(20, 'Código deve ter no máximo 20 caracteres')
      .optional(),

    nome: z
      .string()
      .min(2, 'Nome da turma deve ter no mínimo 2 caracteres')
      .max(100, 'Nome da turma deve ter no máximo 100 caracteres')
      .optional(),

    anoLetivoId: z
      .string()
      .uuid('ID do ano letivo deve ser um UUID válido')
      .optional(),

    serie: z
      .string()
      .min(1, 'Série deve ter no mínimo 1 caractere')
      .max(50, 'Série deve ter no máximo 50 caracteres')
      .optional(),

    turno: z
      .enum(['MANHA', 'TARDE', 'NOITE', 'INTEGRAL'])
      .optional(),

    capacidadeMaxima: z
      .number()
      .int('Capacidade deve ser um número inteiro')
      .min(1, 'Capacidade deve ser no mínimo 1')
      .max(100, 'Capacidade deve ser no máximo 100')
      .optional(),

    sala: z
      .string()
      .max(50, 'Nome da sala deve ter no máximo 50 caracteres')
      .optional()
      .nullable(),

    professorRegenteId: z
      .string()
      .uuid('ID do professor deve ser um UUID válido')
      .optional()
      .nullable(),

    active: z
      .boolean()
      .optional(),
  }),
});

/**
 * Schema de validação para adicionar aluno à turma
 */
export const addAlunoToTurmaSchema = z.object({
  body: z.object({
    alunoId: z
      .string({ message: 'ID do aluno é obrigatório' })
      .uuid('ID do aluno deve ser um UUID válido'),

    dataMatricula: z
      .string()
      .datetime('Data de matrícula deve estar no formato ISO 8601')
      .optional()
      .transform((val) => (val ? new Date(val) : undefined)),
  }),
});

/**
 * Schema de validação para parâmetros de consulta (listagem)
 */
export const queryTurmasSchema = z.object({
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
    
    ano: z
      .string()
      .optional()
      .transform((val) => (val ? parseInt(val, 10) : undefined)),
    
    periodo: z
      .enum(['MANHA', 'TARDE', 'NOITE', 'INTEGRAL'])
      .optional(),
    
    ativa: z
      .string()
      .optional()
      .transform((val) => {
        if (val === 'true') return true;
        if (val === 'false') return false;
        return undefined;
      }),
  }),
});

export type CreateTurmaInput = z.infer<typeof createTurmaSchema>['body'];
export type UpdateTurmaInput = z.infer<typeof updateTurmaSchema>['body'];
export type AddAlunoToTurmaInput = z.infer<typeof addAlunoToTurmaSchema>['body'];
export type QueryTurmasInput = z.infer<typeof queryTurmasSchema>['query'];

import { z } from 'zod';

// Schema para criar disciplina
export const createDisciplinaSchema = z.object({
  codigo: z.string({ message: 'Código é obrigatório' }).min(1, 'Código não pode ser vazio').max(10, 'Código deve ter no máximo 10 caracteres'),
  nome: z.string({ message: 'Nome é obrigatório' }).min(1, 'Nome não pode ser vazio').max(100, 'Nome deve ter no máximo 100 caracteres'),
  areaConhecimento: z.string().optional(),
  cargaHorariaSemanal: z.number({ message: 'Carga horária semanal é obrigatória' }).int('Deve ser um número inteiro').min(1, 'Deve ser no mínimo 1').max(40, 'Deve ser no máximo 40'),
  descricao: z.string().optional()
});

// Schema para atualizar disciplina
export const updateDisciplinaSchema = z.object({
  codigo: z.string().min(1).max(10).optional(),
  nome: z.string().min(1).max(100).optional(),
  areaConhecimento: z.string().optional().nullable(),
  cargaHorariaSemanal: z.number().int().min(1).max(40).optional(),
  descricao: z.string().optional().nullable(),
  active: z.boolean().optional()
});

// Schema para criar objetivo de aprendizagem
export const createObjetivoSchema = z.object({
  codigoBNCC: z.string({ message: 'Código BNCC é obrigatório' }).min(1, 'Código BNCC não pode ser vazio'),
  descricao: z.string({ message: 'Descrição é obrigatória' }).min(1, 'Descrição não pode ser vazia'),
  programaEnsinoId: z.string({ message: 'ID do programa de ensino é obrigatório' }).uuid('ID do programa de ensino inválido'),
  ordem: z.number().int().min(0).optional().default(0),
  competencia: z.string().optional(),
  habilidade: z.string().optional()
});

// Schema para atualizar objetivo
export const updateObjetivoSchema = z.object({
  codigoBNCC: z.string().min(1).optional(),
  descricao: z.string().min(1).optional(),
  programaEnsinoId: z.string().uuid('ID do programa de ensino inválido').optional(),
  ordem: z.number().int().min(0).optional(),
  competencia: z.string().optional().nullable(),
  habilidade: z.string().optional().nullable(),
  active: z.boolean().optional()
});

// Schema para filtros de disciplinas
export const queryDisciplinasSchema = z.object({
  search: z.string().optional(),
  areaConhecimento: z.string().optional(),
  ativa: z.string().optional().transform(val => {
    if (val === undefined) return undefined;
    return val === 'true';
  }),
  page: z.string().optional().transform(val => {
    if (!val) return 1;
    const parsed = parseInt(val, 10);
    return isNaN(parsed) ? 1 : parsed;
  }),
  limit: z.string().optional().transform(val => {
    if (!val) return 10;
    const parsed = parseInt(val, 10);
    return isNaN(parsed) ? 10 : parsed;
  })
});

// Schema para filtros de objetivos
export const queryObjetivosSchema = z.object({
  search: z.string().optional(),
  programaEnsinoId: z.string().uuid('ID do programa de ensino inválido').optional(),
  page: z.string().optional().transform(val => {
    if (!val) return 1;
    const parsed = parseInt(val, 10);
    return isNaN(parsed) ? 1 : parsed;
  }),
  limit: z.string().optional().transform(val => {
    if (!val) return 10;
    const parsed = parseInt(val, 10);
    return isNaN(parsed) ? 10 : parsed;
  })
});

export type CreateDisciplinaInput = z.infer<typeof createDisciplinaSchema>;
export type UpdateDisciplinaInput = z.infer<typeof updateDisciplinaSchema>;
export type CreateObjetivoInput = z.infer<typeof createObjetivoSchema>;
export type UpdateObjetivoInput = z.infer<typeof updateObjetivoSchema>;
export type QueryDisciplinasInput = z.infer<typeof queryDisciplinasSchema>;
export type QueryObjetivosInput = z.infer<typeof queryObjetivosSchema>;

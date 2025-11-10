import { z } from 'zod';

/**
 * Status possíveis para avaliação de objetivo
 */
export const statusAvaliacaoEnum = z.enum(['A', 'D', 'N', 'NA']).describe('Status deve ser A (Atingido), D (Em Desenvolvimento), N (Não Atingido) ou NA (Não Avaliado)');

/**
 * Tipos de evidência
 */
export const tipoEvidenciaEnum = z.enum(['FOTO', 'VIDEO', 'DOCUMENTO', 'TEXTO', 'ATIVIDADE', 'PROJETO']).describe('Tipo deve ser FOTO, VIDEO, DOCUMENTO, TEXTO, ATIVIDADE ou PROJETO');

/**
 * Schema para criação/atualização de avaliação de objetivo
 */
export const createAvaliacaoSchema = z.object({
  body: z.object({
    objetivoId: z.string().uuid({ message: 'objetivoId deve ser um UUID válido' }),
    alunoId: z.string().uuid({ message: 'alunoId deve ser um UUID válido' }),
    turmaId: z.string().uuid({ message: 'turmaId deve ser um UUID válido' }),
    status: statusAvaliacaoEnum,
    observacao: z.string().max(500, { message: 'Observação não pode ter mais de 500 caracteres' }).optional(),
    dataAvaliacao: z.string().datetime({ message: 'dataAvaliacao deve ser uma data ISO válida' }).optional()
  })
});

/**
 * Schema para avaliação em lote
 */
export const avaliarLoteSchema = z.object({
  body: z.object({
    turmaId: z.string().uuid({ message: 'turmaId deve ser um UUID válido' }),
    programaEnsinoId: z.string().uuid({ message: 'programaEnsinoId deve ser um UUID válido' }),
    avaliacoes: z.array(
      z.object({
        objetivoId: z.string().uuid({ message: 'objetivoId deve ser um UUID válido' }),
        alunoId: z.string().uuid({ message: 'alunoId deve ser um UUID válido' }),
        status: statusAvaliacaoEnum,
        observacao: z.string().max(500).optional()
      })
    ).min(1, { message: 'É necessário informar pelo menos uma avaliação' })
  })
});

/**
 * Schema para atualização de avaliação
 */
export const updateAvaliacaoSchema = z.object({
  params: z.object({
    id: z.string().uuid({ message: 'ID deve ser um UUID válido' })
  }),
  body: z.object({
    status: statusAvaliacaoEnum.optional(),
    observacao: z.string().max(500).optional(),
    dataAvaliacao: z.string().datetime().optional()
  }).refine(data => Object.keys(data).length > 0, {
    message: 'É necessário informar pelo menos um campo para atualizar'
  })
});

/**
 * Schema para listagem de avaliações
 */
export const listAvaliacoesSchema = z.object({
  query: z.object({
    turmaId: z.string().uuid().optional(),
    alunoId: z.string().uuid().optional(),
    objetivoId: z.string().uuid().optional(),
    programaEnsinoId: z.string().uuid().optional(),
    status: statusAvaliacaoEnum.optional(),
    page: z.string().regex(/^\d+$/).transform(Number).optional(),
    limit: z.string().regex(/^\d+$/).transform(Number).optional()
  })
});

/**
 * Schema para mapa de proficiência
 */
export const mapaProficienciaSchema = z.object({
  params: z.object({
    alunoId: z.string().uuid({ message: 'alunoId deve ser um UUID válido' })
  }),
  query: z.object({
    turmaId: z.string().uuid({ message: 'turmaId é obrigatório' }),
    programaEnsinoId: z.string().uuid({ message: 'programaEnsinoId é obrigatório' })
  })
});

/**
 * Schema para acompanhamento longitudinal
 */
export const acompanhamentoLongitudinalSchema = z.object({
  params: z.object({
    alunoId: z.string().uuid({ message: 'alunoId deve ser um UUID válido' })
  }),
  query: z.object({
    programaEnsinoId: z.string().uuid().optional()
  })
});

/**
 * Schema para estatísticas da turma
 */
export const estatisticasTurmaSchema = z.object({
  params: z.object({
    turmaId: z.string().uuid({ message: 'turmaId deve ser um UUID válido' })
  }),
  query: z.object({
    programaEnsinoId: z.string().uuid({ message: 'programaEnsinoId é obrigatório' })
  })
});

/**
 * Schema para criação de evidência
 */
export const createEvidenciaSchema = z.object({
  body: z.object({
    avaliacaoObjetivoId: z.string().uuid({ message: 'avaliacaoObjetivoId deve ser um UUID válido' }),
    alunoId: z.string().uuid({ message: 'alunoId deve ser um UUID válido' }),
    tipo: tipoEvidenciaEnum,
    arquivoUrl: z.string().url({ message: 'arquivoUrl deve ser uma URL válida' }).optional(),
    descricao: z.string().min(1, { message: 'Descrição é obrigatória' }).max(1000, { message: 'Descrição não pode ter mais de 1000 caracteres' })
  })
});

/**
 * Schema para atualização de evidência
 */
export const updateEvidenciaSchema = z.object({
  params: z.object({
    id: z.string().uuid({ message: 'ID deve ser um UUID válido' })
  }),
  body: z.object({
    tipo: tipoEvidenciaEnum.optional(),
    arquivoUrl: z.string().url().optional(),
    descricao: z.string().min(1).max(1000).optional()
  }).refine(data => Object.keys(data).length > 0, {
    message: 'É necessário informar pelo menos um campo para atualizar'
  })
});

/**
 * Schema para listagem de evidências
 */
export const listEvidenciasSchema = z.object({
  query: z.object({
    avaliacaoObjetivoId: z.string().uuid().optional(),
    alunoId: z.string().uuid().optional(),
    tipo: tipoEvidenciaEnum.optional(),
    page: z.string().regex(/^\d+$/).transform(Number).optional(),
    limit: z.string().regex(/^\d+$/).transform(Number).optional()
  })
});

/**
 * Schema para evidências por aluno
 */
export const evidenciasPorAlunoSchema = z.object({
  params: z.object({
    alunoId: z.string().uuid({ message: 'alunoId deve ser um UUID válido' })
  }),
  query: z.object({
    turmaId: z.string().uuid().optional()
  })
});

/**
 * Schema para estatísticas de evidências
 */
export const estatisticasEvidenciasSchema = z.object({
  query: z.object({
    turmaId: z.string().uuid().optional(),
    alunoId: z.string().uuid().optional()
  })
});

/**
 * Schema para parâmetro ID genérico
 */
export const idParamSchema = z.object({
  params: z.object({
    id: z.string().uuid({ message: 'ID deve ser um UUID válido' })
  })
});

export type CreateAvaliacaoInput = z.infer<typeof createAvaliacaoSchema>;
export type AvaliarLoteInput = z.infer<typeof avaliarLoteSchema>;
export type UpdateAvaliacaoInput = z.infer<typeof updateAvaliacaoSchema>;
export type ListAvaliacoesInput = z.infer<typeof listAvaliacoesSchema>;
export type MapaProficienciaInput = z.infer<typeof mapaProficienciaSchema>;
export type AcompanhamentoLongitudinalInput = z.infer<typeof acompanhamentoLongitudinalSchema>;
export type EstatisticasTurmaInput = z.infer<typeof estatisticasTurmaSchema>;
export type CreateEvidenciaInput = z.infer<typeof createEvidenciaSchema>;
export type UpdateEvidenciaInput = z.infer<typeof updateEvidenciaSchema>;
export type ListEvidenciasInput = z.infer<typeof listEvidenciasSchema>;
export type EvidenciasPorAlunoInput = z.infer<typeof evidenciasPorAlunoSchema>;
export type EstatisticasEvidenciasInput = z.infer<typeof estatisticasEvidenciasSchema>;
export type IdParamInput = z.infer<typeof idParamSchema>;

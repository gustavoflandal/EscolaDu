import Joi from 'joi';

// Validator para criação de aula
export const createAulaSchema = Joi.object({
  turmaDisciplinaId: Joi.string().uuid().required().messages({
    'any.required': 'ID da turma/disciplina é obrigatório',
    'string.guid': 'ID da turma/disciplina inválido'
  }),
  turmaId: Joi.string().uuid().required().messages({
    'any.required': 'ID da turma é obrigatório',
    'string.guid': 'ID da turma inválido'
  }),
  data: Joi.date().required().messages({
    'any.required': 'Data da aula é obrigatória',
    'date.base': 'Data inválida'
  }),
  horaInicio: Joi.string().pattern(/^([01]\d|2[0-3]):([0-5]\d)$/).required().messages({
    'any.required': 'Hora de início é obrigatória',
    'string.pattern.base': 'Hora de início deve estar no formato HH:MM'
  }),
  horaFim: Joi.string().pattern(/^([01]\d|2[0-3]):([0-5]\d)$/).required().messages({
    'any.required': 'Hora de fim é obrigatória',
    'string.pattern.base': 'Hora de fim deve estar no formato HH:MM'
  }),
  conteudo: Joi.string().max(500).optional().allow('').messages({
    'string.max': 'Conteúdo deve ter no máximo 500 caracteres'
  }),
  professorId: Joi.string().uuid().optional().messages({
    'string.guid': 'ID do professor inválido'
  })
});

// Validator para atualização de aula
export const updateAulaSchema = Joi.object({
  data: Joi.date().optional(),
  horaInicio: Joi.string().pattern(/^([01]\d|2[0-3]):([0-5]\d)$/).optional(),
  horaFim: Joi.string().pattern(/^([01]\d|2[0-3]):([0-5]\d)$/).optional(),
  conteudo: Joi.string().max(500).optional().allow(''),
  status: Joi.string().valid('PLANEJADA', 'REALIZADA', 'CANCELADA', 'REPOSTA').optional()
}).min(1);

// Validator para cancelamento de aula
export const cancelAulaSchema = Joi.object({
  motivo: Joi.string().max(200).optional()
});

// Validator para listagem de aulas
export const listAulasQuerySchema = Joi.object({
  turmaId: Joi.string().uuid().optional(),
  turmaDisciplinaId: Joi.string().uuid().optional(),
  professorId: Joi.string().uuid().optional(),
  data: Joi.date().optional(), // Permite filtrar por data específica
  dataInicio: Joi.date().optional(),
  dataFim: Joi.date().optional(),
  status: Joi.string().valid('PLANEJADA', 'REALIZADA', 'CANCELADA', 'REPOSTA').optional(),
  page: Joi.number().integer().min(1).optional(),
  limit: Joi.number().integer().min(1).max(100).optional()
});

// Validator para lançamento de chamada
export const lancarChamadaSchema = Joi.object({
  aulaId: Joi.string().uuid().required().messages({
    'any.required': 'ID da aula é obrigatório',
    'string.guid': 'ID da aula inválido'
  }),
  registros: Joi.array().items(
    Joi.object({
      alunoId: Joi.string().uuid().required(),
      status: Joi.string().valid('P', 'F', 'J').required().messages({
        'any.only': 'Status deve ser P (Presente), F (Falta) ou J (Justificada)'
      }),
      observacao: Joi.string().max(200).optional().allow('')
    })
  ).min(1).required().messages({
    'any.required': 'Registros são obrigatórios',
    'array.min': 'Deve haver pelo menos um registro'
  })
});

// Validator para criar justificativa
export const createJustificativaSchema = Joi.object({
  alunoId: Joi.string().uuid().required().messages({
    'any.required': 'ID do aluno é obrigatório',
    'string.guid': 'ID do aluno inválido'
  }),
  dataInicio: Joi.date().required().messages({
    'any.required': 'Data de início é obrigatória'
  }),
  dataFim: Joi.date().min(Joi.ref('dataInicio')).required().messages({
    'any.required': 'Data de fim é obrigatória',
    'date.min': 'Data de fim deve ser posterior à data de início'
  }),
  motivo: Joi.string().min(10).max(500).required().messages({
    'any.required': 'Motivo é obrigatório',
    'string.min': 'Motivo deve ter no mínimo 10 caracteres',
    'string.max': 'Motivo deve ter no máximo 500 caracteres'
  }),
  documentoUrl: Joi.string().uri().optional().messages({
    'string.uri': 'URL do documento inválida'
  })
});

// Validator para atualizar justificativa
export const updateJustificativaSchema = Joi.object({
  motivo: Joi.string().min(10).max(500).optional(),
  documentoUrl: Joi.string().uri().optional().allow('')
}).min(1);

// Validator para aprovar justificativa
export const aprovarJustificativaSchema = Joi.object({
  aprovada: Joi.boolean().required().messages({
    'any.required': 'Campo aprovada é obrigatório'
  })
});

// Validator para listagem de justificativas
export const listJustificativasQuerySchema = Joi.object({
  alunoId: Joi.string().uuid().optional(),
  turmaId: Joi.string().uuid().optional(),
  aprovada: Joi.string().valid('true', 'false').optional(),
  dataInicio: Joi.date().optional(),
  dataFim: Joi.date().optional(),
  page: Joi.number().integer().min(1).optional(),
  limit: Joi.number().integer().min(1).max(100).optional()
});

// Validator para filtros de frequência do aluno
export const frequenciaAlunoQuerySchema = Joi.object({
  dataInicio: Joi.date().optional(),
  dataFim: Joi.date().optional(),
  turmaId: Joi.string().uuid().optional(),
  disciplinaId: Joi.string().uuid().optional()
});

// Validator para filtros de frequência da turma
export const frequenciaTurmaQuerySchema = Joi.object({
  dataInicio: Joi.date().optional(),
  dataFim: Joi.date().optional(),
  disciplinaId: Joi.string().uuid().optional()
});

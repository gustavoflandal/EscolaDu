import Joi from 'joi';

export const turmaValidators = {
  create: Joi.object({
    codigo: Joi.string().required().messages({
      'any.required': 'Código é obrigatório',
      'string.empty': 'Código não pode estar vazio',
    }),
    nome: Joi.string().required().messages({
      'any.required': 'Nome é obrigatório',
      'string.empty': 'Nome não pode estar vazio',
    }),
    anoLetivoId: Joi.string().required().messages({
      'any.required': 'Ano letivo é obrigatório',
    }),
    serie: Joi.string().required().messages({
      'any.required': 'Série é obrigatória',
      'string.empty': 'Série não pode estar vazia',
    }),
    turno: Joi.string()
      .valid('MANHA', 'TARDE', 'NOITE', 'INTEGRAL')
      .required()
      .messages({
        'any.required': 'Turno é obrigatório',
        'any.only': 'Turno deve ser MANHA, TARDE, NOITE ou INTEGRAL',
      }),
    capacidadeMaxima: Joi.number().integer().min(1).max(100).optional().messages({
      'number.base': 'Capacidade máxima deve ser um número',
      'number.min': 'Capacidade máxima deve ser no mínimo 1',
      'number.max': 'Capacidade máxima deve ser no máximo 100',
    }),
    sala: Joi.string().optional().allow(''),
    professorRegenteId: Joi.string().optional().allow(''),
  }),

  update: Joi.object({
    nome: Joi.string().optional(),
    serie: Joi.string().optional(),
    turno: Joi.string()
      .valid('MANHA', 'TARDE', 'NOITE', 'INTEGRAL')
      .optional(),
    capacidadeMaxima: Joi.number().integer().min(1).max(100).optional().messages({
      'number.base': 'Capacidade máxima deve ser um número',
      'number.min': 'Capacidade máxima deve ser no mínimo 1',
      'number.max': 'Capacidade máxima deve ser no máximo 100',
    }),
    sala: Joi.string().optional().allow(''),
    professorRegenteId: Joi.string().optional().allow(''),
    active: Joi.boolean().optional(),
  }),

  matricularAluno: Joi.object({
    alunoId: Joi.string().required().messages({
      'any.required': 'ID do aluno é obrigatório',
    }),
    dataMatricula: Joi.date().optional(),
  }),
};

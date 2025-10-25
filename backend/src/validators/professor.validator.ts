import Joi from 'joi';

export const professorValidators = {
  create: Joi.object({
    nome: Joi.string().required().messages({
      'any.required': 'Nome é obrigatório',
      'string.empty': 'Nome não pode estar vazio',
    }),
    email: Joi.string().email().required().messages({
      'any.required': 'Email é obrigatório',
      'string.email': 'Email inválido',
    }),
    senha: Joi.string().min(6).required().messages({
      'any.required': 'Senha é obrigatória',
      'string.min': 'Senha deve ter no mínimo 6 caracteres',
    }),
    cpf: Joi.string().pattern(/^\d{11}$/).optional().allow('').messages({
      'string.pattern.base': 'CPF deve conter 11 dígitos',
    }),
    telefone: Joi.string().optional().allow(''),
    registroProfissional: Joi.string().optional().allow(''),
    especialidade: Joi.string().optional().allow(''),
    cargaHoraria: Joi.number().integer().min(0).optional().messages({
      'number.base': 'Carga horária deve ser um número',
      'number.min': 'Carga horária não pode ser negativa',
    }),
  }),

  update: Joi.object({
    nome: Joi.string().optional(),
    telefone: Joi.string().optional().allow(''),
    registroProfissional: Joi.string().optional().allow(''),
    especialidade: Joi.string().optional().allow(''),
    cargaHoraria: Joi.number().integer().min(0).optional().messages({
      'number.base': 'Carga horária deve ser um número',
      'number.min': 'Carga horária não pode ser negativa',
    }),
    active: Joi.boolean().optional(),
  }),

  createFormacao: Joi.object({
    nivel: Joi.string()
      .valid('FUNDAMENTAL', 'MEDIO', 'TECNICO', 'GRADUACAO', 'POS_GRADUACAO', 'MESTRADO', 'DOUTORADO')
      .required()
      .messages({
        'any.required': 'Nível é obrigatório',
        'any.only': 'Nível inválido',
      }),
    curso: Joi.string().required().messages({
      'any.required': 'Curso é obrigatório',
      'string.empty': 'Curso não pode estar vazio',
    }),
    instituicao: Joi.string().required().messages({
      'any.required': 'Instituição é obrigatória',
      'string.empty': 'Instituição não pode estar vazia',
    }),
    areaConhecimento: Joi.string().optional().allow(''),
    dataInicio: Joi.date().required().messages({
      'any.required': 'Data de início é obrigatória',
      'date.base': 'Data de início inválida',
    }),
    dataConclusao: Joi.date().optional().greater(Joi.ref('dataInicio')).messages({
      'date.base': 'Data de conclusão inválida',
      'date.greater': 'Data de conclusão deve ser posterior à data de início',
    }),
    emAndamento: Joi.boolean().default(false),
    cargaHoraria: Joi.number().integer().min(0).optional().messages({
      'number.base': 'Carga horária deve ser um número',
      'number.min': 'Carga horária não pode ser negativa',
    }),
    observacoes: Joi.string().optional().allow(''),
  }),

  updateFormacao: Joi.object({
    nivel: Joi.string()
      .valid('FUNDAMENTAL', 'MEDIO', 'TECNICO', 'GRADUACAO', 'POS_GRADUACAO', 'MESTRADO', 'DOUTORADO')
      .optional(),
    curso: Joi.string().optional(),
    instituicao: Joi.string().optional(),
    areaConhecimento: Joi.string().optional().allow(''),
    dataInicio: Joi.date().optional(),
    dataConclusao: Joi.date().optional(),
    emAndamento: Joi.boolean().optional(),
    cargaHoraria: Joi.number().integer().min(0).optional().messages({
      'number.base': 'Carga horária deve ser um número',
      'number.min': 'Carga horária não pode ser negativa',
    }),
    observacoes: Joi.string().optional().allow(''),
  }),
};

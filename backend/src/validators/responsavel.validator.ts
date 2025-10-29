import Joi from 'joi';

/**
 * Schema para criação de responsável
 */
export const createResponsavelSchema = Joi.object({
  // Dados do User
  name: Joi.string().min(3).max(100).required().messages({
    'string.empty': 'Nome é obrigatório',
    'string.min': 'Nome deve ter no mínimo 3 caracteres',
    'string.max': 'Nome deve ter no máximo 100 caracteres',
    'any.required': 'Nome é obrigatório'
  }),
  email: Joi.string().email().required().messages({
    'string.empty': 'Email é obrigatório',
    'string.email': 'Email inválido',
    'any.required': 'Email é obrigatório'
  }),
  password: Joi.string().min(8).required().messages({
    'string.empty': 'Senha é obrigatória',
    'string.min': 'Senha deve ter no mínimo 8 caracteres',
    'any.required': 'Senha é obrigatória'
  }),
  cpf: Joi.string().pattern(/^\d{11}$/).required().messages({
    'string.empty': 'CPF é obrigatório',
    'string.pattern.base': 'CPF deve conter 11 dígitos numéricos',
    'any.required': 'CPF é obrigatório'
  }),
  phone: Joi.string().pattern(/^\d{10,11}$/).required().messages({
    'string.empty': 'Telefone é obrigatório',
    'string.pattern.base': 'Telefone deve conter 10 ou 11 dígitos numéricos',
    'any.required': 'Telefone é obrigatório'
  }),

  // Dados específicos do Responsável
  tipoVinculo: Joi.string().valid('PAI', 'MAE', 'AVO', 'TUTOR', 'OUTRO').required().messages({
    'string.empty': 'Tipo de vínculo é obrigatório',
    'any.only': 'Tipo de vínculo deve ser PAI, MAE, AVO, TUTOR ou OUTRO',
    'any.required': 'Tipo de vínculo é obrigatório'
  }),
  rg: Joi.string().optional().allow('', null),
  telefoneSecundario: Joi.string().pattern(/^\d{10,11}$/).optional().allow('', null).messages({
    'string.pattern.base': 'Telefone secundário deve conter 10 ou 11 dígitos numéricos'
  }),
  profissao: Joi.string().max(100).optional().allow('', null),
  endereco: Joi.string().max(500).optional().allow('', null)
});

/**
 * Schema para atualização de responsável
 */
export const updateResponsavelSchema = Joi.object({
  name: Joi.string().min(3).max(100).optional().messages({
    'string.min': 'Nome deve ter no mínimo 3 caracteres',
    'string.max': 'Nome deve ter no máximo 100 caracteres'
  }),
  email: Joi.string().email().optional().messages({
    'string.email': 'Email inválido'
  }),
  phone: Joi.string().pattern(/^\d{10,11}$/).optional().messages({
    'string.pattern.base': 'Telefone deve conter 10 ou 11 dígitos numéricos'
  }),
  tipoVinculo: Joi.string().valid('PAI', 'MAE', 'AVO', 'TUTOR', 'OUTRO').optional().messages({
    'any.only': 'Tipo de vínculo deve ser PAI, MAE, AVO, TUTOR ou OUTRO'
  }),
  rg: Joi.string().optional().allow('', null),
  telefoneSecundario: Joi.string().pattern(/^\d{10,11}$/).optional().allow('', null).messages({
    'string.pattern.base': 'Telefone secundário deve conter 10 ou 11 dígitos numéricos'
  }),
  profissao: Joi.string().max(100).optional().allow('', null),
  endereco: Joi.string().max(500).optional().allow('', null),
  active: Joi.boolean().optional()
});

/**
 * Schema para query params da listagem
 */
export const listResponsaveisQuerySchema = Joi.object({
  search: Joi.string().optional().allow(''),
  active: Joi.string().valid('true', 'false').optional(),
  page: Joi.number().integer().min(1).optional().default(1),
  limit: Joi.number().integer().min(1).max(100).optional().default(10)
});

/**
 * Schema para criação de vínculo
 */
export const createVinculoSchema = Joi.object({
  alunoId: Joi.string().uuid().required().messages({
    'string.empty': 'ID do aluno é obrigatório',
    'string.guid': 'ID do aluno inválido',
    'any.required': 'ID do aluno é obrigatório'
  }),
  prioridadeContato: Joi.number().integer().min(1).max(10).optional().default(1).messages({
    'number.min': 'Prioridade de contato deve ser no mínimo 1',
    'number.max': 'Prioridade de contato deve ser no máximo 10'
  })
});

/**
 * Schema para atualização de vínculo (apenas prioridade de contato)
 */
export const updateVinculoSchema = Joi.object({
  prioridadeContato: Joi.number().integer().min(1).max(10).optional().messages({
    'number.min': 'Prioridade de contato deve ser no mínimo 1',
    'number.max': 'Prioridade de contato deve ser no máximo 10'
  })
});

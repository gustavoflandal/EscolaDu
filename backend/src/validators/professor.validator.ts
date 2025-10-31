import Joi from 'joi';

// Schema de criação de professor
export const createProfessorSchema = Joi.object({
  userId: Joi.string().uuid().required().messages({
    'string.guid': 'ID do usuário inválido',
    'any.required': 'ID do usuário é obrigatório'
  }),
  registroProfissional: Joi.string().min(3).max(20).required().messages({
    'string.min': 'Registro profissional deve ter no mínimo 3 caracteres',
    'string.max': 'Registro profissional deve ter no máximo 20 caracteres',
    'any.required': 'Registro profissional é obrigatório'
  }),
  cargaHoraria: Joi.number().integer().min(1).max(60).required().messages({
    'number.base': 'Carga horária deve ser um número',
    'number.integer': 'Carga horária deve ser um número inteiro',
    'number.min': 'Carga horária deve ser maior que 0',
    'number.max': 'Carga horária não pode exceder 60 horas',
    'any.required': 'Carga horária é obrigatória'
  }),
  active: Joi.boolean().default(true)
});

// Schema de atualização de professor
export const updateProfessorSchema = Joi.object({
  registroProfissional: Joi.string().min(3).max(20).messages({
    'string.min': 'Registro profissional deve ter no mínimo 3 caracteres',
    'string.max': 'Registro profissional deve ter no máximo 20 caracteres'
  }),
  cargaHoraria: Joi.number().integer().min(1).max(60).messages({
    'number.base': 'Carga horária deve ser um número',
    'number.integer': 'Carga horária deve ser um número inteiro',
    'number.min': 'Carga horária deve ser maior que 0',
    'number.max': 'Carga horária não pode exceder 60 horas'
  }),
  active: Joi.boolean()
});

// Schema de criação de formação
export const createFormacaoSchema = Joi.object({
  professorId: Joi.string().uuid().required().messages({
    'string.guid': 'ID do professor inválido',
    'any.required': 'ID do professor é obrigatório'
  }),
  nome: Joi.string().min(3).max(100).required().messages({
    'string.min': 'Nome da formação deve ter no mínimo 3 caracteres',
    'string.max': 'Nome da formação deve ter no máximo 100 caracteres',
    'any.required': 'Nome da formação é obrigatório'
  }),
  descricao: Joi.string().max(500).allow('', null).messages({
    'string.max': 'Descrição deve ter no máximo 500 caracteres'
  })
});

// Schema de atualização de formação
export const updateFormacaoSchema = Joi.object({
  nome: Joi.string().min(3).max(100).messages({
    'string.min': 'Nome da formação deve ter no mínimo 3 caracteres',
    'string.max': 'Nome da formação deve ter no máximo 100 caracteres'
  }),
  descricao: Joi.string().max(500).allow('', null).messages({
    'string.max': 'Descrição deve ter no máximo 500 caracteres'
  })
});

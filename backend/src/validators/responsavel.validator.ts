import Joi from 'joi';

// Criar responsável
export const createResponsavelSchema = Joi.object({
  nome: Joi.string().min(3).required().messages({
    'string.min': 'Nome deve ter no mínimo 3 caracteres',
    'any.required': 'Nome é obrigatório',
  }),
  email: Joi.string().email().required().messages({
    'string.email': 'Email inválido',
    'any.required': 'Email é obrigatório',
  }),
  senha: Joi.string().min(8).required().messages({
    'string.min': 'Senha deve ter no mínimo 8 caracteres',
    'any.required': 'Senha é obrigatória',
  }),
  cpf: Joi.string().length(11).required().messages({
    'string.length': 'CPF deve ter 11 dígitos',
    'any.required': 'CPF é obrigatório',
  }),
  rg: Joi.string().optional().allow(''),
  tipoVinculo: Joi.string()
    .valid('PAI', 'MAE', 'AVO', 'TUTOR', 'OUTRO')
    .required()
    .messages({
      'any.only': 'Tipo de vínculo inválido',
      'any.required': 'Tipo de vínculo é obrigatório',
    }),
  telefonePrincipal: Joi.string().required().messages({
    'any.required': 'Telefone principal é obrigatório',
  }),
  telefoneSecundario: Joi.string().optional().allow(''),
  profissao: Joi.string().optional().allow(''),
  endereco: Joi.string().optional().allow(''),
});

// Atualizar responsável
export const updateResponsavelSchema = Joi.object({
  nome: Joi.string().min(3).optional(),
  cpf: Joi.string().length(11).optional(),
  rg: Joi.string().optional().allow(''),
  tipoVinculo: Joi.string()
    .valid('PAI', 'MAE', 'AVO', 'TUTOR', 'OUTRO')
    .optional(),
  telefonePrincipal: Joi.string().optional(),
  telefoneSecundario: Joi.string().optional().allow(''),
  profissao: Joi.string().optional().allow(''),
  endereco: Joi.string().optional().allow(''),
});

// Vincular aluno
export const vincularAlunoSchema = Joi.object({
  alunoId: Joi.string().uuid().required().messages({
    'string.uuid': 'ID do aluno inválido',
    'any.required': 'ID do aluno é obrigatório',
  }),
  prioridadeContato: Joi.number().min(1).max(10).default(1).messages({
    'number.min': 'Prioridade deve ser no mínimo 1',
    'number.max': 'Prioridade deve ser no máximo 10',
  }),
});

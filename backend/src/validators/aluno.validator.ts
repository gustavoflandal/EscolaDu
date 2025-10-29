import Joi from 'joi';

// Create Aluno
export const createAlunoSchema = Joi.object({
  matricula: Joi.string().required().messages({
    'any.required': 'Matrícula é obrigatória',
  }),
  nome: Joi.string().required().messages({
    'any.required': 'Nome é obrigatório',
  }),
  cpf: Joi.string().optional().allow(null, '').regex(/^\d{11}$/).messages({
    'string.pattern.base': 'CPF deve conter 11 dígitos',
  }),
  rg: Joi.string().optional().allow(null, ''),
  dataNascimento: Joi.date().required().messages({
    'any.required': 'Data de nascimento é obrigatória',
  }),
  genero: Joi.string().valid('M', 'F', 'Outro').optional().allow(null, ''),
  foto: Joi.string().optional().allow(null, ''),
  endereco: Joi.string().optional().allow(null, ''),
  telefone: Joi.string().optional().allow(null, ''),
  email: Joi.string().email().optional().allow(null, ''),
  necessidadesEspeciais: Joi.string().optional().allow(null, ''),
  restricoesMedicas: Joi.string().optional().allow(null, ''),
  status: Joi.string().valid('ATIVO', 'INATIVO', 'TRANSFERIDO', 'EVADIDO', 'CONCLUIDO').default('ATIVO'),
  responsavelPrincipalId: Joi.string().optional().allow(null),
});

// Update Aluno
export const updateAlunoSchema = Joi.object({
  matricula: Joi.string().optional(),
  nome: Joi.string().optional(),
  cpf: Joi.string().optional().allow(null, '').regex(/^\d{11}$/).messages({
    'string.pattern.base': 'CPF deve conter 11 dígitos',
  }),
  rg: Joi.string().optional().allow(null, ''),
  dataNascimento: Joi.date().optional(),
  genero: Joi.string().valid('M', 'F', 'Outro').optional().allow(null, ''),
  foto: Joi.string().optional().allow(null, ''),
  endereco: Joi.string().optional().allow(null, ''),
  telefone: Joi.string().optional().allow(null, ''),
  email: Joi.string().email().optional().allow(null, ''),
  necessidadesEspeciais: Joi.string().optional().allow(null, ''),
  restricoesMedicas: Joi.string().optional().allow(null, ''),
  status: Joi.string().valid('ATIVO', 'INATIVO', 'TRANSFERIDO', 'EVADIDO', 'CONCLUIDO').optional(),
  responsavelPrincipalId: Joi.string().optional().allow(null),
});

// List Alunos Query
export const listAlunosQuerySchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(20),
  status: Joi.string().valid('ATIVO', 'INATIVO', 'TRANSFERIDO', 'EVADIDO').optional(),
  search: Joi.string().optional(),
  turmaId: Joi.string().optional(),
});

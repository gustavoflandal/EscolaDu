import Joi from 'joi';

// Create User
export const createUserSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'any.required': 'Email é obrigatório',
    'string.email': 'Email inválido',
  }),
  password: Joi.string().min(8).required().messages({
    'any.required': 'Senha é obrigatória',
    'string.min': 'Senha deve ter no mínimo 8 caracteres',
  }),
  name: Joi.string().required().messages({
    'any.required': 'Nome é obrigatório',
  }),
  cpf: Joi.string().optional().allow(null, '').regex(/^\d{11}$/).messages({
    'string.pattern.base': 'CPF deve conter 11 dígitos',
  }),
  phone: Joi.string().optional().allow(null, ''),
  avatar: Joi.string().uri().optional().allow(null, ''),
  roleIds: Joi.array().items(Joi.string().uuid()).optional(),
});

// Update User
export const updateUserSchema = Joi.object({
  email: Joi.string().email().optional(),
  name: Joi.string().optional(),
  cpf: Joi.string().optional().allow(null, '').regex(/^\d{11}$/).messages({
    'string.pattern.base': 'CPF deve conter 11 dígitos',
  }),
  phone: Joi.string().optional().allow(null, ''),
  avatar: Joi.string().uri().optional().allow(null, ''),
  active: Joi.boolean().optional(),
  roleIds: Joi.array().items(Joi.string().uuid()).optional(),
});

// List Users Query
export const listUsersQuerySchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(0).max(100).default(20),
  search: Joi.string().optional(),
  active: Joi.boolean().optional(),
  roleId: Joi.string().uuid().optional(),
});

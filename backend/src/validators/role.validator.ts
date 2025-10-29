import Joi from 'joi';

// Create Role
export const createRoleSchema = Joi.object({
  name: Joi.string().required().messages({
    'any.required': 'Nome é obrigatório',
  }),
  description: Joi.string().optional().allow(null, ''),
  permissionIds: Joi.array().items(Joi.string().uuid()).optional(),
});

// Update Role
export const updateRoleSchema = Joi.object({
  name: Joi.string().optional(),
  description: Joi.string().optional().allow(null, ''),
  active: Joi.boolean().optional(),
  permissionIds: Joi.array().items(Joi.string().uuid()).optional(),
});

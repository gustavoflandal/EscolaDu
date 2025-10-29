import { Router } from 'express';
import { userController } from '../controllers/user.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { hasPermission } from '../middleware/permission.middleware';
import { validate } from '../middleware/validation.middleware';
import { createUserSchema, updateUserSchema, listUsersQuerySchema } from '../validators/user.validator';

const router = Router();

// Todas as rotas requerem autenticação
router.use(authMiddleware);

// Listar usuários
router.get(
  '/',
  hasPermission('users', 'read'),
  validate(listUsersQuerySchema, 'query'),
  userController.list.bind(userController)
);

// Buscar usuário por ID
router.get(
  '/:id',
  hasPermission('users', 'read'),
  userController.findById.bind(userController)
);

// Buscar permissões do usuário
router.get(
  '/:id/permissions',
  hasPermission('users', 'read'),
  userController.getUserPermissions.bind(userController)
);

// Criar usuário
router.post(
  '/',
  hasPermission('users', 'create'),
  validate(createUserSchema),
  userController.create.bind(userController)
);

// Atualizar usuário
router.put(
  '/:id',
  hasPermission('users', 'update'),
  validate(updateUserSchema),
  userController.update.bind(userController)
);

// Deletar usuário
router.delete(
  '/:id',
  hasPermission('users', 'delete'),
  userController.delete.bind(userController)
);

export default router;

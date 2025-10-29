import { Router } from 'express';
import { roleController, permissionController } from '../controllers/role.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { hasPermission } from '../middleware/permission.middleware';
import { validate } from '../middleware/validation.middleware';
import { createRoleSchema, updateRoleSchema } from '../validators/role.validator';

const router = Router();

// Todas as rotas requerem autenticação
router.use(authMiddleware);

// ========================================
// ROTAS DE PERFIS (ROLES)
// ========================================

// Listar perfis
router.get(
  '/',
  hasPermission('roles', 'read'),
  roleController.list.bind(roleController)
);

// Buscar perfil por ID
router.get(
  '/:id',
  hasPermission('roles', 'read'),
  roleController.findById.bind(roleController)
);

// Criar perfil
router.post(
  '/',
  hasPermission('roles', 'create'),
  validate(createRoleSchema),
  roleController.create.bind(roleController)
);

// Atualizar perfil
router.put(
  '/:id',
  hasPermission('roles', 'update'),
  validate(updateRoleSchema),
  roleController.update.bind(roleController)
);

// Deletar perfil
router.delete(
  '/:id',
  hasPermission('roles', 'delete'),
  roleController.delete.bind(roleController)
);

// ========================================
// ROTAS DE PERMISSÕES
// ========================================

// Listar todas as permissões
router.get(
  '/permissions/all',
  hasPermission('permissions', 'read'),
  permissionController.list.bind(permissionController)
);

// Listar permissões agrupadas por recurso
router.get(
  '/permissions/grouped',
  hasPermission('permissions', 'read'),
  permissionController.listGroupedByResource.bind(permissionController)
);

// Buscar permissão por ID
router.get(
  '/permissions/:id',
  hasPermission('permissions', 'read'),
  permissionController.findById.bind(permissionController)
);

export default router;

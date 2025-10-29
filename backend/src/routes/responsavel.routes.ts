import { Router } from 'express';
import { responsavelController } from '../controllers/responsavel.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { hasPermission } from '../middleware/permission.middleware';
import { validate } from '../middleware/validation.middleware';
import {
  createResponsavelSchema,
  updateResponsavelSchema,
  listResponsaveisQuerySchema,
  createVinculoSchema,
  updateVinculoSchema
} from '../validators/responsavel.validator';

const router = Router();

// Todas as rotas requerem autenticação
router.use(authMiddleware);

/**
 * Rotas de Responsáveis
 */

// GET /api/v1/responsaveis - Lista responsáveis
router.get(
  '/',
  hasPermission('responsaveis', 'read'),
  validate(listResponsaveisQuerySchema, 'query'),
  responsavelController.list.bind(responsavelController)
);

// GET /api/v1/responsaveis/cpf/:cpf - Busca por CPF
router.get(
  '/cpf/:cpf',
  hasPermission('responsaveis', 'read'),
  responsavelController.findByCPF.bind(responsavelController)
);

// GET /api/v1/responsaveis/:id - Busca por ID
router.get(
  '/:id',
  hasPermission('responsaveis', 'read'),
  responsavelController.findById.bind(responsavelController)
);

// POST /api/v1/responsaveis - Cria responsável
router.post(
  '/',
  hasPermission('responsaveis', 'create'),
  validate(createResponsavelSchema),
  responsavelController.create.bind(responsavelController)
);

// PUT /api/v1/responsaveis/:id - Atualiza responsável
router.put(
  '/:id',
  hasPermission('responsaveis', 'update'),
  validate(updateResponsavelSchema),
  responsavelController.update.bind(responsavelController)
);

// DELETE /api/v1/responsaveis/:id - Remove responsável
router.delete(
  '/:id',
  hasPermission('responsaveis', 'delete'),
  responsavelController.delete.bind(responsavelController)
);

/**
 * Rotas de Vínculos
 */

// GET /api/v1/responsaveis/:id/alunos - Lista alunos do responsável
router.get(
  '/:id/alunos',
  hasPermission('responsaveis', 'read'),
  responsavelController.getAlunos.bind(responsavelController)
);

// POST /api/v1/responsaveis/:id/vinculos - Cria vínculo
router.post(
  '/:id/vinculos',
  hasPermission('responsaveis', 'create'),
  validate(createVinculoSchema),
  responsavelController.createVinculo.bind(responsavelController)
);

// PATCH /api/v1/responsaveis/vinculos/:vinculoId - Atualiza vínculo
router.patch(
  '/vinculos/:vinculoId',
  hasPermission('responsaveis', 'update'),
  validate(updateVinculoSchema),
  responsavelController.updateVinculo.bind(responsavelController)
);

// DELETE /api/v1/responsaveis/vinculos/:vinculoId - Remove vínculo
router.delete(
  '/vinculos/:vinculoId',
  hasPermission('responsaveis', 'delete'),
  responsavelController.removeVinculo.bind(responsavelController)
);

export default router;

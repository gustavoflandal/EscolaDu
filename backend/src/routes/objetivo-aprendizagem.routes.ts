import { Router } from 'express';
import objetivoAprendizagemController from '../controllers/objetivo-aprendizagem.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { requirePermission } from '../middleware/permission.middleware';
import { validateZod } from '../middleware/validation.middleware';
import {
  createObjetivoSchema,
  updateObjetivoSchema,
  listObjetivosSchema,
  reorderObjetivosSchema,
} from '../validators/objetivo-aprendizagem.validator';

const router = Router();

// Todas as rotas requerem autenticação
router.use(authMiddleware);

/**
 * @route   POST /api/objetivos-aprendizagem
 * @desc    Criar novo objetivo de aprendizagem
 * @access  Private (create permission)
 */
router.post(
  '/',
  requirePermission('objetivos', 'create'),
  validateZod(createObjetivoSchema),
  objetivoAprendizagemController.create
);

/**
 * @route   GET /api/objetivos-aprendizagem
 * @desc    Listar objetivos de aprendizagem com filtros
 * @access  Private (read permission)
 */
router.get(
  '/',
  requirePermission('objetivos', 'read'),
  validateZod(listObjetivosSchema),
  objetivoAprendizagemController.list
);

/**
 * @route   GET /api/objetivos-aprendizagem/:id
 * @desc    Buscar objetivo de aprendizagem por ID
 * @access  Private (read permission)
 */
router.get(
  '/:id',
  requirePermission('objetivos', 'read'),
  objetivoAprendizagemController.findById
);

/**
 * @route   PUT /api/objetivos-aprendizagem/:id
 * @desc    Atualizar objetivo de aprendizagem
 * @access  Private (update permission)
 */
router.put(
  '/:id',
  requirePermission('objetivos', 'update'),
  validateZod(updateObjetivoSchema),
  objetivoAprendizagemController.update
);

/**
 * @route   PATCH /api/objetivos-aprendizagem/:id/deactivate
 * @desc    Desativar objetivo de aprendizagem
 * @access  Private (update permission)
 */
router.patch(
  '/:id/deactivate',
  requirePermission('objetivos', 'update'),
  objetivoAprendizagemController.deactivate
);

/**
 * @route   PATCH /api/objetivos-aprendizagem/:id/activate
 * @desc    Reativar objetivo de aprendizagem
 * @access  Private (update permission)
 */
router.patch(
  '/:id/activate',
  requirePermission('objetivos', 'update'),
  objetivoAprendizagemController.activate
);

/**
 * @route   DELETE /api/objetivos-aprendizagem/:id
 * @desc    Deletar objetivo de aprendizagem
 * @access  Private (delete permission)
 */
router.delete(
  '/:id',
  requirePermission('objetivos', 'delete'),
  objetivoAprendizagemController.delete
);

/**
 * @route   POST /api/objetivos-aprendizagem/programas/:programaEnsinoId/reorder
 * @desc    Reordenar objetivos de um programa
 * @access  Private (update permission)
 */
router.post(
  '/programas/:programaEnsinoId/reorder',
  requirePermission('objetivos', 'update'),
  validateZod(reorderObjetivosSchema),
  objetivoAprendizagemController.reorder
);

export default router;

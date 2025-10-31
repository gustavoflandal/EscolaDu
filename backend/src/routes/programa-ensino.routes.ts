import { Router } from 'express';
import programaEnsinoController from '../controllers/programa-ensino.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { requirePermission } from '../middleware/permission.middleware';
import { validateZod } from '../middleware/validation.middleware';
import {
  createProgramaEnsinoSchema,
  updateProgramaEnsinoSchema,
  getProgramaEnsinoSchema,
  listProgramasEnsinoSchema,
  deleteProgramaEnsinoSchema,
} from '../validators/programa-ensino.validator';

const router = Router();

// Todas as rotas exigem autenticação
router.use(authMiddleware);

/**
 * @route   GET /api/programas-ensino
 * @desc    Listar programas de ensino com filtros
 * @access  Private (programas-ensino:read)
 */
router.get(
  '/',
  requirePermission('programas-ensino', 'read'),
  validateZod(listProgramasEnsinoSchema),
  programaEnsinoController.list
);

/**
 * @route   GET /api/programas-ensino/series
 * @desc    Listar séries disponíveis
 * @access  Private (programas-ensino:read)
 */
router.get(
  '/series',
  requirePermission('programas-ensino', 'read'),
  programaEnsinoController.getSeries
);

/**
 * @route   GET /api/programas-ensino/anos-letivos
 * @desc    Listar anos letivos disponíveis
 * @access  Private (programas-ensino:read)
 */
router.get(
  '/anos-letivos',
  requirePermission('programas-ensino', 'read'),
  programaEnsinoController.getAnosLetivos
);

/**
 * @route   GET /api/programas-ensino/:id
 * @desc    Buscar programa de ensino por ID
 * @access  Private (programas-ensino:read)
 */
router.get(
  '/:id',
  requirePermission('programas-ensino', 'read'),
  validateZod(getProgramaEnsinoSchema),
  programaEnsinoController.findById
);

/**
 * @route   POST /api/programas-ensino
 * @desc    Criar novo programa de ensino
 * @access  Private (programas-ensino:create)
 */
router.post(
  '/',
  requirePermission('programas-ensino', 'create'),
  validateZod(createProgramaEnsinoSchema),
  programaEnsinoController.create
);

/**
 * @route   PUT /api/programas-ensino/:id
 * @desc    Atualizar programa de ensino
 * @access  Private (programas-ensino:update)
 */
router.put(
  '/:id',
  requirePermission('programas-ensino', 'update'),
  validateZod(updateProgramaEnsinoSchema),
  programaEnsinoController.update
);

/**
 * @route   PATCH /api/programas-ensino/:id/deactivate
 * @desc    Desativar programa de ensino
 * @access  Private (programas-ensino:update)
 */
router.patch(
  '/:id/deactivate',
  requirePermission('programas-ensino', 'update'),
  validateZod(getProgramaEnsinoSchema),
  programaEnsinoController.deactivate
);

/**
 * @route   PATCH /api/programas-ensino/:id/activate
 * @desc    Reativar programa de ensino
 * @access  Private (programas-ensino:update)
 */
router.patch(
  '/:id/activate',
  requirePermission('programas-ensino', 'update'),
  validateZod(getProgramaEnsinoSchema),
  programaEnsinoController.activate
);

/**
 * @route   DELETE /api/programas-ensino/:id
 * @desc    Deletar programa de ensino
 * @access  Private (programas-ensino:delete)
 */
router.delete(
  '/:id',
  requirePermission('programas-ensino', 'delete'),
  validateZod(deleteProgramaEnsinoSchema),
  programaEnsinoController.delete
);

export default router;

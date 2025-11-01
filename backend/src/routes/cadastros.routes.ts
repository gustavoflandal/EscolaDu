import { Router } from 'express';
import serieController from '../controllers/serie.controller';
import salaController from '../controllers/sala.controller';
import feriadoController from '../controllers/feriado.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { requirePermission } from '../middleware/permission.middleware';

const router = Router();

// Todas as rotas requerem autenticação
router.use(authMiddleware);

// ==================== SÉRIES ====================
router.get(
  '/series',
  requirePermission('cadastros', 'read'),
  serieController.list
);

router.get(
  '/series/:id',
  requirePermission('cadastros', 'read'),
  serieController.getById
);

router.post(
  '/series',
  requirePermission('cadastros', 'create'),
  serieController.create
);

router.put(
  '/series/:id',
  requirePermission('cadastros', 'update'),
  serieController.update
);

router.delete(
  '/series/:id',
  requirePermission('cadastros', 'delete'),
  serieController.delete
);

// ==================== SALAS ====================
router.get(
  '/salas',
  requirePermission('cadastros', 'read'),
  salaController.list
);

router.get(
  '/salas/:id',
  requirePermission('cadastros', 'read'),
  salaController.getById
);

router.post(
  '/salas',
  requirePermission('cadastros', 'create'),
  salaController.create
);

router.put(
  '/salas/:id',
  requirePermission('cadastros', 'update'),
  salaController.update
);

router.delete(
  '/salas/:id',
  requirePermission('cadastros', 'delete'),
  salaController.delete
);

// ==================== FERIADOS ====================
router.get(
  '/feriados',
  requirePermission('cadastros', 'read'),
  feriadoController.list
);

router.get(
  '/feriados/:id',
  requirePermission('cadastros', 'read'),
  feriadoController.getById
);

router.post(
  '/feriados',
  requirePermission('cadastros', 'create'),
  feriadoController.create
);

router.put(
  '/feriados/:id',
  requirePermission('cadastros', 'update'),
  feriadoController.update
);

router.delete(
  '/feriados/:id',
  requirePermission('cadastros', 'delete'),
  feriadoController.delete
);

export default router;

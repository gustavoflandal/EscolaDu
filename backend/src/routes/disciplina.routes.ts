import { Router } from 'express';
import disciplinaController from '../controllers/disciplina.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { requirePermission } from '../middleware/permission.middleware';
import { validateZod } from '../middleware/validation.middleware';
import {
  createDisciplinaSchema,
  updateDisciplinaSchema,
  createObjetivoSchema,
  updateObjetivoSchema
} from '../validators/disciplina.validator';

const router = Router();

// Todas as rotas requerem autenticação
router.use(authMiddleware);

// ==================== ROTAS AUXILIARES (devem vir antes das rotas com :id) ====================

// Áreas de conhecimento
router.get(
  '/areas-conhecimento',
  requirePermission('disciplinas', 'read'),
  disciplinaController.getAreasConhecimento
);

// Séries
router.get(
  '/series',
  requirePermission('disciplinas', 'read'),
  disciplinaController.getSeries
);

// Períodos
router.get(
  '/periodos',
  requirePermission('disciplinas', 'read'),
  disciplinaController.getPeriodos
);

// ==================== ROTAS DE DISCIPLINAS ====================

// Listar disciplinas
router.get(
  '/',
  requirePermission('disciplinas', 'read'),
  disciplinaController.list
);

// Buscar disciplina por ID
router.get(
  '/:id',
  requirePermission('disciplinas', 'read'),
  disciplinaController.getById
);

// Criar disciplina
router.post(
  '/',
  requirePermission('disciplinas', 'create'),
  validateZod(createDisciplinaSchema),
  disciplinaController.create
);

// Atualizar disciplina
router.put(
  '/:id',
  requirePermission('disciplinas', 'update'),
  validateZod(updateDisciplinaSchema),
  disciplinaController.update
);

// Excluir disciplina
router.delete(
  '/:id',
  requirePermission('disciplinas', 'delete'),
  disciplinaController.delete
);

// ==================== ROTAS DE OBJETIVOS ====================

// Listar objetivos (geral ou por disciplina via query param)
router.get(
  '/objetivos/list',
  requirePermission('disciplinas', 'read'),
  disciplinaController.listObjetivos
);

// Objetivos de uma disciplina específica
router.get(
  '/:disciplinaId/objetivos',
  requirePermission('disciplinas', 'read'),
  disciplinaController.getObjetivosPorDisciplina
);

// Buscar objetivo por ID
router.get(
  '/objetivos/:id',
  requirePermission('disciplinas', 'read'),
  disciplinaController.getObjetivoById
);

// Criar objetivo para uma disciplina
router.post(
  '/:disciplinaId/objetivos',
  requirePermission('disciplinas', 'create'),
  validateZod(createObjetivoSchema),
  disciplinaController.createObjetivo
);

// Atualizar objetivo
router.put(
  '/objetivos/:id',
  requirePermission('disciplinas', 'update'),
  validateZod(updateObjetivoSchema),
  disciplinaController.updateObjetivo
);

// Excluir objetivo
router.delete(
  '/objetivos/:id',
  requirePermission('disciplinas', 'delete'),
  disciplinaController.deleteObjetivo
);

export default router;

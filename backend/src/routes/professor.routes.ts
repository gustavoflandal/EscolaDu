import { Router } from 'express';
import professorController from '../controllers/professor.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { requirePermission } from '../middleware/permission.middleware';
import { validation } from '../middleware/validation.middleware';
import {
  createProfessorSchema,
  updateProfessorSchema,
  createFormacaoSchema,
  updateFormacaoSchema
} from '../validators/professor.validator';

const router = Router();

// Todas as rotas requerem autenticação
router.use(authMiddleware);

// Rotas de professores
router.get(
  '/',
  requirePermission('professores', 'read'),
  professorController.list
);

router.get(
  '/stats',
  requirePermission('professores', 'read'),
  professorController.getStats
);

router.get(
  '/:id',
  requirePermission('professores', 'read'),
  professorController.getById
);

router.get(
  '/user/:userId',
  requirePermission('professores', 'read'),
  professorController.getByUserId
);

router.post(
  '/',
  requirePermission('professores', 'create'),
  validation(createProfessorSchema),
  professorController.create
);

router.put(
  '/:id',
  requirePermission('professores', 'update'),
  validation(updateProfessorSchema),
  professorController.update
);

router.delete(
  '/:id',
  requirePermission('professores', 'delete'),
  professorController.delete
);

// Rotas de formações
router.get(
  '/:professorId/formacoes',
  requirePermission('professores', 'read'),
  professorController.listFormacoes
);

router.post(
  '/formacoes',
  requirePermission('professores', 'update'),
  validation(createFormacaoSchema),
  professorController.createFormacao
);

router.put(
  '/formacoes/:id',
  requirePermission('professores', 'update'),
  validation(updateFormacaoSchema),
  professorController.updateFormacao
);

router.delete(
  '/formacoes/:id',
  requirePermission('professores', 'delete'),
  professorController.deleteFormacao
);

// Rotas de agenda
router.get(
  '/:id/agenda',
  requirePermission('professores', 'read'),
  professorController.getAgenda
);

export default router;

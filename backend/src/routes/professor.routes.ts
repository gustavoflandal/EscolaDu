import { Router } from 'express';
import { professorController } from '../controllers/professor.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { validate } from '../middleware/validation.middleware';
import { professorValidators } from '../validators/professor.validator';

const router = Router();

// Todas as rotas requerem autenticação
router.use(authMiddleware);

// CRUD de professores
router.get('/', professorController.list.bind(professorController));
router.get('/:id', professorController.getById.bind(professorController));
router.post(
  '/',
  validate(professorValidators.create),
  professorController.create.bind(professorController)
);
router.put(
  '/:id',
  validate(professorValidators.update),
  professorController.update.bind(professorController)
);
router.delete('/:id', professorController.delete.bind(professorController));

// Gerenciamento de formações
router.get('/:id/formacoes', professorController.getFormacoes.bind(professorController));
router.post(
  '/:id/formacoes',
  validate(professorValidators.createFormacao),
  professorController.addFormacao.bind(professorController)
);
router.put(
  '/:id/formacoes/:formacaoId',
  validate(professorValidators.updateFormacao),
  professorController.updateFormacao.bind(professorController)
);
router.delete('/:id/formacoes/:formacaoId', professorController.deleteFormacao.bind(professorController));

export default router;

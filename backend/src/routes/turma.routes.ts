import { Router } from 'express';
import { turmaController } from '../controllers/turma.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { validate } from '../middleware/validation.middleware';
import { turmaValidators } from '../validators/turma.validator';

const router = Router();

// Todas as rotas requerem autenticação
router.use(authMiddleware);

// Rota especial para buscar anos letivos
router.get('/anos-letivos', turmaController.getAnosLetivos.bind(turmaController));

// CRUD de turmas
router.get('/', turmaController.list.bind(turmaController));
router.get('/:id', turmaController.getById.bind(turmaController));
router.post(
  '/',
  validate(turmaValidators.create),
  turmaController.create.bind(turmaController)
);
router.put(
  '/:id',
  validate(turmaValidators.update),
  turmaController.update.bind(turmaController)
);
router.delete('/:id', turmaController.delete.bind(turmaController));

// Gerenciamento de alunos
router.get('/:id/alunos', turmaController.getAlunos.bind(turmaController));
router.post(
  '/:id/alunos',
  validate(turmaValidators.matricularAluno),
  turmaController.matricularAluno.bind(turmaController)
);
router.delete('/:id/alunos/:alunoId', turmaController.desmatricularAluno.bind(turmaController));

export default router;

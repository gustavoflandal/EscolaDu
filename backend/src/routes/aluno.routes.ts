import { Router } from 'express';
import { AlunoController } from '../controllers/aluno.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { requirePermission } from '../middleware/permission.middleware';
import { validate } from '../middleware/validation.middleware';
import { createAlunoSchema, updateAlunoSchema } from '../validators/aluno.validator';

const router = Router();
const alunoController = new AlunoController();

// Todas as rotas requerem autenticação
router.use(authMiddleware);

// GET /api/v1/alunos - Listar alunos
router.get(
  '/',
  requirePermission('alunos', 'read'),
  alunoController.list.bind(alunoController)
);

// GET /api/v1/alunos/:id - Buscar aluno por ID
router.get(
  '/:id',
  requirePermission('alunos', 'read'),
  alunoController.findById.bind(alunoController)
);

// GET /api/v1/alunos/:id/stats - Estatísticas do aluno
router.get(
  '/:id/stats',
  requirePermission('alunos', 'read'),
  alunoController.getStats.bind(alunoController)
);

// POST /api/v1/alunos - Criar novo aluno
router.post(
  '/',
  requirePermission('alunos', 'create'),
  validate(createAlunoSchema),
  alunoController.create.bind(alunoController)
);

// PUT /api/v1/alunos/:id - Atualizar aluno
router.put(
  '/:id',
  requirePermission('alunos', 'update'),
  validate(updateAlunoSchema),
  alunoController.update.bind(alunoController)
);

// DELETE /api/v1/alunos/:id - Deletar aluno (soft delete)
router.delete(
  '/:id',
  requirePermission('alunos', 'delete'),
  alunoController.delete.bind(alunoController)
);

export default router;

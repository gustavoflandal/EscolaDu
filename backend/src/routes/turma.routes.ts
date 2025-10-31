import { Router } from 'express';
import turmaController from '../controllers/turma.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { requirePermission } from '../middleware/permission.middleware';
import { validateZod } from '../middleware/validation.middleware';
import {
  createTurmaSchema,
  updateTurmaSchema,
  addAlunoToTurmaSchema,
  queryTurmasSchema,
} from '../validators/turma.validator';

const router = Router();

// Todas as rotas requerem autenticação
router.use(authMiddleware);

/**
 * IMPORTANTE: Rotas específicas devem vir ANTES das rotas com parâmetros dinâmicos
 * Caso contrário, 'anos-letivos' seria interpretado como um ID
 */

/**
 * Rotas auxiliares (sem ID) - DEVEM VIR PRIMEIRO
 */
// GET /api/v1/turmas/anos-letivos - Lista anos letivos disponíveis
router.get('/anos-letivos', turmaController.getAnosLetivos);

// GET /api/v1/turmas/professores-disponiveis - Lista professores disponíveis
router.get('/professores-disponiveis', turmaController.getProfessoresDisponiveis);

/**
 * Rotas CRUD de turmas
 */
// GET /api/v1/turmas - Lista turmas
router.get(
  '/',
  requirePermission('turmas', 'read'),
  validateZod(queryTurmasSchema),
  turmaController.list
);

// POST /api/v1/turmas - Cria turma
router.post(
  '/',
  requirePermission('turmas', 'create'),
  validateZod(createTurmaSchema),
  turmaController.create
);

/**
 * Rotas com sub-recursos (devem vir antes de /:id)
 */
// GET /api/v1/turmas/:id/stats - Estatísticas da turma
router.get(
  '/:id/stats',
  requirePermission('turmas', 'read'),
  turmaController.getStats
);

// GET /api/v1/turmas/:id/alunos-disponiveis - Lista alunos disponíveis
router.get(
  '/:id/alunos-disponiveis',
  requirePermission('turmas', 'update'),
  turmaController.getAlunosDisponiveis
);

// POST /api/v1/turmas/:id/alunos - Adiciona aluno à turma
router.post(
  '/:id/alunos',
  requirePermission('turmas', 'update'),
  validateZod(addAlunoToTurmaSchema),
  turmaController.addAluno
);

// DELETE /api/v1/turmas/:id/alunos/:alunoId - Remove aluno da turma
router.delete(
  '/:id/alunos/:alunoId',
  requirePermission('turmas', 'update'),
  turmaController.removeAluno
);

/**
 * Rotas com parâmetros dinâmicos (devem vir por último)
 */
// GET /api/v1/turmas/:id - Busca turma por ID
router.get(
  '/:id',
  requirePermission('turmas', 'read'),
  turmaController.getById
);

// PUT /api/v1/turmas/:id - Atualiza turma
router.put(
  '/:id',
  requirePermission('turmas', 'update'),
  validateZod(updateTurmaSchema),
  turmaController.update
);

// DELETE /api/v1/turmas/:id - Exclui turma
router.delete(
  '/:id',
  requirePermission('turmas', 'delete'),
  turmaController.delete
);

export default router;

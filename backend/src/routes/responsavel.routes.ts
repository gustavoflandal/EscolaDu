import { Router } from 'express';
import { responsavelController } from '../controllers/responsavel.controller';
import { validation } from '../middleware/validation.middleware';
import { authMiddleware } from '../middleware/auth.middleware';
import {
  createResponsavelSchema,
  updateResponsavelSchema,
  vincularAlunoSchema,
} from '../validators/responsavel.validator';

const router = Router();

// Todas as rotas requerem autenticação
router.use(authMiddleware);

/**
 * @route   GET /api/responsaveis
 * @desc    Lista responsáveis
 * @access  Private
 */
router.get('/', (req, res) => responsavelController.list(req, res));

/**
 * @route   GET /api/responsaveis/:id
 * @desc    Busca responsável por ID
 * @access  Private
 */
router.get('/:id', (req, res) => responsavelController.getById(req, res));

/**
 * @route   POST /api/responsaveis
 * @desc    Cria novo responsável
 * @access  Private
 */
router.post('/', validation(createResponsavelSchema), (req, res) =>
  responsavelController.create(req, res)
);

/**
 * @route   PUT /api/responsaveis/:id
 * @desc    Atualiza responsável
 * @access  Private
 */
router.put('/:id', validation(updateResponsavelSchema), (req, res) =>
  responsavelController.update(req, res)
);

/**
 * @route   DELETE /api/responsaveis/:id
 * @desc    Remove responsável
 * @access  Private
 */
router.delete('/:id', (req, res) => responsavelController.delete(req, res));

/**
 * @route   GET /api/responsaveis/:id/alunos
 * @desc    Lista alunos do responsável
 * @access  Private
 */
router.get('/:id/alunos', (req, res) => responsavelController.getAlunos(req, res));

/**
 * @route   POST /api/responsaveis/:id/alunos
 * @desc    Vincula aluno ao responsável
 * @access  Private
 */
router.post('/:id/alunos', validation(vincularAlunoSchema), (req, res) =>
  responsavelController.vincularAluno(req, res)
);

/**
 * @route   DELETE /api/responsaveis/:id/alunos/:alunoId
 * @desc    Remove vínculo de aluno
 * @access  Private
 */
router.delete('/:id/alunos/:alunoId', (req, res) =>
  responsavelController.desvincularAluno(req, res)
);

export default router;

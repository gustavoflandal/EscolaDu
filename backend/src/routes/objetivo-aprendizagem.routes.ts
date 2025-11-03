import { Router } from 'express';
import objetivoAprendizagemController from '../controllers/objetivo-aprendizagem.controller';
import { avaliacaoObjetivoController } from '../controllers/avaliacao-objetivo.controller';
import { evidenciaAprendizagemController } from '../controllers/evidencia-aprendizagem.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { requirePermission } from '../middleware/permission.middleware';
import { validateZod } from '../middleware/validation.middleware';
import {
  createObjetivoSchema,
  updateObjetivoSchema,
  listObjetivosSchema,
  reorderObjetivosSchema,
} from '../validators/objetivo-aprendizagem.validator';
import {
  createAvaliacaoSchema,
  avaliarLoteSchema,
  updateAvaliacaoSchema,
  listAvaliacoesSchema,
  mapaProficienciaSchema,
  acompanhamentoLongitudinalSchema,
  estatisticasTurmaSchema,
  createEvidenciaSchema,
  updateEvidenciaSchema,
  listEvidenciasSchema,
  evidenciasPorAlunoSchema,
  estatisticasEvidenciasSchema,
  idParamSchema,
} from '../validators/avaliacao-objetivo.validator';

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

// ========================================
// ROTAS DE AVALIAÇÕES DE OBJETIVOS
// ========================================

/**
 * @route   POST /api/objetivos-aprendizagem/avaliacoes
 * @desc    Criar ou atualizar avaliação de objetivo
 * @access  Private (create permission)
 */
router.post(
  '/avaliacoes',
  requirePermission('objetivos', 'create'),
  validateZod(createAvaliacaoSchema),
  avaliacaoObjetivoController.createOrUpdate
);

/**
 * @route   POST /api/objetivos-aprendizagem/avaliacoes/lote
 * @desc    Avaliar objetivos em lote
 * @access  Private (create permission)
 */
router.post(
  '/avaliacoes/lote',
  requirePermission('objetivos', 'create'),
  validateZod(avaliarLoteSchema),
  avaliacaoObjetivoController.avaliarLote
);

/**
 * @route   GET /api/objetivos-aprendizagem/avaliacoes
 * @desc    Listar avaliações com filtros
 * @access  Private (read permission)
 */
router.get(
  '/avaliacoes',
  requirePermission('objetivos', 'read'),
  validateZod(listAvaliacoesSchema),
  avaliacaoObjetivoController.list
);

/**
 * @route   GET /api/objetivos-aprendizagem/avaliacoes/:id
 * @desc    Buscar avaliação por ID
 * @access  Private (read permission)
 */
router.get(
  '/avaliacoes/:id',
  requirePermission('objetivos', 'read'),
  validateZod(idParamSchema),
  avaliacaoObjetivoController.findById
);

/**
 * @route   PUT /api/objetivos-aprendizagem/avaliacoes/:id
 * @desc    Atualizar avaliação
 * @access  Private (update permission)
 */
router.put(
  '/avaliacoes/:id',
  requirePermission('objetivos', 'update'),
  validateZod(updateAvaliacaoSchema),
  avaliacaoObjetivoController.update
);

/**
 * @route   DELETE /api/objetivos-aprendizagem/avaliacoes/:id
 * @desc    Excluir avaliação
 * @access  Private (delete permission)
 */
router.delete(
  '/avaliacoes/:id',
  requirePermission('objetivos', 'delete'),
  validateZod(idParamSchema),
  avaliacaoObjetivoController.delete
);

/**
 * @route   GET /api/objetivos-aprendizagem/avaliacoes/aluno/:alunoId/mapa
 * @desc    Obter mapa de proficiência do aluno
 * @access  Private (read permission)
 */
router.get(
  '/avaliacoes/aluno/:alunoId/mapa',
  requirePermission('objetivos', 'read'),
  validateZod(mapaProficienciaSchema),
  avaliacaoObjetivoController.getMapaProficiencia
);

/**
 * @route   GET /api/objetivos-aprendizagem/avaliacoes/aluno/:alunoId/longitudinal
 * @desc    Obter acompanhamento longitudinal do aluno
 * @access  Private (read permission)
 */
router.get(
  '/avaliacoes/aluno/:alunoId/longitudinal',
  requirePermission('objetivos', 'read'),
  validateZod(acompanhamentoLongitudinalSchema),
  avaliacaoObjetivoController.getAcompanhamentoLongitudinal
);

/**
 * @route   GET /api/objetivos-aprendizagem/avaliacoes/turma/:turmaId/estatisticas
 * @desc    Obter estatísticas da turma
 * @access  Private (read permission)
 */
router.get(
  '/avaliacoes/turma/:turmaId/estatisticas',
  requirePermission('objetivos', 'read'),
  validateZod(estatisticasTurmaSchema),
  avaliacaoObjetivoController.getEstatisticasTurma
);

// ========================================
// ROTAS DE EVIDÊNCIAS DE APRENDIZAGEM
// ========================================

/**
 * @route   POST /api/objetivos-aprendizagem/evidencias
 * @desc    Criar evidência de aprendizagem
 * @access  Private (create permission)
 */
router.post(
  '/evidencias',
  requirePermission('objetivos', 'create'),
  validateZod(createEvidenciaSchema),
  evidenciaAprendizagemController.create
);

/**
 * @route   GET /api/objetivos-aprendizagem/evidencias
 * @desc    Listar evidências com filtros
 * @access  Private (read permission)
 */
router.get(
  '/evidencias',
  requirePermission('objetivos', 'read'),
  validateZod(listEvidenciasSchema),
  evidenciaAprendizagemController.list
);

/**
 * @route   GET /api/objetivos-aprendizagem/evidencias/:id
 * @desc    Buscar evidência por ID
 * @access  Private (read permission)
 */
router.get(
  '/evidencias/:id',
  requirePermission('objetivos', 'read'),
  validateZod(idParamSchema),
  evidenciaAprendizagemController.findById
);

/**
 * @route   PUT /api/objetivos-aprendizagem/evidencias/:id
 * @desc    Atualizar evidência
 * @access  Private (update permission)
 */
router.put(
  '/evidencias/:id',
  requirePermission('objetivos', 'update'),
  validateZod(updateEvidenciaSchema),
  evidenciaAprendizagemController.update
);

/**
 * @route   DELETE /api/objetivos-aprendizagem/evidencias/:id
 * @desc    Excluir evidência
 * @access  Private (delete permission)
 */
router.delete(
  '/evidencias/:id',
  requirePermission('objetivos', 'delete'),
  validateZod(idParamSchema),
  evidenciaAprendizagemController.delete
);

/**
 * @route   GET /api/objetivos-aprendizagem/evidencias/aluno/:alunoId/por-objetivo
 * @desc    Obter evidências do aluno agrupadas por objetivo
 * @access  Private (read permission)
 */
router.get(
  '/evidencias/aluno/:alunoId/por-objetivo',
  requirePermission('objetivos', 'read'),
  validateZod(evidenciasPorAlunoSchema),
  evidenciaAprendizagemController.getEvidenciasPorAluno
);

/**
 * @route   GET /api/objetivos-aprendizagem/evidencias/estatisticas
 * @desc    Obter estatísticas de evidências
 * @access  Private (read permission)
 */
router.get(
  '/evidencias/estatisticas',
  requirePermission('objetivos', 'read'),
  validateZod(estatisticasEvidenciasSchema),
  evidenciaAprendizagemController.getEstatisticas
);

// ========================================
// ROTAS GENÉRICAS (DEVEM FICAR NO FINAL)
// ========================================

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

export default router;

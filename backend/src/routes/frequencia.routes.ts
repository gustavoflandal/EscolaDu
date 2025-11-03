import { Router } from 'express';
import { aulaController } from '../controllers/aula.controller';
import { frequenciaController } from '../controllers/frequencia.controller';
import { justificativaController } from '../controllers/justificativa.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { hasPermission } from '../middleware/permission.middleware';
import { validate } from '../middleware/validation.middleware';
import {
  createAulaSchema,
  updateAulaSchema,
  cancelAulaSchema,
  listAulasQuerySchema,
  lancarChamadaSchema,
  createJustificativaSchema,
  updateJustificativaSchema,
  aprovarJustificativaSchema,
  listJustificativasQuerySchema,
  frequenciaAlunoQuerySchema,
  frequenciaTurmaQuerySchema
} from '../validators/frequencia.validator';

const router = Router();

// Todas as rotas requerem autenticação
router.use(authMiddleware);

/**
 * =================================
 * ROTAS DE AULAS
 * =================================
 */

// GET /api/v1/frequencia/aulas - Lista aulas
router.get(
  '/aulas',
  hasPermission('frequencia', 'read'),
  validate(listAulasQuerySchema, 'query'),
  aulaController.list.bind(aulaController)
);

// GET /api/v1/frequencia/aulas/:id - Busca aula por ID
router.get(
  '/aulas/:id',
  hasPermission('frequencia', 'read'),
  aulaController.findById.bind(aulaController)
);

// GET /api/v1/frequencia/aulas/turma/:turmaId/dia/:data - Aulas do dia
router.get(
  '/aulas/turma/:turmaId/dia/:data',
  hasPermission('frequencia', 'read'),
  aulaController.getAulasDoDia.bind(aulaController)
);

// POST /api/v1/frequencia/aulas - Cria aula
router.post(
  '/aulas',
  hasPermission('frequencia', 'create'),
  validate(createAulaSchema),
  aulaController.create.bind(aulaController)
);

// PUT /api/v1/frequencia/aulas/:id - Atualiza aula
router.put(
  '/aulas/:id',
  hasPermission('frequencia', 'update'),
  validate(updateAulaSchema),
  aulaController.update.bind(aulaController)
);

// PATCH /api/v1/frequencia/aulas/:id/cancelar - Cancela aula
router.patch(
  '/aulas/:id/cancelar',
  hasPermission('frequencia', 'update'),
  validate(cancelAulaSchema),
  aulaController.cancel.bind(aulaController)
);

// DELETE /api/v1/frequencia/aulas/:id - Deleta aula
router.delete(
  '/aulas/:id',
  hasPermission('frequencia', 'delete'),
  aulaController.delete.bind(aulaController)
);

/**
 * =================================
 * ROTAS DE FREQUÊNCIA
 * =================================
 */

// POST /api/v1/frequencia/lancar-chamada - Lança chamada
router.post(
  '/lancar-chamada',
  hasPermission('frequencia', 'create'),
  validate(lancarChamadaSchema),
  frequenciaController.lancarChamada.bind(frequenciaController)
);

// GET /api/v1/frequencia/aula/:aulaId - Frequência de uma aula
router.get(
  '/aula/:aulaId',
  hasPermission('frequencia', 'read'),
  frequenciaController.getFrequenciaAula.bind(frequenciaController)
);

// GET /api/v1/frequencia/aluno/:alunoId - Frequência de um aluno
router.get(
  '/aluno/:alunoId',
  hasPermission('frequencia', 'read'),
  validate(frequenciaAlunoQuerySchema, 'query'),
  frequenciaController.getFrequenciaAluno.bind(frequenciaController)
);

// GET /api/v1/frequencia/turma/:turmaId - Frequência de uma turma
router.get(
  '/turma/:turmaId',
  hasPermission('frequencia', 'read'),
  validate(frequenciaTurmaQuerySchema, 'query'),
  frequenciaController.getFrequenciaTurma.bind(frequenciaController)
);

/**
 * =================================
 * ROTAS DE JUSTIFICATIVAS
 * =================================
 */

// GET /api/v1/frequencia/justificativas - Lista justificativas
router.get(
  '/justificativas',
  hasPermission('frequencia', 'read'),
  validate(listJustificativasQuerySchema, 'query'),
  justificativaController.list.bind(justificativaController)
);

// GET /api/v1/frequencia/justificativas/pendentes - Justificativas pendentes
router.get(
  '/justificativas/pendentes',
  hasPermission('frequencia', 'read'),
  justificativaController.getPendentes.bind(justificativaController)
);

// GET /api/v1/frequencia/justificativas/:id - Busca justificativa por ID
router.get(
  '/justificativas/:id',
  hasPermission('frequencia', 'read'),
  justificativaController.findById.bind(justificativaController)
);

// POST /api/v1/frequencia/justificativas - Cria justificativa
router.post(
  '/justificativas',
  hasPermission('frequencia', 'create'),
  validate(createJustificativaSchema),
  justificativaController.create.bind(justificativaController)
);

// PUT /api/v1/frequencia/justificativas/:id - Atualiza justificativa
router.put(
  '/justificativas/:id',
  hasPermission('frequencia', 'update'),
  validate(updateJustificativaSchema),
  justificativaController.update.bind(justificativaController)
);

// PATCH /api/v1/frequencia/justificativas/:id/aprovar - Aprova/Reprova justificativa
router.patch(
  '/justificativas/:id/aprovar',
  hasPermission('frequencia', 'update'),
  validate(aprovarJustificativaSchema),
  justificativaController.aprovar.bind(justificativaController)
);

// DELETE /api/v1/frequencia/justificativas/:id - Deleta justificativa
router.delete(
  '/justificativas/:id',
  hasPermission('frequencia', 'delete'),
  justificativaController.delete.bind(justificativaController)
);

export default router;

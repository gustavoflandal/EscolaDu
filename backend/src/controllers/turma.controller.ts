import { Request, Response } from 'express';
import { turmaService } from '../services/turma.service';
import { sendSuccess, errorResponse } from '../utils/response.util';
import { AuthRequest } from '../middleware/auth.middleware';
import { logger } from '../config/logger';

export class TurmaController {
  /**
   * GET /api/turmas
   * Lista todas as turmas
   */
  async list(req: Request, res: Response): Promise<void> {
    try {
      const { search, anoLetivoId, serie, turno, page = 1, limit = 10 } = req.query;

      const result = await turmaService.list({
        search: search as string,
        anoLetivoId: anoLetivoId as string,
        serie: serie as string,
        turno: turno as string,
        page: Number(page),
        limit: Number(limit),
      });

      sendSuccess(res, result);
    } catch (error: any) {
      logger.error('Erro ao listar turmas:', error);
      errorResponse(res, 'LIST_ERROR', error.message, 400);
    }
  }

  /**
   * GET /api/turmas/:id
   * Busca turma por ID
   */
  async getById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const turma = await turmaService.getById(id);
      sendSuccess(res, turma);
    } catch (error: any) {
      logger.error('Erro ao buscar turma:', error);
      errorResponse(res, 'GET_ERROR', error.message, 404);
    }
  }

  /**
   * POST /api/turmas
   * Cria nova turma
   */
  async create(req: AuthRequest, res: Response): Promise<void> {
    try {
      const turma = await turmaService.create(req.body);
      sendSuccess(res, turma, 'Turma criada com sucesso', 201);
    } catch (error: any) {
      logger.error('Erro ao criar turma:', error);
      errorResponse(res, 'CREATE_ERROR', error.message, 400);
    }
  }

  /**
   * PUT /api/turmas/:id
   * Atualiza turma
   */
  async update(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const turma = await turmaService.update(id, req.body);
      sendSuccess(res, turma, 'Turma atualizada com sucesso');
    } catch (error: any) {
      logger.error('Erro ao atualizar turma:', error);
      errorResponse(res, 'UPDATE_ERROR', error.message, 400);
    }
  }

  /**
   * DELETE /api/turmas/:id
   * Remove turma
   */
  async delete(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      await turmaService.delete(id);
      sendSuccess(res, null, 'Turma removida com sucesso');
    } catch (error: any) {
      logger.error('Erro ao deletar turma:', error);
      errorResponse(res, 'DELETE_ERROR', error.message, 400);
    }
  }

  /**
   * POST /api/turmas/:id/alunos
   * Matricula aluno na turma
   */
  async matricularAluno(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const matricula = await turmaService.matricularAluno(id, req.body);
      sendSuccess(res, matricula, 'Aluno matriculado com sucesso', 201);
    } catch (error: any) {
      logger.error('Erro ao matricular aluno:', error);
      errorResponse(res, 'MATRICULA_ERROR', error.message, 400);
    }
  }

  /**
   * DELETE /api/turmas/:id/alunos/:alunoId
   * Desmatricula aluno da turma
   */
  async desmatricularAluno(req: Request, res: Response): Promise<void> {
    try {
      const { id, alunoId } = req.params;
      await turmaService.desmatricularAluno(id, alunoId);
      sendSuccess(res, null, 'Aluno desmatriculado com sucesso');
    } catch (error: any) {
      logger.error('Erro ao desmatricular aluno:', error);
      errorResponse(res, 'DESMATRICULA_ERROR', error.message, 400);
    }
  }

  /**
   * GET /api/turmas/:id/alunos
   * Lista alunos da turma
   */
  async getAlunos(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const alunos = await turmaService.getAlunos(id);
      sendSuccess(res, alunos);
    } catch (error: any) {
      logger.error('Erro ao buscar alunos:', error);
      errorResponse(res, 'GET_ALUNOS_ERROR', error.message, 400);
    }
  }

  /**
   * GET /api/turmas/anos-letivos
   * Lista anos letivos
   */
  async getAnosLetivos(req: Request, res: Response): Promise<void> {
    try {
      const anos = await turmaService.getAnosLetivos();
      sendSuccess(res, anos);
    } catch (error: any) {
      logger.error('Erro ao buscar anos letivos:', error);
      errorResponse(res, 'GET_ANOS_ERROR', error.message, 400);
    }
  }
}

export const turmaController = new TurmaController();

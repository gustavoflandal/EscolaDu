import { Request, Response } from 'express';
import { responsavelService } from '../services/responsavel.service';
import { sendSuccess, errorResponse } from '../utils/response.util';
import { AuthRequest } from '../middleware/auth.middleware';
import { logger } from '../config/logger';

export class ResponsavelController {
  /**
   * GET /api/responsaveis
   * Lista todos os responsáveis
   */
  async list(req: Request, res: Response): Promise<void> {
    try {
      const { search, page = 1, limit = 10 } = req.query;

      const result = await responsavelService.list({
        search: search as string,
        page: Number(page),
        limit: Number(limit),
      });

      sendSuccess(res, result);
    } catch (error: any) {
      logger.error('Erro ao listar responsáveis:', error);
      errorResponse(res, 'LIST_ERROR', error.message, 400);
    }
  }

  /**
   * GET /api/responsaveis/:id
   * Busca responsável por ID
   */
  async getById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const responsavel = await responsavelService.getById(id);
      sendSuccess(res, responsavel);
    } catch (error: any) {
      logger.error('Erro ao buscar responsável:', error);
      errorResponse(res, 'GET_ERROR', error.message, 404);
    }
  }

  /**
   * POST /api/responsaveis
   * Cria novo responsável
   */
  async create(req: AuthRequest, res: Response): Promise<void> {
    try {
      const responsavel = await responsavelService.create(req.body);
      sendSuccess(res, responsavel, 'Responsável criado com sucesso', 201);
    } catch (error: any) {
      logger.error('Erro ao criar responsável:', error);
      errorResponse(res, 'CREATE_ERROR', error.message, 400);
    }
  }

  /**
   * PUT /api/responsaveis/:id
   * Atualiza responsável
   */
  async update(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const responsavel = await responsavelService.update(id, req.body);
      sendSuccess(res, responsavel, 'Responsável atualizado com sucesso');
    } catch (error: any) {
      logger.error('Erro ao atualizar responsável:', error);
      errorResponse(res, 'UPDATE_ERROR', error.message, 400);
    }
  }

  /**
   * DELETE /api/responsaveis/:id
   * Remove responsável
   */
  async delete(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      await responsavelService.delete(id);
      sendSuccess(res, null, 'Responsável removido com sucesso');
    } catch (error: any) {
      logger.error('Erro ao deletar responsável:', error);
      errorResponse(res, 'DELETE_ERROR', error.message, 400);
    }
  }

  /**
   * POST /api/responsaveis/:id/alunos
   * Vincula aluno ao responsável
   */
  async vincularAluno(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { alunoId, prioridadeContato } = req.body;

      const vinculo = await responsavelService.vincularAluno(
        id,
        alunoId,
        prioridadeContato
      );

      sendSuccess(res, vinculo, 'Aluno vinculado com sucesso', 201);
    } catch (error: any) {
      logger.error('Erro ao vincular aluno:', error);
      errorResponse(res, 'VINCULAR_ERROR', error.message, 400);
    }
  }

  /**
   * DELETE /api/responsaveis/:id/alunos/:alunoId
   * Remove vínculo de aluno
   */
  async desvincularAluno(req: Request, res: Response): Promise<void> {
    try {
      const { id, alunoId } = req.params;
      await responsavelService.desvincularAluno(id, alunoId);
      sendSuccess(res, null, 'Vínculo removido com sucesso');
    } catch (error: any) {
      logger.error('Erro ao desvincular aluno:', error);
      errorResponse(res, 'DESVINCULAR_ERROR', error.message, 400);
    }
  }

  /**
   * GET /api/responsaveis/:id/alunos
   * Lista alunos do responsável
   */
  async getAlunos(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const alunos = await responsavelService.getAlunos(id);
      sendSuccess(res, alunos);
    } catch (error: any) {
      logger.error('Erro ao buscar alunos do responsável:', error);
      errorResponse(res, 'GET_ALUNOS_ERROR', error.message, 400);
    }
  }
}

export const responsavelController = new ResponsavelController();

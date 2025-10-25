import { Request, Response } from 'express';
import { professorService } from '../services/professor.service';
import { sendSuccess, errorResponse } from '../utils/response.util';
import { AuthRequest } from '../middleware/auth.middleware';
import { logger } from '../config/logger';

export class ProfessorController {
  /**
   * GET /api/professores
   * Lista todos os professores
   */
  async list(req: Request, res: Response): Promise<void> {
    try {
      const { search, page = 1, limit = 10 } = req.query;

      const result = await professorService.list({
        search: search as string,
        page: Number(page),
        limit: Number(limit),
      });

      sendSuccess(res, result);
    } catch (error: any) {
      logger.error('Erro ao listar professores:', error);
      errorResponse(res, 'LIST_ERROR', error.message, 400);
    }
  }

  /**
   * GET /api/professores/:id
   * Busca professor por ID
   */
  async getById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const professor = await professorService.getById(id);
      sendSuccess(res, professor);
    } catch (error: any) {
      logger.error('Erro ao buscar professor:', error);
      errorResponse(res, 'GET_ERROR', error.message, 404);
    }
  }

  /**
   * POST /api/professores
   * Cria novo professor
   */
  async create(req: AuthRequest, res: Response): Promise<void> {
    try {
      const professor = await professorService.create(req.body);
      sendSuccess(res, professor, 'Professor criado com sucesso', 201);
    } catch (error: any) {
      logger.error('Erro ao criar professor:', error);
      errorResponse(res, 'CREATE_ERROR', error.message, 400);
    }
  }

  /**
   * PUT /api/professores/:id
   * Atualiza professor
   */
  async update(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const professor = await professorService.update(id, req.body);
      sendSuccess(res, professor, 'Professor atualizado com sucesso');
    } catch (error: any) {
      logger.error('Erro ao atualizar professor:', error);
      errorResponse(res, 'UPDATE_ERROR', error.message, 400);
    }
  }

  /**
   * DELETE /api/professores/:id
   * Remove professor
   */
  async delete(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      await professorService.delete(id);
      sendSuccess(res, null, 'Professor removido com sucesso');
    } catch (error: any) {
      logger.error('Erro ao deletar professor:', error);
      errorResponse(res, 'DELETE_ERROR', error.message, 400);
    }
  }

  /**
   * POST /api/professores/:id/formacoes
   * Adiciona formação ao professor
   */
  async addFormacao(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const formacao = await professorService.addFormacao(id, req.body);
      sendSuccess(res, formacao, 'Formação adicionada com sucesso', 201);
    } catch (error: any) {
      logger.error('Erro ao adicionar formação:', error);
      errorResponse(res, 'ADD_FORMACAO_ERROR', error.message, 400);
    }
  }

  /**
   * PUT /api/professores/:id/formacoes/:formacaoId
   * Atualiza formação do professor
   */
  async updateFormacao(req: Request, res: Response): Promise<void> {
    try {
      const { id, formacaoId } = req.params;
      const formacao = await professorService.updateFormacao(id, formacaoId, req.body);
      sendSuccess(res, formacao, 'Formação atualizada com sucesso');
    } catch (error: any) {
      logger.error('Erro ao atualizar formação:', error);
      errorResponse(res, 'UPDATE_FORMACAO_ERROR', error.message, 400);
    }
  }

  /**
   * DELETE /api/professores/:id/formacoes/:formacaoId
   * Remove formação do professor
   */
  async deleteFormacao(req: Request, res: Response): Promise<void> {
    try {
      const { id, formacaoId } = req.params;
      await professorService.deleteFormacao(id, formacaoId);
      sendSuccess(res, null, 'Formação removida com sucesso');
    } catch (error: any) {
      logger.error('Erro ao remover formação:', error);
      errorResponse(res, 'DELETE_FORMACAO_ERROR', error.message, 400);
    }
  }

  /**
   * GET /api/professores/:id/formacoes
   * Lista formações do professor
   */
  async getFormacoes(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const formacoes = await professorService.getFormacoes(id);
      sendSuccess(res, formacoes);
    } catch (error: any) {
      logger.error('Erro ao buscar formações:', error);
      errorResponse(res, 'GET_FORMACOES_ERROR', error.message, 400);
    }
  }
}

export const professorController = new ProfessorController();

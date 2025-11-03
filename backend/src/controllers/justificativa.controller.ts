import { Request, Response } from 'express';
import { justificativaService } from '../services/justificativa.service';
import { successResponse, errorResponse } from '../utils/response.util';
import { logger } from '../config/logger';
import { AuthRequest } from '../middleware/auth.middleware';

export class JustificativaController {
  /**
   * Lista justificativas
   * GET /api/v1/frequencia/justificativas
   */
  async list(req: Request, res: Response): Promise<void> {
    try {
      const {
        alunoId,
        turmaId,
        aprovada,
        dataInicio,
        dataFim,
        page,
        limit
      } = req.query;

      const filters = {
        alunoId: alunoId as string,
        turmaId: turmaId as string,
        aprovada: aprovada === 'true' ? true : aprovada === 'false' ? false : undefined,
        dataInicio: dataInicio ? new Date(dataInicio as string) : undefined,
        dataFim: dataFim ? new Date(dataFim as string) : undefined,
        page: page ? Number(page) : 1,
        limit: limit ? Number(limit) : 20
      };

      const result = await justificativaService.list(filters);

      successResponse(res, result.data, 'Justificativas listadas com sucesso', 200, result.meta);
    } catch (error: any) {
      logger.error('Erro ao listar justificativas:', error);
      errorResponse(res, 'LIST_ERROR', error.message);
    }
  }

  /**
   * Busca justificativa por ID
   * GET /api/v1/frequencia/justificativas/:id
   */
  async findById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const justificativa = await justificativaService.findById(id);

      successResponse(res, justificativa, 'Justificativa encontrada');
    } catch (error: any) {
      logger.error('Erro ao buscar justificativa:', error);
      
      if (error.message === 'Justificativa não encontrada') {
        errorResponse(res, 'NOT_FOUND', error.message, 404);
      } else {
        errorResponse(res, 'FETCH_ERROR', error.message);
      }
    }
  }

  /**
   * Cria nova justificativa
   * POST /api/v1/frequencia/justificativas
   */
  async create(req: Request, res: Response): Promise<void> {
    try {
      const {
        alunoId,
        dataInicio,
        dataFim,
        motivo,
        documentoUrl
      } = req.body;

      const justificativa = await justificativaService.create({
        alunoId,
        dataInicio: new Date(dataInicio),
        dataFim: new Date(dataFim),
        motivo,
        documentoUrl
      });

      successResponse(res, justificativa, 'Justificativa criada com sucesso', 201);
    } catch (error: any) {
      logger.error('Erro ao criar justificativa:', error);
      
      if (error.message === 'Aluno não encontrado') {
        errorResponse(res, 'NOT_FOUND', error.message, 404);
      } else if (error.message.includes('Data final')) {
        errorResponse(res, 'BAD_REQUEST', error.message, 400);
      } else {
        errorResponse(res, 'CREATE_ERROR', error.message);
      }
    }
  }

  /**
   * Atualiza justificativa
   * PUT /api/v1/frequencia/justificativas/:id
   */
  async update(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { motivo, documentoUrl } = req.body;

      const justificativa = await justificativaService.update(id, {
        motivo,
        documentoUrl
      });

      successResponse(res, justificativa, 'Justificativa atualizada com sucesso');
    } catch (error: any) {
      logger.error('Erro ao atualizar justificativa:', error);
      
      if (error.message === 'Justificativa não encontrada') {
        errorResponse(res, 'NOT_FOUND', error.message, 404);
      } else if (error.message.includes('já aprovada')) {
        errorResponse(res, 'BAD_REQUEST', error.message, 400);
      } else {
        errorResponse(res, 'UPDATE_ERROR', error.message);
      }
    }
  }

  /**
   * Aprova ou reprova justificativa
   * PATCH /api/v1/frequencia/justificativas/:id/aprovar
   */
  async aprovar(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { aprovada } = req.body;
      const aprovadaPor = req.userId!;

      const justificativa = await justificativaService.aprovar(id, {
        aprovada,
        aprovadaPor
      });

      successResponse(
        res,
        justificativa,
        `Justificativa ${aprovada ? 'aprovada' : 'reprovada'} com sucesso`
      );
    } catch (error: any) {
      logger.error('Erro ao aprovar justificativa:', error);
      
      if (error.message === 'Justificativa não encontrada') {
        errorResponse(res, 'NOT_FOUND', error.message, 404);
      } else if (error.message.includes('já foi processada')) {
        errorResponse(res, 'BAD_REQUEST', error.message, 400);
      } else {
        errorResponse(res, 'APPROVAL_ERROR', error.message);
      }
    }
  }

  /**
   * Deleta justificativa
   * DELETE /api/v1/frequencia/justificativas/:id
   */
  async delete(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      await justificativaService.delete(id);

      successResponse(res, null, 'Justificativa excluída com sucesso', 204);
    } catch (error: any) {
      logger.error('Erro ao excluir justificativa:', error);
      
      if (error.message === 'Justificativa não encontrada') {
        errorResponse(res, 'NOT_FOUND', error.message, 404);
      } else if (error.message.includes('aprovada')) {
        errorResponse(res, 'BAD_REQUEST', error.message, 400);
      } else {
        errorResponse(res, 'DELETE_ERROR', error.message);
      }
    }
  }

  /**
   * Busca justificativas pendentes
   * GET /api/v1/frequencia/justificativas/pendentes
   */
  async getPendentes(req: Request, res: Response): Promise<void> {
    try {
      const { turmaId } = req.query;
      const justificativas = await justificativaService.getPendentes(turmaId as string);

      successResponse(res, justificativas, 'Justificativas pendentes listadas com sucesso');
    } catch (error: any) {
      logger.error('Erro ao buscar justificativas pendentes:', error);
      errorResponse(res, 'FETCH_ERROR', error.message);
    }
  }
}

export const justificativaController = new JustificativaController();

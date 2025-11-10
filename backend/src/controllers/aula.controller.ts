import { Request, Response } from 'express';
import { aulaService } from '../services/aula.service';
import { successResponse, errorResponse } from '../utils/response.util';
import { logger } from '../config/logger';

export class AulaController {
  /**
   * Lista aulas com filtros
   * GET /api/v1/frequencia/aulas
   */
  async list(req: Request, res: Response): Promise<void> {
    try {
      const {
        turmaId,
        turmaDisciplinaId,
        professorId,
        dataInicio,
        dataFim,
        status,
        page,
        limit
      } = req.query;

      const filters = {
        turmaId: turmaId as string,
        turmaDisciplinaId: turmaDisciplinaId as string,
        professorId: professorId as string,
        dataInicio: dataInicio ? new Date(dataInicio as string) : undefined,
        dataFim: dataFim ? new Date(dataFim as string) : undefined,
        status: status as string,
        page: page ? Number(page) : 1,
        limit: limit ? Number(limit) : 20
      };

      const result = await aulaService.list(filters);

      successResponse(res, result.data, 'Aulas listadas com sucesso', 200, result.meta);
    } catch (error: any) {
      logger.error('Erro ao listar aulas:', error);
      errorResponse(res, 'LIST_ERROR', error.message);
    }
  }

  /**
   * Busca aula por ID
   * GET /api/v1/frequencia/aulas/:id
   */
  async findById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const aula = await aulaService.findById(id);

      successResponse(res, aula, 'Aula encontrada');
    } catch (error: any) {
      logger.error('Erro ao buscar aula:', error);
      if (error.message === 'Aula não encontrada') {
        errorResponse(res, 'NOT_FOUND', error.message, 404);
      } else {
        errorResponse(res, 'FETCH_ERROR', error.message);
      }
    }
  }

  /**
   * Cria nova aula
   * POST /api/v1/frequencia/aulas
   */
  async create(req: Request, res: Response): Promise<void> {
    try {
      const {
        turmaDisciplinaId,
        turmaId,
        data,
        horaInicio,
        horaFim,
        conteudo,
        professorId
      } = req.body;

      const aula = await aulaService.create({
        turmaDisciplinaId,
        turmaId,
        data: new Date(data),
        horaInicio,
        horaFim,
        conteudo,
        professorId
      });

      successResponse(res, aula, 'Aula criada com sucesso', 201);
    } catch (error: any) {
      logger.error('Erro ao criar aula:', error);
      
      if (error.message.includes('não encontrada')) {
        errorResponse(res, 'NOT_FOUND', error.message, 404);
      } else if (error.message.includes('Conflito')) {
        errorResponse(res, 'CONFLICT', error.message, 409);
      } else {
        errorResponse(res, 'CREATE_ERROR', error.message);
      }
    }
  }

  /**
   * Atualiza aula
   * PUT /api/v1/frequencia/aulas/:id
   */
  async update(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { data, horaInicio, horaFim, conteudo, status } = req.body;

      const updateData: any = {};
      if (data) updateData.data = new Date(data);
      if (horaInicio) updateData.horaInicio = horaInicio;
      if (horaFim) updateData.horaFim = horaFim;
      if (conteudo !== undefined) updateData.conteudo = conteudo;
      if (status) updateData.status = status;

      const aula = await aulaService.update(id, updateData);

      successResponse(res, aula, 'Aula atualizada com sucesso');
    } catch (error: any) {
      logger.error('Erro ao atualizar aula:', error);
      
      if (error.message === 'Aula não encontrada') {
        errorResponse(res, 'NOT_FOUND', error.message, 404);
      } else if (error.message.includes('Conflito')) {
        errorResponse(res, 'CONFLICT', error.message, 409);
      } else {
        errorResponse(res, 'UPDATE_ERROR', error.message);
      }
    }
  }

  /**
   * Cancela aula
   * PATCH /api/v1/frequencia/aulas/:id/cancelar
   */
  async cancel(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { motivo } = req.body;

      const aula = await aulaService.cancel(id, motivo);

      successResponse(res, aula, 'Aula cancelada com sucesso');
    } catch (error: any) {
      logger.error('Erro ao cancelar aula:', error);
      
      if (error.message === 'Aula não encontrada') {
        errorResponse(res, 'NOT_FOUND', error.message, 404);
      } else if (error.message.includes('já está cancelada')) {
        errorResponse(res, 'BAD_REQUEST', error.message, 400);
      } else {
        errorResponse(res, 'CANCEL_ERROR', error.message);
      }
    }
  }

  /**
   * Deleta aula
   * DELETE /api/v1/frequencia/aulas/:id
   */
  async delete(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      await aulaService.delete(id);

      successResponse(res, null, 'Aula excluída com sucesso', 204);
    } catch (error: any) {
      logger.error('Erro ao excluir aula:', error);
      
      if (error.message === 'Aula não encontrada') {
        errorResponse(res, 'NOT_FOUND', error.message, 404);
      } else {
        errorResponse(res, 'DELETE_ERROR', error.message);
      }
    }
  }

  /**
   * Busca aulas do dia para uma turma
   * GET /api/v1/frequencia/aulas/turma/:turmaId/dia/:data
   */
  async getAulasDoDia(req: Request, res: Response): Promise<void> {
    try {
      const { turmaId, data } = req.params;
      const dataFormatada = new Date(data);

      const aulas = await aulaService.getAulasDoDia(turmaId, dataFormatada);

      successResponse(res, aulas, 'Aulas do dia listadas com sucesso');
    } catch (error: any) {
      logger.error('Erro ao buscar aulas do dia:', error);
      errorResponse(res, 'FETCH_ERROR', error.message);
    }
  }
}

export const aulaController = new AulaController();

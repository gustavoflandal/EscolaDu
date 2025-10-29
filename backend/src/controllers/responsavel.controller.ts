import { Request, Response } from 'express';
import { responsavelService } from '../services/responsavel.service';
import { successResponse, errorResponse } from '../utils/response.util';
import { logger } from '../config/logger';

export class ResponsavelController {
  /**
   * Lista responsáveis com paginação e filtros
   * GET /api/v1/responsaveis
   */
  async list(req: Request, res: Response): Promise<void> {
    try {
      const { search, active, page, limit } = req.query;

      const filters = {
        search: search as string,
        active: active === 'true' ? true : active === 'false' ? false : undefined,
        page: page ? Number(page) : 1,
        limit: limit ? Number(limit) : 10
      };

      const result = await responsavelService.list(filters);

      successResponse(res, result.data, 'Responsáveis listados com sucesso', 200, result.meta);
    } catch (error: any) {
      logger.error('Erro ao listar responsáveis:', error);
      errorResponse(res, 'LIST_ERROR', error.message);
    }
  }

  /**
   * Busca responsável por ID
   * GET /api/v1/responsaveis/:id
   */
  async findById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const responsavel = await responsavelService.findById(id);

      successResponse(res, responsavel, 'Responsável encontrado');
    } catch (error: any) {
      logger.error('Erro ao buscar responsável:', error);
      if (error.message === 'Responsável não encontrado') {
        errorResponse(res, 'NOT_FOUND', error.message, 404);
      } else {
        errorResponse(res, 'FETCH_ERROR', error.message);
      }
    }
  }

  /**
   * Busca responsável por CPF
   * GET /api/v1/responsaveis/cpf/:cpf
   */
  async findByCPF(req: Request, res: Response): Promise<void> {
    try {
      const { cpf } = req.params;
      const responsavel = await responsavelService.findByCPF(cpf);

      if (!responsavel) {
        errorResponse(res, 'NOT_FOUND', 'Responsável não encontrado', 404);
        return;
      }

      successResponse(res, responsavel, 'Responsável encontrado');
    } catch (error: any) {
      logger.error('Erro ao buscar responsável por CPF:', error);
      errorResponse(res, 'FETCH_ERROR', error.message);
    }
  }

  /**
   * Cria novo responsável
   * POST /api/v1/responsaveis
   */
  async create(req: Request, res: Response): Promise<void> {
    try {
      const responsavel = await responsavelService.create(req.body);

      successResponse(res, responsavel, 'Responsável criado com sucesso', 201);
    } catch (error: any) {
      logger.error('Erro ao criar responsável:', error);
      
      if (error.message.includes('já cadastrado')) {
        errorResponse(res, 'CONFLICT', error.message, 409);
      } else {
        errorResponse(res, 'CREATE_ERROR', error.message);
      }
    }
  }

  /**
   * Atualiza responsável
   * PUT /api/v1/responsaveis/:id
   */
  async update(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const responsavel = await responsavelService.update(id, req.body);

      successResponse(res, responsavel, 'Responsável atualizado com sucesso');
    } catch (error: any) {
      logger.error('Erro ao atualizar responsável:', error);
      
      if (error.message === 'Responsável não encontrado') {
        errorResponse(res, 'NOT_FOUND', error.message, 404);
      } else if (error.message.includes('já cadastrado')) {
        errorResponse(res, 'CONFLICT', error.message, 409);
      } else {
        errorResponse(res, 'UPDATE_ERROR', error.message);
      }
    }
  }

  /**
   * Remove responsável (soft delete)
   * DELETE /api/v1/responsaveis/:id
   */
  async delete(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      await responsavelService.delete(id);

      successResponse(res, null, 'Responsável removido com sucesso', 204);
    } catch (error: any) {
      logger.error('Erro ao remover responsável:', error);
      
      if (error.message === 'Responsável não encontrado') {
        errorResponse(res, 'NOT_FOUND', error.message, 404);
      } else if (error.message.includes('alunos vinculados')) {
        errorResponse(res, 'BAD_REQUEST', error.message, 400);
      } else {
        errorResponse(res, 'DELETE_ERROR', error.message);
      }
    }
  }

  /**
   * Cria vínculo entre responsável e aluno
   * POST /api/v1/responsaveis/:id/vinculos
   */
  async createVinculo(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { alunoId, prioridadeContato } = req.body;

      const vinculo = await responsavelService.createVinculo({
        responsavelId: id,
        alunoId,
        prioridadeContato
      });

      successResponse(res, vinculo, 'Vínculo criado com sucesso', 201);
    } catch (error: any) {
      logger.error('Erro ao criar vínculo:', error);
      
      if (error.message.includes('não encontrado')) {
        errorResponse(res, 'NOT_FOUND', error.message, 404);
      } else if (error.message.includes('já existe')) {
        errorResponse(res, 'CONFLICT', error.message, 409);
      } else {
        errorResponse(res, 'CREATE_ERROR', error.message);
      }
    }
  }

  /**
   * Remove vínculo
   * DELETE /api/v1/responsaveis/vinculos/:vinculoId
   */
  async removeVinculo(req: Request, res: Response): Promise<void> {
    try {
      const { vinculoId } = req.params;
      await responsavelService.removeVinculo(vinculoId);

      successResponse(res, null, 'Vínculo removido com sucesso', 204);
    } catch (error: any) {
      logger.error('Erro ao remover vínculo:', error);
      
      if (error.message === 'Vínculo não encontrado') {
        errorResponse(res, 'NOT_FOUND', error.message, 404);
      } else {
        errorResponse(res, 'DELETE_ERROR', error.message);
      }
    }
  }

  /**
   * Atualiza vínculo
   * PATCH /api/v1/responsaveis/vinculos/:vinculoId
   */
  async updateVinculo(req: Request, res: Response): Promise<void> {
    try {
      const { vinculoId } = req.params;
      const { prioridadeContato } = req.body;

      const vinculo = await responsavelService.updateVinculo(vinculoId, {
        prioridadeContato
      });

      successResponse(res, vinculo, 'Vínculo atualizado com sucesso');
    } catch (error: any) {
      logger.error('Erro ao atualizar vínculo:', error);
      
      if (error.message === 'Vínculo não encontrado') {
        errorResponse(res, 'NOT_FOUND', error.message, 404);
      } else {
        errorResponse(res, 'UPDATE_ERROR', error.message);
      }
    }
  }

  /**
   * Lista alunos de um responsável
   * GET /api/v1/responsaveis/:id/alunos
   */
  async getAlunos(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const alunos = await responsavelService.getAlunosByResponsavel(id);

      successResponse(res, alunos, 'Alunos listados com sucesso');
    } catch (error: any) {
      logger.error('Erro ao listar alunos do responsável:', error);
      errorResponse(res, 'FETCH_ERROR', error.message);
    }
  }
}

export const responsavelController = new ResponsavelController();

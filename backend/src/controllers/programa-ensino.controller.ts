import { Request, Response, NextFunction } from 'express';
import programaEnsinoService from '../services/programa-ensino.service';
import { successResponse } from '../utils/response.util';
import { ListProgramasEnsinoQuery } from '../validators/programa-ensino.validator';

export class ProgramaEnsinoController {
  /**
   * Criar novo programa de ensino
   */
  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const programa = await programaEnsinoService.create(req.body);
      successResponse(res, programa, 'Programa de ensino criado com sucesso', 201);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Listar programas de ensino com filtros e paginação
   */
  async list(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await programaEnsinoService.list(req.query as unknown as ListProgramasEnsinoQuery);
      successResponse(res, result.data, 'Programas listados com sucesso', 200, result.pagination);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Buscar programa de ensino por ID
   */
  async findById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const programa = await programaEnsinoService.findById(id);
      successResponse(res, programa, 'Programa encontrado com sucesso');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Atualizar programa de ensino
   */
  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const programa = await programaEnsinoService.update(id, req.body);
      successResponse(res, programa, 'Programa atualizado com sucesso');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Desativar programa de ensino
   */
  async deactivate(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const programa = await programaEnsinoService.deactivate(id);
      successResponse(res, programa, 'Programa desativado com sucesso');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Reativar programa de ensino
   */
  async activate(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const programa = await programaEnsinoService.activate(id);
      successResponse(res, programa, 'Programa reativado com sucesso');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Deletar programa de ensino
   */
  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      await programaEnsinoService.delete(id);
      successResponse(res, null, 'Programa excluído com sucesso');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Buscar séries disponíveis
   */
  async getSeries(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const series = await programaEnsinoService.getSeries();
      successResponse(res, series, 'Séries listadas com sucesso');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Buscar anos letivos disponíveis
   */
  async getAnosLetivos(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const anos = await programaEnsinoService.getAnosLetivos();
      successResponse(res, anos, 'Anos letivos listados com sucesso');
    } catch (error) {
      next(error);
    }
  }
}

export default new ProgramaEnsinoController();

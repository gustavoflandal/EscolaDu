import { Request, Response, NextFunction } from 'express';
import objetivoAprendizagemService from '../services/objetivo-aprendizagem.service';
import { successResponse } from '../utils/response.util';
import { ListObjetivosQuery } from '../validators/objetivo-aprendizagem.validator';

export class ObjetivoAprendizagemController {
  /**
   * Criar novo objetivo de aprendizagem
   */
  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const objetivo = await objetivoAprendizagemService.create(req.body);
      successResponse(res, objetivo, 'Objetivo de aprendizagem criado com sucesso', 201);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Listar objetivos de aprendizagem com filtros e paginação
   */
  async list(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const query = req.query as unknown as ListObjetivosQuery | undefined;
      const result = await objetivoAprendizagemService.list(query);
      successResponse(res, result.data, 'Objetivos listados com sucesso', 200, result.pagination);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Buscar objetivo de aprendizagem por ID
   */
  async findById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const objetivo = await objetivoAprendizagemService.findById(id);
      successResponse(res, objetivo, 'Objetivo encontrado com sucesso');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Atualizar objetivo de aprendizagem
   */
  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const objetivo = await objetivoAprendizagemService.update(id, req.body);
      successResponse(res, objetivo, 'Objetivo atualizado com sucesso');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Desativar objetivo de aprendizagem
   */
  async deactivate(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const objetivo = await objetivoAprendizagemService.deactivate(id);
      successResponse(res, objetivo, 'Objetivo desativado com sucesso');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Reativar objetivo de aprendizagem
   */
  async activate(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const objetivo = await objetivoAprendizagemService.activate(id);
      successResponse(res, objetivo, 'Objetivo reativado com sucesso');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Deletar objetivo de aprendizagem
   */
  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      await objetivoAprendizagemService.delete(id);
      successResponse(res, null, 'Objetivo excluído com sucesso');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Reordenar objetivos de um programa
   */
  async reorder(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { programaEnsinoId } = req.params;
      const { objetivosOrdem } = req.body;
      await objetivoAprendizagemService.reorder(programaEnsinoId, objetivosOrdem);
      successResponse(res, null, 'Objetivos reordenados com sucesso');
    } catch (error) {
      next(error);
    }
  }
}

export default new ObjetivoAprendizagemController();

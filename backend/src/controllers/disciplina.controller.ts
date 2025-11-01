import type { Request, Response, NextFunction } from 'express';
import disciplinaService from '../services/disciplina.service';
import { successResponse } from '../utils/response.util';

export class DisciplinaController {
  // ==================== DISCIPLINAS ====================

  async list(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const filters = {
        search: req.query.search as string | undefined,
        areaConhecimento: req.query.areaConhecimento as string | undefined,
        ativa: req.query.ativa === 'true' ? true : req.query.ativa === 'false' ? false : undefined,
        page: req.query.page ? parseInt(req.query.page as string) : undefined,
        limit: req.query.limit ? parseInt(req.query.limit as string) : undefined
      };

      const result = await disciplinaService.findAll(filters);
      successResponse(res, result, 'Disciplinas listadas com sucesso');
    } catch (error) {
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const disciplina = await disciplinaService.findById(id);
      successResponse(res, disciplina, 'Disciplina encontrada');
    } catch (error) {
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const disciplina = await disciplinaService.create(req.body);
      successResponse(res, disciplina, 'Disciplina criada com sucesso', 201);
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const disciplina = await disciplinaService.update(id, req.body);
      successResponse(res, disciplina, 'Disciplina atualizada com sucesso');
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      await disciplinaService.delete(id);
      successResponse(res, null, 'Disciplina excluída com sucesso');
    } catch (error) {
      next(error);
    }
  }

  async getAreasConhecimento(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const areas = await disciplinaService.getAreasConhecimento();
      successResponse(res, areas, 'Áreas de conhecimento listadas com sucesso');
    } catch (error) {
      next(error);
    }
  }

  // ==================== OBJETIVOS DE APRENDIZAGEM ====================

  async listObjetivos(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const filters = {
        search: req.query.search as string | undefined,
        disciplinaId: req.query.disciplinaId as string | undefined,
        programaEnsinoId: req.query.programaEnsinoId as string | undefined,
        page: req.query.page ? parseInt(req.query.page as string) : undefined,
        limit: req.query.limit ? parseInt(req.query.limit as string) : undefined
      };

      const result = await disciplinaService.findAllObjetivos(filters);
      successResponse(res, result, 'Objetivos listados com sucesso');
    } catch (error) {
      next(error);
    }
  }

  async getObjetivoById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const objetivo = await disciplinaService.findObjetivoById(id);
      successResponse(res, objetivo, 'Objetivo encontrado');
    } catch (error) {
      next(error);
    }
  }

  async createObjetivo(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { disciplinaId } = req.params;
      const objetivo = await disciplinaService.createObjetivo(disciplinaId, req.body);
      successResponse(res, objetivo, 'Objetivo criado com sucesso', 201);
    } catch (error) {
      next(error);
    }
  }

  async updateObjetivo(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const objetivo = await disciplinaService.updateObjetivo(id, req.body);
      successResponse(res, objetivo, 'Objetivo atualizado com sucesso');
    } catch (error) {
      next(error);
    }
  }

  async deleteObjetivo(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      await disciplinaService.deleteObjetivo(id);
      successResponse(res, null, 'Objetivo excluído com sucesso');
    } catch (error) {
      next(error);
    }
  }

  async getSeries(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const series = await disciplinaService.getSeries();
      successResponse(res, series, 'Séries listadas com sucesso');
    } catch (error) {
      next(error);
    }
  }

  async getPeriodos(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const periodos = await disciplinaService.getPeriodos();
      successResponse(res, periodos, 'Períodos listados com sucesso');
    } catch (error) {
      next(error);
    }
  }

  async getObjetivosPorDisciplina(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { disciplinaId } = req.params;
      const objetivos = await disciplinaService.getObjetivosPorDisciplina(disciplinaId);
      successResponse(res, objetivos, 'Objetivos da disciplina listados com sucesso');
    } catch (error) {
      next(error);
    }
  }

  // ==================== TURMAS ====================

  async getTurmas(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const turmas = await disciplinaService.getTurmas(id);
      successResponse(res, turmas, 'Turmas vinculadas listadas com sucesso');
    } catch (error) {
      next(error);
    }
  }

  async vincularTurma(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const { turmaId, professorId, diaSemana, horarioInicio, horarioFim } = req.body;
      const vinculo = await disciplinaService.vincularTurma(id, {
        turmaId,
        professorId,
        diaSemana,
        horarioInicio,
        horarioFim
      });
      successResponse(res, vinculo, 'Turma vinculada com sucesso', 201);
    } catch (error) {
      next(error);
    }
  }

  async atualizarVinculoTurma(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id, vinculoId } = req.params;
      const vinculo = await disciplinaService.atualizarVinculoTurma(id, vinculoId, req.body);
      successResponse(res, vinculo, 'Vínculo atualizado com sucesso');
    } catch (error) {
      next(error);
    }
  }

  async desvincularTurma(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id, turmaId } = req.params;
      await disciplinaService.desvincularTurma(id, turmaId);
      successResponse(res, null, 'Turma desvinculada com sucesso');
    } catch (error) {
      next(error);
    }
  }

  async getTurmasDisponiveis(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const turmas = await disciplinaService.getTurmasDisponiveis(id);
      successResponse(res, turmas, 'Turmas disponíveis listadas com sucesso');
    } catch (error) {
      next(error);
    }
  }
}

export default new DisciplinaController();

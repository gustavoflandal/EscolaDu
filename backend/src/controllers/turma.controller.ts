import { Request, Response, NextFunction } from 'express';
import turmaService from '../services/turma.service';
import { successResponse, errorResponse } from '../utils/response.util';
import type {
  CreateTurmaInput,
  UpdateTurmaInput,
  AddAlunoToTurmaInput,
  QueryTurmasInput,
} from '../validators/turma.validator';

/**
 * Controller para gerenciamento de turmas
 */
class TurmaController {
  /**
   * GET /api/v1/turmas
   * Lista turmas com paginação e filtros
   */
  async list(req: Request, res: Response, next: NextFunction) {
    try {
      const filters = req.query as unknown as QueryTurmasInput;
      const result = await turmaService.findAll(filters);

      return successResponse(res, result, 'Turmas listadas com sucesso');
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/v1/turmas/:id
   * Busca uma turma por ID com seus alunos
   */
  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const turma = await turmaService.findById(id);

      return successResponse(res, turma, 'Turma encontrada');
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/v1/turmas
   * Cria uma nova turma
   */
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const data: CreateTurmaInput = req.body;
      const turma = await turmaService.create(data);

      return successResponse(res, turma, 'Turma criada com sucesso', 201);
    } catch (error) {
      next(error);
    }
  }

  /**
   * PUT /api/v1/turmas/:id
   * Atualiza uma turma existente
   */
  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const data: UpdateTurmaInput = req.body;
      const turma = await turmaService.update(id, data);

      return successResponse(res, turma, 'Turma atualizada com sucesso');
    } catch (error) {
      next(error);
    }
  }

  /**
   * DELETE /api/v1/turmas/:id
   * Exclui uma turma
   */
  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      await turmaService.delete(id);

      return successResponse(res, null, 'Turma excluída com sucesso');
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/v1/turmas/:id/alunos
   * Adiciona um aluno à turma
   */
  async addAluno(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const data: AddAlunoToTurmaInput = req.body;
      const matricula = await turmaService.addAluno(id, data);

      return successResponse(res, matricula, 'Aluno adicionado à turma com sucesso', 201);
    } catch (error) {
      next(error);
    }
  }

  /**
   * DELETE /api/v1/turmas/:id/alunos/:alunoId
   * Remove um aluno da turma
   */
  async removeAluno(req: Request, res: Response, next: NextFunction) {
    try {
      const { id, alunoId } = req.params;
      await turmaService.removeAluno(id, alunoId);

      return successResponse(res, null, 'Aluno removido da turma com sucesso');
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/v1/turmas/:id/alunos-disponiveis
   * Lista alunos disponíveis para adicionar à turma
   */
  async getAlunosDisponiveis(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { search } = req.query;
      const alunos = await turmaService.getAlunosDisponiveis(id, search as string);

      return successResponse(res, alunos, 'Alunos disponíveis listados');
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/v1/turmas/:id/stats
   * Obtém estatísticas da turma
   */
  async getStats(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const stats = await turmaService.getStats(id);

      return successResponse(res, stats, 'Estatísticas da turma obtidas');
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/v1/turmas/anos-letivos
   * Lista anos letivos disponíveis
   */
  async getAnosLetivos(req: Request, res: Response, next: NextFunction) {
    try {
      const anos = await turmaService.getAnosLetivos();

      return successResponse(res, anos, 'Anos letivos listados');
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/v1/turmas/professores-disponiveis
   * Lista professores disponíveis para ser regente
   */
  async getProfessoresDisponiveis(req: Request, res: Response, next: NextFunction) {
    try {
      const professores = await turmaService.getProfessoresDisponiveis();

      return successResponse(res, professores, 'Professores disponíveis listados');
    } catch (error) {
      next(error);
    }
  }
}

export default new TurmaController();

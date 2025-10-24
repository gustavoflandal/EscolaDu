import { Request, Response, NextFunction } from 'express';
import { AlunoService } from '../services/aluno.service';
import { sendSuccess } from '../utils/response.util';
import { logger } from '../config/logger';

export class AlunoController {
  private alunoService: AlunoService;

  constructor() {
    this.alunoService = new AlunoService();
  }

  async list(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { search, active, page = '1', limit = '10' } = req.query;

      const filters = {
        search: search as string | undefined,
        active: active === 'true' ? true : active === 'false' ? false : undefined,
        page: parseInt(page as string, 10),
        limit: parseInt(limit as string, 10),
      };

      const result = await this.alunoService.list(filters);

      sendSuccess(res, result);
    } catch (error) {
      next(error);
    }
  }

  async findById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;

      const aluno = await this.alunoService.findById(id);

      sendSuccess(res, aluno);
    } catch (error) {
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = req.body;

      const aluno = await this.alunoService.create(data);

      logger.info(`Aluno criado: ${aluno.id}`, {
        userId: (req as any).userId,
        alunoId: aluno.id,
      });

      sendSuccess(res, aluno, 'Aluno criado com sucesso', 201);
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const data = req.body;

      const aluno = await this.alunoService.update(id, data);

      logger.info(`Aluno atualizado: ${id}`, {
        userId: (req as any).userId,
        alunoId: id,
      });

      sendSuccess(res, aluno, 'Aluno atualizado com sucesso');
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;

      await this.alunoService.delete(id);

      logger.info(`Aluno deletado: ${id}`, {
        userId: (req as any).userId,
        alunoId: id,
      });

      sendSuccess(res, null, 'Aluno deletado com sucesso');
    } catch (error) {
      next(error);
    }
  }

  async getStats(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;

      const stats = await this.alunoService.getStats(id);

      sendSuccess(res, stats);
    } catch (error) {
      next(error);
    }
  }
}

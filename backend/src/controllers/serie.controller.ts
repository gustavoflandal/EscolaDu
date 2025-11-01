import type { Request, Response, NextFunction } from 'express';
import { prisma } from '../config/database';
import { successResponse } from '../utils/response.util';

export class SerieController {
  async list(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { active } = req.query;
      
      const where: any = {};
      if (active !== undefined) {
        where.active = active === 'true';
      }

      const series = await prisma.serie.findMany({
        where,
        orderBy: { ordem: 'asc' }
      });

      successResponse(res, series, 'Séries listadas com sucesso');
    } catch (error) {
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const serie = await prisma.serie.findUnique({
        where: { id }
      });

      if (!serie) {
        return successResponse(res, null, 'Série não encontrada', 404);
      }

      successResponse(res, serie, 'Série encontrada');
    } catch (error) {
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const serie = await prisma.serie.create({
        data: req.body
      });

      successResponse(res, serie, 'Série criada com sucesso', 201);
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const serie = await prisma.serie.update({
        where: { id },
        data: req.body
      });

      successResponse(res, serie, 'Série atualizada com sucesso');
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      await prisma.serie.update({
        where: { id },
        data: { active: false }
      });

      successResponse(res, null, 'Série inativada com sucesso');
    } catch (error) {
      next(error);
    }
  }
}

export default new SerieController();

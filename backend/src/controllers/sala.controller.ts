import type { Request, Response, NextFunction } from 'express';
import { prisma } from '../config/database';
import { successResponse } from '../utils/response.util';

export class SalaController {
  async list(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { active } = req.query;
      
      const where: any = {};
      if (active !== undefined) {
        where.active = active === 'true';
      }

      const salas = await prisma.sala.findMany({
        where,
        orderBy: { codigo: 'asc' }
      });

      successResponse(res, salas, 'Salas listadas com sucesso');
    } catch (error) {
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const sala = await prisma.sala.findUnique({
        where: { id }
      });

      if (!sala) {
        return successResponse(res, null, 'Sala não encontrada', 404);
      }

      successResponse(res, sala, 'Sala encontrada');
    } catch (error) {
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const sala = await prisma.sala.create({
        data: req.body
      });

      successResponse(res, sala, 'Sala criada com sucesso', 201);
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const sala = await prisma.sala.update({
        where: { id },
        data: req.body
      });

      successResponse(res, sala, 'Sala atualizada com sucesso');
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      await prisma.sala.update({
        where: { id },
        data: { active: false }
      });

      successResponse(res, null, 'Sala inativada com sucesso');
    } catch (error) {
      next(error);
    }
  }
}

export default new SalaController();

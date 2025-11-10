import type { Request, Response, NextFunction } from 'express';
import { prisma } from '../config/database';
import { successResponse } from '../utils/response.util';

export class FeriadoController {
  async list(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { active, tipo, ano } = req.query;
      
      const where: any = {};
      if (active !== undefined) {
        where.active = active === 'true';
      }
      if (tipo) {
        where.tipo = tipo;
      }
      if (ano) {
        const anoNum = parseInt(ano as string);
        where.data = {
          gte: new Date(`${anoNum}-01-01`),
          lte: new Date(`${anoNum}-12-31`)
        };
      }

      const feriados = await prisma.feriado.findMany({
        where,
        orderBy: { data: 'asc' }
      });

      successResponse(res, feriados, 'Feriados listados com sucesso');
    } catch (error) {
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const feriado = await prisma.feriado.findUnique({
        where: { id }
      });

      if (!feriado) {
        successResponse(res, null, 'Feriado não encontrado', 404);
        return;
      }

      successResponse(res, feriado, 'Feriado encontrado');
    } catch (error) {
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const feriado = await prisma.feriado.create({
        data: {
          ...req.body,
          data: new Date(req.body.data)
        }
      });

      successResponse(res, feriado, 'Feriado criado com sucesso', 201);
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const feriado = await prisma.feriado.update({
        where: { id },
        data: {
          ...req.body,
          data: req.body.data ? new Date(req.body.data) : undefined
        }
      });

      successResponse(res, feriado, 'Feriado atualizado com sucesso');
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      await prisma.feriado.update({
        where: { id },
        data: { active: false }
      });

      successResponse(res, null, 'Feriado inativado com sucesso');
    } catch (error) {
      next(error);
    }
  }
}

export default new FeriadoController();

import { Request, Response, NextFunction } from 'express';
import { roleService, permissionService } from '../services/role.service';
import { sendSuccess } from '../utils/response.util';
import { logger } from '../config/logger';

export class RoleController {
  async list(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const roles = await roleService.list();

      sendSuccess(res, roles);
    } catch (error) {
      next(error);
    }
  }

  async findById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;

      const role = await roleService.findById(id);

      sendSuccess(res, role);
    } catch (error) {
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = req.body;

      const role = await roleService.create(data);

      logger.info(`Perfil criado: ${role.id}`, {
        userId: (req as any).userId,
        roleId: role.id,
      });

      sendSuccess(res, role, 'Perfil criado com sucesso', 201);
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const data = req.body;

      const role = await roleService.update(id, data);

      logger.info(`Perfil atualizado: ${id}`, {
        userId: (req as any).userId,
        roleId: id,
      });

      sendSuccess(res, role, 'Perfil atualizado com sucesso');
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;

      await roleService.delete(id);

      logger.info(`Perfil deletado: ${id}`, {
        userId: (req as any).userId,
        roleId: id,
      });

      sendSuccess(res, null, 'Perfil deletado com sucesso');
    } catch (error) {
      next(error);
    }
  }
}

export class PermissionController {
  async list(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const permissions = await permissionService.list();

      sendSuccess(res, permissions);
    } catch (error) {
      next(error);
    }
  }

  async listGroupedByResource(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const grouped = await permissionService.listGroupedByResource();

      sendSuccess(res, grouped);
    } catch (error) {
      next(error);
    }
  }

  async findById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;

      const permission = await permissionService.findById(id);

      sendSuccess(res, permission);
    } catch (error) {
      next(error);
    }
  }
}

export const roleController = new RoleController();
export const permissionController = new PermissionController();

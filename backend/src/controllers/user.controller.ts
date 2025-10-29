import { Request, Response, NextFunction } from 'express';
import { UserService } from '../services/user.service';
import { sendSuccess } from '../utils/response.util';
import { logger } from '../config/logger';

export class UserController {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  async list(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { search, active, roleId, page = '1', limit = '20' } = req.query;

      const filters = {
        search: search as string | undefined,
        active: active === 'true' ? true : active === 'false' ? false : undefined,
        roleId: roleId as string | undefined,
        page: parseInt(page as string, 10),
        limit: parseInt(limit as string, 10),
      };

      const result = await this.userService.list(filters);

      sendSuccess(res, result);
    } catch (error) {
      next(error);
    }
  }

  async findById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;

      const user = await this.userService.findById(id);

      sendSuccess(res, user);
    } catch (error) {
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = req.body;

      const user = await this.userService.create(data);

      logger.info(`Usuário criado: ${user.id}`, {
        userId: (req as any).userId,
        targetUserId: user.id,
      });

      sendSuccess(res, user, 'Usuário criado com sucesso', 201);
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const data = req.body;

      const user = await this.userService.update(id, data);

      logger.info(`Usuário atualizado: ${id}`, {
        userId: (req as any).userId,
        targetUserId: id,
      });

      sendSuccess(res, user, 'Usuário atualizado com sucesso');
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;

      await this.userService.delete(id);

      logger.info(`Usuário deletado: ${id}`, {
        userId: (req as any).userId,
        targetUserId: id,
      });

      sendSuccess(res, null, 'Usuário deletado com sucesso');
    } catch (error) {
      next(error);
    }
  }

  async getUserPermissions(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;

      const permissions = await this.userService.getUserPermissions(id);

      sendSuccess(res, { permissions });
    } catch (error) {
      next(error);
    }
  }
}

export const userController = new UserController();

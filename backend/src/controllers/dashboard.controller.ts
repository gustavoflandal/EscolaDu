import { Request, Response } from 'express';
import { dashboardService } from '../services/dashboard.service';
import { successResponse, errorResponse } from '../utils/response.util';
import { logger } from '../config/logger';

export class DashboardController {
  /**
   * GET /api/dashboard/stats
   * Busca estatísticas do dashboard
   */
  async getStats(req: Request, res: Response): Promise<void> {
    try {
      const stats = await dashboardService.getStats();
      successResponse(res, stats);
    } catch (error: any) {
      logger.error('Erro ao buscar estatísticas:', error);
      errorResponse(res, 'STATS_ERROR', error.message, 400);
    }
  }
}

export const dashboardController = new DashboardController();

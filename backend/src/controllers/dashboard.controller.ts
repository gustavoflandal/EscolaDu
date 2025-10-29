import { Request, Response } from 'express';
import { dashboardService } from '../services/dashboard.service';
import { successResponse, errorResponse } from '../utils/response.util';
import { logger } from '../config/logger';

export class DashboardController {
  /**
   * GET /api/dashboard/stats
   * Busca estatísticas gerais do sistema
   */
  async getStats(_req: Request, res: Response): Promise<void> {
    try {
      const stats = await dashboardService.getGeneralStats();
      successResponse(res, stats);
    } catch (error: any) {
      logger.error('Erro ao buscar estatísticas:', error);
      errorResponse(res, 'STATS_ERROR', error.message, 400);
    }
  }

  /**
   * GET /api/dashboard/recent-activities
   * Busca atividades recentes
   */
  async getRecentActivities(req: Request, res: Response): Promise<void> {
    try {
      const limit = parseInt(req.query.limit as string) || 10;
      const activities = await dashboardService.getRecentActivities(limit);
      successResponse(res, activities);
    } catch (error: any) {
      logger.error('Erro ao buscar atividades recentes:', error);
      errorResponse(res, 'ACTIVITIES_ERROR', error.message, 400);
    }
  }

  /**
   * GET /api/dashboard/alerts
   * Busca alertas do sistema
   */
  async getAlerts(_req: Request, res: Response): Promise<void> {
    try {
      const alerts = await dashboardService.getSystemAlerts();
      successResponse(res, alerts);
    } catch (error: any) {
      logger.error('Erro ao buscar alertas:', error);
      errorResponse(res, 'ALERTS_ERROR', error.message, 400);
    }
  }

  /**
   * POST /api/dashboard/refresh-cache
   * Força a atualização do cache do dashboard
   */
  async refreshCache(_req: Request, res: Response): Promise<void> {
    try {
      dashboardService.invalidateCache();
      successResponse(res, null, 'Cache do dashboard atualizado com sucesso');
    } catch (error: any) {
      logger.error('Erro ao atualizar cache:', error);
      errorResponse(res, 'REFRESH_ERROR', error.message, 400);
    }
  }
}

export const dashboardController = new DashboardController();

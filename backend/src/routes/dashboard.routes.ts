import { Router } from 'express';
import { dashboardController } from '../controllers/dashboard.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

// Todas as rotas requerem autenticação
router.use(authMiddleware);

// GET /api/v1/dashboard/stats - Estatísticas gerais
router.get('/stats', dashboardController.getStats.bind(dashboardController));

// GET /api/v1/dashboard/recent-activities - Atividades recentes
router.get('/recent-activities', dashboardController.getRecentActivities.bind(dashboardController));

// GET /api/v1/dashboard/alerts - Alertas do sistema
router.get('/alerts', dashboardController.getAlerts.bind(dashboardController));

// POST /api/v1/dashboard/refresh-cache - Forçar atualização do cache
router.post('/refresh-cache', dashboardController.refreshCache.bind(dashboardController));

export default router;

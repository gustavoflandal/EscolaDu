import { Router } from 'express';
import { dashboardController } from '../controllers/dashboard.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

/**
 * @route   GET /api/dashboard/stats
 * @desc    Busca estatísticas do dashboard
 * @access  Private
 */
router.get('/stats', authMiddleware, (req, res) =>
  dashboardController.getStats(req, res)
);

export default router;

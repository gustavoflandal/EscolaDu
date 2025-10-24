import { Router } from 'express';
import { authController } from '../controllers/auth.controller';
import { validation } from '../middleware/validation.middleware';
import { authMiddleware } from '../middleware/auth.middleware';
import {
  loginSchema,
  refreshTokenSchema,
  changePasswordSchema,
} from '../validators/auth.validator';

const router = Router();

/**
 * @route   POST /api/auth/login
 * @desc    Login do usuário
 * @access  Public
 */
router.post('/login', validation(loginSchema), (req, res) =>
  authController.login(req, res)
);

/**
 * @route   POST /api/auth/refresh
 * @desc    Atualiza tokens
 * @access  Public
 */
router.post('/refresh', validation(refreshTokenSchema), (req, res) =>
  authController.refreshToken(req, res)
);

/**
 * @route   GET /api/auth/me
 * @desc    Busca dados do usuário autenticado
 * @access  Private
 */
router.get('/me', authMiddleware, (req, res) => authController.me(req, res));

/**
 * @route   POST /api/auth/change-password
 * @desc    Altera senha do usuário
 * @access  Private
 */
router.post(
  '/change-password',
  authMiddleware,
  validation(changePasswordSchema),
  (req, res) => authController.changePassword(req, res)
);

/**
 * @route   POST /api/auth/logout
 * @desc    Logout (client-side)
 * @access  Private
 */
router.post('/logout', authMiddleware, (req, res) =>
  authController.logout(req, res)
);

export default router;

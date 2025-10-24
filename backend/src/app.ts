import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { env } from './config/env';
import { logger } from './config/logger';
import { errorMiddleware } from './middleware/error.middleware';

// Importar rotas
import authRoutes from './routes/auth.routes';

export function createApp(): Application {
  const app = express();

  // Middlewares de segurança
  app.use(helmet());
  app.use(
    cors({
      origin: env.corsOrigin,
      credentials: true,
    })
  );

  // Body parser
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // Health check
  app.get('/health', (req, res) => {
    res.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: env.nodeEnv,
    });
  });

  // Rotas API
  app.use('/api/auth', authRoutes);

  // Rota 404
  app.use((req, res) => {
    res.status(404).json({
      success: false,
      error: {
        code: 'NOT_FOUND',
        message: `Rota não encontrada: ${req.method} ${req.path}`,
      },
    });
  });

  // Middleware de tratamento de erros (deve ser o último)
  app.use(errorMiddleware);

  return app;
}

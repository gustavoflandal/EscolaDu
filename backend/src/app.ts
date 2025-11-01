import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { env } from './config/env';
import { errorMiddleware } from './middleware/error.middleware';

// Importar rotas
import authRoutes from './routes/auth.routes';
import alunoRoutes from './routes/aluno.routes';
import dashboardRoutes from './routes/dashboard.routes';
import userRoutes from './routes/user.routes';
import roleRoutes from './routes/role.routes';
import responsavelRoutes from './routes/responsavel.routes';
import professorRoutes from './routes/professor.routes';
import turmaRoutes from './routes/turma.routes';
import disciplinaRoutes from './routes/disciplina.routes';
import programaEnsinoRoutes from './routes/programa-ensino.routes';
import objetivoAprendizagemRoutes from './routes/objetivo-aprendizagem.routes';
import cadastrosRoutes from './routes/cadastros.routes';

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
  app.get('/health', (_req, res) => {
    res.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: env.nodeEnv,
    });
  });

  // Rotas API v1
  app.use('/api/v1/auth', authRoutes);
  app.use('/api/v1/alunos', alunoRoutes);
  app.use('/api/v1/dashboard', dashboardRoutes);
  app.use('/api/v1/users', userRoutes);
  app.use('/api/v1/roles', roleRoutes);
  app.use('/api/v1/responsaveis', responsavelRoutes);
  app.use('/api/v1/professores', professorRoutes);
  app.use('/api/v1/turmas', turmaRoutes);
  app.use('/api/v1/disciplinas', disciplinaRoutes);
  app.use('/api/v1/programas-ensino', programaEnsinoRoutes);
  app.use('/api/v1/objetivos-aprendizagem', objetivoAprendizagemRoutes);
  app.use('/api/v1/cadastros', cadastrosRoutes);

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

import { createApp } from './app';
import { env } from './config/env';
import { logger } from './config/logger';
import { prisma } from './config/database';

async function startServer() {
  try {
    // Testa conexão com o banco
    await prisma.$connect();
    logger.info('✅ Conexão com banco de dados estabelecida');

    // Cria aplicação
    const app = createApp();

    // Inicia servidor
    app.listen(env.port, () => {
      logger.info(`🚀 Servidor rodando na porta ${env.port}`);
      logger.info(`📝 Ambiente: ${env.nodeEnv}`);
      logger.info(`🌐 CORS Origin: ${env.corsOrigin}`);
      logger.info(`📚 Documentação: http://localhost:${env.port}/health`);
    });
  } catch (error) {
    logger.error('❌ Erro ao iniciar servidor:', error);
    process.exit(1);
  }
}

// Tratamento de sinais de encerramento
process.on('SIGTERM', async () => {
  logger.info('SIGTERM recebido, encerrando aplicação...');
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGINT', async () => {
  logger.info('SIGINT recebido, encerrando aplicação...');
  await prisma.$disconnect();
  process.exit(0);
});

// Tratamento de erros não capturados
process.on('uncaughtException', (error) => {
  logger.error('Exceção não capturada:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  logger.error('Promise rejeitada não tratada:', { reason, promise });
  process.exit(1);
});

// Inicia servidor
startServer();

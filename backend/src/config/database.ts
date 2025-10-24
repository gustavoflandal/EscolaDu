import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});

// Tratamento de desconexão
process.on('beforeExit', async () => {
  await prisma.$disconnect();
});

export { prisma };

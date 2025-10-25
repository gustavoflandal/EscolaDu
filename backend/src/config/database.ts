import { PrismaClient } from '@prisma/client';
import mysql from 'mysql2/promise';

const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});

export const dbConfig = {
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: 'root123',
  database: 'escoladu_db',
};

export const testDatabaseConnection = async () => {
  try {
    const connection = await mysql.createConnection(dbConfig);
    await connection.connect();
    console.log('Conexão com o banco de dados bem-sucedida!');
    await connection.end();
  } catch (error) {
    console.error('Erro ao conectar ao banco de dados:', error);
  }
};

// Teste de conexão
testDatabaseConnection();

// Tratamento de desconexão
process.on('beforeExit', async () => {
  await prisma.$disconnect();
});

export { prisma };

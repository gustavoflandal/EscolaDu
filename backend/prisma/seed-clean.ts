/**
 * SEED CLEAN
 * Limpa o banco de dados para recomeçar do zero
 * Preserva apenas o usuário admin
 * Executa: npx ts-node prisma/seed-clean.ts
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function clean() {
  console.log('🧹 Limpando banco de dados...\n');

  try {
    // Ordem reversa de dependências para evitar erros de foreign key

    console.log('Deletando avaliações e evidências...');
    await prisma.evidenciaAprendizagem.deleteMany({});
    await prisma.avaliacaoObjetivo.deleteMany({});
    
    console.log('Deletando objetivos de aprendizagem...');
    await prisma.objetivoAprendizagem.deleteMany({});
    
    console.log('Deletando programas de ensino...');
    await prisma.programaEnsino.deleteMany({});
    
    console.log('Deletando aulas e frequências...');
    await prisma.registroFrequencia.deleteMany({});
    await prisma.justificativaFalta.deleteMany({});
    await prisma.aula.deleteMany({});
    
    console.log('Deletando vínculos turma-disciplina...');
    await prisma.turmaDisciplina.deleteMany({});
    
    console.log('Deletando matrículas...');
    await prisma.matricula.deleteMany({});
    
    console.log('Deletando turmas...');
    await prisma.turma.deleteMany({});
    
    console.log('Deletando alunos e responsáveis...');
    await prisma.vinculoResponsabilidade.deleteMany({});
    await prisma.aluno.deleteMany({});
    await prisma.responsavel.deleteMany({});
    
    console.log('Deletando professores...');
    await prisma.formacao.deleteMany({});
    await prisma.professor.deleteMany({});
    
    console.log('Deletando disciplinas...');
    await prisma.disciplina.deleteMany({});
    
    console.log('Deletando cadastros básicos...');
    await prisma.feriado.deleteMany({});
    await prisma.periodoLetivo.deleteMany({});
    await prisma.sala.deleteMany({});
    await prisma.serie.deleteMany({});
    await prisma.anoLetivo.deleteMany({});
    
    console.log('Deletando usuários (exceto admin)...');
    await prisma.userRole.deleteMany({
      where: {
        user: {
          email: { not: 'admin@sge.com' }
        }
      }
    });
    
    await prisma.user.deleteMany({
      where: {
        email: { not: 'admin@sge.com' }
      }
    });
    
    console.log('\n✅ Banco de dados limpo!');
    console.log('   - Usuário admin preservado: admin@sge.com\n');
    
  } catch (error) {
    console.error('❌ Erro ao limpar banco:', error);
    throw error;
  }
}

clean()
  .catch((e) => {
    console.error('❌ Erro fatal:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

/**
 * Script para limpar completamente o banco de dados
 * Executa: npx ts-node prisma/seed-clean.ts
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function clean() {
  console.log('🧹 Iniciando limpeza do banco de dados...\n');

  try {
    // Deletar em ordem reversa de dependências
    console.log('Deletando avaliações e evidências...');
    await prisma.evidenciaAprendizagem.deleteMany();
    await prisma.avaliacaoObjetivo.deleteMany();
    
    console.log('Deletando frequências e justificativas...');
    await prisma.registroFrequencia.deleteMany();
    await prisma.justificativaFalta.deleteMany();
    
    console.log('Deletando aulas...');
    await prisma.aula.deleteMany();
    
    console.log('Deletando comunicados e planos de recuperação...');
    await prisma.comunicado.deleteMany();
    await prisma.planoRecuperacao.deleteMany();
    
    console.log('Deletando vínculos turma-disciplina...');
    await prisma.turmaDisciplina.deleteMany();
    
    console.log('Deletando matrículas...');
    await prisma.matricula.deleteMany();
    
    console.log('Deletando objetivos de aprendizagem...');
    await prisma.objetivoAprendizagem.deleteMany();
    
    console.log('Deletando programas de ensino...');
    await prisma.programaEnsino.deleteMany();
    
    console.log('Deletando turmas...');
    await prisma.turma.deleteMany();
    
    console.log('Deletando alunos e vínculos...');
    await prisma.vinculoResponsabilidade.deleteMany();
    await prisma.aluno.deleteMany();
    
    console.log('Deletando formações de professores...');
    await prisma.formacaoProfessor.deleteMany();
    
    console.log('Deletando professores e responsáveis...');
    await prisma.professor.deleteMany();
    await prisma.responsavel.deleteMany();
    
    console.log('Deletando disciplinas...');
    await prisma.disciplina.deleteMany();
    
    console.log('Deletando cadastros básicos...');
    await prisma.periodoLetivo.deleteMany();
    await prisma.feriado.deleteMany();
    await prisma.sala.deleteMany();
    await prisma.serie.deleteMany();
    await prisma.anoLetivo.deleteMany();
    
    console.log('Deletando permissões e roles...');
    await prisma.rolePermission.deleteMany();
    await prisma.userRole.deleteMany();
    await prisma.permission.deleteMany();
    await prisma.role.deleteMany();
    
    console.log('Deletando logs de auditoria...');
    await prisma.auditLog.deleteMany();
    
    console.log('Deletando usuários (exceto admin)...');
    await prisma.user.deleteMany({
      where: {
        email: { not: 'admin@sge.com' }
      }
    });

    console.log('\n✅ Banco de dados limpo com sucesso!');
    console.log('ℹ️  Usuário admin mantido: admin@sge.com / Admin@2024\n');
  } catch (error) {
    console.error('❌ Erro ao limpar banco:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

clean();

/**
 * SEED 6: Alunos
 * Alunos com matrículas nas turmas
 * Executa: npx ts-node prisma/seed-6-alunos.ts
 */

import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

// Nomes realistas para geração
const nomes = [
  'Lucas', 'Matheus', 'Gabriel', 'Felipe', 'Pedro', 'João', 'Gustavo', 'Rafael',
  'Ana', 'Maria', 'Júlia', 'Beatriz', 'Laura', 'Isabella', 'Manuela', 'Sophia',
  'Miguel', 'Arthur', 'Davi', 'Enzo', 'Nicolas', 'Lorenzo', 'Heitor', 'Bernardo',
  'Alice', 'Helena', 'Valentina', 'Marina', 'Cecília', 'Luiza', 'Clara', 'Lívia'
];

const sobrenomes = [
  'Silva', 'Santos', 'Oliveira', 'Souza', 'Rodrigues', 'Ferreira', 'Alves', 'Pereira',
  'Lima', 'Gomes', 'Costa', 'Ribeiro', 'Martins', 'Carvalho', 'Rocha', 'Almeida',
  'Nascimento', 'Araújo', 'Melo', 'Barbosa', 'Cardoso', 'Correia', 'Dias', 'Pinto'
];

function gerarNomeCompleto(): string {
  const nome = nomes[Math.floor(Math.random() * nomes.length)];
  const sobrenome1 = sobrenomes[Math.floor(Math.random() * sobrenomes.length)];
  const sobrenome2 = sobrenomes[Math.floor(Math.random() * sobrenomes.length)];
  return `${nome} ${sobrenome1} ${sobrenome2}`;
}

function gerarCPF(): string {
  const n = () => Math.floor(Math.random() * 10);
  return `${n()}${n()}${n()}.${n()}${n()}${n()}.${n()}${n()}${n()}-${n()}${n()}`;
}

function gerarDataNascimento(serieOrdem: number): Date {
  // 1º ano = 6 anos, 2º ano = 7 anos, etc.
  const idade = 5 + serieOrdem;
  const ano = 2025 - idade;
  const mes = Math.floor(Math.random() * 12) + 1;
  const dia = Math.floor(Math.random() * 28) + 1;
  return new Date(ano, mes - 1, dia);
}

async function seed() {
  console.log('👨‍🎓 Seed 6: Alunos\n');

  const turmas = await prisma.turma.findMany({
    include: {
      serie: true
    }
  });

  const anoLetivo = await prisma.anoLetivo.findFirst({ where: { ano: 2025 } });
  const roleResponsavel = await prisma.role.findFirst({ where: { name: 'Responsavel' } });

  if (!anoLetivo) throw new Error('Ano letivo não encontrado');
  if (!roleResponsavel) throw new Error('Role Responsavel não encontrado');

  console.log('Criando alunos e matrículas...\n');

  let totalAlunos = 0;
  let totalMatriculas = 0;
  let totalResponsaveis = 0;
  let contadorResponsavel = 0;

  for (const turma of turmas) {
    const quantidadeAlunos = Math.floor(Math.random() * 6) + 20; // 20 a 25 alunos por turma
    
    console.log(`Turma ${turma.codigo} - ${turma.nome}:`);

    for (let i = 0; i < quantidadeAlunos; i++) {
      const nomeCompleto = gerarNomeCompleto();
      const cpf = gerarCPF();
      const dataNascimento = gerarDataNascimento(turma.serie.ordem);
      const numeroMatricula = `${turma.serie.codigo}${String(totalAlunos + 1).padStart(4, '0')}`;

      // Criar aluno
      const aluno = await prisma.aluno.create({
        data: {
          nome: nomeCompleto,
          cpf,
          dataNascimento,
          matricula: numeroMatricula,
          email: `${nomeCompleto.toLowerCase().replace(/\s+/g, '.')}.aluno@escola.com`,
          endereco: `Rua Exemplo, ${Math.floor(Math.random() * 1000) + 1}`,
          telefone: `(11) 9${Math.floor(Math.random() * 10000000) + 10000000}`
        }
      });

      totalAlunos++;

      // Criar matrícula
      await prisma.matricula.create({
        data: {
          alunoId: aluno.id,
          turmaId: turma.id,
          dataMatricula: new Date(2025, 0, 15), // 15/01/2025
          status: 'ATIVO'
        }
      });

      totalMatriculas++;
      // Criar responsável (1 a cada 2 alunos para simular irmãos)
      if (i % 2 === 0) {
        contadorResponsavel++;
        const sobrenomeAluno = nomeCompleto.split(' ').slice(-1)[0];
        const nomeResponsavel = Math.random() > 0.5 ? 
          `Carlos ${sobrenomeAluno}` : 
          `Patricia ${sobrenomeAluno}`;
        
        const emailResponsavel = `${nomeResponsavel.toLowerCase().replace(/\s+/g, '.')}.resp${contadorResponsavel}@email.com`;
        const senhaHash = await bcrypt.hash('Resp@2024', 10);

        // Criar usuário do responsável
        const userResponsavel = await prisma.user.create({
          data: {
            email: emailResponsavel,
            password: senhaHash,
            name: nomeResponsavel,
            active: true
          }
        });

        // Vincular role
        await prisma.userRole.create({
          data: {
            userId: userResponsavel.id,
            roleId: roleResponsavel.id
          }
        });

        // Criar responsável
        const responsavel = await prisma.responsavel.create({
          data: {
            cpf: gerarCPF(),
            tipoVinculo: Math.random() > 0.5 ? 'PAI' : 'MAE',
            telefonePrincipal: `(11) 9${Math.floor(Math.random() * 10000000) + 10000000}`,
            email: emailResponsavel,
            userId: userResponsavel.id
          }
        });

        totalResponsaveis++;

        // Vincular responsável ao aluno
        await prisma.vinculoResponsabilidade.create({
          data: {
            alunoId: aluno.id,
            responsavelId: responsavel.id,
            prioridadeContato: 1
          }
        });
      }
    }

    console.log(`  ✓ ${quantidadeAlunos} alunos matriculados`);
  }

  console.log(`\n✅ Dados criados:`);
  console.log(`   - ${totalAlunos} alunos`);
  console.log(`   - ${totalMatriculas} matrículas`);
  console.log(`   - ${totalResponsaveis} responsáveis`);
  console.log(`   - Média: ${Math.round(totalAlunos / turmas.length)} alunos por turma\n`);

  console.log('✅ Seed 6 concluído com sucesso!\n');
}

seed()
  .catch((e) => {
    console.error('❌ Erro no seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

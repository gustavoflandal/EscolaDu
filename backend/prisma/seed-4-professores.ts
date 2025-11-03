/**
 * SEED 4: Professores
 * Professores com formações e usuários
 * Executa: npx ts-node prisma/seed-4-professores.ts
 */

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function seed() {
  console.log('👨‍🏫 Seed 4: Professores\n');

  // Buscar role de professor
  const professorRole = await prisma.role.findFirst({
    where: { name: 'Professor' }
  });

  if (!professorRole) {
    throw new Error('Role Professor não encontrada. Execute seed-1-permissions primeiro.');
  }

  const professores = [
    {
      nome: 'Maria Silva Santos',
      email: 'maria.silva@escola.com',
      cpf: '11111111111',
      phone: '(11) 98765-4321',
      registroProfissional: 'RG-PORT-2015',
      cargaHoraria: 40,
      formacoes: [
        { instituicao: 'USP', curso: 'Letras - Português', nivel: 'GRADUACAO', anoConclusao: 2015 },
        { instituicao: 'UNICAMP', curso: 'Metodologia do Ensino de Português', nivel: 'POS_GRADUACAO', anoConclusao: 2018 }
      ]
    },
    {
      nome: 'João Pedro Oliveira',
      email: 'joao.oliveira@escola.com',
      cpf: '22222222222',
      phone: '(11) 98765-4322',
      registroProfissional: 'RG-MAT-2016',
      cargaHoraria: 40,
      formacoes: [
        { instituicao: 'UNESP', curso: 'Matemática', nivel: 'GRADUACAO', anoConclusao: 2016 },
        { instituicao: 'USP', curso: 'Educação Matemática', nivel: 'MESTRADO', anoConclusao: 2019 }
      ]
    },
    {
      nome: 'Ana Paula Costa',
      email: 'ana.costa@escola.com',
      cpf: '33333333333',
      phone: '(11) 98765-4323',
      registroProfissional: 'RG-CIEN-2017',
      cargaHoraria: 30,
      formacoes: [
        { instituicao: 'PUC-SP', curso: 'Ciências Biológicas', nivel: 'GRADUACAO', anoConclusao: 2017 }
      ]
    },
    {
      nome: 'Carlos Eduardo Lima',
      email: 'carlos.lima@escola.com',
      cpf: '44444444444',
      phone: '(11) 98765-4324',
      registroProfissional: 'RG-HIST-2014',
      cargaHoraria: 30,
      formacoes: [
        { instituicao: 'UNICAMP', curso: 'História', nivel: 'GRADUACAO', anoConclusao: 2014 }
      ]
    },
    {
      nome: 'Fernanda Rocha Alves',
      email: 'fernanda.alves@escola.com',
      cpf: '55555555555',
      phone: '(11) 98765-4325',
      registroProfissional: 'RG-GEO-2016',
      cargaHoraria: 30,
      formacoes: [
        { instituicao: 'USP', curso: 'Geografia', nivel: 'GRADUACAO', anoConclusao: 2016 }
      ]
    },
    {
      nome: 'Ricardo Mendes Souza',
      email: 'ricardo.souza@escola.com',
      cpf: '66666666666',
      phone: '(11) 98765-4326',
      registroProfissional: 'RG-ARTE-2015',
      cargaHoraria: 20,
      formacoes: [
        { instituicao: 'UNESP', curso: 'Artes Visuais', nivel: 'GRADUACAO', anoConclusao: 2015 }
      ]
    },
    {
      nome: 'Juliana Santos Ferreira',
      email: 'juliana.ferreira@escola.com',
      cpf: '77777777777',
      phone: '(11) 98765-4327',
      registroProfissional: 'RG-EDFIS-2017',
      cargaHoraria: 30,
      formacoes: [
        { instituicao: 'PUC-SP', curso: 'Educação Física', nivel: 'GRADUACAO', anoConclusao: 2017 }
      ]
    },
    {
      nome: 'Rafael Almeida Silva',
      email: 'rafael.silva@escola.com',
      cpf: '88888888888',
      phone: '(11) 98765-4328',
      registroProfissional: 'RG-ING-2018',
      cargaHoraria: 20,
      formacoes: [
        { instituicao: 'USP', curso: 'Letras - Inglês', nivel: 'GRADUACAO', anoConclusao: 2018 }
      ]
    }
  ];

  console.log('Criando professores...');
  const professorCriados = [];

  for (const prof of professores) {
    // Criar usuário
    const user = await prisma.user.create({
      data: {
        name: prof.nome,
        email: prof.email,
        cpf: prof.cpf,
        phone: prof.phone,
        password: await bcrypt.hash('Prof@2024', 10),
        active: true
      }
    });

    // Vincular role
    await prisma.userRole.create({
      data: {
        userId: user.id,
        roleId: professorRole.id
      }
    });

    // Criar professor
    const professor = await prisma.professor.create({
      data: {
        userId: user.id,
        registroProfissional: prof.registroProfissional,
        cargaHoraria: prof.cargaHoraria,
        active: true
      }
    });

    // Criar formações
    for (const formacao of prof.formacoes) {
      await prisma.formacao.create({
        data: {
          professorId: professor.id,
          nome: `${formacao.nivel} em ${formacao.curso}`,
          descricao: `${formacao.nivel} em ${formacao.curso} pela ${formacao.instituicao} (${formacao.anoConclusao})`
        }
      });
    }

    professorCriados.push({ ...prof, id: professor.id });
    console.log(`  ✓ ${prof.nome}`);
  }

  console.log(`\n✅ ${professorCriados.length} professores criados\n`);
  console.log('📊 Estatísticas:');
  console.log(`   - Carga horária média: ${Math.round(professorCriados.reduce((sum, p) => sum + p.cargaHoraria, 0) / professorCriados.length)}h`);
  console.log(`   - Total de formações: ${professorCriados.reduce((sum, p) => sum + p.formacoes.length, 0)}`);
  console.log('\n🔑 Acesso padrão: email do professor / Prof@2024\n');

  console.log('✅ Seed 4 concluído com sucesso!\n');
}

seed()
  .catch((e) => {
    console.error('❌ Erro no seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

/**
 * SEED 3: Disciplinas
 * Disciplinas do Ensino Fundamental I
 * Executa: npx ts-node prisma/seed-3-disciplinas.ts
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seed() {
  console.log('📖 Seed 3: Disciplinas\n');

  const disciplinas = [
    {
      codigo: 'PORT',
      nome: 'Português',
      areaConhecimento: 'Linguagens',
      cargaHorariaSemanal: 5,
      descricao: 'Língua Portuguesa - Leitura, escrita e interpretação'
    },
    {
      codigo: 'MAT',
      nome: 'Matemática',
      areaConhecimento: 'Matemática',
      cargaHorariaSemanal: 5,
      descricao: 'Números, operações, geometria e medidas'
    },
    {
      codigo: 'CIEN',
      nome: 'Ciências',
      areaConhecimento: 'Ciências da Natureza',
      cargaHorariaSemanal: 3,
      descricao: 'Ciências Naturais - Vida, Terra e Universo'
    },
    {
      codigo: 'HIST',
      nome: 'História',
      areaConhecimento: 'Ciências Humanas',
      cargaHorariaSemanal: 2,
      descricao: 'História do Brasil e Geral'
    },
    {
      codigo: 'GEO',
      nome: 'Geografia',
      areaConhecimento: 'Ciências Humanas',
      cargaHorariaSemanal: 2,
      descricao: 'Geografia física e humana'
    },
    {
      codigo: 'ARTE',
      nome: 'Arte',
      areaConhecimento: 'Linguagens',
      cargaHorariaSemanal: 2,
      descricao: 'Artes visuais, música, teatro e dança'
    },
    {
      codigo: 'EDFIS',
      nome: 'Educação Física',
      areaConhecimento: 'Linguagens',
      cargaHorariaSemanal: 2,
      descricao: 'Práticas corporais e esportivas'
    },
    {
      codigo: 'ING',
      nome: 'Inglês',
      areaConhecimento: 'Linguagens',
      cargaHorariaSemanal: 2,
      descricao: 'Língua Inglesa'
    }
  ];

  console.log('Criando disciplinas...');
  const disciplinasCriadas = [];
  for (const disc of disciplinas) {
    const criada = await prisma.disciplina.create({ data: disc });
    disciplinasCriadas.push(criada);
    console.log(`  ✓ ${disc.codigo} - ${disc.nome}`);
  }

  console.log(`\n✅ ${disciplinasCriadas.length} disciplinas criadas\n`);

  console.log('📊 Por área de conhecimento:');
  const porArea = disciplinasCriadas.reduce((acc, d) => {
    acc[d.areaConhecimento!] = (acc[d.areaConhecimento!] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  Object.entries(porArea).forEach(([area, count]) => {
    console.log(`   ${area}: ${count} disciplina(s)`);
  });

  console.log('\n✅ Seed 3 concluído com sucesso!\n');
}

seed()
  .catch((e) => {
    console.error('❌ Erro no seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

/**
 * SEED 2: Cadastros Básicos
 * Ano letivo, séries, salas, feriados
 * Executa: npx ts-node prisma/seed-2-cadastros-basicos.ts
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seed() {
  console.log('📚 Seed 2: Cadastros Básicos\n');

  // 1. Ano Letivo 2025
  console.log('Criando ano letivo 2025...');
  const anoLetivo = await prisma.anoLetivo.create({
    data: {
      ano: 2025,
      dataInicio: new Date('2025-02-01'),
      dataFim: new Date('2025-12-20'),
      status: 'ATIVO'
    }
  });
  console.log(`✅ Ano letivo criado: ${anoLetivo.ano}`);

  // 2. Períodos Letivos (4 bimestres)
  console.log('\nCriando períodos letivos...');
  const periodos = [
    { numero: 1, nome: '1º Bimestre', dataInicio: new Date('2025-02-01'), dataFim: new Date('2025-04-30') },
    { numero: 2, nome: '2º Bimestre', dataInicio: new Date('2025-05-01'), dataFim: new Date('2025-07-15') },
    { numero: 3, nome: '3º Bimestre', dataInicio: new Date('2025-08-01'), dataFim: new Date('2025-09-30') },
    { numero: 4, nome: '4º Bimestre', dataInicio: new Date('2025-10-01'), dataFim: new Date('2025-12-20') }
  ];

  for (const periodo of periodos) {
    await prisma.periodoLetivo.create({
      data: {
        ...periodo,
        anoLetivoId: anoLetivo.id
      }
    });
  }
  console.log(`✅ ${periodos.length} períodos criados`);

  // 3. Séries (Ensino Fundamental I - 1º ao 5º ano)
  console.log('\nCriando séries...');
  const series = [
    { codigo: '1ANO', nome: '1º Ano', ordem: 1, nivelEnsino: 'FUNDAMENTAL_I' },
    { codigo: '2ANO', nome: '2º Ano', ordem: 2, nivelEnsino: 'FUNDAMENTAL_I' },
    { codigo: '3ANO', nome: '3º Ano', ordem: 3, nivelEnsino: 'FUNDAMENTAL_I' },
    { codigo: '4ANO', nome: '4º Ano', ordem: 4, nivelEnsino: 'FUNDAMENTAL_I' },
    { codigo: '5ANO', nome: '5º Ano', ordem: 5, nivelEnsino: 'FUNDAMENTAL_I' }
  ];

  const seriesCriadas = [];
  for (const serie of series) {
    const criada = await prisma.serie.create({ data: serie });
    seriesCriadas.push(criada);
  }
  console.log(`✅ ${seriesCriadas.length} séries criadas`);

  // 4. Salas
  console.log('\nCriando salas...');
  const salas = [
    { codigo: 'SALA-101', nome: 'Sala 101', bloco: 'A', andar: '1', capacidade: 30 },
    { codigo: 'SALA-102', nome: 'Sala 102', bloco: 'A', andar: '1', capacidade: 30 },
    { codigo: 'SALA-103', nome: 'Sala 103', bloco: 'A', andar: '1', capacidade: 25 },
    { codigo: 'SALA-201', nome: 'Sala 201', bloco: 'A', andar: '2', capacidade: 30 },
    { codigo: 'SALA-202', nome: 'Sala 202', bloco: 'A', andar: '2', capacidade: 30 },
    { codigo: 'SALA-203', nome: 'Sala 203', bloco: 'A', andar: '2', capacidade: 25 },
    { codigo: 'LAB-INFO', nome: 'Laboratório de Informática', bloco: 'B', andar: '1', capacidade: 20 },
    { codigo: 'LAB-CIEN', nome: 'Laboratório de Ciências', bloco: 'B', andar: '1', capacidade: 20 },
    { codigo: 'BIBLIO', nome: 'Biblioteca', bloco: 'C', andar: '1', capacidade: 40 }
  ];

  const salasCriadas = [];
  for (const sala of salas) {
    const criada = await prisma.sala.create({ data: sala });
    salasCriadas.push(criada);
  }
  console.log(`✅ ${salasCriadas.length} salas criadas`);

  // 5. Feriados 2025
  console.log('\nCriando feriados...');
  const feriados = [
    { data: new Date('2025-01-01'), nome: 'Ano Novo', tipo: 'NACIONAL' as const },
    { data: new Date('2025-02-17'), nome: 'Carnaval', tipo: 'ESCOLAR' as const },
    { data: new Date('2025-04-18'), nome: 'Sexta-feira Santa', tipo: 'NACIONAL' as const },
    { data: new Date('2025-04-21'), nome: 'Tiradentes', tipo: 'NACIONAL' as const },
    { data: new Date('2025-05-01'), nome: 'Dia do Trabalhador', tipo: 'NACIONAL' as const },
    { data: new Date('2025-06-19'), nome: 'Corpus Christi', tipo: 'ESCOLAR' as const },
    { data: new Date('2025-09-07'), nome: 'Independência do Brasil', tipo: 'NACIONAL' as const },
    { data: new Date('2025-10-12'), nome: 'Nossa Senhora Aparecida', tipo: 'NACIONAL' as const },
    { data: new Date('2025-11-02'), nome: 'Finados', tipo: 'NACIONAL' as const },
    { data: new Date('2025-11-15'), nome: 'Proclamação da República', tipo: 'NACIONAL' as const },
    { data: new Date('2025-11-20'), nome: 'Consciência Negra', tipo: 'ESCOLAR' as const },
    { data: new Date('2025-12-25'), nome: 'Natal', tipo: 'NACIONAL' as const }
  ];

  for (const feriado of feriados) {
    await prisma.feriado.create({ data: feriado });
  }
  console.log(`✅ ${feriados.length} feriados criados`);

  console.log('\n✅ Seed 2 concluído com sucesso!\n');
  console.log('📊 Resumo:');
  console.log(`   - 1 ano letivo`);
  console.log(`   - 4 períodos (bimestres)`);
  console.log(`   - ${seriesCriadas.length} séries`);
  console.log(`   - ${salasCriadas.length} salas`);
  console.log(`   - ${feriados.length} feriados\n`);
}

seed()
  .catch((e) => {
    console.error('❌ Erro no seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

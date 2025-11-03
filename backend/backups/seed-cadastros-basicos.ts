import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedCadastrosBasicos() {
  console.log('🌱 Iniciando seed de cadastros básicos...');

  // Séries
  const series = [
    { codigo: '1ANO', nome: '1º Ano', ordem: 1, nivelEnsino: 'Fundamental I' },
    { codigo: '2ANO', nome: '2º Ano', ordem: 2, nivelEnsino: 'Fundamental I' },
    { codigo: '3ANO', nome: '3º Ano', ordem: 3, nivelEnsino: 'Fundamental I' },
    { codigo: '4ANO', nome: '4º Ano', ordem: 4, nivelEnsino: 'Fundamental I' },
    { codigo: '5ANO', nome: '5º Ano', ordem: 5, nivelEnsino: 'Fundamental I' },
    { codigo: '6ANO', nome: '6º Ano', ordem: 6, nivelEnsino: 'Fundamental II' },
    { codigo: '7ANO', nome: '7º Ano', ordem: 7, nivelEnsino: 'Fundamental II' },
    { codigo: '8ANO', nome: '8º Ano', ordem: 8, nivelEnsino: 'Fundamental II' },
    { codigo: '9ANO', nome: '9º Ano', ordem: 9, nivelEnsino: 'Fundamental II' },
  ];

  console.log('📚 Criando séries...');
  for (const serie of series) {
    await prisma.serie.upsert({
      where: { codigo: serie.codigo },
      update: {},
      create: serie,
    });
  }
  console.log(`✅ ${series.length} séries criadas/atualizadas`);

  // Salas
  const salas = [
    { codigo: 'S101', nome: 'Sala 101', capacidade: 30, andar: '1º', bloco: 'A' },
    { codigo: 'S102', nome: 'Sala 102', capacidade: 30, andar: '1º', bloco: 'A' },
    { codigo: 'S103', nome: 'Sala 103', capacidade: 25, andar: '1º', bloco: 'A' },
    { codigo: 'S201', nome: 'Sala 201', capacidade: 35, andar: '2º', bloco: 'A' },
    { codigo: 'S202', nome: 'Sala 202', capacidade: 35, andar: '2º', bloco: 'A' },
    { codigo: 'S203', nome: 'Sala 203', capacidade: 30, andar: '2º', bloco: 'A' },
    { codigo: 'LAB1', nome: 'Laboratório de Informática', capacidade: 25, andar: '1º', bloco: 'B', recursos: JSON.stringify(['Computadores', 'Projetor', 'Internet']) },
    { codigo: 'LAB2', nome: 'Laboratório de Ciências', capacidade: 30, andar: '1º', bloco: 'B', recursos: JSON.stringify(['Microscópios', 'Material de laboratório']) },
  ];

  console.log('🏫 Criando salas...');
  for (const sala of salas) {
    await prisma.sala.upsert({
      where: { codigo: sala.codigo },
      update: {},
      create: sala,
    });
  }
  console.log(`✅ ${salas.length} salas criadas/atualizadas`);

  // Feriados 2025
  const feriados = [
    { nome: 'Ano Novo', data: new Date('2025-01-01'), tipo: 'NACIONAL' as const, recorrente: true },
    { nome: 'Carnaval', data: new Date('2025-03-04'), tipo: 'NACIONAL' as const, recorrente: false },
    { nome: 'Sexta-feira Santa', data: new Date('2025-04-18'), tipo: 'NACIONAL' as const, recorrente: false },
    { nome: 'Tiradentes', data: new Date('2025-04-21'), tipo: 'NACIONAL' as const, recorrente: true },
    { nome: 'Dia do Trabalho', data: new Date('2025-05-01'), tipo: 'NACIONAL' as const, recorrente: true },
    { nome: 'Corpus Christi', data: new Date('2025-06-19'), tipo: 'NACIONAL' as const, recorrente: false },
    { nome: 'Independência do Brasil', data: new Date('2025-09-07'), tipo: 'NACIONAL' as const, recorrente: true },
    { nome: 'Nossa Senhora Aparecida', data: new Date('2025-10-12'), tipo: 'NACIONAL' as const, recorrente: true },
    { nome: 'Finados', data: new Date('2025-11-02'), tipo: 'NACIONAL' as const, recorrente: true },
    { nome: 'Proclamação da República', data: new Date('2025-11-15'), tipo: 'NACIONAL' as const, recorrente: true },
    { nome: 'Consciência Negra', data: new Date('2025-11-20'), tipo: 'NACIONAL' as const, recorrente: true },
    { nome: 'Natal', data: new Date('2025-12-25'), tipo: 'NACIONAL' as const, recorrente: true },
  ];

  console.log('📅 Criando feriados...');
  for (const feriado of feriados) {
    const existing = await prisma.feriado.findFirst({
      where: {
        nome: feriado.nome,
        data: feriado.data,
      },
    });

    if (!existing) {
      await prisma.feriado.create({
        data: feriado,
      });
    }
  }
  console.log(`✅ ${feriados.length} feriados criados/atualizados`);

  console.log('✨ Seed de cadastros básicos concluído!');
}

seedCadastrosBasicos()
  .catch((e) => {
    console.error('❌ Erro no seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

/**
 * SEED 8: Programas de Ensino
 * Cria programas de ensino por disciplina e série
 * Executa: npx ts-node prisma/seed-8-programas-ensino.ts
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seed() {
  console.log('📘 Seed 8: Programas de Ensino\n');

  // Buscar disciplinas criadas
  const disciplinas = await prisma.disciplina.findMany();
  console.log(`📚 Encontradas ${disciplinas.length} disciplinas\n`);

  // Buscar séries cadastradas no sistema
  const seriesCadastradas = await prisma.serie.findMany({ orderBy: { ordem: 'asc' } });
  console.log(`📊 Encontradas ${seriesCadastradas.length} séries cadastradas\n`);

  const anoLetivo = 2025;
  const programas = [];

  // PORTUGUÊS
  const portugues = disciplinas.find(d => d.codigo === 'PORT');
  if (portugues) {
    for (const serie of seriesCadastradas) {
      programas.push({
        codigo: `PORT-${serie.codigo}-2025`,
        nome: `Língua Portuguesa - ${serie.nome}`,
        descricao: `Programa de Língua Portuguesa para o ${serie.nome} do Ensino Fundamental I - 2025. Foco em leitura, escrita, oralidade e análise linguística.`,
        disciplinaId: portugues.id,
        serie: serie.codigo,
        periodo: 'Anual',
        anoLetivo,
        cargaHoraria: 200,
        observacoes: 'Baseado na BNCC - Campo de atuação: Vida cotidiana, Artístico-literário, Práticas de estudo e pesquisa'
      });
    }
  }

  // MATEMÁTICA
  const matematica = disciplinas.find(d => d.codigo === 'MAT');
  if (matematica) {
    for (const serie of seriesCadastradas) {
      programas.push({
        codigo: `MAT-${serie.codigo}-2025`,
        nome: `Matemática - ${serie.nome}`,
        descricao: `Programa de Matemática para o ${serie.nome} do Ensino Fundamental I - 2025. Números, álgebra, geometria, grandezas e medidas, probabilidade e estatística.`,
        disciplinaId: matematica.id,
        serie: serie.codigo,
        periodo: 'Anual',
        anoLetivo,
        cargaHoraria: 200,
        observacoes: 'Baseado na BNCC - Unidades temáticas: Números, Álgebra, Geometria, Grandezas e Medidas, Probabilidade e Estatística'
      });
    }
  }

  // CIÊNCIAS
  const ciencias = disciplinas.find(d => d.codigo === 'CIEN');
  if (ciencias) {
    for (const serie of seriesCadastradas) {
      programas.push({
        codigo: `CIEN-${serie.codigo}-2025`,
        nome: `Ciências - ${serie.nome}`,
        descricao: `Programa de Ciências da Natureza para o ${serie.nome} do Ensino Fundamental I - 2025. Matéria e energia, vida e evolução, terra e universo.`,
        disciplinaId: ciencias.id,
        serie: serie.codigo,
        periodo: 'Anual',
        anoLetivo,
        cargaHoraria: 120,
        observacoes: 'Baseado na BNCC - Unidades temáticas: Matéria e energia, Vida e evolução, Terra e Universo'
      });
    }
  }

  // HISTÓRIA
  const historia = disciplinas.find(d => d.codigo === 'HIST');
  if (historia) {
    for (const serie of seriesCadastradas) {
      programas.push({
        codigo: `HIST-${serie.codigo}-2025`,
        nome: `História - ${serie.nome}`,
        descricao: `Programa de História para o ${serie.nome} do Ensino Fundamental I - 2025. Eu, o outro e o nós; Mundo pessoal, familiar e escolar; Transformações e permanências.`,
        disciplinaId: historia.id,
        serie: serie.codigo,
        periodo: 'Anual',
        anoLetivo,
        cargaHoraria: 80,
        observacoes: 'Baseado na BNCC - Temporalidades, fontes históricas, identidade e diversidade'
      });
    }
  }

  // GEOGRAFIA
  const geografia = disciplinas.find(d => d.codigo === 'GEO');
  if (geografia) {
    for (const serie of seriesCadastradas) {
      programas.push({
        codigo: `GEO-${serie.codigo}-2025`,
        nome: `Geografia - ${serie.nome}`,
        descricao: `Programa de Geografia para o ${serie.nome} do Ensino Fundamental I - 2025. O sujeito e seu lugar no mundo, conexões e escalas, mundo do trabalho, formas de representação.`,
        disciplinaId: geografia.id,
        serie: serie.codigo,
        periodo: 'Anual',
        anoLetivo,
        cargaHoraria: 80,
        observacoes: 'Baseado na BNCC - Raciocínio geográfico, espaço e território'
      });
    }
  }

  // ARTE
  const arte = disciplinas.find(d => d.codigo === 'ARTE');
  if (arte) {
    for (const serie of seriesCadastradas) {
      programas.push({
        codigo: `ARTE-${serie.codigo}-2025`,
        nome: `Arte - ${serie.nome}`,
        descricao: `Programa de Arte para o ${serie.nome} do Ensino Fundamental I - 2025. Artes visuais, dança, música e teatro.`,
        disciplinaId: arte.id,
        serie: serie.codigo,
        periodo: 'Anual',
        anoLetivo,
        cargaHoraria: 80,
        observacoes: 'Baseado na BNCC - Linguagens artísticas: Visual, Dança, Música, Teatro'
      });
    }
  }

  // EDUCAÇÃO FÍSICA
  const educacaoFisica = disciplinas.find(d => d.codigo === 'EDFIS');
  if (educacaoFisica) {
    for (const serie of seriesCadastradas) {
      programas.push({
        codigo: `EDFIS-${serie.codigo}-2025`,
        nome: `Educação Física - ${serie.nome}`,
        descricao: `Programa de Educação Física para o ${serie.nome} do Ensino Fundamental I - 2025. Brincadeiras e jogos, esportes, ginásticas, danças, lutas.`,
        disciplinaId: educacaoFisica.id,
        serie: serie.codigo,
        periodo: 'Anual',
        anoLetivo,
        cargaHoraria: 80,
        observacoes: 'Baseado na BNCC - Práticas corporais e cultura corporal de movimento'
      });
    }
  }

  // INGLÊS
  const ingles = disciplinas.find(d => d.codigo === 'ING');
  if (ingles) {
    for (const serie of seriesCadastradas) {
      programas.push({
        codigo: `ING-${serie.codigo}-2025`,
        nome: `Inglês - ${serie.nome}`,
        descricao: `Programa de Língua Inglesa para o ${serie.nome} do Ensino Fundamental I - 2025. Oralidade, leitura, escrita, conhecimentos linguísticos, dimensão intercultural.`,
        disciplinaId: ingles.id,
        serie: serie.codigo,
        periodo: 'Anual',
        anoLetivo,
        cargaHoraria: 80,
        observacoes: 'Baseado na BNCC - Eixos: Oralidade, Leitura, Escrita, Conhecimentos linguísticos'
      });
    }
  }

  // Criar programas
  console.log('Criando programas de ensino...');
  const programasCriados = [];
  for (const programa of programas) {
    const criado = await prisma.programaEnsino.create({ data: programa });
    programasCriados.push(criado);
    console.log(`  ✓ ${programa.codigo} - ${programa.nome}`);
  }

  console.log(`\n✅ ${programasCriados.length} programas de ensino criados\n`);

  // Estatísticas
  console.log('📊 Por disciplina:');
  const porDisciplina = programasCriados.reduce((acc, p) => {
    const disc = disciplinas.find(d => d.id === p.disciplinaId);
    const nome = disc?.nome || 'Desconhecida';
    acc[nome] = (acc[nome] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  Object.entries(porDisciplina).forEach(([disc, count]) => {
    console.log(`   ${disc}: ${count} programa(s)`);
  });

  console.log('\n✅ Seed 8 concluído com sucesso!\n');
}

seed()
  .catch((e) => {
    console.error('❌ Erro no seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

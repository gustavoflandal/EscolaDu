import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed de Programas de Ensino...\n');

  // Buscar disciplinas existentes
  const disciplinas = await prisma.disciplina.findMany({
    where: { active: true },
  });

  if (disciplinas.length === 0) {
    console.log('⚠️  Nenhuma disciplina encontrada. Execute o seed principal primeiro.');
    return;
  }

  console.log(`📚 Encontradas ${disciplinas.length} disciplinas\n`);

  const programasData = [];
  const anoLetivo = 2025;

  // ============================================
  // 1º ANO - ENSINO FUNDAMENTAL
  // ============================================
  console.log('📖 Criando programas do 1º Ano...');
  
  const portugues1 = disciplinas.find(d => d.codigo === 'PORT');
  if (portugues1) {
    programasData.push({
      codigo: 'PORT-1ANO-2025',
      nome: 'Língua Portuguesa - 1º Ano Fundamental',
      descricao: 'Programa de alfabetização e letramento. Foco em consciência fonológica, reconhecimento de letras, leitura e escrita inicial.',
      disciplinaId: portugues1.id,
      serie: '1º Ano',
      periodo: 'Anual',
      anoLetivo,
      cargaHoraria: 200,
      observacoes: 'Ênfase em práticas de oralidade, leitura compartilhada e produção de textos simples.',
    });
  }

  const matematica1 = disciplinas.find(d => d.codigo === 'MAT');
  if (matematica1) {
    programasData.push({
      codigo: 'MAT-1ANO-2025',
      nome: 'Matemática - 1º Ano Fundamental',
      descricao: 'Introdução aos números naturais, contagem, adição e subtração simples. Noções de geometria e medidas.',
      disciplinaId: matematica1.id,
      serie: '1º Ano',
      periodo: 'Anual',
      anoLetivo,
      cargaHoraria: 200,
      observacoes: 'Uso de materiais concretos e jogos para construção de conceitos matemáticos.',
    });
  }

  const ciencias1 = disciplinas.find(d => d.codigo === 'CIEN');
  if (ciencias1) {
    programasData.push({
      codigo: 'CIEN-1ANO-2025',
      nome: 'Ciências - 1º Ano Fundamental',
      descricao: 'Observação e exploração do ambiente. Corpo humano, saúde e higiene. Seres vivos e não vivos.',
      disciplinaId: ciencias1.id,
      serie: '1º Ano',
      periodo: 'Anual',
      anoLetivo,
      cargaHoraria: 120,
      observacoes: 'Atividades práticas de observação e experimentação.',
    });
  }

  // ============================================
  // 2º ANO - ENSINO FUNDAMENTAL
  // ============================================
  console.log('📖 Criando programas do 2º Ano...');
  
  if (portugues1) {
    programasData.push({
      codigo: 'PORT-2ANO-2025',
      nome: 'Língua Portuguesa - 2º Ano Fundamental',
      descricao: 'Consolidação da alfabetização. Leitura e compreensão de textos diversos. Produção textual orientada.',
      disciplinaId: portugues1.id,
      serie: '2º Ano',
      periodo: 'Anual',
      anoLetivo,
      cargaHoraria: 200,
      observacoes: 'Ampliação do repertório de gêneros textuais e práticas de reescrita.',
    });
  }

  if (matematica1) {
    programasData.push({
      codigo: 'MAT-2ANO-2025',
      nome: 'Matemática - 2º Ano Fundamental',
      descricao: 'Operações com números até 100. Multiplicação e divisão inicial. Medidas de tempo, comprimento e massa.',
      disciplinaId: matematica1.id,
      serie: '2º Ano',
      periodo: 'Anual',
      anoLetivo,
      cargaHoraria: 200,
      observacoes: 'Resolução de problemas contextualizados e jogos matemáticos.',
    });
  }

  // ============================================
  // 3º ANO - ENSINO FUNDAMENTAL
  // ============================================
  console.log('📖 Criando programas do 3º Ano...');
  
  if (portugues1) {
    programasData.push({
      codigo: 'PORT-3ANO-2025',
      nome: 'Língua Portuguesa - 3º Ano Fundamental',
      descricao: 'Leitura fluente e interpretação textual. Ortografia e gramática básica. Produção de textos diversos.',
      disciplinaId: portugues1.id,
      serie: '3º Ano',
      periodo: 'Anual',
      anoLetivo,
      cargaHoraria: 200,
      observacoes: 'Trabalho com diferentes gêneros: narrativos, informativos e instrucionais.',
    });
  }

  if (matematica1) {
    programasData.push({
      codigo: 'MAT-3ANO-2025',
      nome: 'Matemática - 3º Ano Fundamental',
      descricao: 'Operações com números até 1000. Multiplicação e divisão. Frações simples. Geometria plana.',
      disciplinaId: matematica1.id,
      serie: '3º Ano',
      periodo: 'Anual',
      anoLetivo,
      cargaHoraria: 200,
      observacoes: 'Ênfase em estratégias de cálculo mental e estimativas.',
    });
  }

  const historia3 = disciplinas.find(d => d.codigo === 'HIST');
  if (historia3) {
    programasData.push({
      codigo: 'HIST-3ANO-2025',
      nome: 'História - 3º Ano Fundamental',
      descricao: 'História local e regional. Noções de tempo histórico. Diversidade cultural e identidade.',
      disciplinaId: historia3.id,
      serie: '3º Ano',
      periodo: 'Anual',
      anoLetivo,
      cargaHoraria: 80,
      observacoes: 'Trabalho com fontes históricas acessíveis (fotos, documentos familiares).',
    });
  }

  const geografia3 = disciplinas.find(d => d.codigo === 'GEO');
  if (geografia3) {
    programasData.push({
      codigo: 'GEO-3ANO-2025',
      nome: 'Geografia - 3º Ano Fundamental',
      descricao: 'Espaço de vivência. Paisagens naturais e transformadas. Representações cartográficas simples.',
      disciplinaId: geografia3.id,
      serie: '3º Ano',
      periodo: 'Anual',
      anoLetivo,
      cargaHoraria: 80,
      observacoes: 'Uso de mapas, maquetes e observação do entorno escolar.',
    });
  }

  // ============================================
  // 4º ANO - ENSINO FUNDAMENTAL
  // ============================================
  console.log('📖 Criando programas do 4º Ano...');
  
  if (portugues1) {
    programasData.push({
      codigo: 'PORT-4ANO-2025',
      nome: 'Língua Portuguesa - 4º Ano Fundamental',
      descricao: 'Leitura e análise de textos complexos. Gramática e ortografia. Produção textual autônoma.',
      disciplinaId: portugues1.id,
      serie: '4º Ano',
      periodo: 'Anual',
      anoLetivo,
      cargaHoraria: 200,
      observacoes: 'Introdução à análise linguística e estudos de pontuação.',
    });
  }

  if (matematica1) {
    programasData.push({
      codigo: 'MAT-4ANO-2025',
      nome: 'Matemática - 4º Ano Fundamental',
      descricao: 'Operações com números naturais. Frações e decimais. Área e perímetro. Estatística básica.',
      disciplinaId: matematica1.id,
      serie: '4º Ano',
      periodo: 'Anual',
      anoLetivo,
      cargaHoraria: 200,
      observacoes: 'Resolução de problemas e introdução ao pensamento algébrico.',
    });
  }

  // ============================================
  // 5º ANO - ENSINO FUNDAMENTAL
  // ============================================
  console.log('📖 Criando programas do 5º Ano...');
  
  if (portugues1) {
    programasData.push({
      codigo: 'PORT-5ANO-2025',
      nome: 'Língua Portuguesa - 5º Ano Fundamental',
      descricao: 'Consolidação das habilidades de leitura e escrita. Análise linguística avançada. Produção de textos argumentativos.',
      disciplinaId: portugues1.id,
      serie: '5º Ano',
      periodo: 'Anual',
      anoLetivo,
      cargaHoraria: 200,
      observacoes: 'Preparação para o Ensino Fundamental II com ênfase em gêneros acadêmicos.',
    });
  }

  if (matematica1) {
    programasData.push({
      codigo: 'MAT-5ANO-2025',
      nome: 'Matemática - 5º Ano Fundamental',
      descricao: 'Sistema decimal. Operações com decimais. Porcentagem. Geometria espacial. Gráficos e tabelas.',
      disciplinaId: matematica1.id,
      serie: '5º Ano',
      periodo: 'Anual',
      anoLetivo,
      cargaHoraria: 200,
      observacoes: 'Consolidação de conceitos e preparação para álgebra no Fundamental II.',
    });
  }

  const ingles5 = disciplinas.find(d => d.codigo === 'ING');
  if (ingles5) {
    programasData.push({
      codigo: 'ING-5ANO-2025',
      nome: 'Língua Inglesa - 5º Ano Fundamental',
      descricao: 'Introdução à língua inglesa. Vocabulário básico, expressões cotidianas e estruturas simples.',
      disciplinaId: ingles5.id,
      serie: '5º Ano',
      periodo: 'Anual',
      anoLetivo,
      cargaHoraria: 80,
      observacoes: 'Ênfase em compreensão auditiva e produção oral.',
    });
  }

  // Criar programas no banco
  console.log('\n💾 Salvando programas no banco de dados...');
  let criados = 0;
  let atualizados = 0;

  for (const programaData of programasData) {
    const existing = await prisma.programaEnsino.findUnique({
      where: { codigo: programaData.codigo },
    });

    if (existing) {
      await prisma.programaEnsino.update({
        where: { codigo: programaData.codigo },
        data: programaData,
      });
      atualizados++;
    } else {
      await prisma.programaEnsino.create({
        data: programaData,
      });
      criados++;
    }
  }

  console.log(`✅ ${criados} programas criados`);
  console.log(`🔄 ${atualizados} programas atualizados`);
  console.log('\n✨ Seed de Programas de Ensino concluído com sucesso!');
}

main()
  .catch((e) => {
    console.error('❌ Erro no seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

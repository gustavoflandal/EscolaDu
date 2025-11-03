import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Script para popular disciplinas e objetivos de aprendizagem (BNCC)
 * 
 * Disciplinas por área de conhecimento:
 * - Linguagens: Português, Inglês, Educação Física, Arte
 * - Matemática
 * - Ciências da Natureza: Ciências
 * - Ciências Humanas: História, Geografia
 * - Ensino Religioso
 * 
 * Objetivos de aprendizagem seguem códigos BNCC
 */

async function seedDisciplinas() {
  console.log('🌱 Iniciando seed de disciplinas...\n');

  // Disciplinas do Ensino Fundamental Anos Iniciais (1º ao 5º ano)
  const disciplinas = [
    {
      codigo: 'PORT',
      nome: 'Língua Portuguesa',
      areaConhecimento: 'Linguagens',
      cargaHorariaSemanal: 5,
      descricao: 'Leitura, escrita, oralidade e análise linguística/semiótica'
    },
    {
      codigo: 'MAT',
      nome: 'Matemática',
      areaConhecimento: 'Matemática',
      cargaHorariaSemanal: 5,
      descricao: 'Números, Álgebra, Geometria, Grandezas e Medidas, Probabilidade e Estatística'
    },
    {
      codigo: 'CIEN',
      nome: 'Ciências',
      areaConhecimento: 'Ciências da Natureza',
      cargaHorariaSemanal: 3,
      descricao: 'Matéria e energia, Vida e evolução, Terra e universo'
    },
    {
      codigo: 'HIST',
      nome: 'História',
      areaConhecimento: 'Ciências Humanas',
      cargaHorariaSemanal: 2,
      descricao: 'Mundo pessoal, grupos sociais, comunidades, tempo e espaço'
    },
    {
      codigo: 'GEO',
      nome: 'Geografia',
      areaConhecimento: 'Ciências Humanas',
      cargaHorariaSemanal: 2,
      descricao: 'O sujeito e seu lugar no mundo, conexões e escalas, mundo do trabalho, formas de representação'
    },
    {
      codigo: 'ARTE',
      nome: 'Arte',
      areaConhecimento: 'Linguagens',
      cargaHorariaSemanal: 2,
      descricao: 'Artes visuais, dança, música e teatro'
    },
    {
      codigo: 'EDF',
      nome: 'Educação Física',
      areaConhecimento: 'Linguagens',
      cargaHorariaSemanal: 2,
      descricao: 'Brincadeiras e jogos, esportes, ginásticas, danças, lutas'
    },
    {
      codigo: 'ING',
      nome: 'Língua Inglesa',
      areaConhecimento: 'Linguagens',
      cargaHorariaSemanal: 2,
      descricao: 'Oralidade, leitura, escrita, conhecimentos linguísticos'
    },
    {
      codigo: 'ER',
      nome: 'Ensino Religioso',
      areaConhecimento: 'Ensino Religioso',
      cargaHorariaSemanal: 1,
      descricao: 'Identidades e alteridades, manifestações religiosas, crenças e filosofias de vida'
    }
  ];

  console.log('📚 Criando disciplinas...');
  const disciplinasCriadas = await Promise.all(
    disciplinas.map(async (disc) => {
      const disciplina = await prisma.disciplina.create({
        data: disc
      });
      console.log(`  ✅ ${disciplina.nome} (${disciplina.codigo})`);
      return disciplina;
    })
  );

  console.log(`\n✅ ${disciplinasCriadas.length} disciplinas criadas\n`);

  // Objetivos de Aprendizagem - Alguns exemplos por disciplina e série
  console.log('🎯 Criando objetivos de aprendizagem (BNCC)...\n');

  // Português - 1º Ano
  const portugues = disciplinasCriadas.find(d => d.codigo === 'PORT')!;
  const objetivosPortugues = [
    {
      codigoBNCC: 'EF01LP01',
      descricao: 'Reconhecer que textos são lidos e escritos da esquerda para a direita e de cima para baixo da página.',
      serie: '1º Ano',
      periodo: '1º Bimestre',
      competencia: 'Compreender o funcionamento do sistema de escrita alfabética',
      disciplinaId: portugues.id
    },
    {
      codigoBNCC: 'EF01LP02',
      descricao: 'Escrever, espontaneamente ou por ditado, palavras e frases de forma alfabética.',
      serie: '1º Ano',
      periodo: '2º Bimestre',
      competencia: 'Apropriar-se da escrita alfabética',
      disciplinaId: portugues.id
    },
    {
      codigoBNCC: 'EF01LP08',
      descricao: 'Relacionar elementos sonoros das palavras com sua representação escrita.',
      serie: '1º Ano',
      periodo: '1º Semestre',
      habilidade: 'Consciência fonológica e correspondência fonema-grafema',
      disciplinaId: portugues.id
    }
  ];

  // Matemática - 1º Ano
  const matematica = disciplinasCriadas.find(d => d.codigo === 'MAT')!;
  const objetivosMatematica = [
    {
      codigoBNCC: 'EF01MA01',
      descricao: 'Utilizar números naturais como indicadores de quantidade ou de ordem em diferentes situações cotidianas.',
      serie: '1º Ano',
      periodo: '1º Bimestre',
      competencia: 'Números e contagem',
      disciplinaId: matematica.id
    },
    {
      codigoBNCC: 'EF01MA02',
      descricao: 'Contar de maneira exata ou aproximada, utilizando diferentes estratégias como o pareamento e outros agrupamentos.',
      serie: '1º Ano',
      periodo: '1º Bimestre',
      habilidade: 'Estratégias de contagem',
      disciplinaId: matematica.id
    },
    {
      codigoBNCC: 'EF01MA08',
      descricao: 'Resolver e elaborar problemas de adição e de subtração, envolvendo números de até dois algarismos.',
      serie: '1º Ano',
      periodo: '2º Semestre',
      competencia: 'Operações básicas',
      disciplinaId: matematica.id
    }
  ];

  // Ciências - 1º Ano
  const ciencias = disciplinasCriadas.find(d => d.codigo === 'CIEN')!;
  const objetivosCiencias = [
    {
      codigoBNCC: 'EF01CI01',
      descricao: 'Comparar características de diferentes materiais presentes em objetos de uso cotidiano.',
      serie: '1º Ano',
      periodo: '1º Bimestre',
      competencia: 'Matéria e energia',
      disciplinaId: ciencias.id
    },
    {
      codigoBNCC: 'EF01CI02',
      descricao: 'Localizar, nomear e representar graficamente partes do corpo humano.',
      serie: '1º Ano',
      periodo: '2º Bimestre',
      competencia: 'Vida e evolução',
      habilidade: 'Conhecimento do próprio corpo',
      disciplinaId: ciencias.id
    },
    {
      codigoBNCC: 'EF01CI05',
      descricao: 'Identificar e nomear diferentes escalas de tempo: os períodos diários (manhã, tarde, noite) e a sucessão de dias, semanas, meses e anos.',
      serie: '1º Ano',
      periodo: '3º Bimestre',
      competencia: 'Terra e universo',
      disciplinaId: ciencias.id
    }
  ];

  // História - 1º Ano
  const historia = disciplinasCriadas.find(d => d.codigo === 'HIST')!;
  const objetivosHistoria = [
    {
      codigoBNCC: 'EF01HI01',
      descricao: 'Identificar aspectos do seu crescimento por meio do registro das lembranças particulares.',
      serie: '1º Ano',
      periodo: '1º Bimestre',
      competencia: 'Mundo pessoal: meu lugar no mundo',
      disciplinaId: historia.id
    },
    {
      codigoBNCC: 'EF01HI04',
      descricao: 'Identificar as diferenças entre os variados ambientes em que vive (doméstico, escolar e da comunidade).',
      serie: '1º Ano',
      periodo: '2º Bimestre',
      competencia: 'Mundo pessoal: eu, meu grupo social e meu tempo',
      disciplinaId: historia.id
    }
  ];

  // Geografia - 1º Ano
  const geografia = disciplinasCriadas.find(d => d.codigo === 'GEO')!;
  const objetivosGeografia = [
    {
      codigoBNCC: 'EF01GE01',
      descricao: 'Descrever características observadas de seus lugares de vivência e identificar semelhanças e diferenças entre eles.',
      serie: '1º Ano',
      periodo: '1º Bimestre',
      competencia: 'O sujeito e seu lugar no mundo',
      disciplinaId: geografia.id
    },
    {
      codigoBNCC: 'EF01GE02',
      descricao: 'Identificar semelhanças e diferenças entre jogos e brincadeiras de diferentes épocas e lugares.',
      serie: '1º Ano',
      periodo: '2º Bimestre',
      competencia: 'O sujeito e seu lugar no mundo',
      disciplinaId: geografia.id
    }
  ];

  // Criar todos os objetivos
  const todosObjetivos = [
    ...objetivosPortugues,
    ...objetivosMatematica,
    ...objetivosCiencias,
    ...objetivosHistoria,
    ...objetivosGeografia
  ];

  let count = 0;
  for (const objetivo of todosObjetivos) {
    await prisma.objetivoAprendizagem.create({
      data: objetivo
    });
    count++;
    console.log(`  ✅ ${objetivo.codigoBNCC} - ${objetivo.serie}`);
  }

  console.log(`\n✅ ${count} objetivos de aprendizagem criados\n`);

  console.log('✅ Seed de disciplinas concluído!\n');
  console.log('📊 Resumo:');
  console.log(`  - ${disciplinasCriadas.length} disciplinas`);
  console.log(`  - ${count} objetivos de aprendizagem (BNCC)\n`);
}

async function main() {
  try {
    await seedDisciplinas();
  } catch (error) {
    console.error('❌ Erro ao executar seed de disciplinas:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

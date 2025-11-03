/**
 * SEED 9: Objetivos de Aprendizagem
 * Cria objetivos baseados na BNCC para cada programa de ensino
 * Executa: npx ts-node prisma/seed-9-objetivos-aprendizagem.ts
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seed() {
  console.log('🎯 Seed 9: Objetivos de Aprendizagem\n');

  // Buscar programas criados
  const programas = await prisma.programaEnsino.findMany({
    include: { disciplina: true }
  });
  console.log(`📚 Encontrados ${programas.length} programas de ensino\n`);

  const objetivos = [];

  // PORTUGUÊS - 1º ANO
  const port1ano = programas.find(p => p.codigo === 'PORT-1ANO-2025');
  if (port1ano) {
    objetivos.push(
      {
        codigoBNCC: 'EF01LP01',
        descricao: 'Reconhecer que textos são lidos e escritos da esquerda para a direita e de cima para baixo da página.',
        programaEnsinoId: port1ano.id,
        ordem: 1,
        competencia: 'Compreender as diferenças entre escrita e outras formas gráficas',
        habilidade: 'Reconhecer direção da escrita',
        pontuacaoMeta: 8.0
      },
      {
        codigoBNCC: 'EF01LP02',
        descricao: 'Escrever, espontaneamente ou por ditado, palavras e frases de forma alfabética.',
        programaEnsinoId: port1ano.id,
        ordem: 2,
        competencia: 'Apropriar-se do sistema de escrita alfabético',
        habilidade: 'Escrita alfabética de palavras e frases',
        pontuacaoMeta: 7.5
      },
      {
        codigoBNCC: 'EF01LP08',
        descricao: 'Relacionar elementos sonoros (sílabas, fonemas, partes de palavras) com sua representação escrita.',
        programaEnsinoId: port1ano.id,
        ordem: 3,
        competencia: 'Desenvolver consciência fonológica',
        habilidade: 'Correspondência fonema-grafema',
        pontuacaoMeta: 8.0
      },
      {
        codigoBNCC: 'EF15LP03',
        descricao: 'Localizar informações explícitas em textos.',
        programaEnsinoId: port1ano.id,
        ordem: 4,
        competencia: 'Compreender e interpretar textos',
        habilidade: 'Localização de informações explícitas',
        pontuacaoMeta: 7.0
      }
    );
  }

  // MATEMÁTICA - 1º ANO
  const mat1ano = programas.find(p => p.codigo === 'MAT-1ANO-2025');
  if (mat1ano) {
    objetivos.push(
      {
        codigoBNCC: 'EF01MA01',
        descricao: 'Utilizar números naturais como indicadores de quantidade ou de ordem em diferentes situações cotidianas.',
        programaEnsinoId: mat1ano.id,
        ordem: 1,
        competencia: 'Números',
        habilidade: 'Contagem e ordem',
        pontuacaoMeta: 8.0
      },
      {
        codigoBNCC: 'EF01MA04',
        descricao: 'Contar a quantidade de objetos de coleções até 100 unidades e apresentar o resultado por registros verbais e simbólicos.',
        programaEnsinoId: mat1ano.id,
        ordem: 2,
        competencia: 'Números',
        habilidade: 'Quantificação de elementos de uma coleção',
        pontuacaoMeta: 7.5
      },
      {
        codigoBNCC: 'EF01MA06',
        descricao: 'Construir fatos básicos da adição e utilizá-los em procedimentos de cálculo para resolver problemas.',
        programaEnsinoId: mat1ano.id,
        ordem: 3,
        competencia: 'Números',
        habilidade: 'Adição',
        pontuacaoMeta: 7.0
      },
      {
        codigoBNCC: 'EF01MA14',
        descricao: 'Identificar e nomear figuras planas (círculo, quadrado, retângulo e triângulo) em desenhos apresentados em diferentes disposições.',
        programaEnsinoId: mat1ano.id,
        ordem: 4,
        competencia: 'Geometria',
        habilidade: 'Figuras geométricas planas',
        pontuacaoMeta: 8.0
      }
    );
  }

  // CIÊNCIAS - 1º ANO
  const cien1ano = programas.find(p => p.codigo === 'CIEN-1ANO-2025');
  if (cien1ano) {
    objetivos.push(
      {
        codigoBNCC: 'EF01CI01',
        descricao: 'Comparar características de diferentes materiais presentes em objetos de uso cotidiano.',
        programaEnsinoId: cien1ano.id,
        ordem: 1,
        competencia: 'Matéria e energia',
        habilidade: 'Propriedades dos materiais',
        pontuacaoMeta: 7.5
      },
      {
        codigoBNCC: 'EF01CI02',
        descricao: 'Localizar, nomear e representar graficamente (por meio de desenhos) partes do corpo humano.',
        programaEnsinoId: cien1ano.id,
        ordem: 2,
        competencia: 'Vida e evolução',
        habilidade: 'Corpo humano',
        pontuacaoMeta: 8.0
      },
      {
        codigoBNCC: 'EF01CI05',
        descricao: 'Identificar e nomear diferentes escalas de tempo: os períodos diários (manhã, tarde, noite) e a sucessão de dias, semanas, meses e anos.',
        programaEnsinoId: cien1ano.id,
        ordem: 3,
        competencia: 'Terra e Universo',
        habilidade: 'Escalas de tempo',
        pontuacaoMeta: 7.0
      }
    );
  }

  // PORTUGUÊS - 2º ANO
  const port2ano = programas.find(p => p.codigo === 'PORT-2ANO-2025');
  if (port2ano) {
    objetivos.push(
      {
        codigoBNCC: 'EF02LP01',
        descricao: 'Utilizar, ao produzir o texto, grafia correta de palavras conhecidas ou com estruturas silábicas já dominadas.',
        programaEnsinoId: port2ano.id,
        ordem: 1,
        competencia: 'Escrita autônoma',
        habilidade: 'Ortografia',
        pontuacaoMeta: 7.5
      },
      {
        codigoBNCC: 'EF02LP07',
        descricao: 'Escrever palavras, frases, textos curtos nas formas imprensa e cursiva.',
        programaEnsinoId: port2ano.id,
        ordem: 2,
        competencia: 'Escrita compartilhada e autônoma',
        habilidade: 'Formas de escrita',
        pontuacaoMeta: 7.0
      },
      {
        codigoBNCC: 'EF15LP15',
        descricao: 'Reconhecer que os textos literários fazem parte do mundo do imaginário.',
        programaEnsinoId: port2ano.id,
        ordem: 3,
        competencia: 'Leitura literária',
        habilidade: 'Formação do leitor literário',
        pontuacaoMeta: 8.0
      }
    );
  }

  // MATEMÁTICA - 2º ANO
  const mat2ano = programas.find(p => p.codigo === 'MAT-2ANO-2025');
  if (mat2ano) {
    objetivos.push(
      {
        codigoBNCC: 'EF02MA05',
        descricao: 'Construir fatos básicos da adição e subtração e utilizá-los no cálculo mental ou escrito.',
        programaEnsinoId: mat2ano.id,
        ordem: 1,
        competencia: 'Números',
        habilidade: 'Adição e subtração',
        pontuacaoMeta: 7.5
      },
      {
        codigoBNCC: 'EF02MA08',
        descricao: 'Resolver e elaborar problemas envolvendo dobro, metade, triplo e terça parte.',
        programaEnsinoId: mat2ano.id,
        ordem: 2,
        competencia: 'Números',
        habilidade: 'Problemas envolvendo multiplicação',
        pontuacaoMeta: 7.0
      },
      {
        codigoBNCC: 'EF02MA15',
        descricao: 'Reconhecer, comparar e nomear figuras planas (círculo, quadrado, retângulo e triângulo), por meio de características comuns.',
        programaEnsinoId: mat2ano.id,
        ordem: 3,
        competencia: 'Geometria',
        habilidade: 'Figuras geométricas planas',
        pontuacaoMeta: 8.0
      }
    );
  }

  // HISTÓRIA - 1º ANO
  const hist1ano = programas.find(p => p.codigo === 'HIST-1ANO-2025');
  if (hist1ano) {
    objetivos.push(
      {
        codigoBNCC: 'EF01HI01',
        descricao: 'Identificar aspectos do seu crescimento por meio do registro das lembranças particulares ou de lembranças dos membros de sua família.',
        programaEnsinoId: hist1ano.id,
        ordem: 1,
        competencia: 'Mundo pessoal: meu lugar no mundo',
        habilidade: 'História pessoal e familiar',
        pontuacaoMeta: 8.0
      },
      {
        codigoBNCC: 'EF01HI02',
        descricao: 'Identificar a relação entre as suas histórias e as histórias de sua família e de sua comunidade.',
        programaEnsinoId: hist1ano.id,
        ordem: 2,
        competencia: 'Mundo pessoal: eu, meu grupo social e meu tempo',
        habilidade: 'Relações entre indivíduo, família e comunidade',
        pontuacaoMeta: 7.5
      }
    );
  }

  // GEOGRAFIA - 1º ANO
  const geo1ano = programas.find(p => p.codigo === 'GEO-1ANO-2025');
  if (geo1ano) {
    objetivos.push(
      {
        codigoBNCC: 'EF01GE01',
        descricao: 'Descrever características observadas de seus lugares de vivência (moradia, escola etc.).',
        programaEnsinoId: geo1ano.id,
        ordem: 1,
        competencia: 'O sujeito e seu lugar no mundo',
        habilidade: 'Lugares de vivência',
        pontuacaoMeta: 8.0
      },
      {
        codigoBNCC: 'EF01GE02',
        descricao: 'Identificar semelhanças e diferenças entre jogos e brincadeiras de diferentes épocas e lugares.',
        programaEnsinoId: geo1ano.id,
        ordem: 2,
        competencia: 'O sujeito e seu lugar no mundo',
        habilidade: 'Culturas e modos de vida',
        pontuacaoMeta: 7.5
      }
    );
  }

  // ARTE - 1º ANO
  const arte1ano = programas.find(p => p.codigo === 'ARTE-1ANO-2025');
  if (arte1ano) {
    objetivos.push(
      {
        codigoBNCC: 'EF15AR01',
        descricao: 'Identificar e apreciar formas distintas das artes visuais tradicionais e contemporâneas.',
        programaEnsinoId: arte1ano.id,
        ordem: 1,
        competencia: 'Artes visuais',
        habilidade: 'Contextos e práticas',
        pontuacaoMeta: 8.0
      },
      {
        codigoBNCC: 'EF15AR02',
        descricao: 'Explorar e reconhecer elementos constitutivos das artes visuais (ponto, linha, forma, cor, espaço, movimento etc.).',
        programaEnsinoId: arte1ano.id,
        ordem: 2,
        competencia: 'Artes visuais',
        habilidade: 'Elementos da linguagem',
        pontuacaoMeta: 7.5
      }
    );
  }

  // EDUCAÇÃO FÍSICA - 1º ANO
  const edfis1ano = programas.find(p => p.codigo === 'EDFIS-1ANO-2025');
  if (edfis1ano) {
    objetivos.push(
      {
        codigoBNCC: 'EF12EF01',
        descricao: 'Experimentar, fruir e recriar diferentes brincadeiras e jogos da cultura popular presentes no contexto comunitário e regional.',
        programaEnsinoId: edfis1ano.id,
        ordem: 1,
        competencia: 'Brincadeiras e jogos',
        habilidade: 'Brincadeiras e jogos da cultura popular',
        pontuacaoMeta: 8.0
      },
      {
        codigoBNCC: 'EF12EF05',
        descricao: 'Experimentar e fruir, prezando pelo trabalho coletivo e pelo protagonismo, a prática de esportes de marca e de precisão.',
        programaEnsinoId: edfis1ano.id,
        ordem: 2,
        competencia: 'Esportes',
        habilidade: 'Esportes de marca e precisão',
        pontuacaoMeta: 7.5
      }
    );
  }

  // INGLÊS - 1º ANO
  const ing1ano = programas.find(p => p.codigo === 'ING-1ANO-2025');
  if (ing1ano) {
    objetivos.push(
      {
        codigoBNCC: 'EF01LI01',
        descricao: 'Interagir em situações de intercâmbio oral, demonstrando iniciativa para utilizar a língua inglesa.',
        programaEnsinoId: ing1ano.id,
        ordem: 1,
        competencia: 'Oralidade',
        habilidade: 'Interação discursiva',
        pontuacaoMeta: 7.5
      },
      {
        codigoBNCC: 'EF01LI11',
        descricao: 'Conhecer a língua inglesa como meio de comunicação de pessoas de diferentes países.',
        programaEnsinoId: ing1ano.id,
        ordem: 2,
        competencia: 'Dimensão intercultural',
        habilidade: 'A língua inglesa no mundo',
        pontuacaoMeta: 8.0
      }
    );
  }

  // Criar objetivos
  console.log('Criando objetivos de aprendizagem...');
  const objetivosCriados = [];
  for (const objetivo of objetivos) {
    const criado = await prisma.objetivoAprendizagem.create({ data: objetivo });
    objetivosCriados.push(criado);
    console.log(`  ✓ ${objetivo.codigoBNCC} - ${objetivo.descricao.substring(0, 60)}...`);
  }

  console.log(`\n✅ ${objetivosCriados.length} objetivos de aprendizagem criados\n`);

  // Estatísticas
  console.log('📊 Por programa de ensino:');
  const porPrograma = objetivosCriados.reduce((acc, obj) => {
    const prog = programas.find(p => p.id === obj.programaEnsinoId);
    const nome = prog?.codigo || 'Desconhecido';
    acc[nome] = (acc[nome] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  Object.entries(porPrograma).forEach(([prog, count]) => {
    console.log(`   ${prog}: ${count} objetivo(s)`);
  });

  console.log('\n✅ Seed 9 concluído com sucesso!\n');
}

seed()
  .catch((e) => {
    console.error('❌ Erro no seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

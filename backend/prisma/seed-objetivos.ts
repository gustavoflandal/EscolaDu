import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed de Objetivos de Aprendizagem...\n');

  // Buscar programas de ensino existentes
  const programas = await prisma.programaEnsino.findMany({
    where: { active: true },
    include: { disciplina: true },
  });

  if (programas.length === 0) {
    console.log('⚠️  Nenhum programa de ensino encontrado. Execute o seed de programas primeiro.');
    return;
  }

  console.log(`📚 Encontrados ${programas.length} programas de ensino\n`);

  const objetivosData = [];

  // ============================================
  // PORTUGUÊS - 1º ANO
  // ============================================
  const port1ano = programas.find(p => p.codigo === 'PORT-1ANO-2025');
  if (port1ano) {
    console.log('📝 Criando objetivos de Português - 1º Ano...');
    objetivosData.push(
      {
        codigoBNCC: 'EF01LP01',
        descricao: 'Reconhecer que textos são lidos e escritos da esquerda para a direita e de cima para baixo da página.',
        programaEnsinoId: port1ano.id,
        ordem: 1,
        competencia: 'Compreender as convenções da escrita',
        habilidade: 'Reconhecimento da direção da escrita',
      },
      {
        codigoBNCC: 'EF01LP02',
        descricao: 'Escrever, espontaneamente ou por ditado, palavras e frases de forma alfabética – usando letras/grafemas que representem fonemas.',
        programaEnsinoId: port1ano.id,
        ordem: 2,
        competencia: 'Apropriar-se do sistema alfabético de escrita',
        habilidade: 'Correspondência fonema-grafema',
      },
      {
        codigoBNCC: 'EF01LP03',
        descricao: 'Observar escritas convencionais, comparando-as às suas produções escritas, percebendo semelhanças e diferenças.',
        programaEnsinoId: port1ano.id,
        ordem: 3,
        competencia: 'Desenvolver consciência ortográfica',
        habilidade: 'Análise e reflexão sobre a escrita',
      },
      {
        codigoBNCC: 'EF01LP04',
        descricao: 'Distinguir as letras do alfabeto de outros sinais gráficos.',
        programaEnsinoId: port1ano.id,
        ordem: 4,
        competencia: 'Conhecer o alfabeto',
        habilidade: 'Identificação de letras',
      },
      {
        codigoBNCC: 'EF01LP05',
        descricao: 'Reconhecer o sistema de escrita alfabética como representação dos sons da fala.',
        programaEnsinoId: port1ano.id,
        ordem: 5,
        competencia: 'Compreender o princípio alfabético',
        habilidade: 'Consciência fonológica',
      },
    );
  }

  // ============================================
  // MATEMÁTICA - 1º ANO
  // ============================================
  const mat1ano = programas.find(p => p.codigo === 'MAT-1ANO-2025');
  if (mat1ano) {
    console.log('📝 Criando objetivos de Matemática - 1º Ano...');
    objetivosData.push(
      {
        codigoBNCC: 'EF01MA01',
        descricao: 'Utilizar números naturais como indicadores de quantidade ou de ordem em diferentes situações cotidianas e reconhecer situações em que os números não indicam contagem nem ordem, mas sim código de identificação.',
        programaEnsinoId: mat1ano.id,
        ordem: 1,
        competencia: 'Compreender e utilizar o sistema de numeração decimal',
        habilidade: 'Função social dos números',
      },
      {
        codigoBNCC: 'EF01MA02',
        descricao: 'Contar de maneira exata ou aproximada, utilizando diferentes estratégias como o pareamento e outros agrupamentos.',
        programaEnsinoId: mat1ano.id,
        ordem: 2,
        competencia: 'Desenvolver o conceito de número',
        habilidade: 'Contagem e quantificação',
      },
      {
        codigoBNCC: 'EF01MA03',
        descricao: 'Estimar e comparar quantidades de objetos de dois conjuntos (em torno de 20 elementos), por estimativa e/ou por correspondência (um a um, dois a dois) para indicar "tem mais", "tem menos" ou "tem a mesma quantidade".',
        programaEnsinoId: mat1ano.id,
        ordem: 3,
        competencia: 'Estabelecer relações de quantidade',
        habilidade: 'Comparação de quantidades',
      },
      {
        codigoBNCC: 'EF01MA04',
        descricao: 'Contar a quantidade de objetos de coleções até 100 unidades e apresentar o resultado por registros verbais e simbólicos, em situações de seu interesse, como jogos, brincadeiras, materiais da sala de aula, entre outros.',
        programaEnsinoId: mat1ano.id,
        ordem: 4,
        competencia: 'Ampliar a sequência numérica',
        habilidade: 'Contagem até 100',
      },
      {
        codigoBNCC: 'EF01MA05',
        descricao: 'Comparar números naturais de até duas ordens em situações cotidianas, com e sem suporte da reta numérica.',
        programaEnsinoId: mat1ano.id,
        ordem: 5,
        competencia: 'Ordenar números naturais',
        habilidade: 'Comparação de números',
      },
      {
        codigoBNCC: 'EF01MA06',
        descricao: 'Construir fatos básicos da adição e utilizá-los em procedimentos de cálculo para resolver problemas.',
        programaEnsinoId: mat1ano.id,
        ordem: 6,
        competencia: 'Compreender e resolver operações de adição',
        habilidade: 'Fatos básicos da adição',
      },
    );
  }

  // ============================================
  // CIÊNCIAS - 1º ANO
  // ============================================
  const cien1ano = programas.find(p => p.codigo === 'CIEN-1ANO-2025');
  if (cien1ano) {
    console.log('📝 Criando objetivos de Ciências - 1º Ano...');
    objetivosData.push(
      {
        codigoBNCC: 'EF01CI01',
        descricao: 'Comparar características de diferentes materiais presentes em objetos de uso cotidiano, discutindo sua origem, os modos como são descartados e como podem ser usados de forma mais consciente.',
        programaEnsinoId: cien1ano.id,
        ordem: 1,
        competencia: 'Compreender as propriedades dos materiais',
        habilidade: 'Identificação e classificação de materiais',
      },
      {
        codigoBNCC: 'EF01CI02',
        descricao: 'Localizar, nomear e representar graficamente (por meio de desenhos) partes do corpo humano e explicar suas funções.',
        programaEnsinoId: cien1ano.id,
        ordem: 2,
        competencia: 'Conhecer o corpo humano',
        habilidade: 'Partes e funções do corpo',
      },
      {
        codigoBNCC: 'EF01CI03',
        descricao: 'Discutir as razões pelas quais os hábitos de higiene do corpo (lavar as mãos antes de comer, escovar os dentes, limpar os olhos, o nariz e as orelhas etc.) são necessários para a manutenção da saúde.',
        programaEnsinoId: cien1ano.id,
        ordem: 3,
        competencia: 'Desenvolver hábitos saudáveis',
        habilidade: 'Higiene e saúde',
      },
      {
        codigoBNCC: 'EF01CI04',
        descricao: 'Comparar características físicas entre os colegas, reconhecendo a diversidade e a importância da valorização, do acolhimento e do respeito às diferenças.',
        programaEnsinoId: cien1ano.id,
        ordem: 4,
        competencia: 'Respeitar a diversidade humana',
        habilidade: 'Características físicas e diversidade',
      },
    );
  }

  // ============================================
  // PORTUGUÊS - 2º ANO
  // ============================================
  const port2ano = programas.find(p => p.codigo === 'PORT-2ANO-2025');
  if (port2ano) {
    console.log('📝 Criando objetivos de Português - 2º Ano...');
    objetivosData.push(
      {
        codigoBNCC: 'EF02LP01',
        descricao: 'Utilizar, ao produzir o texto, grafia correta de palavras conhecidas ou com estruturas silábicas já dominadas, letras maiúsculas em início de frases e em substantivos próprios, segmentação entre as palavras, ponto final, ponto de interrogação e ponto de exclamação.',
        programaEnsinoId: port2ano.id,
        ordem: 1,
        competencia: 'Dominar convenções da escrita',
        habilidade: 'Ortografia e pontuação básica',
      },
      {
        codigoBNCC: 'EF02LP02',
        descricao: 'Segmentar palavras em sílabas e remover e substituir sílabas iniciais, mediais ou finais para criar novas palavras.',
        programaEnsinoId: port2ano.id,
        ordem: 2,
        competencia: 'Desenvolver consciência fonológica avançada',
        habilidade: 'Manipulação de sílabas',
      },
      {
        codigoBNCC: 'EF02LP03',
        descricao: 'Ler e escrever palavras com correspondências regulares diretas entre letras e fonemas (f, v, t, d, p, b) e correspondências regulares contextuais (c e q; e e o, em posição átona em final de palavra).',
        programaEnsinoId: port2ano.id,
        ordem: 3,
        competencia: 'Consolidar o sistema alfabético',
        habilidade: 'Correspondências grafema-fonema',
      },
    );
  }

  // ============================================
  // MATEMÁTICA - 2º ANO
  // ============================================
  const mat2ano = programas.find(p => p.codigo === 'MAT-2ANO-2025');
  if (mat2ano) {
    console.log('📝 Criando objetivos de Matemática - 2º Ano...');
    objetivosData.push(
      {
        codigoBNCC: 'EF02MA01',
        descricao: 'Comparar e ordenar números naturais (até a ordem de centenas) pela compreensão de características do sistema de numeração decimal (valor posicional e função do zero).',
        programaEnsinoId: mat2ano.id,
        ordem: 1,
        competencia: 'Compreender o valor posicional',
        habilidade: 'Sistema de numeração decimal',
      },
      {
        codigoBNCC: 'EF02MA02',
        descricao: 'Fazer estimativas por meio de estratégias diversas a respeito da quantidade de objetos de coleções e registrar o resultado da contagem desses objetos (até 1000 unidades).',
        programaEnsinoId: mat2ano.id,
        ordem: 2,
        competencia: 'Desenvolver estimativa e contagem',
        habilidade: 'Estimativa e quantificação',
      },
      {
        codigoBNCC: 'EF02MA03',
        descricao: 'Comparar quantidades de objetos de dois conjuntos, por estimativa e/ou por correspondência (um a um, dois a dois, entre outros), para indicar "tem mais", "tem menos" ou "tem a mesma quantidade", indicando, quando for o caso, quantos a mais e quantos a menos.',
        programaEnsinoId: mat2ano.id,
        ordem: 3,
        competencia: 'Estabelecer relações numéricas',
        habilidade: 'Comparação quantitativa',
      },
    );
  }

  // Criar objetivos no banco
  console.log('\n💾 Salvando objetivos no banco de dados...');
  let criados = 0;
  let atualizados = 0;

  for (const objetivoData of objetivosData) {
    const existing = await prisma.objetivoAprendizagem.findUnique({
      where: { codigoBNCC: objetivoData.codigoBNCC },
    });

    if (existing) {
      await prisma.objetivoAprendizagem.update({
        where: { codigoBNCC: objetivoData.codigoBNCC },
        data: objetivoData,
      });
      atualizados++;
    } else {
      await prisma.objetivoAprendizagem.create({
        data: objetivoData,
      });
      criados++;
    }
  }

  console.log(`✅ ${criados} objetivos criados`);
  console.log(`🔄 ${atualizados} objetivos atualizados`);
  console.log(`\n📊 Total de objetivos: ${objetivosData.length}`);
  console.log('\n✨ Seed de Objetivos de Aprendizagem concluído com sucesso!');
}

main()
  .catch((e) => {
    console.error('❌ Erro no seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

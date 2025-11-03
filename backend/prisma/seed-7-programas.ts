/**
 * SEED 7: Programas de Ensino
 * Programas com objetivos de aprendizagem e avaliações
 * Executa: npx ts-node prisma/seed-7-programas.ts
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Objetivos BNCC por disciplina e série
const objetivosBNCC: Record<string, Record<string, string[]>> = {
  'PORT': {
    '1': [
      'EF01LP01: Reconhecer letras do alfabeto',
      'EF01LP02: Escrever palavras e frases',
      'EF01LP03: Localizar informações em textos',
      'EF01LP04: Compreender textos narrativos',
      'EF01LP05: Produzir textos simples'
    ],
    '2': [
      'EF02LP01: Ler e compreender textos diversos',
      'EF02LP02: Segmentar palavras em textos',
      'EF02LP03: Produzir textos narrativos',
      'EF02LP04: Usar pontuação adequada',
      'EF02LP05: Ampliar vocabulário'
    ]
  },
  'MAT': {
    '1': [
      'EF01MA01: Utilizar números naturais',
      'EF01MA02: Contar objetos',
      'EF01MA03: Comparar quantidades',
      'EF01MA04: Resolver adição e subtração',
      'EF01MA05: Reconhecer formas geométricas'
    ],
    '2': [
      'EF02MA01: Comparar e ordenar números',
      'EF02MA02: Fazer estimativas',
      'EF02MA03: Resolver multiplicação simples',
      'EF02MA04: Medir comprimentos',
      'EF02MA05: Identificar padrões'
    ]
  },
  'CIEN': {
    '1': [
      'EF01CI01: Comparar seres vivos',
      'EF01CI02: Identificar necessidades dos seres vivos',
      'EF01CI03: Reconhecer partes do corpo',
      'EF01CI04: Comparar características de materiais',
      'EF01CI05: Observar fenômenos naturais'
    ],
    '2': [
      'EF02CI01: Investigar plantas e animais',
      'EF02CI02: Observar crescimento de plantas',
      'EF02CI03: Identificar materiais recicláveis',
      'EF02CI04: Discutir uso da água',
      'EF02CI05: Reconhecer Sol como fonte de luz e calor'
    ]
  },
  'HIST': {
    '1': [
      'EF01HI01: Identificar mudanças e permanências',
      'EF01HI02: Descrever história pessoal',
      'EF01HI03: Conhecer história familiar',
      'EF01HI04: Identificar semelhanças entre famílias',
      'EF01HI05: Reconhecer diferentes tipos de moradia'
    ]
  },
  'GEO': {
    '1': [
      'EF01GE01: Descrever características do lugar',
      'EF01GE02: Identificar semelhanças e diferenças',
      'EF01GE03: Identificar tipos de moradia',
      'EF01GE04: Observar ritmos naturais',
      'EF01GE05: Localizar-se no espaço'
    ]
  }
};

async function seed() {
  console.log('📚 Seed 7: Programas de Ensino\n');

  const disciplinas = await prisma.disciplina.findMany();
  const series = await prisma.serie.findMany({ orderBy: { ordem: 'asc' } });
  const turmas = await prisma.turma.findMany({
    include: {
      serie: true,
      matriculas: {
        include: {
          aluno: true
        }
      }
    }
  });

  console.log('Criando programas de ensino...\n');

  let totalProgramas = 0;
  let totalObjetivos = 0;
  let totalAvaliacoes = 0;

  // Criar programas para cada disciplina x série
  for (const disciplina of disciplinas) {
    for (const serie of series.slice(0, 2)) { // Apenas 1º e 2º ano para exemplo
      const programa = await prisma.programaEnsino.create({
        data: {
          codigo: `${disciplina.codigo}-${serie.codigo}-2025`,
          nome: `${disciplina.nome} - ${serie.nome}`,
          descricao: `Programa de ${disciplina.nome} para ${serie.nome} - Ano Letivo 2025`,
          disciplinaId: disciplina.id,
          serieId: serie.id,
          periodo: "Anual",
          anoLetivo: 2025,
          cargaHoraria: disciplina.cargaHorariaSemanal * 40, // 40 semanas
          active: true
        }
      });

      totalProgramas++;
      console.log(`  ✓ ${programa.nome}`);

      // Criar objetivos para o programa
      const objetivosList = objetivosBNCC[disciplina.codigo]?.[String(serie.ordem)] || [
        `Objetivo 1: Compreender conceitos básicos de ${disciplina.nome}`,
        `Objetivo 2: Aplicar conhecimentos em situações práticas`,
        `Objetivo 3: Desenvolver habilidades específicas`,
        `Objetivo 4: Relacionar conteúdos com o cotidiano`,
        `Objetivo 5: Avaliar e refletir sobre o aprendizado`
      ];

      for (let i = 0; i < objetivosList.length; i++) {
        const descricaoObj = objetivosList[i];
        const codigoBNCC = descricaoObj.split(':')[0];

        const objetivo = await prisma.objetivoAprendizagem.create({
          data: {
            codigoBNCC: `${codigoBNCC}-${serie.codigo}-${disciplina.codigo}`,
            descricao: descricaoObj,
            programaEnsinoId: programa.id,
            ordem: i + 1,
            pontuacaoMeta: 7.0
          }
        });

        totalObjetivos++;

        // Criar avaliações do objetivo para alunos das turmas desta série
        const turmasSerie = turmas.filter(t => t.serieId === serie.id);
        
        for (const turma of turmasSerie) {
          // Avaliar metade dos alunos de cada turma (exemplo)
          const alunosAvaliar = turma.matriculas.slice(0, Math.ceil(turma.matriculas.length / 2));

          for (const matricula of alunosAvaliar) {
            // Gerar status aleatório
            const statusOptions = ['A', 'D', 'N'] as const;
            const status = statusOptions[Math.floor(Math.random() * statusOptions.length)];

            await prisma.avaliacaoObjetivo.create({
              data: {
                objetivoId: objetivo.id,
                alunoId: matricula.alunoId,
                turmaId: turma.id,
                status,
                observacao: status === 'A' ? 
                  'Objetivo atingido com sucesso' : 
                  status === 'D' ?
                  'Em desenvolvimento, requer acompanhamento' :
                  'Não atingido, requer reforço',
                revisado: status === 'A'
              }
            });

            totalAvaliacoes++;
          }
        }
      }
    }
  }

  console.log(`\n✅ Dados criados:`);
  console.log(`   - ${totalProgramas} programas de ensino`);
  console.log(`   - ${totalObjetivos} objetivos de aprendizagem`);
  console.log(`   - ${totalAvaliacoes} avaliações de objetivos`);
  console.log(`   - Média: ${Math.round(totalObjetivos / totalProgramas)} objetivos por programa\n`);

  console.log('✅ Seed 7 concluído com sucesso!\n');
}

seed()
  .catch((e) => {
    console.error('❌ Erro no seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

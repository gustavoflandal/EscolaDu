import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🎯 Iniciando seed de avaliações de objetivos...');

  // 1. Buscar dados necessários
  const turmas = await prisma.turma.findMany({ take: 2 });
  const programas = await prisma.programaEnsino.findMany({ 
    take: 5,
    include: {
      _count: {
        select: { objetivos: true }
      }
    }
  });
  
  if (turmas.length === 0) {
    console.log('⚠️  Nenhuma turma encontrada. Execute seed-turmas.ts primeiro.');
    return;
  }

  if (programas.length === 0) {
    console.log('⚠️  Nenhum programa de ensino encontrado. Execute seed-programas-ensino.ts primeiro.');
    return;
  }

  // Escolher um programa que tenha objetivos
  const programaComObjetivos = programas.find(p => p._count.objetivos > 0);
  if (!programaComObjetivos) {
    console.log('⚠️  Nenhum programa com objetivos encontrado. Execute seed-objetivos.ts primeiro.');
    return;
  }

  const turma = turmas[0];
  const programa = programaComObjetivos;

  console.log(`📚 Usando turma: ${turma.nome}`);
  console.log(`📖 Usando programa: ${programa.nome}`);

  // 2. Buscar objetivos do programa
  const objetivos = await prisma.objetivoAprendizagem.findMany({
    where: { programaEnsinoId: programa.id },
    take: 5,
  });

  if (objetivos.length === 0) {
    console.log('⚠️  Nenhum objetivo encontrado. Execute seed-objetivos.ts primeiro.');
    return;
  }

  console.log(`🎯 Encontrados ${objetivos.length} objetivos`);

  // 3. Buscar alunos da turma
  const matriculas = await prisma.matricula.findMany({
    where: { 
      turmaId: turma.id,
      status: 'ATIVO'
    },
    include: { aluno: true },
    take: 5,
  });

  if (matriculas.length === 0) {
    console.log('⚠️  Nenhum aluno encontrado na turma. Execute seed-alunos-exemplo.ts primeiro.');
    return;
  }

  console.log(`👨‍🎓 Encontrados ${matriculas.length} alunos na turma`);

  // 4. Buscar um professor para ser o avaliador
  const professor = await prisma.professor.findFirst({
    include: { user: true }
  });

  if (!professor) {
    console.log('⚠️  Nenhum professor encontrado. Execute seed-professores.ts primeiro.');
    return;
  }

  console.log(`👨‍🏫 Avaliador: ${professor.user.name}`);

  // 5. Criar avaliações para cada aluno em cada objetivo
  let avaliacoesCount = 0;
  let evidenciasCount = 0;

  const statusOptions: Array<'A' | 'D' | 'N' | 'NA'> = ['A', 'D', 'N', 'NA'];
  const tipoEvidenciaOptions: Array<'FOTO' | 'VIDEO' | 'DOCUMENTO' | 'TEXTO' | 'ATIVIDADE' | 'PROJETO'> = 
    ['FOTO', 'VIDEO', 'DOCUMENTO', 'TEXTO', 'ATIVIDADE', 'PROJETO'];

  for (const matricula of matriculas) {
    const aluno = matricula.aluno;
    
    for (const objetivo of objetivos) {
      // Criar avaliação com status variado
      const randomIndex = Math.floor(Math.random() * statusOptions.length);
      const status = statusOptions[randomIndex];
      
      // 80% de chance de criar avaliação (20% ficam NA - Não Avaliado)
      if (Math.random() > 0.2) {
        const avaliacao = await prisma.avaliacaoObjetivo.create({
          data: {
            objetivoId: objetivo.id,
            alunoId: aluno.id,
            turmaId: turma.id,
            status,
            observacao: getObservacaoPorStatus(status),
            avaliadoEm: new Date(),
            avaliadoPor: professor.userId,
          },
        });

        avaliacoesCount++;

        // 60% de chance de criar evidências para avaliações A ou D
        if ((status === 'A' || status === 'D') && Math.random() > 0.4) {
          const numEvidencias = Math.floor(Math.random() * 3) + 1; // 1 a 3 evidências
          
          for (let i = 0; i < numEvidencias; i++) {
            const tipoIndex = Math.floor(Math.random() * tipoEvidenciaOptions.length);
            const tipo = tipoEvidenciaOptions[tipoIndex];
            
            await prisma.evidenciaAprendizagem.create({
              data: {
                avaliacaoObjetivoId: avaliacao.id,
                alunoId: aluno.id,
                tipo,
                arquivoUrl: getArquivoUrlExemplo(tipo),
                descricao: getDescricaoEvidencia(tipo, objetivo.codigoBNCC),
              },
            });

            evidenciasCount++;
          }
        }
      }
    }

    console.log(`✅ Avaliações criadas para aluno: ${aluno.nome}`);
  }

  console.log('\n📊 Resumo do Seed:');
  console.log(`   ✅ ${avaliacoesCount} avaliações criadas`);
  console.log(`   📎 ${evidenciasCount} evidências criadas`);
  console.log(`   👨‍🎓 ${matriculas.length} alunos avaliados`);
  console.log(`   🎯 ${objetivos.length} objetivos com avaliações`);

  // 6. Exibir estatísticas
  console.log('\n📈 Estatísticas por Status:');
  const stats = await prisma.avaliacaoObjetivo.groupBy({
    by: ['status'],
    _count: true,
  });

  stats.forEach(stat => {
    const label = getStatusLabel(stat.status);
    console.log(`   ${label}: ${stat._count} (${((stat._count / avaliacoesCount) * 100).toFixed(1)}%)`);
  });

  console.log('\n✅ Seed de avaliações concluído com sucesso!');
}

function getStatusLabel(status: string): string {
  switch (status) {
    case 'A': return '✅ Atingido';
    case 'D': return '🔄 Em Desenvolvimento';
    case 'N': return '❌ Não Atingido';
    case 'NA': return '⏸️  Não Avaliado';
    default: return status;
  }
}

function getObservacaoPorStatus(status: 'A' | 'D' | 'N' | 'NA'): string {
  const observacoes = {
    A: [
      'Demonstrou pleno domínio do conteúdo',
      'Atingiu todos os critérios estabelecidos',
      'Desempenho excelente na avaliação',
      'Compreensão completa do objetivo',
    ],
    D: [
      'Em processo de desenvolvimento, necessita mais prática',
      'Demonstra compreensão parcial, precisa de reforço',
      'Está avançando, mas ainda precisa consolidar o aprendizado',
      'Necessita acompanhamento mais próximo',
    ],
    N: [
      'Não demonstrou compreensão do conteúdo',
      'Precisa de intervenção pedagógica',
      'Necessita retomar os conceitos básicos',
      'Requer apoio individualizado',
    ],
    NA: [
      'Aguardando avaliação',
      'Será avaliado em momento posterior',
    ],
  };

  const lista = observacoes[status];
  return lista[Math.floor(Math.random() * lista.length)];
}

function getDescricaoEvidencia(tipo: string, codigo: string): string {
  const descricoes: Record<string, string[]> = {
    FOTO: [
      `Registro fotográfico da atividade relacionada ao objetivo ${codigo}`,
      `Imagem demonstrando a aplicação prática do conteúdo`,
      `Foto do trabalho realizado em sala de aula`,
    ],
    VIDEO: [
      `Vídeo da apresentação sobre o objetivo ${codigo}`,
      `Gravação da atividade prática realizada`,
      `Registro em vídeo do experimento/projeto`,
    ],
    DOCUMENTO: [
      `Trabalho escrito sobre o tema do objetivo ${codigo}`,
      `Relatório da atividade desenvolvida`,
      `Documento comprobatório do aprendizado`,
    ],
    TEXTO: [
      `Produção textual demonstrando compreensão do objetivo ${codigo}`,
      `Redação sobre o tema trabalhado`,
      `Texto reflexivo sobre o conteúdo`,
    ],
    ATIVIDADE: [
      `Atividade prática realizada em sala relacionada ao ${codigo}`,
      `Exercícios resolvidos sobre o conteúdo`,
      `Atividade de fixação do aprendizado`,
    ],
    PROJETO: [
      `Projeto desenvolvido sobre o objetivo ${codigo}`,
      `Trabalho em grupo demonstrando aplicação do conhecimento`,
      `Projeto interdisciplinar relacionado ao tema`,
    ],
  };

  const lista = descricoes[tipo] || [`Evidência do tipo ${tipo} relacionada ao objetivo ${codigo}`];
  return lista[Math.floor(Math.random() * lista.length)];
}

function getArquivoUrlExemplo(tipo: string): string {
  const urls: Record<string, string> = {
    FOTO: 'https://exemplo.com/evidencias/fotos/atividade-001.jpg',
    VIDEO: 'https://exemplo.com/evidencias/videos/apresentacao-001.mp4',
    DOCUMENTO: 'https://exemplo.com/evidencias/documentos/trabalho-001.pdf',
    TEXTO: 'https://exemplo.com/evidencias/textos/redacao-001.txt',
    ATIVIDADE: 'https://exemplo.com/evidencias/atividades/exercicios-001.pdf',
    PROJETO: 'https://exemplo.com/evidencias/projetos/projeto-001.zip',
  };

  return urls[tipo] || 'https://exemplo.com/evidencias/arquivo.pdf';
}

main()
  .catch((e) => {
    console.error('❌ Erro ao executar seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

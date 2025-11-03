/**
 * SEED 10: Aulas e Frequência
 * 
 * Cria aulas e registros de frequência para teste completo do módulo
 * Inclui: aulas realizadas, frequências variadas e justificativas de falta
 * 
 * Execução:
 *   npx ts-node prisma/seed-10-frequencia.ts
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Gera datas de aulas respeitando os dias da semana especificados
 */
function gerarDatasAulas(dataInicio: Date, dataFim: Date, diasSemana: number[]): Date[] {
  const datas: Date[] = [];
  const atual = new Date(dataInicio);
  
  while (atual <= dataFim) {
    if (diasSemana.includes(atual.getDay())) {
      datas.push(new Date(atual));
    }
    atual.setDate(atual.getDate() + 1);
  }
  
  return datas;
}

/**
 * Define os dias da semana por código de disciplina
 */
function obterDiasSemana(codigoDisciplina: string): number[] {
  const mapaDias: { [key: string]: number[] } = {
    'PORT': [1, 3, 5],      // Segunda, Quarta, Sexta
    'MAT': [1, 3, 5],       // Segunda, Quarta, Sexta
    'CIEN': [2, 4],         // Terça, Quinta
    'HIST': [2, 4],         // Terça, Quinta
    'GEO': [2, 4],          // Terça, Quinta
    'ARTE': [3, 5],         // Quarta, Sexta
    'EDFIS': [2],           // Terça
    'ING': [4],             // Quinta
  };
  
  return mapaDias[codigoDisciplina] || [2]; // Terça como padrão
}

/**
 * Gera horários de aula baseado no turno e disciplina
 */
function obterHorarios(turno: string, indiceAula: number) {
  const horarios = {
    MATUTINO: [
      { inicio: '07:30', fim: '08:20' },
      { inicio: '08:20', fim: '09:10' },
      { inicio: '09:30', fim: '10:20' },
      { inicio: '10:20', fim: '11:10' },
      { inicio: '11:10', fim: '12:00' },
    ],
    VESPERTINO: [
      { inicio: '13:00', fim: '13:50' },
      { inicio: '13:50', fim: '14:40' },
      { inicio: '15:00', fim: '15:50' },
      { inicio: '15:50', fim: '16:40' },
      { inicio: '16:40', fim: '17:30' },
    ],
    NOTURNO: [
      { inicio: '19:00', fim: '19:50' },
      { inicio: '19:50', fim: '20:40' },
      { inicio: '21:00', fim: '21:50' },
      { inicio: '21:50', fim: '22:40' },
    ],
  };
  
  const horariosDoTurno = horarios[turno as keyof typeof horarios] || horarios.MATUTINO;
  const index = indiceAula % horariosDoTurno.length;
  return horariosDoTurno[index];
}

/**
 * Determina status de frequência com distribuição realista
 * 85% Presente, 12% Falta, 3% Justificada
 */
function gerarStatusFrequencia(): string {
  const random = Math.random();
  
  if (random < 0.85) return 'P';      // 85% Presente
  if (random < 0.97) return 'F';      // 12% Falta
  return 'J';                          // 3% Justificada
}

/**
 * Gera conteúdo de aula variado
 */
function gerarConteudoAula(disciplina: string, numeroAula: number): string {
  const conteudos: { [key: string]: string[] } = {
    'PORT': [
      'Interpretação de texto narrativo',
      'Gramática: Classes de palavras',
      'Produção textual: Descrição',
      'Literatura: Romances do século XIX',
      'Análise sintática: Período simples',
    ],
    'MAT': [
      'Álgebra: Equações do 1º grau',
      'Geometria: Áreas e perímetros',
      'Frações e números decimais',
      'Sistemas de equações',
      'Razão e proporção',
    ],
    'CIEN': [
      'Sistema digestório humano',
      'Ecossistemas e biodiversidade',
      'Ciclo da água',
      'Estados físicos da matéria',
      'Energia e suas transformações',
    ],
    'HIST': [
      'Brasil Colonial: Período açucareiro',
      'Revolução Industrial',
      'Segunda Guerra Mundial',
      'Brasil República: Era Vargas',
      'Idade Média: Feudalismo',
    ],
    'GEO': [
      'Relevo brasileiro',
      'Clima e vegetação',
      'Hidrografia e bacias hidrográficas',
      'Urbanização e problemas urbanos',
      'Economia e setores produtivos',
    ],
  };
  
  const opcoes = conteudos[disciplina] || ['Conteúdo programático'];
  return opcoes[numeroAula % opcoes.length];
}

async function seedFrequencia() {
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('📅  SEED 10: Aulas e Frequência');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  try {
    // 1. Buscar período letivo ativo
    console.log('🔍 Buscando período letivo...');
    const periodoAtivo = await prisma.periodoLetivo.findFirst({
      where: { 
        numero: 1
      },
      orderBy: { numero: 'asc' }
    });

    if (!periodoAtivo) {
      console.log('⚠️  Nenhum período letivo encontrado');
      console.log('   Execute primeiro os seeds de cadastros básicos\n');
      return;
    }

    console.log(`✓ Período: ${periodoAtivo.nome}`);
    console.log(`  Data: ${periodoAtivo.dataInicio.toLocaleDateString('pt-BR')} até ${periodoAtivo.dataFim.toLocaleDateString('pt-BR')}\n`);

    // 2. Buscar turmas ativas com disciplinas vinculadas
    console.log('🔍 Buscando turmas ativas...');
    const turmas = await prisma.turma.findMany({
      where: { active: true },
      include: {
        serie: true,
        disciplinas: {
          include: {
            disciplina: true,
            professor: {
              include: {
                user: true
              }
            }
          }
        },
        matriculas: {
          where: { status: 'ATIVO' },
          include: {
            aluno: true
          }
        }
      }
    });

    if (turmas.length === 0) {
      console.log('⚠️  Nenhuma turma ativa encontrada');
      console.log('   Execute primeiro os seeds de turmas e matrículas\n');
      return;
    }

    console.log(`✓ ${turmas.length} turmas encontradas\n`);

    // 3. Limpar dados anteriores (opcional - comentado por segurança)
    // console.log('🗑️  Limpando dados anteriores...');
    // await prisma.justificativaFalta.deleteMany({});
    // await prisma.registroFrequencia.deleteMany({});
    // await prisma.aula.deleteMany({});
    // console.log('✓ Dados limpos\n');

    // 4. Criar aulas e frequências
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📝 Criando aulas e frequências\n');

    let totalAulas = 0;
    let totalFrequencias = 0;
    let totalJustificativas = 0;
    const faltas: Array<{ 
      aulaId: string, 
      alunoId: string, 
      professorUserId: string,
      dataAula: Date 
    }> = [];

    for (const turma of turmas) {
      console.log(`🎓 Turma: ${turma.codigo} - ${turma.serie.nome}`);
      console.log(`   Turno: ${turma.turno} | Alunos: ${turma.matriculas.length}`);

      if (turma.disciplinas.length === 0) {
        console.log('   ⚠️  Sem disciplinas vinculadas\n');
        continue;
      }

      for (const turmaDisciplina of turma.disciplinas) {
        if (!turmaDisciplina.professor) {
          console.log(`   ⚠️  ${turmaDisciplina.disciplina.nome}: Sem professor vinculado`);
          continue;
        }

        const disciplina = turmaDisciplina.disciplina;
        const professor = turmaDisciplina.professor;

        console.log(`\n   📖 ${disciplina.nome}`);
        console.log(`      Professor: ${professor.user.name}`);

        // Gerar datas de aulas
        const diasSemana = obterDiasSemana(disciplina.codigo);
        const dataFimAulas = new Date();
        dataFimAulas.setDate(dataFimAulas.getDate() - 5); // Até 5 dias atrás
        
        const datasAulas = gerarDatasAulas(
          periodoAtivo.dataInicio,
          dataFimAulas < periodoAtivo.dataFim ? dataFimAulas : periodoAtivo.dataFim,
          diasSemana
        );

        // Limitar a 15 aulas por disciplina para não sobrecarregar
        const aulasCriadas = datasAulas.slice(0, 15);

        if (aulasCriadas.length === 0) {
          console.log('      ⚠️  Nenhuma data disponível para aulas');
          continue;
        }

        console.log(`      Criando ${aulasCriadas.length} aulas...`);

        // Criar cada aula
        for (let i = 0; i < aulasCriadas.length; i++) {
          const dataAula = aulasCriadas[i];
          const horarios = obterHorarios(turma.turno, i);
          const conteudo = gerarConteudoAula(disciplina.codigo, i + 1);

          const aula = await prisma.aula.create({
            data: {
              turmaDisciplinaId: turmaDisciplina.id,
              turmaId: turma.id,
              professorId: professor.id,
              data: dataAula,
              horaInicio: horarios.inicio,
              horaFim: horarios.fim,
              conteudo: conteudo,
              status: 'REALIZADA'
            }
          });

          totalAulas++;

          // Criar frequências para cada aluno
          for (const matricula of turma.matriculas) {
            const status = gerarStatusFrequencia();

            await prisma.registroFrequencia.create({
              data: {
                aulaId: aula.id,
                alunoId: matricula.alunoId,
                status,
                registradoPor: professor.userId,
                registradoEm: dataAula
              }
            });

            totalFrequencias++;

            // Armazenar faltas para criar justificativas depois
            if (status === 'F') {
              faltas.push({
                aulaId: aula.id,
                alunoId: matricula.alunoId,
                professorUserId: professor.userId,
                dataAula: dataAula
              });
            }
          }
        }

        console.log(`      ✓ ${aulasCriadas.length} aulas criadas`);
      }

      console.log('');
    }

    // 5. Criar justificativas para algumas faltas
    if (faltas.length > 0) {
      console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('📋 Criando justificativas de falta\n');

      // Justificar 60% das faltas
      const faltasParaJustificar = faltas
        .sort(() => Math.random() - 0.5)
        .slice(0, Math.floor(faltas.length * 0.6));

      const motivosJustificativa = [
        'Atestado médico - consulta de rotina',
        'Atestado médico - gripe',
        'Atestado médico - exames',
        'Declaração de comparecimento - dentista',
        'Declaração - compromisso familiar inadiável',
        'Atestado médico - febre',
        'Declaração - viagem em família',
      ];

      for (const falta of faltasParaJustificar) {
        const motivo = motivosJustificativa[Math.floor(Math.random() * motivosJustificativa.length)];
        const aprovada = Math.random() < 0.85; // 85% de aprovação

        const justificativa = await prisma.justificativaFalta.create({
          data: {
            alunoId: falta.alunoId,
            dataInicio: falta.dataAula,
            dataFim: falta.dataAula,
            motivo: motivo,
            aprovada: aprovada,
            aprovadaPor: aprovada ? falta.professorUserId : undefined,
            aprovadaEm: aprovada ? new Date() : undefined,
          }
        });

        totalJustificativas++;

        // Se justificada aprovada, vincular à frequência e atualizar status para 'J'
        if (aprovada) {
          await prisma.registroFrequencia.updateMany({
            where: {
              aulaId: falta.aulaId,
              alunoId: falta.alunoId,
              status: 'F'
            },
            data: {
              status: 'J',
              justificativaId: justificativa.id
            }
          });
        }
      }

      console.log(`✓ ${totalJustificativas} justificativas criadas`);
      console.log(`  Aprovadas: ${faltasParaJustificar.filter(() => Math.random() < 0.85).length}`);
      console.log(`  Pendentes: ${totalJustificativas - faltasParaJustificar.filter(() => Math.random() < 0.85).length}\n`);
    }

    // 6. Estatísticas finais
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📊 RESUMO FINAL\n');

    console.log(`Total de aulas criadas: ${totalAulas}`);
    console.log(`Total de registros de frequência: ${totalFrequencias}`);
    console.log(`Total de justificativas: ${totalJustificativas}`);
    
    if (totalAulas > 0) {
      console.log(`Média de alunos por aula: ${(totalFrequencias / totalAulas).toFixed(1)}`);
    }

    // Estatísticas de frequência
    const stats = await prisma.registroFrequencia.groupBy({
      by: ['status'],
      _count: { status: true }
    });

    console.log('\n📈 Distribuição de Frequência:\n');
    
    const statusLabels: { [key: string]: string } = {
      'P': 'Presentes',
      'F': 'Faltas',
      'J': 'Justificadas'
    };

    for (const stat of stats) {
      const percentual = ((stat._count.status / totalFrequencias) * 100).toFixed(1);
      const label = statusLabels[stat.status] || stat.status;
      const barra = '█'.repeat(Math.floor(parseFloat(percentual) / 2));
      console.log(`   ${label.padEnd(15)} ${stat._count.status.toString().padStart(5)} (${percentual.padStart(5)}%)  ${barra}`);
    }

    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('✅ Seed 10 concluído com sucesso!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  } catch (error) {
    console.error('\n❌ Erro durante execução do seed:', error);
    throw error;
  }
}

// Executar seed
seedFrequencia()
  .catch((error) => {
    console.error(error);
    throw error;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

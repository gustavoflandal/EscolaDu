/**
 * SEED 10: Aulas e Frequência - 1º Bimestre
 * Cria aulas e registros de frequência para o primeiro bimestre
 * Executa: npx ts-node prisma/seed-10-frequencia.ts
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Função auxiliar para gerar datas de aulas
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

async function seed() {
  console.log('📅 Seed 10: Aulas e Frequência - 1º Bimestre\n');

  // Buscar 1º Bimestre
  const primeiroBimestre = await prisma.periodoLetivo.findFirst({
    where: { numero: 1 }
  });

  if (!primeiroBimestre) {
    console.log('❌ Primeiro bimestre não encontrado');
    return;
  }

  console.log(`📆 Período: ${primeiroBimestre.nome}`);
  console.log(`   ${primeiroBimestre.dataInicio.toLocaleDateString()} até ${primeiroBimestre.dataFim.toLocaleDateString()}\n`);

  // Buscar turmas com suas disciplinas
  const turmas = await prisma.turma.findMany({
    include: {
      turmaDisciplinas: {
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

  console.log(`📚 Encontradas ${turmas.length} turmas\n`);

  let totalAulas = 0;
  let totalFrequencias = 0;

  // Para cada turma
  for (const turma of turmas) {
    console.log(`\n🎓 Turma: ${turma.nome} (${turma.turno})`);
    console.log(`   Alunos: ${turma.matriculas.length}`);

    // Para cada disciplina da turma
    for (const turmaDisciplina of turma.turmaDisciplinas) {
      if (!turmaDisciplina.professor) continue;

      const disciplina = turmaDisciplina.disciplina;
      console.log(`\n   📖 ${disciplina.nome} - Prof. ${turmaDisciplina.professor.user.name}`);

      // Definir dias da semana para a disciplina (exemplo: PORT e MAT = Seg/Qua/Sex)
      let diasSemana: number[] = [];
      switch (disciplina.codigo) {
        case 'PORT':
        case 'MAT':
          diasSemana = [1, 3, 5]; // Segunda, Quarta, Sexta
          break;
        case 'CIEN':
        case 'HIST':
        case 'GEO':
          diasSemana = [2, 4]; // Terça, Quinta
          break;
        case 'ARTE':
        case 'EDFIS':
        case 'ING':
          diasSemana = [3]; // Quarta
          break;
        default:
          diasSemana = [2]; // Terça (padrão)
      }

      // Gerar datas de aulas
      const datasAulas = gerarDatasAulas(
        primeiroBimestre.dataInicio,
        primeiroBimestre.dataFim,
        diasSemana
      ).slice(0, 10); // Limitar a 10 aulas por disciplina

      console.log(`      Criando ${datasAulas.length} aulas...`);

      // Criar aulas e frequências
      for (const dataAula of datasAulas) {
        // Criar aula
        const aula = await prisma.aula.create({
          data: {
            turmaDisciplinaId: turmaDisciplina.id,
            turmaId: turma.id,
            professorId: turmaDisciplina.professorId,
            data: dataAula,
            horaInicio: turma.turno === 'MATUTINO' ? '08:00' : '13:30',
            horaFim: turma.turno === 'MATUTINO' ? '08:50' : '14:20',
            conteudo: `Aula de ${disciplina.nome} - ${dataAula.toLocaleDateString('pt-BR')}`,
            status: 'REALIZADA'
          }
        });

        totalAulas++;

        // Criar frequências para cada aluno
        for (const matricula of turma.matriculas) {
          // Gerar status de frequência (90% presença, 8% falta, 2% justificada)
          const random = Math.random();
          let status: string;
          
          if (random < 0.90) {
            status = 'P'; // Presente
          } else if (random < 0.98) {
            status = 'F'; // Falta
          } else {
            status = 'J'; // Justificada
          }

          await prisma.registroFrequencia.create({
            data: {
              aulaId: aula.id,
              alunoId: matricula.alunoId,
              status,
              registradoPor: turmaDisciplina.professor.userId,
              registradoEm: dataAula
            }
          });

          totalFrequencias++;
        }
      }

      console.log(`      ✓ ${datasAulas.length} aulas criadas`);
    }
  }

  console.log('\n\n📊 Resumo Final:');
  console.log(`   Total de aulas: ${totalAulas}`);
  console.log(`   Total de registros de frequência: ${totalFrequencias}`);
  console.log(`   Média de alunos por aula: ${(totalFrequencias / totalAulas).toFixed(1)}`);

  // Estatísticas de frequência
  const estatisticas = await prisma.registroFrequencia.groupBy({
    by: ['status'],
    _count: { status: true }
  });

  console.log('\n   Distribuição de frequência:');
  for (const stat of estatisticas) {
    const percentual = ((stat._count.status / totalFrequencias) * 100).toFixed(1);
    const label = stat.status === 'P' ? 'Presentes' : stat.status === 'F' ? 'Faltas' : 'Justificadas';
    console.log(`      ${label}: ${stat._count.status} (${percentual}%)`);
  }

  console.log('\n✅ Seed 10 concluído com sucesso!\n');
}

seed()
  .catch((e) => {
    console.error('❌ Erro no seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

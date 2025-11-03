/**
 * SEED 5: Turmas
 * Turmas com vínculos de disciplinas e professores
 * Executa: npx ts-node prisma/seed-5-turmas.ts
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seed() {
  console.log('🏫 Seed 5: Turmas\n');

  // Buscar dados necessários
  const anoLetivo = await prisma.anoLetivo.findFirst({ where: { ano: 2025 } });
  const series = await prisma.serie.findMany({ orderBy: { ordem: 'asc' } });
  const salas = await prisma.sala.findMany();
  const professores = await prisma.professor.findMany({ include: { user: true } });
  const disciplinas = await prisma.disciplina.findMany();

  if (!anoLetivo) throw new Error('Ano letivo não encontrado');
  if (series.length === 0) throw new Error('Séries não encontradas');

  console.log('Criando turmas...');
  
  const turnos = ['MANHA', 'TARDE'];
  const turmasCriadas = [];

  // Criar 2 turmas por série (manhã e tarde)
  for (const serie of series) {
    for (const turno of turnos) {
      const turnoLabel = turno === 'MANHA' ? 'Manhã' : 'Tarde';
      const sala = salas[Math.floor(Math.random() * salas.length)];
      const professorRegente = professores[Math.floor(Math.random() * professores.length)];

      const turma = await prisma.turma.create({
        data: {
          codigo: `${serie.codigo}-${turno.substring(0, 1)}`,
          nome: `${serie.nome} - ${turnoLabel}`,
          anoLetivoId: anoLetivo.id,
          serieId: serie.id,
          turno,
          capacidadeMaxima: sala.capacidade,
          salaId: sala.id,
          professorRegenteId: professorRegente.id,
          active: true
        }
      });

      turmasCriadas.push(turma);
      console.log(`  ✓ ${turma.codigo} - ${turma.nome} (Sala: ${sala.nome})`);
    }
  }

  console.log(`\n✅ ${turmasCriadas.length} turmas criadas\n`);

  // Vincular disciplinas às turmas
  console.log('Vinculando disciplinas às turmas...');
  
  // Mapeamento de disciplinas por especialidade dos professores
  const mapeamentoDisciplinas: Record<string, string[]> = {
    'PORT': ['maria.silva@escola.com'],
    'MAT': ['joao.oliveira@escola.com'],
    'CIEN': ['ana.costa@escola.com'],
    'HIST': ['carlos.lima@escola.com'],
    'GEO': ['fernanda.alves@escola.com'],
    'ARTE': ['ricardo.souza@escola.com'],
    'EDFIS': ['juliana.ferreira@escola.com'],
    'ING': ['rafael.silva@escola.com']
  };

  let vinculosCount = 0;
  const diasSemana = [1, 2, 3, 4, 5]; // Segunda a Sexta

  for (const turma of turmasCriadas) {
    let diaAtual = 0;
    let horaInicio = turma.turno === 'MANHA' ? 7 : 13;

    for (const disciplina of disciplinas) {
      const emailsProfessores = mapeamentoDisciplinas[disciplina.codigo];
      const professor = professores.find(p => emailsProfessores?.includes(p.user.email));

      if (!professor) continue;

      // Criar vínculo
      await prisma.turmaDisciplina.create({
        data: {
          turmaId: turma.id,
          disciplinaId: disciplina.id,
          professorId: professor.id,
          diaSemana: diasSemana[diaAtual % 5],
          horarioInicio: `${String(horaInicio).padStart(2, '0')}:00`,
          horarioFim: `${String(horaInicio + 1).padStart(2, '0')}:00`
        }
      });

      vinculosCount++;

      // Avançar para próximo horário/dia
      horaInicio++;
      if (turma.turno === 'MANHA' && horaInicio >= 12) {
        diaAtual++;
        horaInicio = 7;
      } else if (turma.turno === 'TARDE' && horaInicio >= 18) {
        diaAtual++;
        horaInicio = 13;
      }
    }
  }

  console.log(`✅ ${vinculosCount} vínculos turma-disciplina criados\n`);

  console.log('📊 Resumo:');
  console.log(`   - ${turmasCriadas.length} turmas`);
  console.log(`   - ${vinculosCount} vínculos de disciplinas`);
  console.log(`   - Média de ${Math.round(vinculosCount / turmasCriadas.length)} disciplinas por turma\n`);

  console.log('✅ Seed 5 concluído com sucesso!\n');
}

seed()
  .catch((e) => {
    console.error('❌ Erro no seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

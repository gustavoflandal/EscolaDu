import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🚀 Iniciando seed de turmas\n');
  console.log('============================================================\n');

  // 1. Verificar/Criar Anos Letivos
  console.log('📅 Verificando anos letivos...\n');
  
  const anoLetivo2024 = await prisma.anoLetivo.upsert({
    where: { ano: 2024 },
    update: {},
    create: {
      ano: 2024,
      dataInicio: new Date('2024-02-05'),
      dataFim: new Date('2024-12-20'),
      divisao: 'TRIMESTRE',
      status: 'ENCERRADO'
    }
  });
  console.log(`  ✓ Ano Letivo 2024: ${anoLetivo2024.id}`);

  const anoLetivo2025 = await prisma.anoLetivo.upsert({
    where: { ano: 2025 },
    update: {},
    create: {
      ano: 2025,
      dataInicio: new Date('2025-02-03'),
      dataFim: new Date('2025-12-19'),
      divisao: 'TRIMESTRE',
      status: 'EM_ANDAMENTO'
    }
  });
  console.log(`  ✓ Ano Letivo 2025: ${anoLetivo2025.id}\n`);

  // 2. Buscar professores disponíveis
  console.log('👨‍🏫 Buscando professores disponíveis...\n');
  
  const professores = await prisma.professor.findMany({
    where: { active: true },
    take: 10,
    include: {
      user: {
        select: { name: true }
      }
    }
  });

  if (professores.length === 0) {
    console.log('⚠️  Nenhum professor encontrado. Execute o seed de professores primeiro.\n');
    return;
  }

  console.log(`  ✓ ${professores.length} professores encontrados\n`);

  // 3. Criar turmas para 2025
  console.log('🏫 Criando turmas para 2025...\n');

  const turmasData = [
    // Educação Infantil
    { codigo: 'MATERNAL-A', nome: 'Maternal A', serie: 'Maternal', turno: 'MANHA', capacidade: 15, sala: 'Sala 1' },
    { codigo: 'MATERNAL-B', nome: 'Maternal B', serie: 'Maternal', turno: 'TARDE', capacidade: 15, sala: 'Sala 2' },
    { codigo: 'PRE-I-A', nome: 'Pré I A', serie: 'Pré I', turno: 'MANHA', capacidade: 20, sala: 'Sala 3' },
    { codigo: 'PRE-I-B', nome: 'Pré I B', serie: 'Pré I', turno: 'TARDE', capacidade: 20, sala: 'Sala 4' },
    { codigo: 'PRE-II-A', nome: 'Pré II A', serie: 'Pré II', turno: 'MANHA', capacidade: 20, sala: 'Sala 5' },
    { codigo: 'PRE-II-B', nome: 'Pré II B', serie: 'Pré II', turno: 'TARDE', capacidade: 20, sala: 'Sala 6' },

    // Ensino Fundamental I (1º ao 5º ano)
    { codigo: '1A', nome: '1º Ano A', serie: '1º Ano', turno: 'MANHA', capacidade: 25, sala: 'Sala 101' },
    { codigo: '1B', nome: '1º Ano B', serie: '1º Ano', turno: 'TARDE', capacidade: 25, sala: 'Sala 102' },
    { codigo: '2A', nome: '2º Ano A', serie: '2º Ano', turno: 'MANHA', capacidade: 28, sala: 'Sala 103' },
    { codigo: '2B', nome: '2º Ano B', serie: '2º Ano', turno: 'TARDE', capacidade: 28, sala: 'Sala 104' },
    { codigo: '3A', nome: '3º Ano A', serie: '3º Ano', turno: 'MANHA', capacidade: 30, sala: 'Sala 105' },
    { codigo: '3B', nome: '3º Ano B', serie: '3º Ano', turno: 'TARDE', capacidade: 30, sala: 'Sala 106' },
    { codigo: '4A', nome: '4º Ano A', serie: '4º Ano', turno: 'MANHA', capacidade: 30, sala: 'Sala 107' },
    { codigo: '4B', nome: '4º Ano B', serie: '4º Ano', turno: 'TARDE', capacidade: 30, sala: 'Sala 108' },
    { codigo: '5A', nome: '5º Ano A', serie: '5º Ano', turno: 'MANHA', capacidade: 32, sala: 'Sala 109' },
    { codigo: '5B', nome: '5º Ano B', serie: '5º Ano', turno: 'TARDE', capacidade: 32, sala: 'Sala 110' },

    // Ensino Fundamental II (6º ao 9º ano)
    { codigo: '6A', nome: '6º Ano A', serie: '6º Ano', turno: 'MANHA', capacidade: 35, sala: 'Sala 201' },
    { codigo: '6B', nome: '6º Ano B', serie: '6º Ano', turno: 'TARDE', capacidade: 35, sala: 'Sala 202' },
    { codigo: '7A', nome: '7º Ano A', serie: '7º Ano', turno: 'MANHA', capacidade: 35, sala: 'Sala 203' },
    { codigo: '7B', nome: '7º Ano B', serie: '7º Ano', turno: 'TARDE', capacidade: 35, sala: 'Sala 204' },
    { codigo: '8A', nome: '8º Ano A', serie: '8º Ano', turno: 'MANHA', capacidade: 35, sala: 'Sala 205' },
    { codigo: '8B', nome: '8º Ano B', serie: '8º Ano', turno: 'TARDE', capacidade: 35, sala: 'Sala 206' },
    { codigo: '9A', nome: '9º Ano A', serie: '9º Ano', turno: 'MANHA', capacidade: 35, sala: 'Sala 207' },
    { codigo: '9B', nome: '9º Ano B', serie: '9º Ano', turno: 'TARDE', capacidade: 35, sala: 'Sala 208' },

    // Ensino Médio
    { codigo: '1EM-A', nome: '1ª Série EM A', serie: '1ª Série EM', turno: 'MANHA', capacidade: 40, sala: 'Sala 301' },
    { codigo: '1EM-B', nome: '1ª Série EM B', serie: '1ª Série EM', turno: 'TARDE', capacidade: 40, sala: 'Sala 302' },
    { codigo: '2EM-A', nome: '2ª Série EM A', serie: '2ª Série EM', turno: 'MANHA', capacidade: 40, sala: 'Sala 303' },
    { codigo: '2EM-B', nome: '2ª Série EM B', serie: '2ª Série EM', turno: 'TARDE', capacidade: 40, sala: 'Sala 304' },
    { codigo: '3EM-A', nome: '3ª Série EM A', serie: '3ª Série EM', turno: 'MANHA', capacidade: 40, sala: 'Sala 305' },
    { codigo: '3EM-B', nome: '3ª Série EM B', serie: '3ª Série EM', turno: 'TARDE', capacidade: 40, sala: 'Sala 306' },

    // Turma EJA (Educação de Jovens e Adultos)
    { codigo: 'EJA-1', nome: 'EJA Fundamental I', serie: 'EJA Fund. I', turno: 'NOITE', capacidade: 30, sala: 'Sala 401' },
    { codigo: 'EJA-2', nome: 'EJA Fundamental II', serie: 'EJA Fund. II', turno: 'NOITE', capacidade: 30, sala: 'Sala 402' },
    { codigo: 'EJA-3', nome: 'EJA Ensino Médio', serie: 'EJA EM', turno: 'NOITE', capacidade: 35, sala: 'Sala 403' },
  ];

  let turmasCriadas = 0;
  const turmasIds: string[] = [];

  for (const [index, turmaData] of turmasData.entries()) {
    // Atribuir professor regente de forma alternada
    const professorIndex = index % professores.length;
    const professor = professores[professorIndex];

    try {
      const turma = await prisma.turma.create({
        data: {
          codigo: turmaData.codigo,
          nome: turmaData.nome,
          serie: turmaData.serie,
          turno: turmaData.turno,
          capacidadeMaxima: turmaData.capacidade,
          sala: turmaData.sala,
          anoLetivoId: anoLetivo2025.id,
          professorRegenteId: professor.id,
          active: true
        }
      });

      turmasIds.push(turma.id);
      turmasCriadas++;
      console.log(`  ✓ ${turma.codigo} - ${turma.nome} (Regente: ${professor.user.name})`);
    } catch (error: any) {
      if (error.code === 'P2002') {
        console.log(`  ⚠️  ${turmaData.codigo} já existe, pulando...`);
      } else {
        console.error(`  ✗ Erro ao criar ${turmaData.codigo}:`, error.message);
      }
    }
  }

  console.log(`\n✅ ${turmasCriadas} turmas criadas com sucesso!\n`);

  // 4. Matricular alguns alunos nas turmas (se houver alunos cadastrados)
  console.log('👨‍🎓 Verificando alunos para matrícula...\n');
  
  const alunos = await prisma.aluno.findMany({
    where: { status: 'ATIVO' },
    take: 50
  });

  if (alunos.length > 0 && turmasIds.length > 0) {
    console.log(`  ✓ ${alunos.length} alunos encontrados\n`);
    console.log('📝 Criando matrículas de exemplo...\n');

    let matriculasCriadas = 0;

    // Distribuir alunos nas turmas
    for (const [index, aluno] of alunos.entries()) {
      const turmaIndex = index % turmasIds.length;
      const turmaId = turmasIds[turmaIndex];

      try {
        await prisma.matricula.create({
          data: {
            alunoId: aluno.id,
            turmaId: turmaId,
            dataMatricula: new Date(),
            status: 'ATIVO'
          }
        });
        matriculasCriadas++;
      } catch (error: any) {
        if (error.code === 'P2002') {
          // Matrícula já existe, ignorar
        } else {
          console.error(`  ✗ Erro ao matricular aluno:`, error.message);
        }
      }
    }

    console.log(`  ✅ ${matriculasCriadas} matrículas criadas\n`);
  } else {
    console.log('  ⚠️  Nenhum aluno encontrado. Execute o seed de alunos para criar matrículas.\n');
  }

  // 5. Criar algumas turmas inativas de 2024 para teste
  console.log('📦 Criando turmas de 2024 (inativas)...\n');

  const turmas2024 = [
    { codigo: '1A-2024', nome: '1º Ano A - 2024', serie: '1º Ano', turno: 'MANHA', capacidade: 25, sala: 'Sala 101' },
    { codigo: '2A-2024', nome: '2º Ano A - 2024', serie: '2º Ano', turno: 'MANHA', capacidade: 28, sala: 'Sala 103' },
    { codigo: '3A-2024', nome: '3º Ano A - 2024', serie: '3º Ano', turno: 'MANHA', capacidade: 30, sala: 'Sala 105' },
  ];

  for (const turmaData of turmas2024) {
    try {
      await prisma.turma.create({
        data: {
          codigo: turmaData.codigo,
          nome: turmaData.nome,
          serie: turmaData.serie,
          turno: turmaData.turno,
          capacidadeMaxima: turmaData.capacidade,
          sala: turmaData.sala,
          anoLetivoId: anoLetivo2024.id,
          professorRegenteId: professores[0].id,
          active: false // Turmas de 2024 inativas
        }
      });
      console.log(`  ✓ ${turmaData.codigo} - ${turmaData.nome} (Inativa)`);
    } catch (error: any) {
      if (error.code === 'P2002') {
        console.log(`  ⚠️  ${turmaData.codigo} já existe, pulando...`);
      }
    }
  }

  console.log('\n============================================================\n');
  console.log('📊 ESTATÍSTICAS FINAIS:\n');
  
  const totalTurmas = await prisma.turma.count();
  const turmasAtivas = await prisma.turma.count({ where: { active: true } });
  const totalMatriculas = await prisma.matricula.count();
  
  console.log(`  • Total de turmas: ${totalTurmas}`);
  console.log(`  • Turmas ativas: ${turmasAtivas}`);
  console.log(`  • Turmas inativas: ${totalTurmas - turmasAtivas}`);
  console.log(`  • Matrículas criadas: ${totalMatriculas}`);
  
  console.log('\n✅ Seed de turmas concluído com sucesso!\n');
}

main()
  .catch((e) => {
    console.error('\n❌ Erro durante o seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

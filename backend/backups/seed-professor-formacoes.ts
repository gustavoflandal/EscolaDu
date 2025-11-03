import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed de formações dos professores...');

  // Buscar todos os professores
  const professores = await prisma.professor.findMany({
    include: {
      user: true
    }
  });

  // Buscar todas as formações
  const formacoes = await prisma.formacao.findMany();

  if (formacoes.length === 0) {
    console.log('⚠️  Nenhuma formação encontrada. Execute o seed-formacoes.ts primeiro.');
    return;
  }

  let vinculosCount = 0;

  // Vincular professores a formações aleatoriamente (1-3 formações por professor)
  for (const professor of professores) {
    const numFormacoes = Math.floor(Math.random() * 3) + 1; // 1 a 3 formações
    const formacoesAleatorias = formacoes
      .sort(() => 0.5 - Math.random())
      .slice(0, numFormacoes);

    for (const formacao of formacoesAleatorias) {
      try {
        await prisma.professorFormacao.create({
          data: {
            professorId: professor.id,
            formacaoId: formacao.id
          }
        });
        vinculosCount++;
      } catch (error) {
        // Ignora erro de duplicação
        console.log(`⚠️  Vínculo já existe: ${professor.user.name} - ${formacao.nome}`);
      }
    }

    console.log(`✅ Professor ${professor.user.name} vinculado a ${formacoesAleatorias.length} formação(ões)`);
  }

  console.log(`\n✅ Seed de formações dos professores concluído com sucesso!`);
  console.log(`📊 Total de vínculos criados: ${vinculosCount}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

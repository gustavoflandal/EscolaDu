import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed de formações...');

  // Buscar todos os professores
  const professores = await prisma.professor.findMany({
    include: {
      user: true
    }
  });

  if (professores.length === 0) {
    console.log('⚠️  Nenhum professor encontrado. Execute o seed-full.ts primeiro.');
    return;
  }

  const formacoesBase = [
    { nome: 'Pedagogia', descricao: 'Formação em pedagogia para ensino básico.' },
    { nome: 'Matemática', descricao: 'Especialização em ensino de matemática.' },
    { nome: 'Ciências', descricao: 'Formação em ciências naturais.' },
    { nome: 'Educação Física', descricao: 'Especialização em atividades físicas e esportes.' },
    { nome: 'Letras', descricao: 'Formação em língua portuguesa e literatura.' },
    { nome: 'História', descricao: 'Formação em história e ciências sociais.' },
    { nome: 'Geografia', descricao: 'Formação em geografia e estudos do meio.' },
    { nome: 'Artes', descricao: 'Formação em artes visuais e educação artística.' },
  ];

  let count = 0;

  // Distribuir formações entre os professores
  for (let i = 0; i < professores.length; i++) {
    const professor = professores[i];
    const numFormacoes = Math.min(Math.floor(Math.random() * 2) + 1, formacoesBase.length); // 1 a 2 formações
    
    for (let j = 0; j < numFormacoes; j++) {
      const formacaoBase = formacoesBase[(i + j) % formacoesBase.length];
      
      try {
        await prisma.formacao.create({
          data: {
            nome: formacaoBase.nome,
            descricao: formacaoBase.descricao,
            professorId: professor.id
          }
        });
        count++;
        console.log(`✅ Formação "${formacaoBase.nome}" criada para ${professor.user.name}`);
      } catch (error) {
        // Ignora erro de duplicação ou outro erro
      }
    }
  }

  console.log(`\n✅ Seed de formações concluído com sucesso!`);
  console.log(`📊 Total de formações criadas: ${count}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
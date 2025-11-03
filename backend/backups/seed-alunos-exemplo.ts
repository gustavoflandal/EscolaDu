import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🚀 Iniciando seed de alunos de exemplo\n');
  console.log('============================================================\n');

  // Verificar se já existem alunos
  const alunosExistentes = await prisma.aluno.count();
  
  if (alunosExistentes > 0) {
    console.log(`⚠️  ${alunosExistentes} alunos já cadastrados. Pulando criação de alunos.\n`);
  } else {
    console.log('👨‍🎓 Criando alunos de exemplo...\n');

    const alunosData = [
      { nome: 'João Pedro Silva', dataNascimento: '2015-03-15', genero: 'MASCULINO' },
      { nome: 'Maria Eduarda Santos', dataNascimento: '2015-05-22', genero: 'FEMININO' },
      { nome: 'Lucas Gabriel Oliveira', dataNascimento: '2015-08-10', genero: 'MASCULINO' },
      { nome: 'Ana Clara Costa', dataNascimento: '2015-12-03', genero: 'FEMININO' },
      { nome: 'Pedro Henrique Lima', dataNascimento: '2016-02-18', genero: 'MASCULINO' },
      { nome: 'Isabela Cristina Alves', dataNascimento: '2016-04-25', genero: 'FEMININO' },
      { nome: 'Gabriel Lucas Ferreira', dataNascimento: '2016-07-08', genero: 'MASCULINO' },
      { nome: 'Julia Vitória Pereira', dataNascimento: '2016-09-14', genero: 'FEMININO' },
      { nome: 'Matheus Felipe Rodrigues', dataNascimento: '2017-01-20', genero: 'MASCULINO' },
      { nome: 'Laura Beatriz Martins', dataNascimento: '2017-03-30', genero: 'FEMININO' },
      { nome: 'Rafael Augusto Souza', dataNascimento: '2017-06-12', genero: 'MASCULINO' },
      { nome: 'Sophia Helena Carvalho', dataNascimento: '2017-08-28', genero: 'FEMININO' },
      { nome: 'Enzo Miguel Ribeiro', dataNascimento: '2018-01-05', genero: 'MASCULINO' },
      { nome: 'Valentina Alice Gomes', dataNascimento: '2018-03-19', genero: 'FEMININO' },
      { nome: 'Davi Lucca Barbosa', dataNascimento: '2018-05-25', genero: 'MASCULINO' },
      { nome: 'Heloisa Fernanda Dias', dataNascimento: '2018-07-11', genero: 'FEMININO' },
      { nome: 'Arthur Miguel Cardoso', dataNascimento: '2019-01-08', genero: 'MASCULINO' },
      { nome: 'Manuela Sofia Moreira', dataNascimento: '2019-03-22', genero: 'FEMININO' },
      { nome: 'Bernardo Gustavo Castro', dataNascimento: '2019-06-15', genero: 'MASCULINO' },
      { nome: 'Cecília Melissa Pinto', dataNascimento: '2019-09-03', genero: 'FEMININO' },
      { nome: 'Lorenzo Rafael Cunha', dataNascimento: '2014-02-10', genero: 'MASCULINO' },
      { nome: 'Alice Mariana Teixeira', dataNascimento: '2014-04-18', genero: 'FEMININO' },
      { nome: 'Theo Benjamin Monteiro', dataNascimento: '2014-07-22', genero: 'MASCULINO' },
      { nome: 'Helena Larissa Borges', dataNascimento: '2014-10-06', genero: 'FEMININO' },
      { nome: 'Samuel Victor Nunes', dataNascimento: '2013-01-14', genero: 'MASCULINO' },
      { nome: 'Giovanna Yasmin Campos', dataNascimento: '2013-03-28', genero: 'FEMININO' },
      { nome: 'Nicolas Eduardo Freitas', dataNascimento: '2013-06-11', genero: 'MASCULINO' },
      { nome: 'Livia Fernanda Correia', dataNascimento: '2013-08-24', genero: 'FEMININO' },
      { nome: 'Murilo André Moura', dataNascimento: '2012-02-05', genero: 'MASCULINO' },
      { nome: 'Mariana Leticia Melo', dataNascimento: '2012-04-19', genero: 'FEMININO' },
      { nome: 'Felipe Otavio Azevedo', dataNascimento: '2012-07-03', genero: 'MASCULINO' },
      { nome: 'Beatriz Camila Rocha', dataNascimento: '2012-09-17', genero: 'FEMININO' },
      { nome: 'Vinicius Daniel Barros', dataNascimento: '2011-01-23', genero: 'MASCULINO' },
      { nome: 'Carolina Bianca Lopes', dataNascimento: '2011-03-30', genero: 'FEMININO' },
      { nome: 'Gustavo Henrique Araújo', dataNascimento: '2011-06-14', genero: 'MASCULINO' },
      { nome: 'Rafaela Luiza Cavalcanti', dataNascimento: '2011-08-27', genero: 'FEMININO' },
      { nome: 'Leonardo André Mendes', dataNascimento: '2010-02-08', genero: 'MASCULINO' },
      { nome: 'Bruna Gabriela Soares', dataNascimento: '2010-04-22', genero: 'FEMININO' },
      { nome: 'Caio Guilherme Ramos', dataNascimento: '2010-07-05', genero: 'MASCULINO' },
      { nome: 'Leticia Amanda Duarte', dataNascimento: '2010-09-19', genero: 'FEMININO' },
    ];

    for (const alunoData of alunosData) {
      const matricula = `MAT${Date.now().toString().slice(-6)}${Math.floor(Math.random() * 100)}`;
      
      await prisma.aluno.create({
        data: {
          matricula,
          nome: alunoData.nome,
          dataNascimento: new Date(alunoData.dataNascimento),
          genero: alunoData.genero,
          telefone: `(11) 9${Math.floor(Math.random() * 9000 + 1000)}-${Math.floor(Math.random() * 9000 + 1000)}`,
          status: 'ATIVO',
          endereco: 'Rua Exemplo, 123 - Centro, São Paulo/SP - CEP: 01000-000'
        }
      });

      console.log(`  ✓ ${alunoData.nome}`);
    }

    console.log(`\n✅ ${alunosData.length} alunos criados!\n`);
  }

  // Matricular alunos nas turmas
  console.log('📝 Criando matrículas...\n');

  const alunos = await prisma.aluno.findMany({
    where: { status: 'ATIVO' }
  });

  const turmas = await prisma.turma.findMany({
    where: { active: true },
    include: {
      _count: {
        select: { matriculas: true }
      }
    }
  });

  let matriculasCriadas = 0;

  // Distribuir alunos nas turmas respeitando a capacidade
  for (const aluno of alunos) {
    // Verificar se o aluno já está matriculado
    const jaMatriculado = await prisma.matricula.findFirst({
      where: {
        alunoId: aluno.id,
        status: 'ATIVO'
      }
    });

    if (jaMatriculado) {
      continue;
    }

    // Encontrar uma turma com vaga disponível
    const turmaDisponivel = turmas.find(t => 
      t._count.matriculas < t.capacidadeMaxima
    );

    if (turmaDisponivel) {
      try {
        await prisma.matricula.create({
          data: {
            alunoId: aluno.id,
            turmaId: turmaDisponivel.id,
            dataMatricula: new Date(),
            status: 'ATIVO'
          }
        });

        // Atualizar contador da turma
        turmaDisponivel._count.matriculas++;
        matriculasCriadas++;
      } catch (error) {
        // Ignorar erros de matrícula duplicada
      }
    }
  }

  console.log(`  ✅ ${matriculasCriadas} matrículas criadas\n`);

  console.log('============================================================\n');
  console.log('📊 ESTATÍSTICAS FINAIS:\n');
  
  const totalAlunos = await prisma.aluno.count();
  const totalMatriculas = await prisma.matricula.count();
  const turmasComAlunos = await prisma.turma.count({
    where: {
      matriculas: {
        some: {}
      }
    }
  });
  
  console.log(`  • Total de alunos: ${totalAlunos}`);
  console.log(`  • Total de matrículas: ${totalMatriculas}`);
  console.log(`  • Turmas com alunos: ${turmasComAlunos}`);
  
  console.log('\n✅ Seed de alunos concluído com sucesso!\n');
}

main()
  .catch((e) => {
    console.error('\n❌ Erro durante o seed:', e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

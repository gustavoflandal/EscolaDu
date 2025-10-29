import { PrismaClient } from '@prisma/client';
import { hashPassword } from '../src/utils/password.util';

const prisma = new PrismaClient();

// Dados de exemplo
const nomesMasculinos = ['João', 'Pedro', 'Lucas', 'Gabriel', 'Miguel', 'Rafael', 'Felipe', 'Matheus', 'Gustavo', 'Bruno', 'Diego', 'André', 'Carlos', 'Daniel', 'Fernando', 'Henrique', 'Leonardo', 'Marcelo', 'Ricardo', 'Rodrigo'];
const nomesFemininos = ['Maria', 'Ana', 'Julia', 'Beatriz', 'Larissa', 'Fernanda', 'Camila', 'Carolina', 'Amanda', 'Juliana', 'Mariana', 'Letícia', 'Natália', 'Gabriela', 'Bianca', 'Isabela', 'Vitória', 'Sophia', 'Alice', 'Laura'];
const sobrenomes = ['Silva', 'Santos', 'Oliveira', 'Souza', 'Rodrigues', 'Ferreira', 'Alves', 'Pereira', 'Lima', 'Gomes', 'Costa', 'Ribeiro', 'Martins', 'Carvalho', 'Rocha', 'Almeida', 'Nascimento', 'Araújo', 'Melo', 'Barbosa'];
const ruas = ['Rua das Flores', 'Av. Principal', 'Rua do Comércio', 'Rua Central', 'Av. Brasil', 'Rua São Paulo', 'Rua Santos Dumont', 'Av. Paulista', 'Rua XV de Novembro', 'Rua Sete de Setembro'];

function randomItem<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function gerarCPF(): string {
  const n1 = randomInt(0, 9);
  const n2 = randomInt(0, 9);
  const n3 = randomInt(0, 9);
  const n4 = randomInt(0, 9);
  const n5 = randomInt(0, 9);
  const n6 = randomInt(0, 9);
  const n7 = randomInt(0, 9);
  const n8 = randomInt(0, 9);
  const n9 = randomInt(0, 9);
  
  let d1 = n9 * 2 + n8 * 3 + n7 * 4 + n6 * 5 + n5 * 6 + n4 * 7 + n3 * 8 + n2 * 9 + n1 * 10;
  d1 = 11 - (d1 % 11);
  if (d1 >= 10) d1 = 0;
  
  let d2 = d1 * 2 + n9 * 3 + n8 * 4 + n7 * 5 + n6 * 6 + n5 * 7 + n4 * 8 + n3 * 9 + n2 * 10 + n1 * 11;
  d2 = 11 - (d2 % 11);
  if (d2 >= 10) d2 = 0;
  
  return `${n1}${n2}${n3}${n4}${n5}${n6}${n7}${n8}${n9}${d1}${d2}`;
}

function gerarDataNascimento(idadeMin: number, idadeMax: number): Date {
  const hoje = new Date();
  const idade = randomInt(idadeMin, idadeMax);
  const ano = hoje.getFullYear() - idade;
  const mes = randomInt(0, 11);
  const dia = randomInt(1, 28);
  return new Date(ano, mes, dia);
}

async function main() {
  console.log('🌱 Iniciando seed COMPLETO do banco de dados...');

  // Limpar dados existentes (exceto configurações base)
  console.log('🧹 Limpando dados antigos...');
  await prisma.comunicadoLeitura.deleteMany();
  await prisma.comunicado.deleteMany();
  await prisma.recuperacaoAcompanhamento.deleteMany();
  await prisma.planoRecuperacao.deleteMany();
  await prisma.evidenciaAprendizagem.deleteMany();
  await prisma.avaliacaoObjetivo.deleteMany();
  await prisma.registroFrequencia.deleteMany();
  await prisma.justificativaFalta.deleteMany();
  await prisma.aula.deleteMany();
  await prisma.turmaDisciplina.deleteMany();
  await prisma.matricula.deleteMany();
  await prisma.turma.deleteMany();
  await prisma.objetivoAprendizagem.deleteMany();
  await prisma.aluno.deleteMany();
  await prisma.vinculoResponsabilidade.deleteMany();
  await prisma.responsavel.deleteMany();
  await prisma.professor.deleteMany();
  await prisma.userRole.deleteMany();
  await prisma.user.deleteMany({ where: { email: { not: 'admin@sge.com' } } });

  // Criar permissões
  console.log('📝 Criando permissões...');
  const permissions = [
    { resource: 'alunos', action: 'create', description: 'Criar alunos' },
    { resource: 'alunos', action: 'read', description: 'Visualizar alunos' },
    { resource: 'alunos', action: 'update', description: 'Atualizar alunos' },
    { resource: 'alunos', action: 'delete', description: 'Deletar alunos' },
    { resource: 'turmas', action: 'create', description: 'Criar turmas' },
    { resource: 'turmas', action: 'read', description: 'Visualizar turmas' },
    { resource: 'turmas', action: 'update', description: 'Atualizar turmas' },
    { resource: 'turmas', action: 'delete', description: 'Deletar turmas' },
    { resource: 'frequencia', action: 'create', description: 'Lançar frequência' },
    { resource: 'frequencia', action: 'read', description: 'Visualizar frequência' },
    { resource: 'frequencia', action: 'update', description: 'Editar frequência' },
    { resource: 'objetivos', action: 'create', description: 'Criar objetivos' },
    { resource: 'objetivos', action: 'read', description: 'Visualizar objetivos' },
    { resource: 'objetivos', action: 'update', description: 'Avaliar objetivos' },
    { resource: 'relatorios', action: 'read', description: 'Visualizar relatórios' },
    { resource: 'relatorios', action: 'export', description: 'Exportar relatórios' },
    { resource: 'users', action: 'create', description: 'Criar usuários' },
    { resource: 'users', action: 'read', description: 'Visualizar usuários' },
    { resource: 'users', action: 'update', description: 'Atualizar usuários' },
    { resource: 'users', action: 'delete', description: 'Deletar usuários' },
    { resource: 'roles', action: 'create', description: 'Criar perfis' },
    { resource: 'roles', action: 'read', description: 'Visualizar perfis' },
    { resource: 'roles', action: 'update', description: 'Atualizar perfis' },
    { resource: 'roles', action: 'delete', description: 'Deletar perfis' },
    { resource: 'permissions', action: 'read', description: 'Visualizar permissões' },
    { resource: 'responsaveis', action: 'create', description: 'Criar responsáveis' },
    { resource: 'responsaveis', action: 'read', description: 'Visualizar responsáveis' },
    { resource: 'responsaveis', action: 'update', description: 'Atualizar responsáveis' },
    { resource: 'responsaveis', action: 'delete', description: 'Deletar responsáveis' },
  ];

  for (const perm of permissions) {
    await prisma.permission.upsert({
      where: { resource_action: { resource: perm.resource, action: perm.action } },
      update: {},
      create: perm,
    });
  }

  // Criar roles
  console.log('👤 Criando perfis...');
  const adminRole = await prisma.role.upsert({
    where: { name: 'Administrador' },
    update: {},
    create: { name: 'Administrador', description: 'Acesso total ao sistema' },
  });

  const coordenadorRole = await prisma.role.upsert({
    where: { name: 'Coordenador' },
    update: {},
    create: { name: 'Coordenador', description: 'Coordenador pedagógico' },
  });

  const professorRole = await prisma.role.upsert({
    where: { name: 'Professor' },
    update: {},
    create: { name: 'Professor', description: 'Professor regente' },
  });

  const responsavelRole = await prisma.role.upsert({
    where: { name: 'Responsável' },
    update: {},
    create: { name: 'Responsável', description: 'Responsável por aluno' },
  });

  // Vincular permissões
  console.log('🔗 Vinculando permissões...');
  const allPermissions = await prisma.permission.findMany();
  
  for (const perm of allPermissions) {
    await prisma.rolePermission.upsert({
      where: { roleId_permissionId: { roleId: adminRole.id, permissionId: perm.id } },
      update: {},
      create: { roleId: adminRole.id, permissionId: perm.id },
    });
  }

  const coordPermissions = allPermissions.filter(p => p.action !== 'delete');
  for (const perm of coordPermissions) {
    await prisma.rolePermission.upsert({
      where: { roleId_permissionId: { roleId: coordenadorRole.id, permissionId: perm.id } },
      update: {},
      create: { roleId: coordenadorRole.id, permissionId: perm.id },
    });
  }

  const profPermissions = allPermissions.filter(
    p => ['frequencia', 'objetivos', 'turmas', 'alunos'].includes(p.resource) && 
         ['read', 'create', 'update'].includes(p.action)
  );
  for (const perm of profPermissions) {
    await prisma.rolePermission.upsert({
      where: { roleId_permissionId: { roleId: professorRole.id, permissionId: perm.id } },
      update: {},
      create: { roleId: professorRole.id, permissionId: perm.id },
    });
  }

  // Criar usuário admin
  console.log('🔐 Criando usuário administrador...');
  const adminPassword = await hashPassword('Admin@2024');
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@sge.com' },
    update: {},
    create: {
      email: 'admin@sge.com',
      password: adminPassword,
      name: 'Administrador do Sistema',
      active: true,
    },
  });

  await prisma.userRole.upsert({
    where: { userId_roleId: { userId: adminUser.id, roleId: adminRole.id } },
    update: {},
    create: { userId: adminUser.id, roleId: adminRole.id },
  });

  // Criar professores
  console.log('👨‍🏫 Criando professores...');
  const professores = [];
  for (let i = 0; i < 15; i++) {
    const nome = randomItem([...nomesMasculinos, ...nomesFemininos]);
    const sobrenome = randomItem(sobrenomes);
    const nomeCompleto = `${nome} ${sobrenome}`;
    const email = `professor${i + 1}@sge.com`;
    
    const userProf = await prisma.user.create({
      data: {
        email,
        password: await hashPassword('Prof@2024'),
        name: nomeCompleto,
        cpf: gerarCPF(),
        phone: `(11) 9${randomInt(1000, 9999)}-${randomInt(1000, 9999)}`,
        active: true,
      },
    });

    await prisma.userRole.create({
      data: { userId: userProf.id, roleId: professorRole.id },
    });

    const professor = await prisma.professor.create({
      data: {
        userId: userProf.id,
        registroProfissional: `RP${randomInt(10000, 99999)}`,
        formacao: randomItem(['Pedagogia', 'Letras', 'Matemática', 'Ciências', 'História', 'Geografia']),
        cargaHoraria: randomInt(20, 40),
      },
    });

    professores.push(professor);
  }

  // Criar ano letivo
  console.log('📅 Criando ano letivo...');
  const anoLetivo = await prisma.anoLetivo.upsert({
    where: { ano: 2025 },
    update: {},
    create: {
      ano: 2025,
      dataInicio: new Date('2025-02-01'),
      dataFim: new Date('2025-12-20'),
      divisao: 'TRIMESTRE',
      status: 'EM_ANDAMENTO',
    },
  });

  // Criar períodos letivos
  console.log('📊 Criando períodos letivos...');
  const periodos = [];
  for (const p of [
    { numero: 1, nome: '1º Trimestre', inicio: '2025-02-01', fim: '2025-04-30' },
    { numero: 2, nome: '2º Trimestre', inicio: '2025-05-01', fim: '2025-08-31' },
    { numero: 3, nome: '3º Trimestre', inicio: '2025-09-01', fim: '2025-12-20' },
  ]) {
    const periodo = await prisma.periodoLetivo.upsert({
      where: { anoLetivoId_numero: { anoLetivoId: anoLetivo.id, numero: p.numero } },
      update: {},
      create: {
        anoLetivoId: anoLetivo.id,
        numero: p.numero,
        nome: p.nome,
        dataInicio: new Date(p.inicio),
        dataFim: new Date(p.fim),
      },
    });
    periodos.push(periodo);
  }

  // Criar disciplinas
  console.log('📚 Criando disciplinas...');
  const disciplinasData = [
    { codigo: 'PORT', nome: 'Português', areaConhecimento: 'Linguagens' },
    { codigo: 'MAT', nome: 'Matemática', areaConhecimento: 'Matemática' },
    { codigo: 'CIEN', nome: 'Ciências', areaConhecimento: 'Ciências da Natureza' },
    { codigo: 'HIST', nome: 'História', areaConhecimento: 'Ciências Humanas' },
    { codigo: 'GEO', nome: 'Geografia', areaConhecimento: 'Ciências Humanas' },
    { codigo: 'EDF', nome: 'Educação Física', areaConhecimento: 'Linguagens' },
    { codigo: 'ARTE', nome: 'Arte', areaConhecimento: 'Linguagens' },
    { codigo: 'ING', nome: 'Inglês', areaConhecimento: 'Linguagens' },
  ];

  const disciplinas = [];
  for (const disc of disciplinasData) {
    const disciplina = await prisma.disciplina.upsert({
      where: { codigo: disc.codigo },
      update: {},
      create: disc,
    });
    disciplinas.push(disciplina);
  }

  // Criar turmas
  console.log('🏫 Criando turmas...');
  const turmas = [];
  const series = ['1º Ano', '2º Ano', '3º Ano', '4º Ano', '5º Ano', '6º Ano', '7º Ano', '8º Ano', '9º Ano'];
  const turnos = ['MANHA', 'TARDE'];
  
  for (const serie of series) {
    for (const turno of turnos) {
      const codigo = `${serie.charAt(0)}${turno.charAt(0)}`;
      const turma = await prisma.turma.create({
        data: {
          codigo,
          nome: `${serie} - ${turno === 'MANHA' ? 'Manhã' : 'Tarde'}`,
          anoLetivoId: anoLetivo.id,
          serie,
          turno,
          capacidadeMaxima: 30,
          sala: `Sala ${randomInt(1, 20)}`,
          professorRegenteId: randomItem(professores).id,
        },
      });
      turmas.push(turma);
    }
  }

  // Criar responsáveis e alunos
  console.log('👨‍👩‍👧‍👦 Criando responsáveis e alunos...');
  const alunos = [];
  let matriculaCount = 1000;

  for (const turma of turmas) {
    const numAlunos = randomInt(20, 28);
    
    for (let i = 0; i < numAlunos; i++) {
      const genero = randomItem(['M', 'F']);
      const nome = genero === 'M' ? randomItem(nomesMasculinos) : randomItem(nomesFemininos);
      const sobrenome = randomItem(sobrenomes);
      const nomeCompleto = `${nome} ${sobrenome}`;
      
      // Criar responsável
      const nomeResp = randomItem([...nomesMasculinos, ...nomesFemininos]);
      const sobrenomeResp = sobrenome;
      const nomeResponsavel = `${nomeResp} ${sobrenomeResp}`;
      const emailResp = `responsavel${matriculaCount}@example.com`;
      
      const userResp = await prisma.user.create({
        data: {
          email: emailResp,
          password: await hashPassword('Resp@2024'),
          name: nomeResponsavel,
          cpf: gerarCPF(),
          phone: `(11) 9${randomInt(1000, 9999)}-${randomInt(1000, 9999)}`,
          active: true,
        },
      });

      await prisma.userRole.create({
        data: { userId: userResp.id, roleId: responsavelRole.id },
      });

      const tipoVinculo = randomItem(['PAI', 'MAE', 'AVO', 'TUTOR', 'OUTRO']);
      
      const responsavel = await prisma.responsavel.create({
        data: {
          userId: userResp.id,
          cpf: userResp.cpf!,
          tipoVinculo,
          telefonePrincipal: userResp.phone!,
          email: emailResp,
          endereco: `${randomItem(ruas)}, ${randomInt(10, 999)}`,
        },
      });

      // Criar aluno
      const aluno = await prisma.aluno.create({
        data: {
          matricula: `${matriculaCount++}`,
          nome: nomeCompleto,
          cpf: gerarCPF(),
          dataNascimento: gerarDataNascimento(6, 15),
          genero,
          endereco: `${randomItem(ruas)}, ${randomInt(10, 999)}`,
          telefone: `(11) 9${randomInt(1000, 9999)}-${randomInt(1000, 9999)}`,
          email: `aluno${matriculaCount}@example.com`,
          status: 'ATIVO',
          responsavelPrincipalId: userResp.id,
        },
      });

      alunos.push(aluno);

      // Vincular responsável
      await prisma.vinculoResponsabilidade.create({
        data: {
          alunoId: aluno.id,
          responsavelId: responsavel.id,
          prioridadeContato: 1,
        },
      });

      // Matricular aluno na turma
      await prisma.matricula.create({
        data: {
          alunoId: aluno.id,
          turmaId: turma.id,
          status: 'ATIVO',
        },
      });
    }
  }

  console.log(`✅ Criados ${alunos.length} alunos em ${turmas.length} turmas`);

  // Criar turma_disciplina
  console.log('📋 Vinculando disciplinas às turmas...');
  const turmaDisciplinas = [];
  for (const turma of turmas) {
    for (const disciplina of disciplinas) {
      const td = await prisma.turmaDisciplina.create({
        data: {
          turmaId: turma.id,
          disciplinaId: disciplina.id,
          professorId: randomItem(professores).id,
          diaSemana: randomInt(1, 5),
          horarioInicio: '08:00',
          horarioFim: '08:50',
        },
      });
      turmaDisciplinas.push(td);
    }
  }

  // Criar aulas e frequência
  console.log('📅 Criando aulas e registros de frequência...');
  const dataInicio = new Date('2025-02-03'); // Segunda-feira
  const dataAtual = new Date();
  
  for (const td of turmaDisciplinas) {
    const matriculas = await prisma.matricula.findMany({
      where: { turmaId: td.turmaId },
      include: { aluno: true },
    });

    // Criar aulas semanais até hoje
    let dataAula = new Date(dataInicio);
    while (dataAula <= dataAtual) {
      const aula = await prisma.aula.create({
        data: {
          turmaDisciplinaId: td.id,
          turmaId: td.turmaId,
          data: new Date(dataAula),
          horaInicio: td.horarioInicio!,
          horaFim: td.horarioFim!,
          conteudo: `Conteúdo da aula`,
          status: 'REALIZADA',
        },
      });

      // Registrar frequência para cada aluno
      for (const matricula of matriculas) {
        const presente = Math.random() > 0.15; // 85% de presença
        await prisma.registroFrequencia.create({
          data: {
            aulaId: aula.id,
            alunoId: matricula.alunoId,
            status: presente ? 'P' : 'F',
            registradoPor: adminUser.id,
          },
        });
      }

      // Próxima semana
      dataAula.setDate(dataAula.getDate() + 7);
    }
  }

  // Criar objetivos de aprendizagem
  console.log('🎯 Criando objetivos de aprendizagem...');
  const objetivos = [];
  for (const disciplina of disciplinas) {
    for (let i = 1; i <= 10; i++) {
      const objetivo = await prisma.objetivoAprendizagem.create({
        data: {
          codigoBNCC: `${disciplina.codigo}_OBJ_${i}`,
          descricao: `Objetivo de aprendizagem ${i} de ${disciplina.nome}`,
          disciplinaId: disciplina.id,
          serie: randomItem(series),
          periodo: randomItem(['1º Trimestre', '2º Trimestre', '3º Trimestre']),
          competencia: `Competência relacionada ao objetivo ${i}`,
          habilidade: `Habilidade a ser desenvolvida`,
        },
      });
      objetivos.push(objetivo);
    }
  }

  // Criar avaliações de objetivos
  console.log('✏️ Criando avaliações de objetivos...');
  for (const turma of turmas) {
    const matriculas = await prisma.matricula.findMany({
      where: { turmaId: turma.id },
    });

    const objetivosTurma = objetivos.filter(obj => obj.serie === turma.serie).slice(0, 15);

    for (const matricula of matriculas) {
      for (const objetivo of objetivosTurma) {
        const status = randomItem(['A', 'A', 'D', 'N']); // 50% atingido, 25% em desenvolvimento, 25% não atingido
        await prisma.avaliacaoObjetivo.create({
          data: {
            objetivoId: objetivo.id,
            alunoId: matricula.alunoId,
            turmaId: turma.id,
            status,
            observacao: status === 'N' ? 'Necessita reforço' : status === 'D' ? 'Em progresso' : 'Objetivo alcançado',
            avaliadoPor: adminUser.id,
          },
        });
      }
    }
  }

  // Configurações da escola
  console.log('⚙️ Criando configurações...');
  const configs = [
    { chave: 'percentual_minimo_frequencia', valor: '75', tipo: 'NUMBER' as const, descricao: 'Percentual mínimo de frequência para aprovação' },
    { chave: 'percentual_alerta_frequencia', valor: '80', tipo: 'NUMBER' as const, descricao: 'Percentual para alerta de frequência' },
    { chave: 'dias_bloqueio_edicao_frequencia', valor: '7', tipo: 'NUMBER' as const, descricao: 'Dias para bloquear edição de frequência' },
    { chave: 'percentual_minimo_objetivos', valor: '70', tipo: 'NUMBER' as const, descricao: 'Percentual mínimo de objetivos atingidos' },
    { chave: 'limite_objetivos_criticos', valor: '3', tipo: 'NUMBER' as const, descricao: 'Limite de objetivos não atingidos' },
    { chave: 'nome_escola', valor: 'Escola Modelo EscolaDu', tipo: 'STRING' as const, descricao: 'Nome da escola' },
  ];

  for (const config of configs) {
    await prisma.configuracaoEscola.upsert({
      where: { chave: config.chave },
      update: {},
      create: config,
    });
  }

  console.log('\n✅ Seed completo concluído com sucesso!');
  console.log(`\n📊 Resumo:`);
  console.log(`  - ${alunos.length} alunos`);
  console.log(`  - ${turmas.length} turmas`);
  console.log(`  - ${professores.length} professores`);
  console.log(`  - ${disciplinas.length} disciplinas`);
  console.log(`  - ${objetivos.length} objetivos de aprendizagem`);
  console.log('\n📋 Credenciais de acesso:');
  console.log('  Email: admin@sge.com');
  console.log('  Senha: Admin@2024');
}

main()
  .catch((e) => {
    console.error('❌ Erro no seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

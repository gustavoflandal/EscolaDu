import { PrismaClient } from '@prisma/client';
import { hashPassword } from '../src/utils/password.util';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed do banco de dados...');

  // Criar permissões
  console.log('📝 Criando permissões...');
  const permissions = [
    // Alunos
    { resource: 'alunos', action: 'create', description: 'Criar alunos' },
    { resource: 'alunos', action: 'read', description: 'Visualizar alunos' },
    { resource: 'alunos', action: 'update', description: 'Atualizar alunos' },
    { resource: 'alunos', action: 'delete', description: 'Deletar alunos' },
    
    // Turmas
    { resource: 'turmas', action: 'create', description: 'Criar turmas' },
    { resource: 'turmas', action: 'read', description: 'Visualizar turmas' },
    { resource: 'turmas', action: 'update', description: 'Atualizar turmas' },
    { resource: 'turmas', action: 'delete', description: 'Deletar turmas' },
    
    // Frequência
    { resource: 'frequencia', action: 'create', description: 'Lançar frequência' },
    { resource: 'frequencia', action: 'read', description: 'Visualizar frequência' },
    { resource: 'frequencia', action: 'update', description: 'Editar frequência' },
    
    // Objetivos
    { resource: 'objetivos', action: 'create', description: 'Criar objetivos' },
    { resource: 'objetivos', action: 'read', description: 'Visualizar objetivos' },
    { resource: 'objetivos', action: 'update', description: 'Avaliar objetivos' },
    
    // Relatórios
    { resource: 'relatorios', action: 'read', description: 'Visualizar relatórios' },
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
    create: {
      name: 'Administrador',
      description: 'Acesso total ao sistema',
    },
  });

  const coordenadorRole = await prisma.role.upsert({
    where: { name: 'Coordenador' },
    update: {},
    create: {
      name: 'Coordenador',
      description: 'Coordenador pedagógico',
    },
  });

  const professorRole = await prisma.role.upsert({
    where: { name: 'Professor' },
    update: {},
    create: {
      name: 'Professor',
      description: 'Professor regente',
    },
  });

  // Vincular permissões aos roles
  console.log('🔗 Vinculando permissões aos perfis...');
  const allPermissions = await prisma.permission.findMany();

  // Admin tem todas as permissões
  for (const perm of allPermissions) {
    await prisma.rolePermission.upsert({
      where: {
        roleId_permissionId: {
          roleId: adminRole.id,
          permissionId: perm.id,
        },
      },
      update: {},
      create: {
        roleId: adminRole.id,
        permissionId: perm.id,
      },
    });
  }

  // Coordenador tem todas exceto delete
  const coordPermissions = allPermissions.filter(p => p.action !== 'delete');
  for (const perm of coordPermissions) {
    await prisma.rolePermission.upsert({
      where: {
        roleId_permissionId: {
          roleId: coordenadorRole.id,
          permissionId: perm.id,
        },
      },
      update: {},
      create: {
        roleId: coordenadorRole.id,
        permissionId: perm.id,
      },
    });
  }

  // Professor tem read/create/update em frequencia e objetivos
  const profPermissions = allPermissions.filter(
    p => ['frequencia', 'objetivos', 'turmas', 'alunos'].includes(p.resource) && 
         ['read', 'create', 'update'].includes(p.action)
  );
  for (const perm of profPermissions) {
    await prisma.rolePermission.upsert({
      where: {
        roleId_permissionId: {
          roleId: professorRole.id,
          permissionId: perm.id,
        },
      },
      update: {},
      create: {
        roleId: professorRole.id,
        permissionId: perm.id,
      },
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

  // Vincular admin ao role
  await prisma.userRole.upsert({
    where: {
      userId_roleId: {
        userId: adminUser.id,
        roleId: adminRole.id,
      },
    },
    update: {},
    create: {
      userId: adminUser.id,
      roleId: adminRole.id,
    },
  });

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
  await prisma.periodoLetivo.upsert({
    where: {
      anoLetivoId_numero: {
        anoLetivoId: anoLetivo.id,
        numero: 1,
      },
    },
    update: {},
    create: {
      anoLetivoId: anoLetivo.id,
      numero: 1,
      nome: '1º Trimestre',
      dataInicio: new Date('2025-02-01'),
      dataFim: new Date('2025-04-30'),
    },
  });

  await prisma.periodoLetivo.upsert({
    where: {
      anoLetivoId_numero: {
        anoLetivoId: anoLetivo.id,
        numero: 2,
      },
    },
    update: {},
    create: {
      anoLetivoId: anoLetivo.id,
      numero: 2,
      nome: '2º Trimestre',
      dataInicio: new Date('2025-05-01'),
      dataFim: new Date('2025-08-31'),
    },
  });

  await prisma.periodoLetivo.upsert({
    where: {
      anoLetivoId_numero: {
        anoLetivoId: anoLetivo.id,
        numero: 3,
      },
    },
    update: {},
    create: {
      anoLetivoId: anoLetivo.id,
      numero: 3,
      nome: '3º Trimestre',
      dataInicio: new Date('2025-09-01'),
      dataFim: new Date('2025-12-20'),
    },
  });

  // Criar disciplinas
  console.log('📚 Criando disciplinas...');
  const disciplinas = [
    { codigo: 'PORT', nome: 'Português', areaConhecimento: 'Linguagens' },
    { codigo: 'MAT', nome: 'Matemática', areaConhecimento: 'Matemática' },
    { codigo: 'CIEN', nome: 'Ciências', areaConhecimento: 'Ciências da Natureza' },
    { codigo: 'HIST', nome: 'História', areaConhecimento: 'Ciências Humanas' },
    { codigo: 'GEO', nome: 'Geografia', areaConhecimento: 'Ciências Humanas' },
    { codigo: 'EDF', nome: 'Educação Física', areaConhecimento: 'Linguagens' },
    { codigo: 'ARTE', nome: 'Arte', areaConhecimento: 'Linguagens' },
  ];

  for (const disc of disciplinas) {
    await prisma.disciplina.upsert({
      where: { codigo: disc.codigo },
      update: {},
      create: disc,
    });
  }

  // Configurações da escola
  console.log('⚙️ Criando configurações...');
  const configs = [
    { chave: 'percentual_minimo_frequencia', valor: '75', tipo: 'NUMBER' as const, descricao: 'Percentual mínimo de frequência para aprovação' },
    { chave: 'percentual_alerta_frequencia', valor: '80', tipo: 'NUMBER' as const, descricao: 'Percentual para alerta de frequência' },
    { chave: 'dias_bloqueio_edicao_frequencia', valor: '7', tipo: 'NUMBER' as const, descricao: 'Dias para bloquear edição de frequência' },
    { chave: 'percentual_minimo_objetivos', valor: '70', tipo: 'NUMBER' as const, descricao: 'Percentual mínimo de objetivos atingidos' },
    { chave: 'limite_objetivos_criticos', valor: '3', tipo: 'NUMBER' as const, descricao: 'Limite de objetivos não atingidos' },
    { chave: 'nome_escola', valor: 'Escola Modelo', tipo: 'STRING' as const, descricao: 'Nome da escola' },
  ];

  for (const config of configs) {
    await prisma.configuracaoEscola.upsert({
      where: { chave: config.chave },
      update: {},
      create: config,
    });
  }

  // Criar alunos de exemplo
  console.log('👨‍🎓 Criando alunos de exemplo...');
  const alunos = [
    {
      matricula: '2025001',
      nome: 'João Silva Santos',
      dataNascimento: new Date('2010-03-15'),
      genero: 'M',
      cpf: '12345678901',
      telefone: '(11) 98765-4321',
      email: 'joao.silva@email.com',
      endereco: 'Rua das Flores, 123',
      status: 'ATIVO'
    },
    {
      matricula: '2025002',
      nome: 'Maria Oliveira Costa',
      dataNascimento: new Date('2011-07-22'),
      genero: 'F',
      cpf: '23456789012',
      telefone: '(11) 98765-4322',
      email: 'maria.oliveira@email.com',
      endereco: 'Av. Principal, 456',
      status: 'ATIVO'
    },
    {
      matricula: '2025003',
      nome: 'Pedro Henrique Alves',
      dataNascimento: new Date('2010-11-08'),
      genero: 'M',
      cpf: '34567890123',
      telefone: '(11) 98765-4323',
      email: 'pedro.alves@email.com',
      endereco: 'Rua do Comércio, 789',
      status: 'ATIVO'
    },
    {
      matricula: '2025004',
      nome: 'Ana Paula Ferreira',
      dataNascimento: new Date('2011-01-30'),
      genero: 'F',
      cpf: '45678901234',
      telefone: '(11) 98765-4324',
      email: 'ana.ferreira@email.com',
      endereco: 'Rua das Acácias, 321',
      status: 'ATIVO'
    },
    {
      matricula: '2025005',
      nome: 'Lucas Souza Lima',
      dataNascimento: new Date('2010-05-12'),
      genero: 'M',
      cpf: '56789012345',
      telefone: '(11) 98765-4325',
      email: 'lucas.lima@email.com',
      endereco: 'Av. Central, 654',
      status: 'ATIVO'
    },
    {
      matricula: '2025006',
      nome: 'Juliana Martins Rocha',
      dataNascimento: new Date('2011-09-18'),
      genero: 'F',
      cpf: '67890123456',
      telefone: '(11) 98765-4326',
      email: 'juliana.rocha@email.com',
      endereco: 'Rua dos Pinheiros, 987',
      status: 'ATIVO'
    },
    {
      matricula: '2025007',
      nome: 'Rafael Costa Pereira',
      dataNascimento: new Date('2010-12-25'),
      genero: 'M',
      cpf: '78901234567',
      telefone: '(11) 98765-4327',
      email: 'rafael.pereira@email.com',
      endereco: 'Rua Nova, 147',
      status: 'ATIVO'
    },
    {
      matricula: '2025008',
      nome: 'Beatriz Andrade Silva',
      dataNascimento: new Date('2011-04-03'),
      genero: 'F',
      cpf: '89012345678',
      telefone: '(11) 98765-4328',
      email: 'beatriz.silva@email.com',
      endereco: 'Av. São Paulo, 258',
      status: 'ATIVO'
    },
    {
      matricula: '2025009',
      nome: 'Gabriel Ribeiro Santos',
      dataNascimento: new Date('2010-08-14'),
      genero: 'M',
      cpf: '90123456789',
      telefone: '(11) 98765-4329',
      email: 'gabriel.santos@email.com',
      endereco: 'Rua Verde, 369',
      status: 'ATIVO'
    },
    {
      matricula: '2025010',
      nome: 'Larissa Mendes Costa',
      dataNascimento: new Date('2011-06-20'),
      genero: 'F',
      cpf: '01234567890',
      telefone: '(11) 98765-4330',
      email: 'larissa.costa@email.com',
      endereco: 'Rua Azul, 741',
      status: 'ATIVO'
    },
  ];

  for (const alunoData of alunos) {
    await prisma.aluno.upsert({
      where: { matricula: alunoData.matricula },
      update: {},
      create: alunoData,
    });
  }

  // Criar responsáveis de exemplo
  console.log('👨‍👩‍👧 Criando responsáveis de exemplo...');
  
  const senhaResponsavel = await hashPassword('Resp@2024');
  
  // Responsável 1 - José Silva (pai de João)
  const userJose = await prisma.user.upsert({
    where: { email: 'jose.silva@email.com' },
    update: {},
    create: {
      email: 'jose.silva@email.com',
      password: senhaResponsavel,
      name: 'José Silva Santos',
      phone: '(11) 98765-1001',
      active: true,
    },
  });

  const responsavelJose = await prisma.responsavel.upsert({
    where: { cpf: '11122233344' },
    update: {},
    create: {
      userId: userJose.id,
      cpf: '11122233344',
      rg: '123456789',
      tipoVinculo: 'PAI',
      telefonePrincipal: '(11) 98765-1001',
      telefoneSecundario: '(11) 3456-7890',
      email: 'jose.silva@email.com',
      profissao: 'Engenheiro',
      endereco: 'Rua das Flores, 123',
    },
  });

  // Responsável 2 - Maria Oliveira (mãe de Maria)
  const userMaria = await prisma.user.upsert({
    where: { email: 'maria.oliveira@email.com' },
    update: {},
    create: {
      email: 'maria.oliveira@email.com',
      password: senhaResponsavel,
      name: 'Maria Oliveira Costa',
      phone: '(11) 98765-1002',
      active: true,
    },
  });

  const responsavelMaria = await prisma.responsavel.upsert({
    where: { cpf: '22233344455' },
    update: {},
    create: {
      userId: userMaria.id,
      cpf: '22233344455',
      rg: '234567890',
      tipoVinculo: 'MAE',
      telefonePrincipal: '(11) 98765-1002',
      telefoneSecundario: '(11) 3456-7891',
      email: 'maria.oliveira@email.com',
      profissao: 'Professora',
      endereco: 'Av. Principal, 456',
    },
  });

  // Responsável 3 - Carlos Alves (pai de Pedro)
  const userCarlos = await prisma.user.upsert({
    where: { email: 'carlos.alves@email.com' },
    update: {},
    create: {
      email: 'carlos.alves@email.com',
      password: senhaResponsavel,
      name: 'Carlos Alves Pereira',
      phone: '(11) 98765-1003',
      active: true,
    },
  });

  const responsavelCarlos = await prisma.responsavel.upsert({
    where: { cpf: '33344455566' },
    update: {},
    create: {
      userId: userCarlos.id,
      cpf: '33344455566',
      rg: '345678901',
      tipoVinculo: 'PAI',
      telefonePrincipal: '(11) 98765-1003',
      email: 'carlos.alves@email.com',
      profissao: 'Médico',
      endereco: 'Rua do Comércio, 789',
    },
  });

  // Responsável 4 - Ana Ferreira (mãe de Ana Paula)
  const userAna = await prisma.user.upsert({
    where: { email: 'ana.ferreira@email.com' },
    update: {},
    create: {
      email: 'ana.ferreira@email.com',
      password: senhaResponsavel,
      name: 'Ana Ferreira Lima',
      phone: '(11) 98765-1004',
      active: true,
    },
  });

  const responsavelAna = await prisma.responsavel.upsert({
    where: { cpf: '44455566677' },
    update: {},
    create: {
      userId: userAna.id,
      cpf: '44455566677',
      rg: '456789012',
      tipoVinculo: 'MAE',
      telefonePrincipal: '(11) 98765-1004',
      telefoneSecundario: '(11) 3456-7893',
      email: 'ana.ferreira@email.com',
      profissao: 'Advogada',
      endereco: 'Rua das Acácias, 321',
    },
  });

  // Criar vínculos de responsabilidade
  console.log('🔗 Criando vínculos aluno-responsável...');

  // Buscar alunos criados
  const alunoJoao = await prisma.aluno.findUnique({ where: { matricula: '2025001' } });
  const alunoMaria = await prisma.aluno.findUnique({ where: { matricula: '2025002' } });
  const alunoPedro = await prisma.aluno.findUnique({ where: { matricula: '2025003' } });
  const alunoAnaPaula = await prisma.aluno.findUnique({ where: { matricula: '2025004' } });
  const alunoLucas = await prisma.aluno.findUnique({ where: { matricula: '2025005' } });
  const alunoJuliana = await prisma.aluno.findUnique({ where: { matricula: '2025006' } });

  if (alunoJoao && responsavelJose) {
    await prisma.vinculoResponsabilidade.upsert({
      where: {
        alunoId_responsavelId: {
          alunoId: alunoJoao.id,
          responsavelId: responsavelJose.id,
        },
      },
      update: {},
      create: {
        alunoId: alunoJoao.id,
        responsavelId: responsavelJose.id,
        prioridadeContato: 1,
        active: true,
      },
    });
  }

  if (alunoMaria && responsavelMaria) {
    await prisma.vinculoResponsabilidade.upsert({
      where: {
        alunoId_responsavelId: {
          alunoId: alunoMaria.id,
          responsavelId: responsavelMaria.id,
        },
      },
      update: {},
      create: {
        alunoId: alunoMaria.id,
        responsavelId: responsavelMaria.id,
        prioridadeContato: 1,
        active: true,
      },
    });
  }

  if (alunoPedro && responsavelCarlos) {
    await prisma.vinculoResponsabilidade.upsert({
      where: {
        alunoId_responsavelId: {
          alunoId: alunoPedro.id,
          responsavelId: responsavelCarlos.id,
        },
      },
      update: {},
      create: {
        alunoId: alunoPedro.id,
        responsavelId: responsavelCarlos.id,
        prioridadeContato: 1,
        active: true,
      },
    });
  }

  if (alunoAnaPaula && responsavelAna) {
    await prisma.vinculoResponsabilidade.upsert({
      where: {
        alunoId_responsavelId: {
          alunoId: alunoAnaPaula.id,
          responsavelId: responsavelAna.id,
        },
      },
      update: {},
      create: {
        alunoId: alunoAnaPaula.id,
        responsavelId: responsavelAna.id,
        prioridadeContato: 1,
        active: true,
      },
    });
  }

  // Vínculos adicionais - alguns alunos com múltiplos responsáveis
  if (alunoLucas && responsavelJose) {
    await prisma.vinculoResponsabilidade.upsert({
      where: {
        alunoId_responsavelId: {
          alunoId: alunoLucas.id,
          responsavelId: responsavelJose.id,
        },
      },
      update: {},
      create: {
        alunoId: alunoLucas.id,
        responsavelId: responsavelJose.id,
        prioridadeContato: 2,
        active: true,
      },
    });
  }

  if (alunoJuliana && responsavelMaria) {
    await prisma.vinculoResponsabilidade.upsert({
      where: {
        alunoId_responsavelId: {
          alunoId: alunoJuliana.id,
          responsavelId: responsavelMaria.id,
        },
      },
      update: {},
      create: {
        alunoId: alunoJuliana.id,
        responsavelId: responsavelMaria.id,
        prioridadeContato: 2,
        active: true,
      },
    });
  }

  console.log('✅ Seed concluído com sucesso!');
  
  // Criar professores de exemplo
  console.log('👨‍🏫 Criando professores de exemplo...');
  
  const senhaProfessor = await hashPassword('Prof@2024');
  
  // Professor 1 - Carla Mendes (Português)
  const userCarla = await prisma.user.upsert({
    where: { email: 'carla.mendes@escola.com' },
    update: {},
    create: {
      email: 'carla.mendes@escola.com',
      password: senhaProfessor,
      name: 'Carla Mendes Oliveira',
      cpf: '55566677788',
      phone: '(11) 98765-2001',
      active: true,
    },
  });

  const professorCarla = await prisma.professor.upsert({
    where: { userId: userCarla.id },
    update: {},
    create: {
      userId: userCarla.id,
      registroProfissional: 'RP-2024-001',
      especialidade: 'Língua Portuguesa e Literatura',
      cargaHoraria: 40,
      active: true,
    },
  });

  // Formações da Carla
  await prisma.formacao.upsert({
    where: { id: '1' },
    update: {},
    create: {
      id: '1',
      professorId: professorCarla.id,
      nivel: 'GRADUACAO',
      curso: 'Letras - Português/Inglês',
      instituicao: 'Universidade de São Paulo',
      areaConhecimento: 'Linguagens',
      dataInicio: new Date('2010-02-01'),
      dataConclusao: new Date('2013-12-15'),
      emAndamento: false,
      cargaHoraria: 3200,
    },
  });

  await prisma.formacao.upsert({
    where: { id: '2' },
    update: {},
    create: {
      id: '2',
      professorId: professorCarla.id,
      nivel: 'POS_GRADUACAO',
      curso: 'Especialização em Literatura Brasileira',
      instituicao: 'PUC-SP',
      areaConhecimento: 'Linguagens',
      dataInicio: new Date('2014-03-01'),
      dataConclusao: new Date('2015-12-20'),
      emAndamento: false,
      cargaHoraria: 360,
    },
  });

  // Professor 2 - Roberto Santos (Matemática)
  const userRoberto = await prisma.user.upsert({
    where: { email: 'roberto.santos@escola.com' },
    update: {},
    create: {
      email: 'roberto.santos@escola.com',
      password: senhaProfessor,
      name: 'Roberto Santos Silva',
      cpf: '66677788899',
      phone: '(11) 98765-2002',
      active: true,
    },
  });

  const professorRoberto = await prisma.professor.upsert({
    where: { userId: userRoberto.id },
    update: {},
    create: {
      userId: userRoberto.id,
      registroProfissional: 'RP-2024-002',
      especialidade: 'Matemática e Física',
      cargaHoraria: 40,
      active: true,
    },
  });

  // Formações do Roberto
  await prisma.formacao.upsert({
    where: { id: '3' },
    update: {},
    create: {
      id: '3',
      professorId: professorRoberto.id,
      nivel: 'GRADUACAO',
      curso: 'Licenciatura em Matemática',
      instituicao: 'UNICAMP',
      areaConhecimento: 'Matemática',
      dataInicio: new Date('2008-02-01'),
      dataConclusao: new Date('2011-12-15'),
      emAndamento: false,
      cargaHoraria: 2880,
    },
  });

  await prisma.formacao.upsert({
    where: { id: '4' },
    update: {},
    create: {
      id: '4',
      professorId: professorRoberto.id,
      nivel: 'MESTRADO',
      curso: 'Mestrado em Ensino de Matemática',
      instituicao: 'USP',
      areaConhecimento: 'Educação',
      dataInicio: new Date('2012-03-01'),
      dataConclusao: new Date('2014-12-20'),
      emAndamento: false,
      cargaHoraria: 1440,
    },
  });

  // Professor 3 - Patrícia Lima (Ciências)
  const userPatricia = await prisma.user.upsert({
    where: { email: 'patricia.lima@escola.com' },
    update: {},
    create: {
      email: 'patricia.lima@escola.com',
      password: senhaProfessor,
      name: 'Patrícia Lima Costa',
      cpf: '77788899900',
      phone: '(11) 98765-2003',
      active: true,
    },
  });

  const professorPatricia = await prisma.professor.upsert({
    where: { userId: userPatricia.id },
    update: {},
    create: {
      userId: userPatricia.id,
      registroProfissional: 'RP-2024-003',
      especialidade: 'Ciências e Biologia',
      cargaHoraria: 30,
      active: true,
    },
  });

  // Formações da Patrícia
  await prisma.formacao.upsert({
    where: { id: '5' },
    update: {},
    create: {
      id: '5',
      professorId: professorPatricia.id,
      nivel: 'GRADUACAO',
      curso: 'Ciências Biológicas',
      instituicao: 'UNESP',
      areaConhecimento: 'Ciências da Natureza',
      dataInicio: new Date('2009-02-01'),
      dataConclusao: new Date('2012-12-15'),
      emAndamento: false,
      cargaHoraria: 3000,
    },
  });

  await prisma.formacao.upsert({
    where: { id: '6' },
    update: {},
    create: {
      id: '6',
      professorId: professorPatricia.id,
      nivel: 'POS_GRADUACAO',
      curso: 'Especialização em Educação Ambiental',
      instituicao: 'UNIFESP',
      areaConhecimento: 'Meio Ambiente',
      dataInicio: new Date('2023-03-01'),
      dataConclusao: null,
      emAndamento: true,
      cargaHoraria: 400,
      observacoes: 'Previsão de conclusão: Dezembro/2024',
    },
  });

  // Criar turmas de exemplo
  console.log('🏫 Criando turmas de exemplo...');

  const turma1A = await prisma.turma.upsert({
    where: { codigo: '1A-2025' },
    update: {},
    create: {
      codigo: '1A-2025',
      nome: '1º Ano A',
      anoLetivoId: anoLetivo.id,
      serie: '1º ANO',
      turno: 'MANHA',
      capacidadeMaxima: 30,
      sala: 'Sala 101',
      professorRegenteId: professorCarla.id,
    },
  });

  const turma2A = await prisma.turma.upsert({
    where: { codigo: '2A-2025' },
    update: {},
    create: {
      codigo: '2A-2025',
      nome: '2º Ano A',
      anoLetivoId: anoLetivo.id,
      serie: '2º ANO',
      turno: 'MANHA',
      capacidadeMaxima: 30,
      sala: 'Sala 102',
      professorRegenteId: professorRoberto.id,
    },
  });

  const turma3A = await prisma.turma.upsert({
    where: { codigo: '3A-2025' },
    update: {},
    create: {
      codigo: '3A-2025',
      nome: '3º Ano A',
      anoLetivoId: anoLetivo.id,
      serie: '3º ANO',
      turno: 'TARDE',
      capacidadeMaxima: 25,
      sala: 'Sala 201',
      professorRegenteId: professorPatricia.id,
    },
  });

  // Matricular alunos nas turmas
  console.log('📝 Matriculando alunos nas turmas...');

  // Turma 1º Ano A - Alunos 1 a 4
  const alunos1A = [alunoJoao, alunoMaria, alunoPedro, alunoAnaPaula];
  for (const aluno of alunos1A) {
    if (aluno) {
      await prisma.matricula.upsert({
        where: {
          alunoId_turmaId: {
            alunoId: aluno.id,
            turmaId: turma1A.id,
          },
        },
        update: {},
        create: {
          alunoId: aluno.id,
          turmaId: turma1A.id,
          dataMatricula: new Date('2025-02-01'),
          status: 'ATIVO',
        },
      });
    }
  }

  // Turma 2º Ano A - Alunos 5 a 7
  const alunos2A = [alunoLucas, alunoJuliana];
  for (const aluno of alunos2A) {
    if (aluno) {
      await prisma.matricula.upsert({
        where: {
          alunoId_turmaId: {
            alunoId: aluno.id,
            turmaId: turma2A.id,
          },
        },
        update: {},
        create: {
          alunoId: aluno.id,
          turmaId: turma2A.id,
          dataMatricula: new Date('2025-02-01'),
          status: 'ATIVO',
        },
      });
    }
  }

  // Turma 3º Ano A - Alunos restantes
  const alunoRafael = await prisma.aluno.findUnique({ where: { matricula: '2025007' } });
  const alunoBeatriz = await prisma.aluno.findUnique({ where: { matricula: '2025008' } });
  const alunoGabiel = await prisma.aluno.findUnique({ where: { matricula: '2025009' } });
  const alunoLarissa = await prisma.aluno.findUnique({ where: { matricula: '2025010' } });

  const alunos3A = [alunoRafael, alunoBeatriz, alunoGabiel, alunoLarissa];
  for (const aluno of alunos3A) {
    if (aluno) {
      await prisma.matricula.upsert({
        where: {
          alunoId_turmaId: {
            alunoId: aluno.id,
            turmaId: turma3A.id,
          },
        },
        update: {},
        create: {
          alunoId: aluno.id,
          turmaId: turma3A.id,
          dataMatricula: new Date('2025-02-01'),
          status: 'ATIVO',
        },
      });
    }
  }

  console.log('✅ Seed concluído com sucesso!');
  console.log('\n📋 Credenciais de acesso:');
  console.log('  Email: admin@sge.com');
  console.log('  Senha: Admin@2024');
  console.log('\n👨‍🎓 Alunos criados: 10');
  console.log('👨‍👩‍👧 Responsáveis criados: 4');
  console.log('👨‍🏫 Professores criados: 3');
  console.log('🏫 Turmas criadas: 3');
  console.log('🔗 Vínculos criados: 6');
  console.log('📚 Formações criadas: 6');
  console.log('📝 Matrículas ativas: 10');
  console.log('\n👥 Login de responsáveis (senha padrão: Resp@2024):');
  console.log('  - jose.silva@email.com');
  console.log('  - maria.oliveira@email.com');
  console.log('  - carlos.alves@email.com');
  console.log('  - ana.ferreira@email.com');
  console.log('\n👨‍🏫 Login de professores (senha padrão: Prof@2024):');
  console.log('  - carla.mendes@escola.com');
  console.log('  - roberto.santos@escola.com');
  console.log('  - patricia.lima@escola.com');
}

main()
  .catch((e) => {
    console.error('❌ Erro no seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

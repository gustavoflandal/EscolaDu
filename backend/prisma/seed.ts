import { PrismaClient } from '@prisma/client';
import { hashPassword } from '../src/utils/password.util';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed completo do banco de dados...\n');

  // ============================================
  // 1. PERMISSÕES E PERFIS
  // ============================================
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
    
    // Disciplinas
    { resource: 'disciplinas', action: 'create', description: 'Criar disciplinas' },
    { resource: 'disciplinas', action: 'read', description: 'Visualizar disciplinas' },
    { resource: 'disciplinas', action: 'update', description: 'Atualizar disciplinas' },
    { resource: 'disciplinas', action: 'delete', description: 'Deletar disciplinas' },
    
    // Programas de Ensino
    { resource: 'programas-ensino', action: 'create', description: 'Criar programas de ensino' },
    { resource: 'programas-ensino', action: 'read', description: 'Visualizar programas de ensino' },
    { resource: 'programas-ensino', action: 'update', description: 'Atualizar programas de ensino' },
    { resource: 'programas-ensino', action: 'delete', description: 'Deletar programas de ensino' },
    
    // Professores
    { resource: 'professores', action: 'create', description: 'Criar professores' },
    { resource: 'professores', action: 'read', description: 'Visualizar professores' },
    { resource: 'professores', action: 'update', description: 'Atualizar professores' },
    { resource: 'professores', action: 'delete', description: 'Deletar professores' },
    
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
    { resource: 'relatorios', action: 'export', description: 'Exportar relatórios' },
    
    // Dashboard
    { resource: 'dashboard', action: 'read', description: 'Visualizar dashboard' },
    
    // Usuários
    { resource: 'users', action: 'create', description: 'Criar usuários' },
    { resource: 'users', action: 'read', description: 'Visualizar usuários' },
    { resource: 'users', action: 'update', description: 'Atualizar usuários' },
    { resource: 'users', action: 'delete', description: 'Deletar usuários' },
    
    // Perfis (Roles)
    { resource: 'roles', action: 'create', description: 'Criar perfis' },
    { resource: 'roles', action: 'read', description: 'Visualizar perfis' },
    { resource: 'roles', action: 'update', description: 'Atualizar perfis' },
    { resource: 'roles', action: 'delete', description: 'Deletar perfis' },
    
    // Responsáveis
    { resource: 'responsaveis', action: 'create', description: 'Criar responsáveis' },
    { resource: 'responsaveis', action: 'read', description: 'Visualizar responsáveis' },
    { resource: 'responsaveis', action: 'update', description: 'Atualizar responsáveis' },
    { resource: 'responsaveis', action: 'delete', description: 'Deletar responsáveis' },
    
    // Permissões
    { resource: 'permissions', action: 'read', description: 'Visualizar permissões' },
  ];

  for (const perm of permissions) {
    await prisma.permission.upsert({
      where: { resource_action: { resource: perm.resource, action: perm.action } },
      update: {},
      create: perm,
    });
  }
  console.log(`✅ ${permissions.length} permissões criadas\n`);

  // Criar roles
  console.log('👤 Criando perfis...');
  const adminRole = await prisma.role.upsert({
    where: { name: 'Administrador' },
    update: {},
    create: {
      name: 'Administrador',
      description: 'Acesso total ao sistema. Pode gerenciar usuários, perfis, permissões e todas as funcionalidades.',
    },
  });

  const coordenadorRole = await prisma.role.upsert({
    where: { name: 'Coordenador' },
    update: {},
    create: {
      name: 'Coordenador',
      description: 'Gerencia aspectos acadêmicos e pedagógicos. Pode visualizar, criar e editar a maioria dos recursos.',
    },
  });

  const professorRole = await prisma.role.upsert({
    where: { name: 'Professor' },
    update: {},
    create: {
      name: 'Professor',
      description: 'Gerencia suas turmas, alunos e atividades pedagógicas. Pode registrar frequência, objetivos e avaliações.',
    },
  });

  const responsavelRole = await prisma.role.upsert({
    where: { name: 'Responsável' },
    update: {},
    create: {
      name: 'Responsável',
      description: 'Acesso limitado para visualizar informações dos alunos sob sua responsabilidade.',
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

  // Coordenador: acesso total exceto gerenciar usuários/perfis/permissões
  const coordPermissions = allPermissions.filter(p => 
    !['users', 'roles', 'permissions'].includes(p.resource) || p.action === 'read'
  );
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

  // Professor: leitura geral + CRUD em frequência/objetivos
  const profPermissions = allPermissions.filter(p => {
    const readOnlyResources = ['alunos', 'turmas', 'disciplinas', 'professores', 'responsaveis', 'relatorios', 'dashboard', 'users', 'roles'];
    const fullAccessResources = ['frequencia', 'objetivos'];
    
    if (readOnlyResources.includes(p.resource) && p.action === 'read') return true;
    if (fullAccessResources.includes(p.resource) && ['read', 'create', 'update'].includes(p.action)) return true;
    return false;
  });
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

  // Responsável: apenas leitura de alunos, turmas, disciplinas, frequência, objetivos, dashboard
  const respPermissions = allPermissions.filter(p =>
    ['alunos', 'turmas', 'disciplinas', 'frequencia', 'objetivos', 'dashboard'].includes(p.resource) &&
    p.action === 'read'
  );
  for (const perm of respPermissions) {
    await prisma.rolePermission.upsert({
      where: {
        roleId_permissionId: {
          roleId: responsavelRole.id,
          permissionId: perm.id,
        },
      },
      update: {},
      create: {
        roleId: responsavelRole.id,
        permissionId: perm.id,
      },
    });
  }
  console.log(`✅ 4 perfis criados com permissões vinculadas\n`);

  // ============================================
  // 2. USUÁRIOS E CONFIGURAÇÕES
  // ============================================
  console.log('🔐 Criando usuários do sistema...');
  const adminPassword = await hashPassword('Admin@123');
  
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@escola.com.br' },
    update: {},
    create: {
      email: 'admin@escola.com.br',
      password: adminPassword,
      name: 'Administrador do Sistema',
      cpf: '000.000.000-00',
      active: true,
    },
  });

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

  const coordPassword = await hashPassword('Coord@123');
  const coordUser = await prisma.user.upsert({
    where: { email: 'coordenador@escola.com.br' },
    update: {},
    create: {
      email: 'coordenador@escola.com.br',
      password: coordPassword,
      name: 'Maria Silva Coordenadora',
      cpf: '111.111.111-11',
      active: true,
    },
  });

  await prisma.userRole.upsert({
    where: {
      userId_roleId: {
        userId: coordUser.id,
        roleId: coordenadorRole.id,
      },
    },
    update: {},
    create: {
      userId: coordUser.id,
      roleId: coordenadorRole.id,
    },
  });
  console.log(`✅ 2 usuários criados (admin e coordenador)\n`);

  // ============================================
  // 3. ANO LETIVO E PERÍODOS
  // ============================================
  console.log('📅 Criando ano letivo 2025...');
  const anoLetivo2024 = await prisma.anoLetivo.upsert({
    where: { ano: 2024 },
    update: {},
    create: {
      ano: 2024,
      dataInicio: new Date('2024-02-01'),
      dataFim: new Date('2024-12-20'),
      divisao: 'TRIMESTRE',
      status: 'ENCERRADO',
    },
  });

  const anoLetivo2025 = await prisma.anoLetivo.upsert({
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

  console.log('📊 Criando períodos letivos...');
  await prisma.periodoLetivo.upsert({
    where: {
      anoLetivoId_numero: {
        anoLetivoId: anoLetivo2025.id,
        numero: 1,
      },
    },
    update: {},
    create: {
      anoLetivoId: anoLetivo2025.id,
      numero: 1,
      nome: '1º Trimestre',
      dataInicio: new Date('2025-02-01'),
      dataFim: new Date('2025-04-30'),
    },
  });

  await prisma.periodoLetivo.upsert({
    where: {
      anoLetivoId_numero: {
        anoLetivoId: anoLetivo2025.id,
        numero: 2,
      },
    },
    update: {},
    create: {
      anoLetivoId: anoLetivo2025.id,
      numero: 2,
      nome: '2º Trimestre',
      dataInicio: new Date('2025-05-01'),
      dataFim: new Date('2025-08-31'),
    },
  });

  await prisma.periodoLetivo.upsert({
    where: {
      anoLetivoId_numero: {
        anoLetivoId: anoLetivo2025.id,
        numero: 3,
      },
    },
    update: {},
    create: {
      anoLetivoId: anoLetivo2025.id,
      numero: 3,
      nome: '3º Trimestre',
      dataInicio: new Date('2025-09-01'),
      dataFim: new Date('2025-12-20'),
    },
  });
  console.log(`✅ Anos letivos e períodos criados\n`);

  // ============================================
  // 4. DISCIPLINAS E OBJETIVOS BNCC
  // ============================================
  console.log('📚 Criando disciplinas...');
  const disciplinas = [
    { codigo: 'PORT', nome: 'Língua Portuguesa', areaConhecimento: 'Linguagens', cargaHorariaSemanal: 5, descricao: 'Leitura, escrita, oralidade e análise linguística/semiótica' },
    { codigo: 'MAT', nome: 'Matemática', areaConhecimento: 'Matemática', cargaHorariaSemanal: 5, descricao: 'Números, Álgebra, Geometria, Grandezas e Medidas, Probabilidade e Estatística' },
    { codigo: 'CIEN', nome: 'Ciências', areaConhecimento: 'Ciências da Natureza', cargaHorariaSemanal: 3, descricao: 'Matéria e energia, Vida e evolução, Terra e universo' },
    { codigo: 'HIST', nome: 'História', areaConhecimento: 'Ciências Humanas', cargaHorariaSemanal: 2, descricao: 'Mundo pessoal, grupos sociais, comunidades, tempo e espaço' },
    { codigo: 'GEO', nome: 'Geografia', areaConhecimento: 'Ciências Humanas', cargaHorariaSemanal: 2, descricao: 'O sujeito e seu lugar no mundo, conexões e escalas, mundo do trabalho, formas de representação' },
    { codigo: 'ARTE', nome: 'Arte', areaConhecimento: 'Linguagens', cargaHorariaSemanal: 2, descricao: 'Artes visuais, dança, música e teatro' },
    { codigo: 'EDF', nome: 'Educação Física', areaConhecimento: 'Linguagens', cargaHorariaSemanal: 2, descricao: 'Brincadeiras e jogos, esportes, ginásticas, danças, lutas' },
    { codigo: 'ING', nome: 'Língua Inglesa', areaConhecimento: 'Linguagens', cargaHorariaSemanal: 2, descricao: 'Oralidade, leitura, escrita, conhecimentos linguísticos' },
    { codigo: 'ER', nome: 'Ensino Religioso', areaConhecimento: 'Ensino Religioso', cargaHorariaSemanal: 1, descricao: 'Identidades e alteridades, manifestações religiosas, crenças e filosofias de vida' },
  ];

  const disciplinasCriadas = [];
  for (const disc of disciplinas) {
    const disciplina = await prisma.disciplina.upsert({
      where: { codigo: disc.codigo },
      update: {},
      create: disc,
    });
    disciplinasCriadas.push(disciplina);
  }
  console.log(`✅ ${disciplinasCriadas.length} disciplinas criadas\n`);

  // ============================================
  // 5. OBJETIVOS DE APRENDIZAGEM (BNCC) - Exemplos
  // ============================================
  console.log('🎯 Criando objetivos de aprendizagem...');
  const portugues = disciplinasCriadas.find(d => d.codigo === 'PORT')!;
  const matematica = disciplinasCriadas.find(d => d.codigo === 'MAT')!;
  
  const objetivos = [
    { codigoBNCC: 'EF01LP01', descricao: 'Reconhecer que textos são lidos e escritos da esquerda para a direita e de cima para baixo da página.', serie: '1º Ano', periodo: '1º Bimestre', disciplinaId: portugues.id },
    { codigoBNCC: 'EF01LP02', descricao: 'Escrever, espontaneamente ou por ditado, palavras e frases de forma alfabética.', serie: '1º Ano', periodo: '2º Bimestre', disciplinaId: portugues.id },
    { codigoBNCC: 'EF01MA01', descricao: 'Utilizar números naturais como indicadores de quantidade ou de ordem em diferentes situações cotidianas.', serie: '1º Ano', periodo: '1º Bimestre', disciplinaId: matematica.id },
    { codigoBNCC: 'EF01MA02', descricao: 'Contar de maneira exata ou aproximada, utilizando diferentes estratégias como o pareamento e outros agrupamentos.', serie: '1º Ano', periodo: '1º Bimestre', disciplinaId: matematica.id },
  ];

  for (const obj of objetivos) {
    await prisma.objetivoAprendizagem.upsert({
      where: { codigoBNCC: obj.codigoBNCC },
      update: {},
      create: obj,
    });
  }
  console.log(`✅ ${objetivos.length} objetivos de aprendizagem criados\n`);

  // ============================================
  // 6. PROFESSORES
  // ============================================
  console.log('👨‍🏫 Criando professores...');
  const profPassword = await hashPassword('Prof@123');
  
  const prof1User = await prisma.user.upsert({
    where: { email: 'joao.santos@escola.com.br' },
    update: {},
    create: {
      email: 'joao.santos@escola.com.br',
      password: profPassword,
      name: 'João Santos',
      cpf: '222.222.222-22',
      active: true,
    },
  });

  const prof1 = await prisma.professor.upsert({
    where: { userId: prof1User.id },
    update: {},
    create: {
      userId: prof1User.id,
      registroProfissional: 'RP12345',
      cargaHoraria: 40,
    },
  });

  await prisma.userRole.upsert({
    where: { userId_roleId: { userId: prof1User.id, roleId: professorRole.id } },
    update: {},
    create: { userId: prof1User.id, roleId: professorRole.id },
  });

  const prof2User = await prisma.user.upsert({
    where: { email: 'maria.oliveira@escola.com.br' },
    update: {},
    create: {
      email: 'maria.oliveira@escola.com.br',
      password: profPassword,
      name: 'Maria Oliveira',
      cpf: '333.333.333-33',
      active: true,
    },
  });

  const prof2 = await prisma.professor.upsert({
    where: { userId: prof2User.id },
    update: {},
    create: {
      userId: prof2User.id,
      registroProfissional: 'RP54321',
      cargaHoraria: 40,
    },
  });

  await prisma.userRole.upsert({
    where: { userId_roleId: { userId: prof2User.id, roleId: professorRole.id } },
    update: {},
    create: { userId: prof2User.id, roleId: professorRole.id },
  });

  console.log(`✅ 2 professores criados\n`);

  // ============================================
  // 7. TURMAS
  // ============================================
  console.log('🏫 Criando turmas...');
  const turmas = [
    { codigo: '1A-2025', nome: '1º Ano A', anoLetivoId: anoLetivo2025.id, serie: '1º Ano', turno: 'MANHA' as const, capacidadeMaxima: 25, sala: 'Sala 101', professorRegenteId: prof1.id },
    { codigo: '1B-2025', nome: '1º Ano B', anoLetivoId: anoLetivo2025.id, serie: '1º Ano', turno: 'TARDE' as const, capacidadeMaxima: 25, sala: 'Sala 102', professorRegenteId: prof2.id },
    { codigo: '2A-2025', nome: '2º Ano A', anoLetivoId: anoLetivo2025.id, serie: '2º Ano', turno: 'MANHA' as const, capacidadeMaxima: 30, sala: 'Sala 201', professorRegenteId: prof1.id },
    { codigo: '2B-2025', nome: '2º Ano B', anoLetivoId: anoLetivo2025.id, serie: '2º Ano', turno: 'TARDE' as const, capacidadeMaxima: 30, sala: 'Sala 202', professorRegenteId: prof2.id },
  ];

  const turmasCriadas = [];
  for (const turma of turmas) {
    const t = await prisma.turma.upsert({
      where: { codigo: turma.codigo },
      update: {},
      create: turma,
    });
    turmasCriadas.push(t);
  }
  console.log(`✅ ${turmasCriadas.length} turmas criadas\n`);

  // ============================================
  // 8. ALUNOS E RESPONSÁVEIS
  // ============================================
  console.log('👶 Criando alunos e responsáveis...');
  
  // Criar alguns responsáveis
  const resp1User = await prisma.user.upsert({
    where: { email: 'carlos.silva@email.com' },
    update: {},
    create: {
      email: 'carlos.silva@email.com',
      password: await hashPassword('Resp@123'),
      name: 'Carlos Silva',
      cpf: '444.444.444-44',
      phone: '(11) 98888-8888',
      active: true,
    },
  });

  const resp1 = await prisma.responsavel.upsert({
    where: { userId: resp1User.id },
    update: {},
    create: {
      userId: resp1User.id,
      cpf: '444.444.444-44',
      rg: '44.444.444-4',
      tipoVinculo: 'PAI',
      telefonePrincipal: '(11) 98888-8888',
      email: 'carlos.silva@email.com',
      profissao: 'Engenheiro',
      endereco: 'Av. Paulista, 1000',
    },
  });

  await prisma.userRole.upsert({
    where: { userId_roleId: { userId: resp1User.id, roleId: responsavelRole.id } },
    update: {},
    create: { userId: resp1User.id, roleId: responsavelRole.id },
  });

  // Criar aluno
  const aluno1 = await prisma.aluno.create({
    data: {
      nome: 'Pedro Silva',
      dataNascimento: new Date('2018-03-15'),
      cpf: '555.555.555-55',
      matricula: 'ALU2025001',
      genero: 'M',
      telefone: '(11) 98888-8888',
      endereco: 'Rua das Flores, 123, Centro, São Paulo - SP',
      status: 'ATIVO',
    },
  });

  // Vincular aluno ao responsável
  await prisma.vinculoResponsabilidade.create({
    data: {
      alunoId: aluno1.id,
      responsavelId: resp1.id,
      prioridadeContato: 1,
    },
  });

  // Matricular aluno na turma
  await prisma.matricula.create({
    data: {
      alunoId: aluno1.id,
      turmaId: turmasCriadas[0].id,
      dataMatricula: new Date('2025-02-01'),
      status: 'ATIVO',
    },
  });

  console.log(`✅ 1 aluno e 1 responsável criados\n`);

  // ============================================
  // 9. CONFIGURAÇÕES DA ESCOLA
  // ============================================
  console.log('⚙️ Criando configurações da escola...');
  const configs = [
    { chave: 'percentual_minimo_frequencia', valor: '75', tipo: 'NUMBER' as const, descricao: 'Percentual mínimo de frequência para aprovação' },
    { chave: 'percentual_alerta_frequencia', valor: '80', tipo: 'NUMBER' as const, descricao: 'Percentual para alerta de frequência' },
    { chave: 'dias_bloqueio_edicao_frequencia', valor: '7', tipo: 'NUMBER' as const, descricao: 'Dias para bloquear edição de frequência' },
    { chave: 'percentual_minimo_objetivos', valor: '70', tipo: 'NUMBER' as const, descricao: 'Percentual mínimo de objetivos atingidos' },
    { chave: 'limite_objetivos_criticos', valor: '3', tipo: 'NUMBER' as const, descricao: 'Limite de objetivos não atingidos' },
    { chave: 'nome_escola', valor: 'Escola Modelo', tipo: 'STRING' as const, descricao: 'Nome da escola' },
    { chave: 'cnpj_escola', valor: '00.000.000/0001-00', tipo: 'STRING' as const, descricao: 'CNPJ da escola' },
  ];

  for (const config of configs) {
    await prisma.configuracaoEscola.upsert({
      where: { chave: config.chave },
      update: {},
      create: config,
    });
  }
  console.log(`✅ ${configs.length} configurações criadas\n`);

  // ============================================
  // RESUMO
  // ============================================
  console.log('✅ Seed completo concluído com sucesso!\n');
  console.log('=' .repeat(60));
  console.log('� RESUMO DO SEED');
  console.log('=' .repeat(60));
  console.log(`✅ ${permissions.length} permissões`);
  console.log(`✅ 4 perfis (Administrador, Coordenador, Professor, Responsável)`);
  console.log(`✅ 4 usuários (admin, coordenador, 2 professores)`);
  console.log(`✅ 2 anos letivos (2024, 2025) com períodos`);
  console.log(`✅ ${disciplinasCriadas.length} disciplinas`);
  console.log(`✅ ${objetivos.length} objetivos de aprendizagem (BNCC)`);
  console.log(`✅ 2 professores`);
  console.log(`✅ ${turmasCriadas.length} turmas`);
  console.log(`✅ 1 aluno e 1 responsável`);
  console.log(`✅ ${configs.length} configurações`);
  console.log('=' .repeat(60));
  console.log('\n🔐 CREDENCIAIS DE ACESSO:');
  console.log('=' .repeat(60));
  console.log('👨‍💼 Administrador:');
  console.log('   Email: admin@escola.com.br');
  console.log('   Senha: Admin@123');
  console.log('\n👩‍💼 Coordenador:');
  console.log('   Email: coordenador@escola.com.br');
  console.log('   Senha: Coord@123');
  console.log('\n👨‍🏫 Professor 1:');
  console.log('   Email: joao.santos@escola.com.br');
  console.log('   Senha: Prof@123');
  console.log('\n👩‍🏫 Professor 2:');
  console.log('   Email: maria.oliveira@escola.com.br');
  console.log('   Senha: Prof@123');
  console.log('\n👨‍👩‍👧 Responsável:');
  console.log('   Email: carlos.silva@email.com');
  console.log('   Senha: Resp@123');
  console.log('=' .repeat(60));
  console.log('\n🚀 Sistema pronto para uso!\n');
}

main()
  .catch((e) => {
    console.error('❌ Erro no seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

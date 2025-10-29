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
    { resource: 'relatorios', action: 'export', description: 'Exportar relatórios' },
    
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

  const responsavelRole = await prisma.role.upsert({
    where: { name: 'Responsável' },
    update: {},
    create: {
      name: 'Responsável',
      description: 'Responsável por aluno',
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

  console.log('✅ Seed concluído com sucesso!');
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

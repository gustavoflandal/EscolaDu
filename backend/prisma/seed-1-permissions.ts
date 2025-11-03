/**
 * SEED 1: Permissões e Roles
 * Base do sistema de autenticação e autorização
 * Executa: npx ts-node prisma/seed-1-permissions.ts
 */

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function seed() {
  console.log('🔐 Seed 1: Permissões e Roles\n');

  // 1. Criar Permissões
  console.log('Criando permissões...');
  const resources = [
    'users', 'roles', 'permissions', 'alunos', 'professores', 'responsaveis', 'turmas',
    'disciplinas', 'frequencia', 'objetivos', 'avaliacoes',
    'comunicados', 'relatorios', 'cadastros', 'dashboard', 'programas-ensino'
  ];
  const actions = ['create', 'read', 'update', 'delete'];

  const permissions = [];
  for (const resource of resources) {
    for (const action of actions) {
      const permission = await prisma.permission.upsert({
        where: {
          resource_action: {
            resource,
            action
          }
        },
        update: {
          description: `${action.charAt(0).toUpperCase() + action.slice(1)} ${resource}`
        },
        create: {
          resource,
          action,
          description: `${action.charAt(0).toUpperCase() + action.slice(1)} ${resource}`
        }
      });
      permissions.push(permission);
    }
  }
  console.log(`✅ ${permissions.length} permissões configuradas`);

  // 2. Criar/Atualizar Roles
  console.log('\nConfigurando roles...');
  
  // Limpar permissões antigas das roles
  await prisma.rolePermission.deleteMany({});
  
  const adminRole = await prisma.role.upsert({
    where: { name: 'Administrador' },
    update: {
      description: 'Acesso total ao sistema'
    },
    create: {
      name: 'Administrador',
      description: 'Acesso total ao sistema'
    }
  });

  const coordenadorRole = await prisma.role.upsert({
    where: { name: 'Coordenador' },
    update: {
      description: 'Gerencia pedagógica'
    },
    create: {
      name: 'Coordenador',
      description: 'Gerencia pedagógica'
    }
  });

  const professorRole = await prisma.role.upsert({
    where: { name: 'Professor' },
    update: {
      description: 'Gestão de turmas e frequência'
    },
    create: {
      name: 'Professor',
      description: 'Gestão de turmas e frequência'
    }
  });

  const responsavelRole = await prisma.role.upsert({
    where: { name: 'Responsável' },
    update: {
      description: 'Visualização de informações do aluno'
    },
    create: {
      name: 'Responsável',
      description: 'Visualização de informações do aluno'
    }
  });

  // Associar permissões às roles
  await prisma.rolePermission.createMany({
    data: permissions.map(p => ({ roleId: adminRole.id, permissionId: p.id }))
  });

  await prisma.rolePermission.createMany({
    data: permissions
      .filter(p => !['users'].includes(p.resource) || p.action === 'read')
      .map(p => ({ roleId: coordenadorRole.id, permissionId: p.id }))
  });

  await prisma.rolePermission.createMany({
    data: permissions
      .filter(p => ['turmas', 'frequencia', 'objetivos', 'avaliacoes', 'comunicados', 'dashboard', 'programas-ensino']
        .includes(p.resource) && ['read', 'create', 'update'].includes(p.action))
      .map(p => ({ roleId: professorRole.id, permissionId: p.id }))
  });

  await prisma.rolePermission.createMany({
    data: permissions
      .filter(p => ['alunos', 'frequencia', 'objetivos', 'avaliacoes', 'comunicados']
        .includes(p.resource) && p.action === 'read')
      .map(p => ({ roleId: responsavelRole.id, permissionId: p.id }))
  });

  console.log('✅ 4 roles criadas');
  console.log(`   - ${adminRole.name} (${permissions.length} permissões)`);
  console.log(`   - ${coordenadorRole.name}`);
  console.log(`   - ${professorRole.name}`);
  console.log(`   - ${responsavelRole.name}`);

  // 3. Criar/Atualizar Admin
  console.log('\nConfigurando usuário admin...');
  const adminEmail = 'admin@sge.com';
  const adminPassword = await bcrypt.hash('Admin@2024', 10);

  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      password: adminPassword,
      active: true
    },
    create: {
      email: adminEmail,
      password: adminPassword,
      name: 'Administrador do Sistema',
      cpf: '00000000000',
      phone: '(11) 99999-9999',
      active: true
    }
  });

  // Vincular admin à role
  await prisma.userRole.upsert({
    where: {
      userId_roleId: {
        userId: admin.id,
        roleId: adminRole.id
      }
    },
    update: {},
    create: {
      userId: admin.id,
      roleId: adminRole.id
    }
  });

  console.log('✅ Usuário admin configurado');
  console.log(`   Email: ${adminEmail}`);
  console.log(`   Senha: Admin@2024\n`);

  console.log('✅ Seed 1 concluído com sucesso!\n');
}

seed()
  .catch((e) => {
    console.error('❌ Erro no seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

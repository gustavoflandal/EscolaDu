import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Script de seed para criar permissões e perfis padrão do sistema
 * 
 * Estrutura:
 * - Permissões: resource:action (ex: alunos:create, alunos:read)
 * - Perfis: Administrador, Coordenador, Professor, Responsável
 * - Associações: RolePermission vincula perfis às permissões
 */

// Definição dos recursos e suas ações
const RESOURCES = {
  // Gerenciamento de usuários e permissões
  users: {
    name: 'Usuários',
    actions: ['create', 'read', 'update', 'delete'],
  },
  roles: {
    name: 'Perfis',
    actions: ['create', 'read', 'update', 'delete'],
  },
  permissions: {
    name: 'Permissões',
    actions: ['read'],
  },

  // Gestão acadêmica
  alunos: {
    name: 'Alunos',
    actions: ['create', 'read', 'update', 'delete'],
  },
  turmas: {
    name: 'Turmas',
    actions: ['create', 'read', 'update', 'delete'],
  },
  disciplinas: {
    name: 'Disciplinas',
    actions: ['create', 'read', 'update', 'delete'],
  },
  'programas-ensino': {
    name: 'Programas de Ensino',
    actions: ['create', 'read', 'update', 'delete'],
  },
  professores: {
    name: 'Professores',
    actions: ['create', 'read', 'update', 'delete'],
  },
  responsaveis: {
    name: 'Responsáveis',
    actions: ['create', 'read', 'update', 'delete'],
  },

  // Cadastros básicos
  cadastros: {
    name: 'Cadastros Básicos',
    actions: ['create', 'read', 'update', 'delete'],
  },

  // Atividades pedagógicas
  frequencia: {
    name: 'Frequência',
    actions: ['create', 'read', 'update', 'delete'],
  },
  objetivos: {
    name: 'Objetivos de Aprendizagem',
    actions: ['create', 'read', 'update', 'delete'],
  },
  avaliacoes: {
    name: 'Avaliações',
    actions: ['create', 'read', 'update', 'delete'],
  },
  recuperacao: {
    name: 'Recuperação',
    actions: ['create', 'read', 'update', 'delete'],
  },
  planejamento: {
    name: 'Planejamento',
    actions: ['create', 'read', 'update', 'delete'],
  },

  // Comunicação
  comunicados: {
    name: 'Comunicados',
    actions: ['create', 'read', 'update', 'delete'],
  },
  notificacoes: {
    name: 'Notificações',
    actions: ['create', 'read', 'update', 'delete'],
  },

  // Relatórios e análises
  relatorios: {
    name: 'Relatórios',
    actions: ['read', 'export'],
  },
  dashboard: {
    name: 'Dashboard',
    actions: ['read'],
  },
};

// Definição dos perfis e suas permissões
const ROLES = {
  administrador: {
    name: 'Administrador',
    description:
      'Acesso total ao sistema. Pode gerenciar usuários, perfis, permissões e todas as funcionalidades.',
    permissions: 'ALL', // Todas as permissões
  },
  coordenador: {
    name: 'Coordenador',
    description:
      'Gerencia aspectos acadêmicos e pedagógicos. Pode visualizar, criar e editar a maioria dos recursos, exceto gerenciamento de usuários administrativos.',
    permissions: [
      // Pode ler usuários e perfis, mas não criar/editar/deletar
      'users:read',
      'roles:read',
      'permissions:read',

      // Acesso total à gestão acadêmica
      'alunos:create',
      'alunos:read',
      'alunos:update',
      'alunos:delete',
      'turmas:create',
      'turmas:read',
      'turmas:update',
      'turmas:delete',
      'disciplinas:create',
      'disciplinas:read',
      'disciplinas:update',
      'disciplinas:delete',
      'programas-ensino:create',
      'programas-ensino:read',
      'programas-ensino:update',
      'programas-ensino:delete',
      'professores:create',
      'professores:read',
      'professores:update',
      'professores:delete',
      'responsaveis:create',
      'responsaveis:read',
      'responsaveis:update',
      'responsaveis:delete',

      // Acesso total aos cadastros básicos
      'cadastros:create',
      'cadastros:read',
      'cadastros:update',
      'cadastros:delete',

      // Acesso total às atividades pedagógicas
      'frequencia:create',
      'frequencia:read',
      'frequencia:update',
      'frequencia:delete',
      'objetivos:create',
      'objetivos:read',
      'objetivos:update',
      'objetivos:delete',
      'avaliacoes:create',
      'avaliacoes:read',
      'avaliacoes:update',
      'avaliacoes:delete',
      'recuperacao:create',
      'recuperacao:read',
      'recuperacao:update',
      'recuperacao:delete',
      'planejamento:create',
      'planejamento:read',
      'planejamento:update',
      'planejamento:delete',

      // Acesso total à comunicação
      'comunicados:create',
      'comunicados:read',
      'comunicados:update',
      'comunicados:delete',
      'notificacoes:create',
      'notificacoes:read',
      'notificacoes:update',
      'notificacoes:delete',

      // Acesso a relatórios e dashboard
      'relatorios:read',
      'relatorios:export',
      'dashboard:read',
    ],
  },
  professor: {
    name: 'Professor',
    description:
      'Gerencia suas turmas, alunos e atividades pedagógicas. Pode registrar frequência, objetivos, avaliações e se comunicar com responsáveis.',
    permissions: [
      // Leitura básica
      'users:read',
      'roles:read',

      // Gestão de alunos (leitura e atualização, sem criar/deletar)
      'alunos:read',
      'alunos:update',

      // Leitura de turmas e disciplinas
      'turmas:read',
      'disciplinas:read',
      'programas-ensino:read',
      'professores:read',
      'responsaveis:read',

      // Atividades pedagógicas (criar, ler, atualizar)
      'frequencia:create',
      'frequencia:read',
      'frequencia:update',
      'objetivos:create',
      'objetivos:read',
      'objetivos:update',
      'avaliacoes:create',
      'avaliacoes:read',
      'avaliacoes:update',
      'recuperacao:create',
      'recuperacao:read',
      'recuperacao:update',
      'planejamento:create',
      'planejamento:read',
      'planejamento:update',

      // Comunicação (criar e ler)
      'comunicados:create',
      'comunicados:read',
      'notificacoes:read',

      // Relatórios (apenas leitura)
      'relatorios:read',
      'dashboard:read',
    ],
  },
  responsavel: {
    name: 'Responsável',
    description:
      'Acesso limitado para visualizar informações dos alunos sob sua responsabilidade. Pode ver frequência, objetivos, avaliações e comunicados.',
    permissions: [
      // Leitura de alunos (apenas os seus)
      'alunos:read',

      // Leitura de turmas e disciplinas
      'turmas:read',
      'disciplinas:read',
      'programas-ensino:read',

      // Leitura de atividades pedagógicas
      'frequencia:read',
      'objetivos:read',
      'avaliacoes:read',

      // Leitura de comunicação
      'comunicados:read',
      'notificacoes:read',

      // Dashboard básico
      'dashboard:read',
    ],
  },
};

async function seedPermissions() {
  console.log('🌱 Iniciando seed de permissões...\n');

  // Criar todas as permissões
  const permissions: Array<{ id: string; resource: string; action: string; description: string }> =
    [];

  for (const [resourceKey, resourceData] of Object.entries(RESOURCES)) {
    console.log(`📝 Criando permissões para recurso: ${resourceData.name}`);

    for (const action of resourceData.actions) {
      const description = `${getActionDescription(action)} ${resourceData.name.toLowerCase()}`;

      const permission = await prisma.permission.upsert({
        where: {
          resource_action: {
            resource: resourceKey,
            action: action,
          },
        },
        update: {
          description,
        },
        create: {
          resource: resourceKey,
          action: action,
          description,
        },
      });

      permissions.push({
        id: permission.id,
        resource: permission.resource,
        action: permission.action,
        description: permission.description || description,
      });
      console.log(`  ✓ ${permission.resource}:${permission.action}`);
    }
  }

  console.log(`\n✅ ${permissions.length} permissões criadas/atualizadas\n`);

  return permissions;
}

async function seedRoles(permissions: Array<{ id: string; resource: string; action: string }>) {
  console.log('🌱 Iniciando seed de perfis...\n');

  for (const [_roleKey, roleData] of Object.entries(ROLES)) {
    console.log(`👥 Criando perfil: ${roleData.name}`);

    // Criar ou atualizar o perfil
    const role = await prisma.role.upsert({
      where: { name: roleData.name },
      update: {
        description: roleData.description,
      },
      create: {
        name: roleData.name,
        description: roleData.description,
      },
    });

    // Determinar permissões do perfil
    let rolePermissions: Array<{ id: string; resource: string; action: string }>;

    if (roleData.permissions === 'ALL') {
      rolePermissions = permissions;
      console.log(`  → Atribuindo TODAS as ${permissions.length} permissões`);
    } else {
      rolePermissions = permissions.filter((p) =>
        roleData.permissions.includes(`${p.resource}:${p.action}`)
      );
      console.log(`  → Atribuindo ${rolePermissions.length} permissões específicas`);
    }

    // Limpar permissões antigas
    await prisma.rolePermission.deleteMany({
      where: { roleId: role.id },
    });

    // Criar novas associações
    await prisma.rolePermission.createMany({
      data: rolePermissions.map((p) => ({
        roleId: role.id,
        permissionId: p.id,
      })),
      skipDuplicates: true,
    });

    console.log(`  ✅ Perfil "${role.name}" configurado com sucesso\n`);
  }

  console.log('✅ Todos os perfis foram criados/atualizados\n');
}

function getActionDescription(action: string): string {
  const descriptions: Record<string, string> = {
    create: 'Criar',
    read: 'Visualizar',
    update: 'Editar',
    delete: 'Excluir',
    export: 'Exportar',
  };

  return descriptions[action] || action;
}

async function main() {
  console.log('🚀 Iniciando seed do sistema de permissões\n');
  console.log('=' .repeat(60) + '\n');

  try {
    // Criar permissões
    const permissions = await seedPermissions();

    // Criar perfis
    await seedRoles(permissions);

    // Estatísticas finais
    const totalPermissions = await prisma.permission.count();
    const totalRoles = await prisma.role.count();
    const totalRolePermissions = await prisma.rolePermission.count();

    console.log('=' .repeat(60));
    console.log('\n📊 ESTATÍSTICAS FINAIS:\n');
    console.log(`  • Permissões no sistema: ${totalPermissions}`);
    console.log(`  • Perfis configurados: ${totalRoles}`);
    console.log(`  • Associações perfil-permissão: ${totalRolePermissions}`);
    console.log('\n✅ Seed concluído com sucesso!\n');
  } catch (error) {
    console.error('\n❌ Erro durante o seed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Executar seed
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

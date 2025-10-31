import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/auth/LoginView.vue'),
      meta: { requiresAuth: false }
    },
    {
      path: '/',
      component: () => import('@/layouts/DashboardLayout.vue'),
      meta: { requiresAuth: true },
      children: [
        {
          path: '',
          name: 'dashboard',
          component: () => import('@/views/DashboardView.vue'),
          meta: { module: 'dashboard' }
        },
        {
          path: '/alunos',
          name: 'alunos',
          component: () => import('@/views/alunos/AlunosListView.vue'),
          meta: { module: 'alunos' }
        },
        {
          path: '/alunos/novo',
          name: 'aluno-novo',
          component: () => import('@/views/alunos/AlunoFormView.vue'),
          meta: { module: 'alunos' }
        },
        {
          path: '/alunos/:id',
          name: 'aluno-detalhes',
          component: () => import('@/views/alunos/AlunoDetailView.vue'),
          meta: { module: 'alunos' }
        },
        {
          path: '/alunos/:id/editar',
          name: 'aluno-editar',
          component: () => import('@/views/alunos/AlunoFormView.vue'),
          meta: { module: 'alunos' }
        },
        {
          path: '/turmas',
          name: 'turmas',
          component: () => import('@/views/turmas/TurmasListView.vue'),
          meta: { module: 'turmas' }
        },
        {
          path: '/turmas/:id',
          name: 'turma-detalhes',
          component: () => import('@/views/turmas/TurmaDetailView.vue'),
          meta: { module: 'turmas' }
        },
        {
          path: '/disciplinas',
          name: 'disciplinas',
          component: () => import('@/views/disciplinas/DisciplinasListView.vue'),
          meta: { module: 'disciplinas' }
        },
        {
          path: '/disciplinas/:id',
          name: 'disciplina-detalhes',
          component: () => import('@/views/disciplinas/DisciplinaDetailView.vue'),
          meta: { module: 'disciplinas' }
        },
        {
          path: '/frequencia',
          name: 'frequencia',
          component: () => import('@/views/frequencia/FrequenciaView.vue'),
          meta: { module: 'frequencia' }
        },
        {
          path: '/objetivos',
          name: 'objetivos',
          component: () => import('@/views/objetivos/ObjetivosView.vue'),
          meta: { module: 'objetivos' }
        },
        {
          path: '/relatorios',
          name: 'relatorios',
          component: () => import('@/views/relatorios/RelatoriosView.vue'),
          meta: { module: 'relatorios' }
        },
        {
          path: '/perfil',
          name: 'perfil',
          component: () => import('@/views/auth/ProfileView.vue')
        },
        // Rotas de Usuários
        {
          path: '/usuarios',
          name: 'usuarios',
          component: () => import('@/views/usuarios/UsuariosListView.vue'),
          meta: { module: 'usuarios' }
        },
        {
          path: '/usuarios/novo',
          name: 'usuario-novo',
          component: () => import('@/views/usuarios/UsuarioFormView.vue'),
          meta: { module: 'usuarios' }
        },
        {
          path: '/usuarios/:id',
          name: 'usuario-detalhes',
          component: () => import('@/views/usuarios/UsuarioDetailView.vue'),
          meta: { module: 'usuarios' }
        },
        {
          path: '/usuarios/:id/editar',
          name: 'usuario-editar',
          component: () => import('@/views/usuarios/UsuarioFormView.vue'),
          meta: { module: 'usuarios' }
        },
        // Rotas de Perfis (Roles)
        {
          path: '/perfis',
          name: 'perfis',
          component: () => import('@/views/perfis/PerfisListView.vue'),
          meta: { module: 'perfis' }
        },
        {
          path: '/perfis/novo',
          name: 'perfil-novo',
          component: () => import('@/views/perfis/PerfilFormView.vue'),
          meta: { module: 'perfis' }
        },
        {
          path: '/perfis/:id/editar',
          name: 'perfil-editar',
          component: () => import('@/views/perfis/PerfilFormView.vue'),
          meta: { module: 'perfis' }
        },
        // Rotas de Responsáveis
        {
          path: '/responsaveis',
          name: 'responsaveis',
          component: () => import('@/views/responsaveis/ResponsaveisListView.vue'),
          meta: { module: 'responsaveis' }
        },
        {
          path: '/responsaveis/novo',
          name: 'responsavel-novo',
          component: () => import('@/views/responsaveis/ResponsavelFormView.vue'),
          meta: { module: 'responsaveis' }
        },
        {
          path: '/responsaveis/:id',
          name: 'responsavel-detalhes',
          component: () => import('@/views/responsaveis/ResponsavelDetailView.vue'),
          meta: { module: 'responsaveis' }
        },
        {
          path: '/responsaveis/:id/editar',
          name: 'responsavel-editar',
          component: () => import('@/views/responsaveis/ResponsavelFormView.vue'),
          meta: { module: 'responsaveis' }
        },
        // Rotas de Professores
        {
          path: '/professores',
          name: 'professores',
          component: () => import('@/views/professores/ProfessoresListView.vue'),
          meta: { module: 'professores' }
        },
        {
          path: '/professores/novo',
          name: 'professor-novo',
          component: () => import('@/views/professores/ProfessorFormView.vue'),
          meta: { module: 'professores' }
        },
        {
          path: '/professores/:id',
          name: 'professor-detalhes',
          component: () => import('@/views/professores/ProfessorDetailView.vue'),
          meta: { module: 'professores' }
        },
        {
          path: '/professores/:id/editar',
          name: 'professor-editar',
          component: () => import('@/views/professores/ProfessorFormView.vue'),
          meta: { module: 'professores' }
        }
      ]
    }
  ]
})

// Navigation guard
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth !== false)

  // Se a rota requer autenticação
  if (requiresAuth) {
    // Se não tem token, redireciona para login
    if (!authStore.token) {
      next('/login')
      return
    }

    // Se tem token mas não tem usuário carregado, tenta carregar
    if (!authStore.user) {
      try {
        await authStore.fetchUser()
      } catch (error) {
        // Se falhar ao carregar usuário, vai para login
        next('/login')
        return
      }
    }

    // Verifica permissão de módulo se especificada na rota
    const moduleName = to.meta.module as string | undefined
    if (moduleName) {
      // Importa dynamicamente o composable para verificar permissões
      const { usePermissions } = await import('@/composables/usePermissions')
      const { canAccessModule } = usePermissions()
      
      if (!canAccessModule(moduleName)) {
        // Usuário não tem permissão, redireciona para dashboard
        next('/')
        return
      }
    }

    // Tem token, usuário e permissão, pode prosseguir
    next()
  } else if (to.path === '/login' && authStore.isAuthenticated) {
    // Se está autenticado e tenta acessar login, vai para dashboard
    next('/')
  } else {
    // Rota não requer autenticação
    next()
  }
})

export default router

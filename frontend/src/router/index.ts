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
          component: () => import('@/views/DashboardView.vue')
        },
        {
          path: '/alunos',
          name: 'alunos',
          component: () => import('@/views/alunos/AlunosListView.vue')
        },
        {
          path: '/alunos/novo',
          name: 'aluno-novo',
          component: () => import('@/views/alunos/AlunoFormView.vue')
        },
        {
          path: '/alunos/:id',
          name: 'aluno-detalhes',
          component: () => import('@/views/alunos/AlunoDetailView.vue')
        },
        {
          path: '/alunos/:id/editar',
          name: 'aluno-editar',
          component: () => import('@/views/alunos/AlunoFormView.vue')
        },
        {
          path: '/turmas',
          name: 'turmas',
          component: () => import('@/views/turmas/TurmasListView.vue')
        },
        {
          path: '/frequencia',
          name: 'frequencia',
          component: () => import('@/views/frequencia/FrequenciaView.vue')
        },
        {
          path: '/objetivos',
          name: 'objetivos',
          component: () => import('@/views/objetivos/ObjetivosView.vue')
        },
        {
          path: '/relatorios',
          name: 'relatorios',
          component: () => import('@/views/relatorios/RelatoriosView.vue')
        },
        {
          path: '/perfil',
          name: 'perfil',
          component: () => import('@/views/auth/ProfileView.vue')
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
        next()
      } catch (error) {
        // Se falhar ao carregar usuário, vai para login
        next('/login')
      }
      return
    }

    // Tem token e usuário, pode prosseguir
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

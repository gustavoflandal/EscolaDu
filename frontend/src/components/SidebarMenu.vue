<template>
  <aside class="w-64 bg-white shadow-md fixed left-0 top-20 bottom-0 overflow-y-auto z-40 border-r border-gray-200">
    <nav class="px-4 py-6 space-y-1">
      <!-- Seção Principal -->
      <div class="mb-6">
        <p class="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
          Menu Principal
        </p>

        <!-- Dashboard -->
        <RouterLink
          v-if="canAccessModule('dashboard')"
          to="/"
          class="group flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors"
          :class="isActive('/') 
            ? 'bg-primary-50 text-primary-600 border-l-4 border-primary-600' 
            : 'text-gray-700 hover:bg-gray-50'"
        >
          <svg class="mr-3 h-5 w-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-3m0 0l7-4 7 4M5 9v10a1 1 0 001 1h12a1 1 0 001-1V9m-9 11l3-3m0 0l3 3m-3-3v6" />
          </svg>
          Dashboard
        </RouterLink>

        <!-- Alunos -->
        <RouterLink
          v-if="canAccessModule('alunos')"
          to="/alunos"
          class="group flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors"
          :class="isActive('/alunos') 
            ? 'bg-primary-50 text-primary-600 border-l-4 border-primary-600' 
            : 'text-gray-700 hover:bg-gray-50'"
        >
          <svg class="mr-3 h-5 w-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 12H9m6 0h.01M9 12h.01M12 12h.01M12 12h.01M6 8h.01M18 8h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Alunos
        </RouterLink>

        <!-- Responsáveis -->
        <RouterLink
          v-if="canAccessModule('responsaveis')"
          to="/responsaveis"
          class="group flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors"
          :class="isActive('/responsaveis') 
            ? 'bg-primary-50 text-primary-600 border-l-4 border-primary-600' 
            : 'text-gray-700 hover:bg-gray-50'"
        >
          <svg class="mr-3 h-5 w-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM9 9H5a4 4 0 014-4h0a4 4 0 014 4m0 0v3m0 0v3m0-3h3m-3 0h-3" />
          </svg>
          Responsáveis
        </RouterLink>

        <!-- Professores -->
        <RouterLink
          v-if="canAccessModule('professores')"
          to="/professores"
          class="group flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors"
          :class="isActive('/professores') 
            ? 'bg-primary-50 text-primary-600 border-l-4 border-primary-600' 
            : 'text-gray-700 hover:bg-gray-50'"
        >
          <svg class="mr-3 h-5 w-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
          Professores
        </RouterLink>

        <!-- Agenda de Professores -->
        <RouterLink
          v-if="canAccessModule('professores')"
          to="/agenda-professores"
          class="group flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors"
          :class="isActive('/agenda-professores') 
            ? 'bg-primary-50 text-primary-600 border-l-4 border-primary-600' 
            : 'text-gray-700 hover:bg-gray-50'"
        >
          <svg class="mr-3 h-5 w-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          Agenda
        </RouterLink>

        <!-- Turmas -->
        <RouterLink
          v-if="canAccessModule('turmas')"
          to="/turmas"
          class="group flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors"
          :class="isActive('/turmas') 
            ? 'bg-primary-50 text-primary-600 border-l-4 border-primary-600' 
            : 'text-gray-700 hover:bg-gray-50'"
        >
          <svg class="mr-3 h-5 w-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
          Turmas
        </RouterLink>

        <!-- Disciplinas -->
        <RouterLink
          v-if="canAccessModule('disciplinas')"
          to="/disciplinas"
          class="group flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors"
          :class="isActive('/disciplinas') 
            ? 'bg-primary-50 text-primary-600 border-l-4 border-primary-600' 
            : 'text-gray-700 hover:bg-gray-50'"
        >
          <svg class="mr-3 h-5 w-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C6.228 6.228 2 7.486 2 12s4.228 5.772 10 5.772c5.771 0 10-1.258 10-5.772 0-4.515-4.229-5.772-10-5.772z" />
          </svg>
          Disciplinas
        </RouterLink>
      </div>

      <!-- Seção Operacional -->
      <div class="mb-6">
        <p class="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
          Operacional
        </p>

        <!-- Frequência -->
        <RouterLink
          v-if="canAccessModule('frequencia')"
          to="/frequencia"
          class="group flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors"
          :class="isActive('/frequencia') 
            ? 'bg-primary-50 text-primary-600 border-l-4 border-primary-600' 
            : 'text-gray-700 hover:bg-gray-50'"
        >
          <svg class="mr-3 h-5 w-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
          </svg>
          Frequência
        </RouterLink>

        <!-- Objetivos -->
        <RouterLink
          v-if="canAccessModule('objetivos')"
          to="/objetivos"
          class="group flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors"
          :class="isActive('/objetivos') 
            ? 'bg-primary-50 text-primary-600 border-l-4 border-primary-600' 
            : 'text-gray-700 hover:bg-gray-50'"
        >
          <svg class="mr-3 h-5 w-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          Objetivos
        </RouterLink>

        <!-- Relatórios -->
        <RouterLink
          v-if="canAccessModule('relatorios')"
          to="/relatorios"
          class="group flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors"
          :class="isActive('/relatorios') 
            ? 'bg-primary-50 text-primary-600 border-l-4 border-primary-600' 
            : 'text-gray-700 hover:bg-gray-50'"
        >
          <svg class="mr-3 h-5 w-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          Relatórios
        </RouterLink>

        <!-- Cadastros -->
        <RouterLink
          v-if="canAccessModule('cadastros')"
          to="/cadastros"
          class="group flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors"
          :class="isActive('/cadastros') 
            ? 'bg-primary-50 text-primary-600 border-l-4 border-primary-600' 
            : 'text-gray-700 hover:bg-gray-50'"
        >
          <svg class="mr-3 h-5 w-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
          </svg>
          Cadastros Básicos
        </RouterLink>
      </div>

      <!-- Seção Administrativa (apenas para admins) -->
      <div v-if="canAccessAdminSection" class="mb-6 border-t pt-6">
        <p class="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
          Administração
        </p>

        <!-- Usuários -->
        <RouterLink
          v-if="canAccessModule('usuarios')"
          to="/usuarios"
          class="group flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors"
          :class="isActive('/usuarios') 
            ? 'bg-primary-50 text-primary-600 border-l-4 border-primary-600' 
            : 'text-gray-700 hover:bg-gray-50'"
        >
          <svg class="mr-3 h-5 w-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 12H9m4.5 5.5h-3m3 0h-3M18 20a6 6 0 11-12 0 6 6 0 0112 0z" />
          </svg>
          Usuários
        </RouterLink>

        <!-- Perfis -->
        <RouterLink
          v-if="canAccessModule('perfis')"
          to="/perfis"
          class="group flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors"
          :class="isActive('/perfis') 
            ? 'bg-primary-50 text-primary-600 border-l-4 border-primary-600' 
            : 'text-gray-700 hover:bg-gray-50'"
        >
          <svg class="mr-3 h-5 w-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Perfis
        </RouterLink>
      </div>
    </nav>
  </aside>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { usePermissions } from '@/composables/usePermissions'

const route = useRoute()
const authStore = useAuthStore()
const { canAccessModule } = usePermissions()

// Verifica se o usuário tem acesso à seção administrativa
const canAccessAdminSection = computed(() => {
  return canAccessModule('usuarios') || canAccessModule('perfis')
})

// Verifica se a rota atual é ativa
function isActive(path: string): boolean {
  if (path === '/') {
    return route.path === '/'
  }
  return route.path.startsWith(path)
}
</script>

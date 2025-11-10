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
          <svg class="mr-3 h-5 w-5 flex-shrink-0 text-primary-500" fill="currentColor" viewBox="0 0 24 24">
            <path d="M13 21v-2H3v2a2 2 0 002 2h8zm0-6v-2H3v2h10zM3 9h10V7H3v2zm18-4h-4V3h-2v2h-4v2h4v4h2V7h4V5z"/>
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
          <svg class="mr-3 h-5 w-5 flex-shrink-0 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
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
          <svg class="mr-3 h-5 w-5 flex-shrink-0 text-purple-500" fill="currentColor" viewBox="0 0 24 24">
            <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.89 1.97 1.74 1.97 2.95V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/>
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
          <svg class="mr-3 h-5 w-5 flex-shrink-0 text-yellow-500" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
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
          <svg class="mr-3 h-5 w-5 flex-shrink-0 text-red-500" fill="currentColor" viewBox="0 0 24 24">
            <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11z"/>
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
          <svg class="mr-3 h-5 w-5 flex-shrink-0 text-green-500" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 7V3H2v18h20V7H12zM6 19H4v-2h2v2zm0-4H4v-2h2v2zm0-4H4V9h2v2zm4 8H8v-2h2v2zm0-4H8v-2h2v2zm0-4H8V9h2v2zm4 8h-2v-2h2v2zm0-4h-2v-2h2v2zm0-4h-2V9h2v2zm4 8h-2v-2h2v2zm0-4h-2v-2h2v2z"/>
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
          <svg class="mr-3 h-5 w-5 flex-shrink-0 text-indigo-500" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z"/>
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
          <svg class="mr-3 h-5 w-5 flex-shrink-0 text-teal-500" fill="currentColor" viewBox="0 0 24 24">
            <path d="M9 11H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2zm2-7h-1V2h-2v2H8V2H6v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V9h14v11z"/>
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
          <svg class="mr-3 h-5 w-5 flex-shrink-0 text-orange-500" fill="currentColor" viewBox="0 0 24 24">
            <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
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
          <svg class="mr-3 h-5 w-5 flex-shrink-0 text-pink-500" fill="currentColor" viewBox="0 0 24 24">
            <path d="M5 9.2h3V19H5zM10.6 5h2.8v14h-2.8zm5.6 8H19v6h-2.8z"/>
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
          <svg class="mr-3 h-5 w-5 flex-shrink-0 text-cyan-500" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
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
          <svg class="mr-3 h-5 w-5 flex-shrink-0 text-violet-500" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
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
          <svg class="mr-3 h-5 w-5 flex-shrink-0 text-rose-500" fill="currentColor" viewBox="0 0 24 24">
            <path d="M10.5 1.5H3.75A2.25 2.25 0 001.5 3.75v16.5A2.25 2.25 0 003.75 22.5h16.5a2.25 2.25 0 002.25-2.25V10.5M22.5 1.5l-9 9M22.5 1.5h-6m6 0v6"/>
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

<template>
  <div class="min-h-screen bg-gray-100">
    <!-- Header -->
    <header class="bg-white shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-20">
          <div class="flex items-center">
            <img src="/logo.png" alt="SGE - Sistema de Gestão Escolar" class="h-12 md:h-16 lg:h-20 object-contain" />
          </div>
          <div class="flex items-center space-x-4">
            <span class="text-sm text-gray-700 font-medium">{{ authStore.user?.name }}</span>
            <button @click="handleLogout" class="btn btn-secondary">
              Sair
            </button>
          </div>
        </div>
      </div>
    </header>

    <!-- Menu de Navegação -->
    <nav class="bg-white border-b border-gray-200 shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex space-x-8 h-12">
          <RouterLink
            v-if="canAccessModule('dashboard')"
            to="/"
            class="border-transparent text-gray-600 hover:border-primary-400 hover:text-gray-900 inline-flex items-center px-1 border-b-2 text-sm font-medium transition-colors"
            active-class="border-primary-500 text-primary-600"
          >
            Dashboard
          </RouterLink>
          
          <RouterLink
            v-if="canAccessModule('alunos')"
            to="/alunos"
            class="border-transparent text-gray-600 hover:border-primary-400 hover:text-gray-900 inline-flex items-center px-1 border-b-2 text-sm font-medium transition-colors"
            active-class="border-primary-500 text-primary-600"
          >
            Alunos
          </RouterLink>
          
          <RouterLink
            v-if="canAccessModule('responsaveis')"
            to="/responsaveis"
            class="border-transparent text-gray-600 hover:border-primary-400 hover:text-gray-900 inline-flex items-center px-1 border-b-2 text-sm font-medium transition-colors"
            active-class="border-primary-500 text-primary-600"
          >
            Responsáveis
          </RouterLink>
          
          <RouterLink
            v-if="canAccessModule('professores')"
            to="/professores"
            class="border-transparent text-gray-600 hover:border-primary-400 hover:text-gray-900 inline-flex items-center px-1 border-b-2 text-sm font-medium transition-colors"
            active-class="border-primary-500 text-primary-600"
          >
            Professores
          </RouterLink>
          
          <RouterLink
            v-if="canAccessModule('turmas')"
            to="/turmas"
            class="border-transparent text-gray-600 hover:border-primary-400 hover:text-gray-900 inline-flex items-center px-1 border-b-2 text-sm font-medium transition-colors"
            active-class="border-primary-500 text-primary-600"
          >
            Turmas
          </RouterLink>
          
          <RouterLink
            v-if="canAccessModule('disciplinas')"
            to="/disciplinas"
            class="border-transparent text-gray-600 hover:border-primary-400 hover:text-gray-900 inline-flex items-center px-1 border-b-2 text-sm font-medium transition-colors"
            active-class="border-primary-500 text-primary-600"
          >
            Disciplinas
          </RouterLink>
          
          <RouterLink
            v-if="canAccessModule('frequencia')"
            to="/frequencia"
            class="border-transparent text-gray-600 hover:border-primary-400 hover:text-gray-900 inline-flex items-center px-1 border-b-2 text-sm font-medium transition-colors"
            active-class="border-primary-500 text-primary-600"
          >
            Frequência
          </RouterLink>
          
          <RouterLink
            v-if="canAccessModule('objetivos')"
            to="/objetivos"
            class="border-transparent text-gray-600 hover:border-primary-400 hover:text-gray-900 inline-flex items-center px-1 border-b-2 text-sm font-medium transition-colors"
            active-class="border-primary-500 text-primary-600"
          >
            Objetivos
          </RouterLink>
          
          <RouterLink
            v-if="canAccessModule('relatorios')"
            to="/relatorios"
            class="border-transparent text-gray-600 hover:border-primary-400 hover:text-gray-900 inline-flex items-center px-1 border-b-2 text-sm font-medium transition-colors"
            active-class="border-primary-500 text-primary-600"
          >
            Relatórios
          </RouterLink>
          
          <!-- Seção Administrativa - visível apenas para administradores -->
          <div class="flex-1"></div>
          
          <RouterLink
            v-if="canAccessModule('usuarios')"
            to="/usuarios"
            class="border-transparent text-gray-600 hover:border-primary-400 hover:text-gray-900 inline-flex items-center px-1 border-b-2 text-sm font-medium transition-colors"
            active-class="border-primary-500 text-primary-600"
          >
            Usuários
          </RouterLink>
          
          <RouterLink
            v-if="canAccessModule('perfis')"
            to="/perfis"
            class="border-transparent text-gray-600 hover:border-primary-400 hover:text-gray-900 inline-flex items-center px-1 border-b-2 text-sm font-medium transition-colors"
            active-class="border-primary-500 text-primary-600"
          >
            Perfis
          </RouterLink>
        </div>
      </div>
    </nav>

    <!-- Page Content -->
    <main class="py-10">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <RouterView />
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { RouterLink, RouterView, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { usePermissions } from '@/composables/usePermissions'
import { useToast } from 'vue-toastification'

const router = useRouter()
const authStore = useAuthStore()
const toast = useToast()
const { canAccessModule } = usePermissions()

function handleLogout() {
  authStore.logout()
  toast.success('Logout realizado com sucesso!')
  router.push('/login')
}
</script>

<template>
  <div class="max-w-4xl mx-auto">
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900">Meu Perfil</h1>
      <p class="mt-2 text-sm text-gray-600">
        Gerencie suas informações pessoais e configurações da conta
      </p>
    </div>

    <!-- Perfil Card -->
    <div class="bg-white shadow rounded-lg overflow-hidden">
      <!-- Avatar Section -->
      <div class="bg-gradient-to-r from-primary-500 to-primary-600 px-6 py-8">
        <div class="flex items-center space-x-6">
          <div class="flex-shrink-0">
            <div
              v-if="user?.avatar"
              class="h-24 w-24 rounded-full bg-white shadow-lg overflow-hidden"
            >
              <img :src="user.avatar" :alt="user.name" class="h-full w-full object-cover" />
            </div>
            <div
              v-else
              class="h-24 w-24 rounded-full bg-white shadow-lg flex items-center justify-center text-primary-600 text-3xl font-bold"
            >
              {{ getInitials(user?.name) }}
            </div>
          </div>
          <div class="flex-1">
            <h2 class="text-2xl font-bold text-white">{{ user?.name }}</h2>
            <p class="text-primary-100">{{ user?.email }}</p>
            <div class="mt-2 flex items-center space-x-2">
              <span
                v-for="role in user?.roles"
                :key="role.id"
                class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-white/20 text-white"
              >
                {{ role.name }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Informações Pessoais -->
      <div class="px-6 py-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Informações Pessoais</h3>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Nome Completo</label>
            <p class="text-base text-gray-900">{{ user?.name || 'Não informado' }}</p>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">E-mail</label>
            <p class="text-base text-gray-900">{{ user?.email || 'Não informado' }}</p>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">CPF</label>
            <p class="text-base text-gray-900">{{ formatCPF(user?.cpf) || 'Não informado' }}</p>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Telefone</label>
            <p class="text-base text-gray-900">{{ formatPhone(user?.phone) || 'Não informado' }}</p>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Status da Conta</label>
            <span
              :class="[
                'inline-flex items-center px-3 py-1 rounded-full text-sm font-medium',
                user?.active
                  ? 'bg-green-100 text-green-800'
                  : 'bg-red-100 text-red-800'
              ]"
            >
              {{ user?.active ? 'Ativa' : 'Inativa' }}
            </span>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Conta criada em</label>
            <p class="text-base text-gray-900">{{ formatDate(user?.createdAt) }}</p>
          </div>
        </div>
      </div>

      <!-- Permissões -->
      <div v-if="permissions.length > 0" class="px-6 py-6 bg-gray-50 border-t border-gray-200">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Minhas Permissões</h3>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          <div
            v-for="permission in permissions"
            :key="permission"
            class="flex items-center space-x-2 text-sm text-gray-700 bg-white px-3 py-2 rounded-md border border-gray-200"
          >
            <svg class="h-4 w-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
              <path
                fill-rule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clip-rule="evenodd"
              />
            </svg>
            <span>{{ formatPermission(permission) }}</span>
          </div>
        </div>
      </div>

      <!-- Ações -->
      <div class="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end space-x-3">
        <button @click="handleEditProfile" class="btn btn-secondary">
          Editar Perfil
        </button>
        <button @click="handleChangePassword" class="btn btn-primary">
          Alterar Senha
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useToast } from 'vue-toastification'

const router = useRouter()
const authStore = useAuthStore()
const toast = useToast()

const user = computed(() => authStore.user)

const permissions = computed(() => {
  if (!user.value?.roles) return []
  const allPermissions = user.value.roles.flatMap((role: any) => 
    role.permissions?.map((p: any) => `${p.resource}:${p.action}`) || []
  )
  return [...new Set(allPermissions)].sort()
})

function getInitials(name?: string): string {
  if (!name) return '?'
  const parts = name.split(' ')
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase()
  }
  return name.substring(0, 2).toUpperCase()
}

function formatCPF(cpf?: string): string {
  if (!cpf) return ''
  return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
}

function formatPhone(phone?: string): string {
  if (!phone) return ''
  const cleaned = phone.replace(/\D/g, '')
  if (cleaned.length === 11) {
    return cleaned.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3')
  }
  if (cleaned.length === 10) {
    return cleaned.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3')
  }
  return phone
}

function formatDate(date?: string): string {
  if (!date) return 'Não informado'
  return new Date(date).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  })
}

function formatPermission(permission: string): string {
  const [resource, action] = permission.split(':')
  const actions: Record<string, string> = {
    create: 'Criar',
    read: 'Visualizar',
    update: 'Editar',
    delete: 'Excluir'
  }
  const resources: Record<string, string> = {
    users: 'Usuários',
    alunos: 'Alunos',
    professores: 'Professores',
    responsaveis: 'Responsáveis',
    turmas: 'Turmas',
    disciplinas: 'Disciplinas',
    frequencia: 'Frequência',
    objetivos: 'Objetivos',
    avaliacoes: 'Avaliações',
    comunicados: 'Comunicados',
    relatorios: 'Relatórios',
    cadastros: 'Cadastros',
    dashboard: 'Dashboard',
    'programas-ensino': 'Programas de Ensino'
  }
  return `${actions[action] || action} ${resources[resource] || resource}`
}

function handleEditProfile() {
  toast.info('Funcionalidade em desenvolvimento')
}

function handleChangePassword() {
  toast.info('Funcionalidade em desenvolvimento')
}
</script>

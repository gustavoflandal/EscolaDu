<template>
  <div>
    <!-- Cabeçalho -->
    <div class="flex items-center justify-between mb-8">
      <h1 class="text-3xl font-bold text-gray-900">Professores</h1>
      <div class="flex gap-3">
        <RouterLink to="/" class="btn btn-secondary">
          ← Voltar
        </RouterLink>
        <RouterLink to="/professores/novo" class="btn btn-primary">
          + Novo Professor
        </RouterLink>
      </div>
    </div>

    <!-- Filtros -->
    <div class="card mb-6">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Buscar</label>
          <input
            v-model="filters.search"
            type="text"
            class="input"
            placeholder="Nome, email ou CPF..."
            @input="debouncedSearch"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Status</label>
          <select v-model="filters.active" class="input" @change="loadProfessores">
            <option value="">Todos</option>
            <option value="true">Ativos</option>
            <option value="false">Inativos</option>
          </select>
        </div>
        <div class="flex items-end">
          <button @click="clearFilters" class="btn btn-secondary w-full">
            Limpar Filtros
          </button>
        </div>
      </div>
    </div>

    <!-- Estatísticas -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      <div class="card">
        <div class="flex items-center">
          <div class="flex-shrink-0 bg-primary-100 rounded-lg p-3">
            <svg class="h-6 w-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm text-gray-600">Total</p>
            <p class="text-2xl font-bold text-gray-900">{{ stats.total }}</p>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="flex items-center">
          <div class="flex-shrink-0 bg-green-100 rounded-lg p-3">
            <svg class="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm text-gray-600">Ativos</p>
            <p class="text-2xl font-bold text-green-600">{{ stats.ativos }}</p>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="flex items-center">
          <div class="flex-shrink-0 bg-red-100 rounded-lg p-3">
            <svg class="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm text-gray-600">Inativos</p>
            <p class="text-2xl font-bold text-red-600">{{ stats.inativos }}</p>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="flex items-center">
          <div class="flex-shrink-0 bg-blue-100 rounded-lg p-3">
            <svg class="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm text-gray-600">Formações</p>
            <p class="text-2xl font-bold text-blue-600">{{ stats.totalFormacoes }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="flex justify-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
    </div>

    <!-- Tabela -->
    <div v-else class="card overflow-hidden p-0">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Professor
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Email
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Registro
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Carga Horária
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Formações
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Status
              </th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                Ações
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="professor in professores" :key="professor.id" class="hover:bg-gray-50">
              <td class="px-6 py-2 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="flex-shrink-0 h-10 w-10">
                    <div class="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                      <span class="text-primary-600 font-medium text-sm">
                        {{ getInitials(professor.user?.name || '') }}
                      </span>
                    </div>
                  </div>
                  <div class="ml-4">
                    <div class="text-sm font-medium text-gray-900">
                      {{ professor.user?.name }}
                    </div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-2 whitespace-nowrap text-sm text-gray-900">
                {{ professor.user?.email }}
              </td>
              <td class="px-6 py-2 whitespace-nowrap text-sm text-gray-900">
                {{ professor.registroProfissional }}
              </td>
              <td class="px-6 py-2 whitespace-nowrap text-sm text-gray-900">
                {{ professor.cargaHoraria }}h
              </td>
              <td class="px-6 py-2 whitespace-nowrap text-sm text-gray-900">
                {{ professor._count?.formacoes || 0 }}
              </td>
              <td class="px-6 py-2 whitespace-nowrap">
                <span
                  :class="[
                    'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                    professor.active
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  ]"
                >
                  {{ professor.active ? 'Ativo' : 'Inativo' }}
                </span>
              </td>
              <td class="px-6 py-2 whitespace-nowrap text-right text-sm font-medium">
                <div class="flex justify-end gap-2">
                  <RouterLink
                    :to="`/professores/${professor.id}`"
                    class="text-blue-600 hover:text-blue-900"
                    title="Visualizar"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </RouterLink>
                  <RouterLink
                    :to="`/professores/${professor.id}/editar`"
                    class="text-yellow-600 hover:text-yellow-900"
                    title="Editar"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </RouterLink>
                  <button
                    @click="confirmDelete(professor)"
                    class="text-red-600 hover:text-red-900"
                    title="Excluir"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Paginação -->
      <div class="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
        <div class="flex items-center justify-between">
          <div class="flex-1 flex justify-between sm:hidden">
            <button
              @click="previousPage"
              :disabled="pagination.page === 1"
              class="btn btn-secondary"
            >
              Anterior
            </button>
            <button
              @click="nextPage"
              :disabled="pagination.page >= pagination.totalPages"
              class="btn btn-secondary"
            >
              Próxima
            </button>
          </div>
          <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p class="text-sm text-gray-700">
                Mostrando
                <span class="font-medium">{{ (pagination.page - 1) * pagination.limit + 1 }}</span>
                até
                <span class="font-medium">{{
                  Math.min(pagination.page * pagination.limit, pagination.total)
                }}</span>
                de
                <span class="font-medium">{{ pagination.total }}</span>
                resultados
              </p>
            </div>
            <div>
              <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                <button
                  @click="previousPage"
                  :disabled="pagination.page === 1"
                  class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Anterior
                </button>
                <button
                  @click="nextPage"
                  :disabled="pagination.page >= pagination.totalPages"
                  class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Próxima
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { useToast } from 'vue-toastification'
import { professoresService } from '@/services/professores.service'
import type { Professor } from '@/types'

const toast = useToast()

const loading = ref(false)
const professores = ref<Professor[]>([])
const filters = ref({
  search: '',
  active: ''
})

const pagination = ref({
  page: 1,
  limit: 10,
  total: 0,
  totalPages: 0
})

const stats = ref({
  total: 0,
  ativos: 0,
  inativos: 0,
  totalFormacoes: 0
})

let searchTimeout: ReturnType<typeof setTimeout>

function debouncedSearch() {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    pagination.value.page = 1
    loadProfessores()
  }, 500)
}

function clearFilters() {
  filters.value = {
    search: '',
    active: ''
  }
  pagination.value.page = 1
  loadProfessores()
}

async function loadProfessores() {
  loading.value = true
  try {
    const response = await professoresService.list({
      search: filters.value.search || undefined,
      active: filters.value.active ? filters.value.active === 'true' : undefined,
      page: pagination.value.page,
      limit: pagination.value.limit
    })

    // A resposta do backend tem estrutura: { data: [...], pagination: {...} }
    const result = response.data || response
    
    professores.value = result.data || []
    
    // Extrair paginação do objeto pagination ou da raiz
    const pag = result.pagination || result
    pagination.value = {
      page: pag.page || 1,
      limit: pag.limit || 10,
      total: pag.total || 0,
      totalPages: pag.totalPages || 1
    }
  } catch (error: any) {
    console.error('Erro ao carregar professores:', error)
    toast.error('Erro ao carregar professores')
  } finally {
    loading.value = false
  }
}

async function loadStats() {
  try {
    stats.value = await professoresService.getStats()
  } catch (error) {
    console.error('Erro ao carregar estatísticas:', error)
  }
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

function nextPage() {
  if (pagination.value.page < pagination.value.totalPages) {
    pagination.value.page++
    loadProfessores()
  }
}

function previousPage() {
  if (pagination.value.page > 1) {
    pagination.value.page--
    loadProfessores()
  }
}

async function confirmDelete(professor: Professor) {
  if (
    confirm(
      `Tem certeza que deseja inativar o professor ${professor.user?.name}?`
    )
  ) {
    try {
      await professoresService.delete(professor.id)
      toast.success('Professor inativado com sucesso!')
      loadProfessores()
      loadStats()
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Erro ao inativar professor')
    }
  }
}

onMounted(() => {
  loadProfessores()
  loadStats()
})
</script>

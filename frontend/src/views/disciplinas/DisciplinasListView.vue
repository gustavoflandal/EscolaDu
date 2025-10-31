<template>
  <div>
    <!-- Cabeçalho -->
    <div class="flex items-center justify-between mb-8">
      <h1 class="text-3xl font-bold text-gray-900">Disciplinas</h1>
      <div class="flex gap-3">
        <RouterLink to="/" class="btn btn-secondary">Voltar</RouterLink>
        <button
          v-if="hasPermission('disciplinas', 'create')"
          @click="openModal()"
          class="btn btn-primary"
        >
          Nova Disciplina
        </button>
      </div>
    </div>

    <!-- Filtros -->
    <div class="card mb-6">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Pesquisar</label>
          <input
            v-model="filters.search"
            type="text"
            class="input"
            placeholder="Código, nome..."
            @input="debounceSearch"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Área de Conhecimento</label>
          <select v-model="filters.areaConhecimento" class="input" @change="loadDisciplinas">
            <option :value="undefined">Todas</option>
            <option v-for="area in areasConhecimento" :key="area" :value="area">
              {{ area }}
            </option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Status</label>
          <select v-model="filters.ativa" class="input" @change="loadDisciplinas">
            <option :value="undefined">Todos</option>
            <option :value="true">Ativas</option>
            <option :value="false">Inativas</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="text-center py-8">
      <p class="text-gray-600">Carregando disciplinas...</p>
    </div>

    <!-- Tabela -->
    <div v-else class="card overflow-hidden p-0">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Código</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nome</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Área</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">C.H. Semanal</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Programas</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Turmas</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Ações</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-if="disciplinas.length === 0">
              <td colspan="8" class="px-6 py-8 text-center text-gray-500">
                Nenhuma disciplina encontrada
              </td>
            </tr>
            <tr v-for="disciplina in disciplinas" :key="disciplina.id" class="hover:bg-gray-50">
              <td class="px-6 py-2 whitespace-nowrap text-sm font-medium text-gray-900">
                {{ disciplina.codigo }}
              </td>
              <td class="px-6 py-2 whitespace-nowrap text-sm text-gray-900">
                {{ disciplina.nome }}
              </td>
              <td class="px-6 py-2 whitespace-nowrap text-sm text-gray-600">
                {{ disciplina.areaConhecimento || '-' }}
              </td>
              <td class="px-6 py-2 whitespace-nowrap text-sm text-gray-600">
                {{ disciplina.cargaHorariaSemanal }}h
              </td>
              <td class="px-6 py-2 whitespace-nowrap text-sm text-gray-600">
                {{ disciplina.quantidadeProgramas || 0 }}
              </td>
              <td class="px-6 py-2 whitespace-nowrap text-sm text-gray-600">
                {{ disciplina.quantidadeTurmas || 0 }}
              </td>
              <td class="px-6 py-2 whitespace-nowrap">
                <span v-if="disciplina.active" class="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                  Ativa
                </span>
                <span v-else class="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800">
                  Inativa
                </span>
              </td>
              <td class="px-6 py-2 whitespace-nowrap text-right text-sm font-medium">
                <div class="flex justify-end gap-2">
                  <button
                    @click="viewDisciplina(disciplina.id)"
                    class="text-blue-600 hover:text-blue-900"
                    title="Visualizar"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </button>
                  <button
                    v-if="hasPermission('disciplinas', 'update')"
                    @click="openModal(disciplina)"
                    class="text-yellow-600 hover:text-yellow-900"
                    title="Editar"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button
                    v-if="hasPermission('disciplinas', 'delete')"
                    @click="deleteDisciplina(disciplina)"
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
      <div v-if="pagination && pagination.total > 0" class="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
        <div class="flex items-center justify-between">
          <div class="flex-1 flex justify-between sm:hidden">
            <button
              @click="changePage(pagination.page - 1)"
              :disabled="pagination.page === 1"
              class="btn btn-secondary"
            >
              Anterior
            </button>
            <button
              @click="changePage(pagination.page + 1)"
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
                  @click="changePage(pagination.page - 1)"
                  :disabled="pagination.page === 1"
                  class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Anterior
                </button>
                <button
                  @click="changePage(pagination.page + 1)"
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

    <!-- Modal -->
    <DisciplinaModal
      v-if="showModal"
      :disciplina="selectedDisciplina"
      @close="closeModal"
      @saved="handleSaved"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, RouterLink } from 'vue-router'
import { useToast } from 'vue-toastification'
import disciplinasService from '@/services/disciplinas.service'
import type { Disciplina, PaginatedResponse } from '@/types'
import DisciplinaModal from './DisciplinaModal.vue'
import { usePermissions } from '@/composables/usePermissions'

const router = useRouter()
const toast = useToast()
const { hasPermission } = usePermissions()

// Estado
const disciplinas = ref<Disciplina[]>([])
const areasConhecimento = ref<string[]>([])
const loading = ref(false)
const showModal = ref(false)
const selectedDisciplina = ref<Disciplina | undefined>()
const pagination = ref<PaginatedResponse<Disciplina> | null>(null)

// Filtros
const filters = ref({
  page: 1,
  limit: 10,
  search: undefined as string | undefined,
  areaConhecimento: undefined as string | undefined,
  ativa: undefined as boolean | undefined
})

// Debounce para pesquisa
let searchTimeout: ReturnType<typeof setTimeout>
const debounceSearch = () => {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    filters.value.page = 1
    loadDisciplinas()
  }, 500)
}

// Carregar disciplinas
const loadDisciplinas = async () => {
  try {
    loading.value = true
    const response = await disciplinasService.list(filters.value)
    disciplinas.value = response.data
    pagination.value = response
  } catch (error: any) {
    toast.error(error.response?.data?.error?.message || 'Erro ao carregar disciplinas')
  } finally {
    loading.value = false
  }
}

// Carregar áreas de conhecimento
const loadAreasConhecimento = async () => {
  try {
    areasConhecimento.value = await disciplinasService.getAreasConhecimento()
  } catch (error: any) {
    console.error('Erro ao carregar áreas de conhecimento:', error)
  }
}

// Paginação
const changePage = (page: number) => {
  filters.value.page = page
  loadDisciplinas()
}

// Navegação
const viewDisciplina = (id: string) => {
  router.push(`/disciplinas/${id}`)
}

// Modal
const openModal = (disciplina?: Disciplina) => {
  selectedDisciplina.value = disciplina
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  selectedDisciplina.value = undefined
}

const handleSaved = () => {
  closeModal()
  loadDisciplinas()
}

// Deletar disciplina
const deleteDisciplina = async (disciplina: Disciplina) => {
  if (!confirm(`Deseja realmente excluir a disciplina "${disciplina.nome}"?`)) {
    return
  }

  try {
    await disciplinasService.delete(disciplina.id)
    toast.success('Disciplina excluída com sucesso')
    loadDisciplinas()
  } catch (error: any) {
    toast.error(error.response?.data?.error?.message || 'Erro ao excluir disciplina')
  }
}

// Inicialização
onMounted(() => {
  loadDisciplinas()
  loadAreasConhecimento()
})
</script>

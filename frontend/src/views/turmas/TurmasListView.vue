<template>
  <div>
    <!-- Cabeçalho -->
    <div class="flex items-center justify-between mb-8">
      <h1 class="text-3xl font-bold text-gray-900">Turmas</h1>
      <div class="flex gap-3">
        <RouterLink to="/" class="btn btn-secondary">Voltar</RouterLink>
        <button
          v-if="hasPermission('turmas', 'create')"
          @click="openModal()"
          class="btn btn-primary"
        >
          Nova Turma
        </button>
      </div>
    </div>

    <!-- Filtros -->
    <div class="card mb-6">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Pesquisar</label>
          <input
            v-model="filters.search"
            type="text"
            class="input"
            placeholder="Código, nome, série..."
            @input="debounceSearch"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Ano Letivo</label>
          <select v-model="filters.ano" class="input" @change="loadTurmas">
            <option :value="undefined">Todos</option>
            <option v-for="ano in anosLetivos" :key="ano.id" :value="ano.ano">
              {{ ano.ano }}
            </option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Turno</label>
          <select v-model="filters.periodo" class="input" @change="loadTurmas">
            <option :value="undefined">Todos</option>
            <option value="MANHA">Manhã</option>
            <option value="TARDE">Tarde</option>
            <option value="NOITE">Noite</option>
            <option value="INTEGRAL">Integral</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Status</label>
          <select v-model="filters.ativa" class="input" @change="loadTurmas">
            <option :value="undefined">Todos</option>
            <option :value="true">Ativas</option>
            <option :value="false">Inativas</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="text-center py-8">
      <p class="text-gray-600">Carregando turmas...</p>
    </div>

    <!-- Tabela -->
    <div v-else class="card overflow-hidden p-0">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Código</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nome</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Série</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Turno</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ano</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Alunos</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Professor</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Ações</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-if="turmas.length === 0">
              <td colspan="9" class="px-6 py-8 text-center text-gray-500">
                Nenhuma turma encontrada
              </td>
            </tr>
            <tr v-for="turma in turmas" :key="turma.id" class="hover:bg-gray-50">
              <td class="px-6 py-2 whitespace-nowrap text-sm font-medium text-gray-900">
                {{ turma.codigo }}
              </td>
              <td class="px-6 py-2 whitespace-nowrap text-sm text-gray-900">
                {{ turma.nome }}
              </td>
              <td class="px-6 py-2 whitespace-nowrap text-sm text-gray-600">
                {{ turma.serie }}
              </td>
              <td class="px-6 py-2 whitespace-nowrap text-sm text-gray-600">
                {{ formatTurno(turma.turno) }}
              </td>
              <td class="px-6 py-2 whitespace-nowrap text-sm text-gray-600">
                {{ turma.ano }}
              </td>
              <td class="px-6 py-2 whitespace-nowrap text-sm text-gray-600">
                <span :class="turma.quantidadeAlunos >= turma.capacidadeMaxima ? 'text-red-600 font-semibold' : ''">
                  {{ turma.quantidadeAlunos }}
                </span>
                / {{ turma.capacidadeMaxima }}
              </td>
              <td class="px-6 py-2 whitespace-nowrap text-sm text-gray-600">
                {{ turma.professorRegente?.nome || '-' }}
              </td>
              <td class="px-6 py-2 whitespace-nowrap">
                <span v-if="turma.active" class="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                  Ativa
                </span>
                <span v-else class="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800">
                  Inativa
                </span>
              </td>
              <td class="px-6 py-2 whitespace-nowrap text-right text-sm font-medium">
                <div class="flex justify-end gap-2">
                  <button
                    @click="viewTurma(turma.id)"
                    class="text-blue-600 hover:text-blue-900"
                    title="Visualizar"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </button>
                  <button
                    v-if="hasPermission('turmas', 'update')"
                    @click="openModal(turma)"
                    class="text-yellow-600 hover:text-yellow-900"
                    title="Editar"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button
                    v-if="hasPermission('turmas', 'delete')"
                    @click="deleteTurma(turma)"
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
      <div v-if="pagination && pagination.totalPages > 0" class="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
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
    <TurmaModal
      v-if="showModal"
      :turma="selectedTurma"
      @close="closeModal"
      @saved="handleSaved"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, RouterLink } from 'vue-router'
import { useToast } from 'vue-toastification'
import turmasService, { type TurmaFilters } from '@/services/turmas.service'
import { usePermissions } from '@/composables/usePermissions'
import type { Turma, AnoLetivo } from '@/types'
import TurmaModal from './TurmaModal.vue'

const router = useRouter()
const toast = useToast()
const { hasPermission } = usePermissions()

const loading = ref(false)
const turmas = ref<Turma[]>([])
const pagination = ref<{ page: number; limit: number; total: number; totalPages: number } | null>(null)
const anosLetivos = ref<AnoLetivo[]>([])
const showModal = ref(false)
const selectedTurma = ref<Turma | null>(null)

const filters = ref<TurmaFilters>({
  page: 1,
  limit: 10,
  search: undefined,
  ano: undefined,
  periodo: undefined,
  ativa: undefined
})

let searchTimeout: ReturnType<typeof setTimeout>

function debounceSearch() {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    filters.value.page = 1
    loadTurmas()
  }, 500)
}

async function loadTurmas() {
  loading.value = true
  try {
    const result = await turmasService.list(filters.value)
    console.log('Result completo:', result)
    turmas.value = result.data || result
    pagination.value = {
      page: result.page || result.pagination?.page || 1,
      limit: result.limit || result.pagination?.limit || 10,
      total: result.total || result.pagination?.total || turmas.value.length,
      totalPages: result.totalPages || result.pagination?.totalPages || 1
    }
    console.log('Pagination:', pagination.value)
  } catch (error: any) {
    toast.error(error.response?.data?.message || 'Erro ao carregar turmas')
  } finally {
    loading.value = false
  }
}

async function loadAnosLetivos() {
  try {
    anosLetivos.value = await turmasService.getAnosLetivos()
  } catch (error) {
    console.error('Erro ao carregar anos letivos:', error)
  }
}

function changePage(page: number) {
  filters.value.page = page
  loadTurmas()
}

function formatTurno(turno: string): string {
  const turnos: Record<string, string> = {
    'MANHA': 'Manhã',
    'TARDE': 'Tarde',
    'NOITE': 'Noite',
    'INTEGRAL': 'Integral'
  }
  return turnos[turno] || turno
}

function viewTurma(id: string) {
  router.push(`/turmas/${id}`)
}

function openModal(turma?: Turma) {
  selectedTurma.value = turma || null
  showModal.value = true
}

function closeModal() {
  showModal.value = false
  selectedTurma.value = null
}

function handleSaved() {
  closeModal()
  loadTurmas()
}

async function deleteTurma(turma: Turma) {
  if (!confirm(`Tem certeza que deseja excluir a turma "${turma.nome}"?\n\nEsta ação não pode ser desfeita.`)) {
    return
  }

  try {
    await turmasService.delete(turma.id)
    toast.success('Turma excluída com sucesso')
    loadTurmas()
  } catch (error: any) {
    toast.error(error.response?.data?.message || 'Erro ao excluir turma')
  }
}

onMounted(() => {
  loadTurmas()
  loadAnosLetivos()
})
</script>

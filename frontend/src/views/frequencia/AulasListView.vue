<template>
  <div>
    <!-- Cabeçalho -->
    <div class="flex items-center justify-between mb-8">
      <h1 class="text-3xl font-bold text-gray-900">Aulas e Frequência</h1>
      <div class="flex gap-3">
        <RouterLink to="/" class="btn btn-secondary">Voltar</RouterLink>
        <button
          v-if="hasPermission('frequencia', 'create')"
          @click="openCreateModal()"
          class="btn btn-primary"
        >
          Nova Aula
        </button>
      </div>
    </div>

    <!-- Filtros -->
    <div class="card mb-6">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Data</label>
          <input
            v-model="filters.data"
            type="date"
            class="input"
            @change="loadAulas"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Turma</label>
          <select v-model="filters.turmaId" class="input" @change="loadAulas">
            <option :value="undefined">Todas</option>
            <option v-for="turma in turmas" :key="turma.id" :value="turma.id">
              {{ turma.codigo }} - {{ turma.nome }}
            </option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Status</label>
          <select v-model="filters.status" class="input" @change="loadAulas">
            <option :value="undefined">Todos</option>
            <option value="PLANEJADA">Planejada</option>
            <option value="REALIZADA">Realizada</option>
            <option value="CANCELADA">Cancelada</option>
            <option value="REPOSTA">Reposta</option>
          </select>
        </div>
        <div class="flex items-end">
          <button
            @click="loadAulasHoje"
            class="btn btn-secondary w-full"
          >
            Aulas de Hoje
          </button>
        </div>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="text-center py-8">
      <p class="text-gray-600">Carregando aulas...</p>
    </div>

    <!-- Tabela -->
    <div v-else class="card overflow-hidden p-0">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Data</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Horário</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Turma</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Disciplina</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Professor</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Conteúdo</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Frequência</th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Ações</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-if="aulas.length === 0">
              <td colspan="9" class="px-6 py-8 text-center text-gray-500">
                Nenhuma aula encontrada
              </td>
            </tr>
            <tr v-for="aula in aulas" :key="aula.id" class="hover:bg-gray-50">
              <td class="px-6 py-2 whitespace-nowrap text-sm text-gray-900">
                {{ formatDate(aula.data) }}
              </td>
              <td class="px-6 py-2 whitespace-nowrap text-sm text-gray-600">
                {{ aula.horaInicio }} - {{ aula.horaFim }}
              </td>
              <td class="px-6 py-2 whitespace-nowrap text-sm text-gray-900">
                {{ aula.turma?.codigo }} - {{ aula.turma?.nome }}
              </td>
              <td class="px-6 py-2 whitespace-nowrap text-sm text-gray-600">
                {{ aula.turmaDisciplina?.disciplina?.nome || '-' }}
              </td>
              <td class="px-6 py-2 whitespace-nowrap text-sm text-gray-600">
                {{ aula.professor?.nome || '-' }}
              </td>
              <td class="px-6 py-2 text-sm text-gray-600 max-w-xs truncate">
                {{ aula.conteudo || '-' }}
              </td>
              <td class="px-6 py-2 whitespace-nowrap">
                <span :class="getStatusClass(aula.status)" class="px-2 py-1 text-xs rounded-full">
                  {{ formatStatus(aula.status) }}
                </span>
              </td>
              <td class="px-6 py-2 whitespace-nowrap text-sm">
                <span v-if="aula.frequenciaLancada" class="text-green-600 font-medium">
                  ✓ Lançada
                </span>
                <span v-else class="text-gray-400">
                  Não lançada
                </span>
              </td>
              <td class="px-6 py-2 whitespace-nowrap text-right text-sm font-medium">
                <div class="flex justify-end gap-2">
                  <button
                    v-if="hasPermission('frequencia', 'create') && (aula.status === 'REALIZADA' || aula.status === 'PLANEJADA')"
                    @click="openFrequenciaModal(aula)"
                    class="text-green-600 hover:text-green-900"
                    :title="aula.frequenciaLancada ? 'Editar Frequência' : 'Lançar Frequência'"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Paginação -->
      <div v-if="pagination && pagination.totalPages > 1" class="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
        <div class="flex items-center justify-between">
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
                class="relative inline-flex items-center px-3 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Anterior
              </button>
              <button
                @click="changePage(pagination.page + 1)"
                :disabled="pagination.page >= pagination.totalPages"
                class="relative inline-flex items-center px-3 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Próxima
              </button>
            </nav>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Lançar Frequência -->
    <LancarChamadaModal
      v-if="showFrequenciaModal"
      :aula="selectedAula"
      @close="closeFrequenciaModal"
      @saved="handleFrequenciaSaved"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { useToast } from 'vue-toastification'
import frequenciaService, { type Aula, type AulasFilters } from '@/services/frequencia.service'
import { usePermissions } from '@/composables/usePermissions'
import type { Turma } from '@/types'
import LancarChamadaModal from './LancarChamadaModal.vue'

const toast = useToast()
const { hasPermission } = usePermissions()

const loading = ref(false)
const aulas = ref<Aula[]>([])
const turmas = ref<Turma[]>([])
const pagination = ref<{ page: number; limit: number; total: number; totalPages: number } | null>(null)
const showFrequenciaModal = ref(false)
const selectedAula = ref<Aula | null>(null)

const filters = ref<AulasFilters>({
  page: 1,
  limit: 10,
  data: undefined,
  turmaId: undefined,
  status: undefined
})

async function loadAulas() {
  loading.value = true
  try {
    const result = await frequenciaService.listAulas(filters.value)
    aulas.value = result.data
    pagination.value = {
      page: result.page,
      limit: result.limit,
      total: result.total,
      totalPages: result.totalPages
    }
  } catch (error: any) {
    toast.error(error.response?.data?.message || 'Erro ao carregar aulas')
  } finally {
    loading.value = false
  }
}

async function loadAulasHoje() {
  const hoje = new Date().toISOString().split('T')[0]
  filters.value.data = hoje
  filters.value.page = 1
  await loadAulas()
}

async function loadTurmas() {
  try {
    // Importa o serviço de turmas
    const { default: turmasService } = await import('@/services/turmas.service')
    const result = await turmasService.list({ ativa: true, limit: 100 })
    turmas.value = result.data
  } catch (error) {
    console.error('Erro ao carregar turmas:', error)
  }
}

function changePage(page: number) {
  filters.value.page = page
  loadAulas()
}

function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('pt-BR')
}

function formatStatus(status: string): string {
  const statusMap: Record<string, string> = {
    'PLANEJADA': 'Planejada',
    'REALIZADA': 'Realizada',
    'CANCELADA': 'Cancelada',
    'REPOSTA': 'Reposta'
  }
  return statusMap[status] || status
}

function getStatusClass(status: string): string {
  const classes: Record<string, string> = {
    'PLANEJADA': 'bg-blue-100 text-blue-800',
    'REALIZADA': 'bg-green-100 text-green-800',
    'CANCELADA': 'bg-red-100 text-red-800',
    'REPOSTA': 'bg-yellow-100 text-yellow-800'
  }
  return classes[status] || 'bg-gray-100 text-gray-800'
}

function openFrequenciaModal(aula: Aula) {
  selectedAula.value = aula
  showFrequenciaModal.value = true
}

function closeFrequenciaModal() {
  showFrequenciaModal.value = false
  selectedAula.value = null
}

function handleFrequenciaSaved() {
  closeFrequenciaModal()
  loadAulas()
  toast.success('Frequência lançada com sucesso')
}

function openCreateModal() {
  // TODO: Implementar modal de criação de aula
  toast.info('Funcionalidade em desenvolvimento')
}

function openEditModal(aula: Aula) {
  // TODO: Implementar modal de edição de aula
  toast.info('Funcionalidade em desenvolvimento')
}

function viewAula(aula: Aula) {
  // TODO: Implementar visualização detalhada da aula
  toast.info('Funcionalidade em desenvolvimento')
}

async function deleteAula(aula: Aula) {
  if (!confirm(`Tem certeza que deseja excluir esta aula?\n\nData: ${formatDate(aula.data)}\nHorário: ${aula.horaInicio} - ${aula.horaFim}\n\nEsta ação não pode ser desfeita.`)) {
    return
  }

  try {
    await frequenciaService.deleteAula(aula.id)
    toast.success('Aula excluída com sucesso')
    loadAulas()
  } catch (error: any) {
    toast.error(error.response?.data?.message || 'Erro ao excluir aula')
  }
}

onMounted(() => {
  loadAulas()
  loadTurmas()
})
</script>

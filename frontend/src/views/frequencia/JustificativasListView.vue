<template>
  <div>
    <!-- Cabeçalho -->
    <div class="flex items-center justify-between mb-8">
      <h1 class="text-3xl font-bold text-gray-900">Justificativas de Faltas</h1>
      <div class="flex gap-3">
        <RouterLink to="/" class="btn btn-secondary">Voltar</RouterLink>
        <button
          v-if="hasPermission('frequencia', 'create')"
          @click="openCreateModal()"
          class="btn btn-primary"
        >
          Nova Justificativa
        </button>
      </div>
    </div>

    <!-- Filtros -->
    <div class="card mb-6">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Status</label>
          <select v-model="filters.aprovada" class="input" @change="loadJustificativas">
            <option :value="undefined">Todas</option>
            <option :value="true">Aprovadas</option>
            <option :value="false">Pendentes</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Data Início</label>
          <input
            v-model="filters.dataInicio"
            type="date"
            class="input"
            @change="loadJustificativas"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Data Fim</label>
          <input
            v-model="filters.dataFim"
            type="date"
            class="input"
            @change="loadJustificativas"
          />
        </div>
        <div class="flex items-end">
          <button
            @click="loadPendentes"
            class="btn btn-secondary w-full"
          >
            Apenas Pendentes
          </button>
        </div>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="text-center py-8">
      <p class="text-gray-600">Carregando justificativas...</p>
    </div>

    <!-- Tabela -->
    <div v-else class="card overflow-hidden p-0">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Aluno</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Período</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Motivo</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Documento</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Aprovado Por</th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Ações</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-if="justificativas.length === 0">
              <td colspan="7" class="px-6 py-8 text-center text-gray-500">
                Nenhuma justificativa encontrada
              </td>
            </tr>
            <tr v-for="just in justificativas" :key="just.id" class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900">
                  {{ just.aluno?.nome || 'Aluno não encontrado' }}
                </div>
                <div class="text-sm text-gray-500">
                  Mat: {{ just.aluno?.matricula }}
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                <div>{{ formatDate(just.dataInicio) }}</div>
                <div v-if="just.dataFim && just.dataFim !== just.dataInicio" class="text-xs text-gray-500">
                  até {{ formatDate(just.dataFim) }}
                </div>
              </td>
              <td class="px-6 py-4 text-sm text-gray-600 max-w-xs">
                <div class="truncate" :title="just.motivo">
                  {{ just.motivo }}
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm">
                <a
                  v-if="just.documentoUrl"
                  :href="just.documentoUrl"
                  target="_blank"
                  class="text-blue-600 hover:text-blue-900 flex items-center gap-1"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                  </svg>
                  Ver documento
                </a>
                <span v-else class="text-gray-400">Sem documento</span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  v-if="just.aprovada"
                  class="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800"
                >
                  Aprovada
                </span>
                <span
                  v-else
                  class="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800"
                >
                  Pendente
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                <div v-if="just.aprovadaPor">
                  {{ typeof just.aprovadaPor === 'object' ? just.aprovadaPor.nome : just.aprovadaPor }}
                </div>
                <span v-else class="text-gray-400">-</span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div class="flex justify-end gap-2">
                  <button
                    v-if="hasPermission('frequencia', 'approve') && !just.aprovada"
                    @click="aprovarJustificativa(just)"
                    class="text-green-600 hover:text-green-900"
                    title="Aprovar"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </button>
                  <button
                    @click="viewJustificativa(just)"
                    class="text-blue-600 hover:text-blue-900"
                    title="Visualizar"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </button>
                  <button
                    v-if="hasPermission('frequencia', 'update') && !just.aprovada"
                    @click="openEditModal(just)"
                    class="text-yellow-600 hover:text-yellow-900"
                    title="Editar"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button
                    v-if="hasPermission('frequencia', 'delete') && !just.aprovada"
                    @click="deleteJustificativa(just)"
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
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { useToast } from 'vue-toastification'
import frequenciaService, { type Justificativa, type JustificativasFilters } from '@/services/frequencia.service'
import { usePermissions } from '@/composables/usePermissions'

const toast = useToast()
const { hasPermission } = usePermissions()

const loading = ref(false)
const justificativas = ref<Justificativa[]>([])
const pagination = ref<{ page: number; limit: number; total: number; totalPages: number } | null>(null)

const filters = ref<JustificativasFilters>({
  page: 1,
  limit: 10,
  aprovada: undefined,
  dataInicio: undefined,
  dataFim: undefined
})

async function loadJustificativas() {
  loading.value = true
  try {
    const result = await frequenciaService.listJustificativas(filters.value)
    justificativas.value = result.data
    pagination.value = {
      page: result.page,
      limit: result.limit,
      total: result.total,
      totalPages: result.totalPages
    }
  } catch (error: any) {
    toast.error(error.response?.data?.message || 'Erro ao carregar justificativas')
  } finally {
    loading.value = false
  }
}

async function loadPendentes() {
  filters.value.aprovada = false
  filters.value.page = 1
  await loadJustificativas()
}

function changePage(page: number) {
  filters.value.page = page
  loadJustificativas()
}

function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('pt-BR')
}

async function aprovarJustificativa(just: Justificativa) {
  if (!confirm(`Tem certeza que deseja aprovar esta justificativa?\n\nAluno: ${just.aluno?.nome}\nMotivo: ${just.motivo}`)) {
    return
  }

  try {
    await frequenciaService.aprovarJustificativa(just.id, true)
    toast.success('Justificativa aprovada com sucesso')
    loadJustificativas()
  } catch (error: any) {
    toast.error(error.response?.data?.message || 'Erro ao aprovar justificativa')
  }
}

function viewJustificativa(just: Justificativa) {
  // TODO: Implementar modal de visualização detalhada
  toast.info('Funcionalidade em desenvolvimento')
}

function openCreateModal() {
  // TODO: Implementar modal de criação de justificativa
  toast.info('Funcionalidade em desenvolvimento')
}

function openEditModal(just: Justificativa) {
  // TODO: Implementar modal de edição de justificativa
  toast.info('Funcionalidade em desenvolvimento')
}

async function deleteJustificativa(just: Justificativa) {
  if (!confirm(`Tem certeza que deseja excluir esta justificativa?\n\nAluno: ${just.aluno?.nome}\nPeríodo: ${formatDate(just.dataInicio)} - ${formatDate(just.dataFim)}\n\nEsta ação não pode ser desfeita.`)) {
    return
  }

  try {
    await frequenciaService.deleteJustificativa(just.id)
    toast.success('Justificativa excluída com sucesso')
    loadJustificativas()
  } catch (error: any) {
    toast.error(error.response?.data?.message || 'Erro ao excluir justificativa')
  }
}

onMounted(() => {
  loadJustificativas()
})
</script>

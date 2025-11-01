<template>
  <div>
    <!-- Cabeçalho -->
    <div class="flex items-center justify-between mb-8">
      <h1 class="text-3xl font-bold text-gray-900">Feriados</h1>
      <div class="flex gap-3">
        <RouterLink to="/cadastros" class="btn btn-secondary">Voltar</RouterLink>
        <button
          v-if="hasPermission('cadastros', 'create')"
          @click="openModal()"
          class="btn btn-primary"
        >
          Novo Feriado
        </button>
      </div>
    </div>

    <!-- Filtros -->
    <div class="card mb-6">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Tipo</label>
          <select v-model="filters.tipo" class="input" @change="loadFeriados">
            <option :value="undefined">Todos</option>
            <option value="NACIONAL">Nacional</option>
            <option value="ESTADUAL">Estadual</option>
            <option value="MUNICIPAL">Municipal</option>
            <option value="ESCOLAR">Escolar</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Ano</label>
          <select v-model="filters.ano" class="input" @change="loadFeriados">
            <option :value="undefined">Todos</option>
            <option v-for="ano in anos" :key="ano" :value="ano">{{ ano }}</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Status</label>
          <select v-model="filters.active" class="input" @change="loadFeriados">
            <option :value="undefined">Todos</option>
            <option :value="true">Ativos</option>
            <option :value="false">Inativos</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="text-center py-8">
      <p class="text-gray-600">Carregando feriados...</p>
    </div>

    <!-- Tabela -->
    <div v-else class="card overflow-hidden p-0">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Data</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nome</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tipo</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Recorrente</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Ações</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-if="feriados.length === 0">
              <td colspan="6" class="px-6 py-8 text-center text-gray-500">
                Nenhum feriado encontrado
              </td>
            </tr>
            <tr v-for="feriado in feriados" :key="feriado.id" class="hover:bg-gray-50">
              <td class="px-6 py-2 whitespace-nowrap text-sm font-medium text-gray-900">
                {{ formatDate(feriado.data) }}
              </td>
              <td class="px-6 py-2 whitespace-nowrap text-sm text-gray-900">
                {{ feriado.nome }}
              </td>
              <td class="px-6 py-2 whitespace-nowrap">
                <span :class="getTipoBadgeClass(feriado.tipo)" class="px-2 py-1 text-xs rounded-full">
                  {{ formatTipo(feriado.tipo) }}
                </span>
              </td>
              <td class="px-6 py-2 whitespace-nowrap text-sm text-gray-600">
                {{ feriado.recorrente ? 'Sim' : 'Não' }}
              </td>
              <td class="px-6 py-2 whitespace-nowrap">
                <span v-if="feriado.active" class="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                  Ativo
                </span>
                <span v-else class="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800">
                  Inativo
                </span>
              </td>
              <td class="px-6 py-2 whitespace-nowrap text-right text-sm font-medium">
                <div class="flex justify-end gap-2">
                  <button
                    v-if="hasPermission('cadastros', 'update')"
                    @click="openModal(feriado)"
                    class="text-yellow-600 hover:text-yellow-900"
                    title="Editar"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button
                    v-if="hasPermission('cadastros', 'delete')"
                    @click="deleteFeriado(feriado)"
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
    </div>

    <!-- Modal -->
    <FeriadoModal
      v-if="showModal"
      :feriado="selectedFeriado"
      @close="closeModal"
      @saved="onFeriadoSaved"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
import { usePermissions } from '@/composables/usePermissions'
import { feriadosService, type Feriado, TipoFeriado } from '@/services/feriados.service'
import FeriadoModal from './FeriadoModal.vue'

const router = useRouter()
const toast = useToast()
const { hasPermission } = usePermissions()

const feriados = ref<Feriado[]>([])
const loading = ref(false)
const showModal = ref(false)
const selectedFeriado = ref<Feriado | undefined>(undefined)

const currentYear = new Date().getFullYear()
const anos = computed(() => {
  const anosList = []
  for (let i = currentYear - 2; i <= currentYear + 5; i++) {
    anosList.push(i)
  }
  return anosList
})

const filters = ref<{
  tipo?: TipoFeriado
  ano?: number
  active?: boolean
}>({
  ano: currentYear
})

async function loadFeriados() {
  try {
    loading.value = true
    feriados.value = await feriadosService.list(filters.value)
  } catch (error: any) {
    toast.error(error.response?.data?.error?.message || 'Erro ao carregar feriados')
  } finally {
    loading.value = false
  }
}

function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('pt-BR', { timeZone: 'UTC' })
}

function formatTipo(tipo: TipoFeriado): string {
  const tipos: Record<TipoFeriado, string> = {
    [TipoFeriado.NACIONAL]: 'Nacional',
    [TipoFeriado.ESTADUAL]: 'Estadual',
    [TipoFeriado.MUNICIPAL]: 'Municipal',
    [TipoFeriado.ESCOLAR]: 'Escolar'
  }
  return tipos[tipo]
}

function getTipoBadgeClass(tipo: TipoFeriado): string {
  const classes: Record<TipoFeriado, string> = {
    [TipoFeriado.NACIONAL]: 'bg-blue-100 text-blue-800',
    [TipoFeriado.ESTADUAL]: 'bg-green-100 text-green-800',
    [TipoFeriado.MUNICIPAL]: 'bg-yellow-100 text-yellow-800',
    [TipoFeriado.ESCOLAR]: 'bg-purple-100 text-purple-800'
  }
  return classes[tipo]
}

function openModal(feriado?: Feriado) {
  selectedFeriado.value = feriado
  showModal.value = true
}

function closeModal() {
  showModal.value = false
  selectedFeriado.value = undefined
}

function onFeriadoSaved() {
  closeModal()
  loadFeriados()
}

async function deleteFeriado(feriado: Feriado) {
  if (!confirm(`Deseja realmente excluir o feriado "${feriado.nome}"?`)) {
    return
  }

  try {
    await feriadosService.delete(feriado.id)
    toast.success('Feriado excluído com sucesso')
    loadFeriados()
  } catch (error: any) {
    toast.error(error.response?.data?.error?.message || 'Erro ao excluir feriado')
  }
}

onMounted(() => {
  loadFeriados()
})
</script>

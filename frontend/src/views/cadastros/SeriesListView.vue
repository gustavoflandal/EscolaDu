<template>
  <div>
    <!-- Cabeçalho -->
    <div class="flex items-center justify-between mb-8">
      <h1 class="text-3xl font-bold text-gray-900">Séries</h1>
      <div class="flex gap-3">
        <RouterLink to="/cadastros" class="btn btn-secondary">Voltar</RouterLink>
        <button
          v-if="hasPermission('cadastros', 'create')"
          @click="openModal()"
          class="btn btn-primary"
        >
          Nova Série
        </button>
      </div>
    </div>

    <!-- Filtros -->
    <div class="card mb-6">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Nível de Ensino</label>
          <select v-model="filters.nivelEnsino" class="input" @change="loadSeries">
            <option :value="undefined">Todos</option>
            <option value="Infantil">Educação Infantil</option>
            <option value="Fundamental I">Ensino Fundamental I</option>
            <option value="Fundamental II">Ensino Fundamental II</option>
            <option value="Médio">Ensino Médio</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Status</label>
          <select v-model="filters.active" class="input" @change="loadSeries">
            <option :value="undefined">Todos</option>
            <option :value="true">Ativos</option>
            <option :value="false">Inativos</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="text-center py-8">
      <p class="text-gray-600">Carregando séries...</p>
    </div>

    <!-- Tabela -->
    <div v-else class="card overflow-hidden p-0">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Código</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nome</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nível de Ensino</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ordem</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Ações</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-if="series.length === 0">
              <td colspan="6" class="px-6 py-8 text-center text-gray-500">
                Nenhuma série encontrada
              </td>
            </tr>
            <tr v-for="serie in series" :key="serie.id" class="hover:bg-gray-50">
              <td class="px-6 py-2 whitespace-nowrap text-sm font-medium text-gray-900">
                {{ serie.codigo }}
              </td>
              <td class="px-6 py-2 whitespace-nowrap text-sm text-gray-900">
                {{ serie.nome }}
              </td>
              <td class="px-6 py-2 whitespace-nowrap text-sm text-gray-600">
                {{ serie.nivelEnsino }}
              </td>
              <td class="px-6 py-2 whitespace-nowrap text-sm text-gray-600">
                {{ serie.ordem }}
              </td>
              <td class="px-6 py-2 whitespace-nowrap">
                <span v-if="serie.active" class="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
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
                    @click="openModal(serie)"
                    class="text-yellow-600 hover:text-yellow-900"
                    title="Editar"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button
                    v-if="hasPermission('cadastros', 'delete')"
                    @click="deleteSerie(serie)"
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
    <SerieModal
      v-if="showModal"
      :serie="selectedSerie"
      @close="closeModal"
      @saved="onSerieSaved"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
import { usePermissions } from '@/composables/usePermissions'
import { seriesService, type Serie } from '@/services/series.service'
import SerieModal from './SerieModal.vue'

const router = useRouter()
const toast = useToast()
const { hasPermission } = usePermissions()

const series = ref<Serie[]>([])
const loading = ref(false)
const showModal = ref(false)
const selectedSerie = ref<Serie | undefined>(undefined)

const filters = ref<{
  nivelEnsino?: string
  active?: boolean
}>({})

async function loadSeries() {
  try {
    loading.value = true
    series.value = await seriesService.list(filters.value)
  } catch (error: any) {
    toast.error(error.response?.data?.error?.message || 'Erro ao carregar séries')
  } finally {
    loading.value = false
  }
}

function openModal(serie?: Serie) {
  selectedSerie.value = serie
  showModal.value = true
}

function closeModal() {
  showModal.value = false
  selectedSerie.value = undefined
}

function onSerieSaved() {
  closeModal()
  loadSeries()
}

async function deleteSerie(serie: Serie) {
  if (!confirm(`Deseja realmente excluir a série "${serie.nome}"?`)) {
    return
  }

  try {
    await seriesService.delete(serie.id)
    toast.success('Série excluída com sucesso')
    loadSeries()
  } catch (error: any) {
    toast.error(error.response?.data?.error?.message || 'Erro ao excluir série')
  }
}

onMounted(() => {
  loadSeries()
})
</script>

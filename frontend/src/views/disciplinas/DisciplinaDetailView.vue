<template>
  <div>
    <!-- Loading -->
    <div v-if="loading" class="text-center py-8">
      <p class="text-gray-600">Carregando disciplina...</p>
    </div>

    <!-- Conteúdo -->
    <div v-else-if="disciplina">
      <!-- Cabeçalho -->
      <div class="flex items-center justify-between mb-8">
        <div>
          <h1 class="text-3xl font-bold text-gray-900">{{ disciplina.nome }}</h1>
          <p class="text-gray-600 mt-1">{{ disciplina.codigo }} • {{ disciplina.cargaHorariaSemanal }}h semanais</p>
        </div>
        <button
          @click="$router.back()"
          class="btn btn-secondary"
        >
          Voltar
        </button>
      </div>

      <!-- Informações da Disciplina -->
      <div class="card mb-8">
        <h2 class="text-xl font-bold text-gray-900 mb-6">Informações da Disciplina</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <p class="text-sm text-gray-600">Código</p>
            <p class="text-base font-medium text-gray-900 mt-1">{{ disciplina.codigo }}</p>
          </div>
          <div>
            <p class="text-sm text-gray-600">Área de Conhecimento</p>
            <p class="text-base font-medium text-gray-900 mt-1">{{ disciplina.areaConhecimento || '-' }}</p>
          </div>
          <div>
            <p class="text-sm text-gray-600">Carga Horária Semanal</p>
            <p class="text-base font-medium text-gray-900 mt-1">{{ disciplina.cargaHorariaSemanal }}h</p>
          </div>
          <div>
            <p class="text-sm text-gray-600">Programas de Ensino</p>
            <p class="text-base font-medium text-gray-900 mt-1">{{ programas.length }}</p>
          </div>
          <div>
            <p class="text-sm text-gray-600">Turmas Associadas</p>
            <p class="text-base font-medium text-gray-900 mt-1">{{ disciplina.quantidadeTurmas || 0 }}</p>
          </div>
          <div>
            <p class="text-sm text-gray-600">Status</p>
            <span v-if="disciplina.active" class="inline-block px-3 py-1 text-sm rounded-full bg-green-100 text-green-800 mt-1">
              Ativa
            </span>
            <span v-else class="inline-block px-3 py-1 text-sm rounded-full bg-red-100 text-red-800 mt-1">
              Inativa
            </span>
          </div>
        </div>

        <!-- Descrição -->
        <div v-if="disciplina.descricao" class="mt-6 pt-6 border-t border-gray-200">
          <p class="text-sm text-gray-600 mb-2">Descrição</p>
          <p class="text-base text-gray-900">{{ disciplina.descricao }}</p>
        </div>
      </div>

      <!-- Programas de Ensino -->
      <div class="card p-0 overflow-hidden">
        <div class="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 class="text-xl font-bold text-gray-900">Programas de Ensino</h2>
          <button
            v-if="hasPermission('programas-ensino', 'create')"
            @click="openProgramaModal()"
            class="btn btn-primary"
          >
            Novo Programa de Ensino
          </button>
        </div>

        <!-- Filtros de Programas -->
        <div class="p-6 border-b border-gray-200 bg-gray-50">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Pesquisar</label>
              <input
                v-model="programasFilters.search"
                type="text"
                class="input"
                placeholder="Código, descrição..."
                @input="debounceSearchProgramas"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Série</label>
              <select v-model="programasFilters.serie" class="input" @change="loadProgramas">
                <option :value="undefined">Todas</option>
                <option v-for="serie in series" :key="serie" :value="serie">
                  {{ serie }}
                </option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Período</label>
              <select v-model="programasFilters.periodo" class="input" @change="loadProgramas">
                <option :value="undefined">Todos</option>
                <option v-for="periodo in periodos" :key="periodo" :value="periodo">
                  {{ periodo }}
                </option>
              </select>
            </div>
          </div>
        </div>

        <!-- Tabela de Programas de Ensino -->
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Código</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nome</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Série</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Período</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Objetivos</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Ações</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-if="programas.length === 0">
                <td colspan="7" class="px-6 py-8 text-center text-gray-500">
                  Nenhum programa de ensino cadastrado para esta disciplina
                </td>
              </tr>
              <tr v-for="programa in programas" :key="programa.id" class="hover:bg-gray-50">
                <td class="px-6 py-2 whitespace-nowrap text-sm font-medium text-gray-900">
                  {{ programa.codigo }}
                </td>
                <td class="px-6 py-2 text-sm text-gray-900 max-w-md">
                  <p class="line-clamp-2" :title="programa.nome">{{ programa.nome }}</p>
                </td>
                <td class="px-6 py-2 whitespace-nowrap text-sm text-gray-600">
                  {{ typeof programa.serie === 'object' ? programa.serie.nome : programa.serie }}
                </td>
                <td class="px-6 py-2 whitespace-nowrap text-sm text-gray-600">
                  {{ programa.periodo || '-' }}
                </td>
                <td class="px-6 py-2 whitespace-nowrap text-sm text-gray-600">
                  {{ programa._count?.objetivos || 0 }}
                </td>
                <td class="px-6 py-2 whitespace-nowrap">
                  <span v-if="programa.active" class="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                    Ativo
                  </span>
                  <span v-else class="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800">
                    Inativo
                  </span>
                </td>
                <td class="px-6 py-2 whitespace-nowrap text-right text-sm font-medium">
                  <div class="flex justify-end gap-2">
                    <button
                      @click="navigateToProgramaDetail(programa.id)"
                      class="text-blue-600 hover:text-blue-900"
                      title="Ver detalhes"
                    >
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </button>
                    <button
                      v-if="hasPermission('programas-ensino', 'update')"
                      @click="openProgramaModal(programa)"
                      class="text-yellow-600 hover:text-yellow-900"
                      title="Editar"
                    >
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button
                      v-if="hasPermission('programas-ensino', 'delete')"
                      @click="deletePrograma(programa)"
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
        
        <!-- Rodapé informativo -->
        <div v-if="programas.length > 0" class="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
          <p class="text-sm text-gray-700">
            Total de <span class="font-medium">{{ programas.length }}</span> programa(s) de ensino
          </p>
        </div>
      </div>
    </div>

    <!-- Modal de Programa de Ensino -->
    <ProgramaEnsinoModal
      v-if="showProgramaModal"
      :programa="selectedPrograma"
      :disciplina-id="disciplinaId"
      @close="closeProgramaModal"
      @saved="handleProgramaSaved"
    />

    <!-- Modal de Visualização do Programa -->
    <ProgramaEnsinoViewModal
      ref="viewModalRef"
      :is-open="showViewModal"
      :programa-id="viewProgramaId"
      @close="closeViewModal"
      @add-objetivo="handleAddObjetivo"
      @edit-objetivo="handleEditObjetivo"
    />

    <!-- Modal de Objetivo de Aprendizagem -->
    <ObjetivoModal
      :is-open="showObjetivoModal"
      :programa-ensino-id="currentProgramaId"
      :objetivo="selectedObjetivo"
      @close="closeObjetivoModal"
      @saved="handleObjetivoSaved"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
import disciplinasService from '@/services/disciplinas.service'
import programasEnsinoService from '@/services/programas-ensino.service'
import type { Disciplina } from '@/types'
import type { ProgramaEnsino } from '@/services/programas-ensino.service'
import type { ObjetivoAprendizagem } from '@/services/objetivos-aprendizagem.service'
import ProgramaEnsinoModal from './ProgramaEnsinoModal.vue'
import ProgramaEnsinoViewModal from '@/components/programas-ensino/ProgramaEnsinoViewModal.vue'
import ObjetivoModal from '@/components/objetivos-aprendizagem/ObjetivoModal.vue'
import { usePermissions } from '@/composables/usePermissions'

const route = useRoute()
const router = useRouter()
const toast = useToast()
const { hasPermission } = usePermissions()

// Estado
const disciplinaId = route.params.id as string
const disciplina = ref<Disciplina | null>(null)
const programas = ref<ProgramaEnsino[]>([])
const programasOriginal = ref<ProgramaEnsino[]>([]) // Lista original sem filtros
const series = ref<string[]>([])
const periodos = ref<string[]>([])
const loading = ref(false)
const showProgramaModal = ref(false)
const selectedPrograma = ref<ProgramaEnsino | undefined>()
const showViewModal = ref(false)
const viewProgramaId = ref<string | null>(null)
const viewModalRef = ref<any>(null)
const showObjetivoModal = ref(false)
const currentProgramaId = ref<string>('')
const selectedObjetivo = ref<ObjetivoAprendizagem | undefined>()

// Validar formato UUID
const isValidUUID = (uuid: string): boolean => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
  return uuidRegex.test(uuid)
}

// Filtros de programas
const programasFilters = ref({
  search: undefined as string | undefined,
  serie: undefined as string | undefined,
  periodo: undefined as string | undefined
})

// Debounce para pesquisa
let searchTimeout: ReturnType<typeof setTimeout>
const debounceSearchProgramas = () => {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    loadProgramas()
  }, 500)
}

// Carregar disciplina
const loadDisciplina = async () => {
  try {
    loading.value = true
    disciplina.value = await disciplinasService.getById(disciplinaId)
  } catch (error: any) {
    toast.error(error.response?.data?.error?.message || 'Erro ao carregar disciplina')
  } finally {
    loading.value = false
  }
}

// Carregar programas de ensino
const loadProgramas = async () => {
  try {
    console.log('🔍 Loading programas for disciplinaId:', disciplinaId)
    
    // Validar se o disciplinaId é um UUID válido
    if (!isValidUUID(disciplinaId)) {
      console.warn('⚠️ Invalid disciplina ID format:', disciplinaId)
      toast.warning('ID da disciplina inválido. Carregando página...')
      return
    }

    const response = await programasEnsinoService.getByDisciplina(disciplinaId)
    console.log('✅ Programas received:', response)
    programasOriginal.value = response
    applyFilters()
  } catch (error: any) {
    console.error('❌ Error loading programas:', error)
    const errorMessage = error.response?.data?.error?.message || 'Erro ao carregar programas de ensino'
    toast.error(errorMessage)
  }
}

// Aplicar filtros aos programas
const applyFilters = () => {
  let filtered = [...programasOriginal.value]
  
  if (programasFilters.value.search) {
    const search = programasFilters.value.search.toLowerCase()
    filtered = filtered.filter(p => 
      p.codigo.toLowerCase().includes(search) ||
      p.nome.toLowerCase().includes(search) ||
      (p.descricao && p.descricao.toLowerCase().includes(search))
    )
  }
  
  if (programasFilters.value.serie) {
    filtered = filtered.filter(p => p.serie === programasFilters.value.serie)
  }
  
  if (programasFilters.value.periodo) {
    filtered = filtered.filter(p => p.periodo === programasFilters.value.periodo)
  }
  
  console.log('🔎 Filtered programas:', filtered.length, 'of', programasOriginal.value.length)
  programas.value = filtered
}

// Carregar séries e períodos
const loadSeriesEPeriodos = async () => {
  try {
    series.value = await programasEnsinoService.getSeries()
    periodos.value = ['1º Bimestre', '2º Bimestre', '3º Bimestre', '4º Bimestre', '1º Trimestre', '2º Trimestre', '3º Trimestre', '1º Semestre', '2º Semestre']
  } catch (error: any) {
    console.error('Erro ao carregar séries e períodos:', error)
  }
}

// Watchers para reaplicar filtros quando mudarem
watch(() => programasFilters.value.search, () => applyFilters())
watch(() => programasFilters.value.serie, () => applyFilters())
watch(() => programasFilters.value.periodo, () => applyFilters())

// Modal de programa
const openProgramaModal = (programa?: ProgramaEnsino) => {
  selectedPrograma.value = programa
  showProgramaModal.value = true
}

const closeProgramaModal = () => {
  showProgramaModal.value = false
  selectedPrograma.value = undefined
}

const handleProgramaSaved = () => {
  console.log('✅ Programa saved, reloading...')
  closeProgramaModal()
  loadProgramas()
  loadDisciplina() // Recarregar para atualizar contador
}

// Modal de visualização
const openViewModal = (id: string) => {
  viewProgramaId.value = id
  showViewModal.value = true
}

const closeViewModal = () => {
  showViewModal.value = false
  viewProgramaId.value = null
}

const navigateToProgramaDetail = (id: string) => {
  openViewModal(id)
}

// Modal de objetivo
const handleAddObjetivo = (programaId: string) => {
  currentProgramaId.value = programaId
  selectedObjetivo.value = undefined
  showObjetivoModal.value = true
}

const handleEditObjetivo = async (objetivoId: string) => {
  try {
    const objetivosService = await import('@/services/objetivos-aprendizagem.service')
    const objetivo = await objetivosService.default.getById(objetivoId)
    currentProgramaId.value = objetivo.programaEnsinoId
    selectedObjetivo.value = objetivo
    showObjetivoModal.value = true
  } catch (error: any) {
    toast.error('Erro ao carregar objetivo')
  }
}

const closeObjetivoModal = () => {
  showObjetivoModal.value = false
  selectedObjetivo.value = undefined
  currentProgramaId.value = ''
}

const handleObjetivoSaved = () => {
  closeObjetivoModal()
  // Recarregar os dados do programa no modal de visualização
  if (viewModalRef.value) {
    viewModalRef.value.loadPrograma()
  }
}

// Deletar programa
const deletePrograma = async (programa: ProgramaEnsino) => {
  if (!confirm(`Deseja realmente excluir o programa "${programa.codigo}"?\n\nTodos os objetivos de aprendizagem vinculados a este programa também serão excluídos.`)) {
    return
  }

  try {
    await programasEnsinoService.delete(programa.id)
    toast.success('Programa excluído com sucesso')
    loadProgramas()
    loadDisciplina()
  } catch (error: any) {
    toast.error(error.response?.data?.error?.message || 'Erro ao excluir programa')
  }
}

// Inicialização
onMounted(() => {
  loadDisciplina()
  loadProgramas()
  loadSeriesEPeriodos()
})
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>

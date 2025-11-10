<template>
  <div v-if="isOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div class="bg-white rounded-lg shadow-xl max-w-5xl w-full h-[85vh] flex flex-col">
      <!-- Header -->
      <div class="bg-white border-b px-4 py-3 flex justify-between items-center shrink-0">
        <div>
          <h2 class="text-xl font-bold text-gray-900">Detalhes do Programa de Ensino</h2>
          <p v-if="programa" class="text-sm text-gray-500">{{ programa.codigo }}</p>
        </div>
        <button
          @click="$emit('close')"
          class="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="flex items-center justify-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>

      <!-- Content -->
      <div v-else-if="programa" class="overflow-y-auto flex-1 p-4">
        <!-- Informações Principais -->
        <div class="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
          <div class="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-2 text-sm">
            <div>
              <label class="text-xs font-medium text-blue-700">Nome</label>
              <p class="text-gray-900 font-medium">{{ programa.nome }}</p>
            </div>
            <div>
              <label class="text-xs font-medium text-blue-700">Disciplina</label>
              <p class="text-gray-900">{{ programa.disciplina?.nome || 'N/A' }}</p>
            </div>
            <div>
              <label class="text-xs font-medium text-blue-700">Série</label>
              <p class="text-gray-900">{{ typeof programa.serie === 'object' ? programa.serie.nome : programa.serie }}</p>
            </div>
            <div>
              <label class="text-xs font-medium text-blue-700">Período</label>
              <p class="text-gray-900">{{ programa.periodo || 'N/A' }}</p>
            </div>
            <div>
              <label class="text-xs font-medium text-blue-700">Ano Letivo</label>
              <p class="text-gray-900">{{ programa.anoLetivo }}</p>
            </div>
            <div>
              <label class="text-xs font-medium text-blue-700">Carga Horária</label>
              <p class="text-gray-900">{{ programa.cargaHoraria ? `${programa.cargaHoraria}h` : 'N/A' }}</p>
            </div>
            <div>
              <label class="text-xs font-medium text-blue-700">Status</label>
              <span
                :class="[
                  'inline-flex px-2 py-0.5 text-xs font-semibold rounded-full',
                  programa.active
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                ]"
              >
                {{ programa.active ? 'Ativo' : 'Inativo' }}
              </span>
            </div>
          </div>
        </div>

        <!-- Descrição e Observações -->
        <div v-if="programa.descricao || programa.observacoes" class="mb-4 space-y-3">
          <div v-if="programa.descricao" class="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <p class="text-sm font-bold text-gray-900 mb-2">Descrição</p>
            <p class="text-sm text-gray-700 line-clamp-2">{{ programa.descricao }}</p>
          </div>
          <div v-if="programa.observacoes" class="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p class="text-sm font-bold text-gray-900 mb-2">Observações</p>
            <p class="text-sm text-gray-700 line-clamp-2">{{ programa.observacoes }}</p>
          </div>
        </div>

        <!-- Objetivos de Aprendizagem -->
        <div>
          <div class="flex items-center justify-between mb-3">
            <h3 class="text-base font-semibold text-gray-900">
              Objetivos de Aprendizagem
              <span class="text-sm font-normal text-gray-500 ml-2">
                ({{ programa.objetivos?.length || 0 }})
              </span>
            </h3>
            <button
              @click="$emit('add-objetivo', programa.id)"
              class="btn btn-primary flex items-center gap-2"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
              </svg>
              Adicionar Objetivo
            </button>
          </div>

          <!-- Tabela de Objetivos -->
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Competência</th>
                  <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Habilidade</th>
                  <th class="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase">Pontuação Meta</th>
                  <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th class="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">Ações</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-if="!programa.objetivos || programa.objetivos.length === 0">
                  <td colspan="5" class="px-4 py-4 text-center text-gray-500">
                    Nenhum objetivo de aprendizagem cadastrado
                  </td>
                </tr>
                <tr v-for="objetivo in sortedObjetivos" :key="objetivo.id" class="hover:bg-gray-50">
                  <td class="px-4 py-2 whitespace-nowrap text-sm text-gray-600">
                    {{ objetivo.competencia || '-' }}
                  </td>
                  <td class="px-4 py-2 whitespace-nowrap text-sm text-gray-600">
                    {{ objetivo.habilidade || '-' }}
                  </td>
                  <td class="px-4 py-2 whitespace-nowrap text-center text-sm text-gray-900 font-medium">
                    {{ objetivo.pontuacaoMeta ? Number(objetivo.pontuacaoMeta).toFixed(2) : '-' }}
                  </td>
                  <td class="px-4 py-2 whitespace-nowrap">
                    <span
                      :class="[
                        'px-2 py-1 text-xs rounded-full',
                        objetivo.active
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      ]"
                    >
                      {{ objetivo.active ? 'Ativo' : 'Inativo' }}
                    </span>
                  </td>
                  <td class="px-4 py-2 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      @click="$emit('edit-objetivo', objetivo.id)"
                      class="text-blue-600 hover:text-blue-900"
                      title="Editar objetivo"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <!-- Rodapé informativo -->
          <div v-if="programa.objetivos && programa.objetivos.length > 0" class="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
            <p class="text-sm text-gray-700">
              Total de <span class="font-medium">{{ programa.objetivos.length }}</span> objetivo(s) de aprendizagem
            </p>
          </div>
        </div>
      </div>

      <!-- Error State -->
      <div v-else class="p-6 text-center text-red-600">
        <p>Erro ao carregar programa de ensino</p>
      </div>

      <!-- Footer -->
      <div class="bg-gray-50 border-t px-4 py-2 flex justify-end shrink-0">
        <button
          @click="$emit('close')"
          class="btn btn-secondary"
        >
          Fechar
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import programasEnsinoService from '@/services/programas-ensino.service'

interface Objetivo {
  id: string
  codigoBNCC: string
  descricao: string
  ordem: number
  competencia?: string
  habilidade?: string
  pontuacaoMeta?: number | null
  active: boolean
  createdAt: string
}

interface Programa {
  id: string
  codigo: string
  nome: string
  descricao?: string
  disciplinaId: string
  serie: string
  periodo?: string
  anoLetivo: number
  cargaHoraria?: number
  observacoes?: string
  active: boolean
  createdAt: string
  updatedAt: string
  disciplina?: {
    id: string
    codigo: string
    nome: string
    areaConhecimento?: string
    cargaHorariaSemanal?: number
    descricao?: string
  }
  objetivos?: Objetivo[]
  _count?: {
    objetivos: number
  }
}

const props = defineProps<{
  isOpen: boolean
  programaId: string | null
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'add-objetivo', programaId: string): void
  (e: 'edit-objetivo', objetivoId: string): void
}>()

const loading = ref(false)
const programa = ref<Programa | null>(null)

// Computed
const sortedObjetivos = computed(() => {
  if (!programa.value?.objetivos) return []
  return [...programa.value.objetivos].sort((a, b) => a.ordem - b.ordem)
})

// Methods
const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('pt-BR')
}

const loadPrograma = async () => {
  if (!props.programaId) return

  loading.value = true
  try {
    console.log('🔍 Loading programa details for ID:', props.programaId)
    programa.value = await programasEnsinoService.getById(props.programaId)
    console.log('✅ Programa loaded:', programa.value)
    console.log('📊 Objetivos com pontuação:', programa.value?.objetivos?.map(o => ({ 
      id: o.id, 
      pontuacaoMeta: o.pontuacaoMeta 
    })))
  } catch (error: any) {
    console.error('❌ Error loading programa:', error)
    programa.value = null
  } finally {
    loading.value = false
  }
}

// Watchers
watch(
  () => props.isOpen,
  (newVal) => {
    if (newVal && props.programaId) {
      loadPrograma()
    } else {
      programa.value = null
    }
  },
  { immediate: true }
)

watch(
  () => props.programaId,
  (newVal) => {
    if (newVal && props.isOpen) {
      loadPrograma()
    }
  }
)

// Expor função para o componente pai
defineExpose({
  loadPrograma
})
</script>

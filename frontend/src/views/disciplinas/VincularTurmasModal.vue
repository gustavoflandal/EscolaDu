<template>
  <div v-if="isOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div class="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] flex flex-col">
      <!-- Header -->
      <div class="bg-white border-b px-6 py-4 flex justify-between items-center flex-shrink-0">
        <div>
          <h2 class="text-xl font-bold text-gray-900">Turmas/Disciplinas</h2>
          <p v-if="disciplina" class="text-sm text-gray-500">{{ disciplina.nome }}</p>
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

      <!-- Loading -->
      <div v-if="loading" class="flex items-center justify-center py-12 flex-1">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>

      <!-- Content -->
      <div v-else class="p-6 flex-1 overflow-y-auto">
        <!-- Formulário para Vincular Nova Turma -->
        <div class="mb-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Vincular Nova Turma</h3>
          
          <div class="space-y-4">
            <!-- Turma -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Turma *
              </label>
              <select
                v-model="formData.turmaId"
                class="input"
                required
                :disabled="saving || turmasDisponiveis.length === 0"
              >
                <option value="">Selecione uma turma</option>
                <option v-for="turma in turmasDisponiveis" :key="turma.id" :value="turma.id">
                  {{ formatTurmaOption(turma) }}
                </option>
              </select>
              <p v-if="turmasDisponiveis.length === 0" class="text-xs text-gray-500 mt-1">
                Todas as turmas já estão vinculadas a esta disciplina
              </p>
            </div>

            <!-- Professor -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Professor *
              </label>
              <select
                v-model="formData.professorId"
                class="input"
                required
                :disabled="saving || loadingProfessores"
              >
                <option value="">Selecione um professor</option>
                <option v-for="prof in professores" :key="prof.id" :value="prof.id">
                  {{ prof.user?.name }}
                </option>
              </select>
            </div>

            <!-- Horários (opcional) -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Dia da Semana
                </label>
                <select v-model.number="formData.diaSemana" class="input" :disabled="saving">
                  <option :value="undefined">Selecione</option>
                  <option :value="1">Segunda-feira</option>
                  <option :value="2">Terça-feira</option>
                  <option :value="3">Quarta-feira</option>
                  <option :value="4">Quinta-feira</option>
                  <option :value="5">Sexta-feira</option>
                  <option :value="6">Sábado</option>
                  <option :value="7">Domingo</option>
                </select>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Horário Início
                </label>
                <input
                  v-model="formData.horarioInicio"
                  type="time"
                  class="input"
                  :disabled="saving"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Horário Fim
                </label>
                <input
                  v-model="formData.horarioFim"
                  type="time"
                  class="input"
                  :disabled="saving"
                />
              </div>
            </div>

            <!-- Error Message -->
            <div v-if="errorMessage" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {{ errorMessage }}
            </div>
          </div>
        </div>

        <!-- Turmas Vinculadas -->
        <div v-if="turmasVinculadas.length > 0">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Turmas Vinculadas</h3>
          <div class="border border-gray-200 rounded-lg overflow-hidden">
            <div class="overflow-auto max-h-[250px]">
              <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50 sticky top-0">
                  <tr>
                    <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Turma</th>
                    <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Série</th>
                    <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Professor</th>
                    <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Horário</th>
                    <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Ações</th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  <tr v-for="vinculo in turmasVinculadas" :key="vinculo.id" class="hover:bg-gray-50">
                    <td class="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                      {{ getTurmaInfo(vinculo) }}
                    </td>
                    <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                      {{ getSerieInfo(vinculo) }}
                    </td>
                    <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                      {{ vinculo.professor?.user?.name || '-' }}
                    </td>
                    <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                      <span v-if="vinculo.diaSemana && vinculo.horarioInicio">
                        {{ getDiaSemanaLabel(vinculo.diaSemana) }} {{ vinculo.horarioInicio }}-{{ vinculo.horarioFim }}
                      </span>
                      <span v-else>-</span>
                    </td>
                    <td class="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        @click="confirmDesvincular(vinculo)"
                        class="text-red-600 hover:text-red-900"
                        title="Desvincular"
                      >
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="bg-gray-50 border-t px-6 py-3 flex justify-end gap-3 flex-shrink-0">
        <button
          type="button"
          @click="resetForm"
          class="btn btn-secondary"
          :disabled="saving"
        >
          Limpar
        </button>
        <button
          @click="handleVincular"
          class="btn btn-primary"
          :disabled="saving || !isFormValid || turmasDisponiveis.length === 0"
        >
          <span v-if="saving">Vinculando...</span>
          <span v-else>Vincular Turma</span>
        </button>
        <button @click="$emit('close')" class="btn btn-secondary">
          Fechar
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useToast } from 'vue-toastification'
import disciplinasService from '@/services/disciplinas.service'
import { professoresService } from '@/services/professores.service'
import type { Disciplina } from '@/types'

const props = defineProps<{
  disciplina: Disciplina | null
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'saved'): void
}>()

const toast = useToast()
const loading = ref(false)
const saving = ref(false)
const loadingProfessores = ref(false)
const errorMessage = ref('')

const turmasVinculadas = ref<any[]>([])
const turmasDisponiveis = ref<any[]>([])
const professores = ref<any[]>([])

const formData = ref({
  turmaId: '',
  professorId: '',
  diaSemana: undefined as number | undefined,
  horarioInicio: '',
  horarioFim: ''
})

const isOpen = computed(() => !!props.disciplina)

const isFormValid = computed(() => {
  return formData.value.turmaId && formData.value.professorId
})

function getDiaSemanaLabel(dia: number): string {
  const dias = ['', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom']
  return dias[dia] || ''
}

function getTurmaInfo(vinculo: any): string {
  if (typeof vinculo.turma === 'string') {
    return vinculo.turma
  }
  if (vinculo.turma && typeof vinculo.turma === 'object') {
    const codigo = vinculo.turma.codigo || ''
    const nome = vinculo.turma.nome || ''
    return codigo && nome ? `${codigo} - ${nome}` : (codigo || nome || '-')
  }
  return '-'
}

function getSerieInfo(vinculo: any): string {
  if (vinculo.turma && typeof vinculo.turma === 'object') {
    const serie = vinculo.turma.serie
    if (serie && typeof serie === 'object') {
      return serie.nome || serie.codigo || '-'
    }
  }
  return '-'
}

function formatTurmaOption(turma: any): string {
  if (typeof turma === 'string') {
    return turma
  }
  if (turma && typeof turma === 'object') {
    const codigo = turma.codigo || ''
    const nome = turma.nome || ''
    
    // A série é um objeto com { codigo, nome, ordem }
    let serieTexto = ''
    if (turma.serie && typeof turma.serie === 'object') {
      serieTexto = turma.serie.nome || turma.serie.codigo || ''
    }
    
    if (codigo && serieTexto && nome) {
      return `${codigo} - ${serieTexto} - ${nome}`
    }
    if (codigo && nome) {
      return `${codigo} - ${nome}`
    }
    return codigo || nome || '-'
  }
  return '-'
}

async function loadData() {
  if (!props.disciplina) return

  loading.value = true
  try {
    // Carregar turmas vinculadas e disponíveis
    const [vinculadas, disponiveis] = await Promise.all([
      disciplinasService.getTurmas(props.disciplina.id),
      disciplinasService.getTurmasDisponiveis(props.disciplina.id)
    ])

    turmasVinculadas.value = vinculadas
    turmasDisponiveis.value = disponiveis
  } catch (error: any) {
    console.error('Erro ao carregar dados:', error)
    toast.error('Erro ao carregar dados das turmas')
  } finally {
    loading.value = false
  }
}

async function loadProfessores() {
  loadingProfessores.value = true
  try {
    const response = await professoresService.list({ active: true, limit: 1000 })
    professores.value = response.data.data || []
  } catch (error) {
    console.error('Erro ao carregar professores:', error)
    toast.error('Erro ao carregar professores')
  } finally {
    loadingProfessores.value = false
  }
}

async function handleVincular() {
  if (!isFormValid.value || !props.disciplina) return

  saving.value = true
  errorMessage.value = ''

  try {
    await disciplinasService.vincularTurma(props.disciplina.id, {
      turmaId: formData.value.turmaId,
      professorId: formData.value.professorId,
      diaSemana: formData.value.diaSemana,
      horarioInicio: formData.value.horarioInicio || undefined,
      horarioFim: formData.value.horarioFim || undefined
    })

    toast.success('Turma vinculada com sucesso!')
    resetForm()
    await loadData() // Recarregar listas
    emit('saved')
  } catch (error: any) {
    console.error('Erro ao vincular turma:', error)
    const backendMessage = error.response?.data?.error?.message || error.response?.data?.message || ''
    
    // Verificar se é erro de conflito de horário
    if (backendMessage.includes('Conflito de horário')) {
      errorMessage.value = 'Erro ao vincular a turma - Conflito de agenda'
      toast.error(errorMessage.value)
    } else {
      errorMessage.value = backendMessage || 'Erro ao vincular turma'
      toast.error(errorMessage.value)
    }
  } finally {
    saving.value = false
  }
}

async function confirmDesvincular(vinculo: any) {
  if (!props.disciplina) return

  try {
    await disciplinasService.desvincularTurma(props.disciplina.id, vinculo.turmaId)
    toast.success('Turma desvinculada com sucesso!')
    await loadData()
  } catch (error: any) {
    console.error('Erro ao desvincular turma:', error)
    toast.error(error.response?.data?.message || 'Erro ao desvincular turma')
  }
}

function resetForm() {
  formData.value = {
    turmaId: '',
    professorId: '',
    diaSemana: undefined,
    horarioInicio: '',
    horarioFim: ''
  }
  errorMessage.value = ''
}

watch(() => props.disciplina, (newVal) => {
  if (newVal) {
    loadData()
    loadProfessores()
    resetForm()
  }
}, { immediate: true })

onMounted(() => {
  if (props.disciplina) {
    loadData()
    loadProfessores()
  }
})
</script>

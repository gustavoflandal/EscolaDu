<template>
  <div class="fixed inset-0 z-50 overflow-y-auto" @click.self="emit('close')">
    <div class="flex items-center justify-center min-h-screen px-4">
      <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>

      <div class="relative bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        <!-- Header -->
        <div class="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-xl font-bold text-white">Lançar Frequência</h3>
              <p class="text-blue-100 text-sm mt-1">
                {{ aula ? formatDate(aula.data) : '' }} • {{ aula?.horaInicio }} - {{ aula?.horaFim }}
              </p>
              <p class="text-blue-100 text-sm">
                {{ aula?.turma?.codigo }} - {{ aula?.turma?.nome }} • {{ aula?.turmaDisciplina?.disciplina?.nome }}
              </p>
            </div>
            <button @click="emit('close')" class="text-white hover:text-gray-200">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <!-- Body -->
        <div class="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          <!-- Loading -->
          <div v-if="loading" class="text-center py-8">
            <p class="text-gray-600">Carregando alunos...</p>
          </div>

          <!-- Legenda -->
          <div v-else class="mb-4 flex gap-4 text-sm">
            <div class="flex items-center gap-2">
              <span class="px-3 py-1 rounded-full bg-green-100 text-green-800 font-medium">P</span>
              <span class="text-gray-600">Presente</span>
            </div>
            <div class="flex items-center gap-2">
              <span class="px-3 py-1 rounded-full bg-red-100 text-red-800 font-medium">F</span>
              <span class="text-gray-600">Falta</span>
            </div>
            <div class="flex items-center gap-2">
              <span class="px-3 py-1 rounded-full bg-yellow-100 text-yellow-800 font-medium">J</span>
              <span class="text-gray-600">Justificada</span>
            </div>
          </div>

          <!-- Ações em Massa -->
          <div v-if="!loading" class="mb-4 flex gap-2">
            <button
              @click="marcarTodos('P')"
              class="btn btn-sm bg-green-600 hover:bg-green-700 text-white"
            >
              Marcar Todos Presentes
            </button>
            <button
              @click="marcarTodos('F')"
              class="btn btn-sm bg-red-600 hover:bg-red-700 text-white"
            >
              Marcar Todos Faltas
            </button>
          </div>

          <!-- Lista de Alunos -->
          <div v-if="!loading" class="space-y-2">
            <div
              v-for="registro in registros"
              :key="registro.alunoId"
              class="border rounded-lg p-4 hover:bg-gray-50"
            >
              <div class="flex items-center justify-between gap-4">
                <!-- Dados do Aluno -->
                <div class="flex-1 min-w-0">
                  <p class="font-medium text-gray-900 truncate">
                    {{ registro.aluno?.nome || 'Aluno não encontrado' }}
                  </p>
                  <p class="text-sm text-gray-500">
                    Matrícula: {{ registro.aluno?.matricula }}
                  </p>
                </div>

                <!-- Botões de Status -->
                <div class="flex gap-2">
                  <button
                    @click="setStatus(registro.alunoId, 'P')"
                    :class="[
                      'px-4 py-2 rounded-lg font-medium transition-colors',
                      registro.status === 'P'
                        ? 'bg-green-600 text-white'
                        : 'bg-green-100 text-green-800 hover:bg-green-200'
                    ]"
                  >
                    P
                  </button>
                  <button
                    @click="setStatus(registro.alunoId, 'F')"
                    :class="[
                      'px-4 py-2 rounded-lg font-medium transition-colors',
                      registro.status === 'F'
                        ? 'bg-red-600 text-white'
                        : 'bg-red-100 text-red-800 hover:bg-red-200'
                    ]"
                  >
                    F
                  </button>
                  <button
                    @click="setStatus(registro.alunoId, 'J')"
                    :class="[
                      'px-4 py-2 rounded-lg font-medium transition-colors',
                      registro.status === 'J'
                        ? 'bg-yellow-600 text-white'
                        : 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                    ]"
                  >
                    J
                  </button>
                </div>
              </div>

              <!-- Campo de Observação -->
              <div class="mt-3">
                <input
                  v-model="registro.observacao"
                  type="text"
                  class="input text-sm"
                  placeholder="Observação (opcional)"
                />
              </div>
            </div>
          </div>

          <!-- Resumo -->
          <div v-if="!loading && registros.length > 0" class="mt-6 p-4 bg-blue-50 rounded-lg">
            <h4 class="font-medium text-gray-900 mb-2">Resumo</h4>
            <div class="grid grid-cols-3 gap-4 text-sm">
              <div>
                <span class="text-gray-600">Presentes:</span>
                <span class="ml-2 font-semibold text-green-600">{{ contadores.presentes }}</span>
              </div>
              <div>
                <span class="text-gray-600">Faltas:</span>
                <span class="ml-2 font-semibold text-red-600">{{ contadores.faltas }}</span>
              </div>
              <div>
                <span class="text-gray-600">Justificadas:</span>
                <span class="ml-2 font-semibold text-yellow-600">{{ contadores.justificadas }}</span>
              </div>
            </div>
            <div class="mt-2 text-sm text-gray-600">
              Total de alunos: {{ registros.length }}
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="bg-gray-50 px-6 py-4 flex justify-end gap-3">
          <button @click="emit('close')" class="btn btn-secondary">
            Cancelar
          </button>
          <button
            @click="salvarFrequencia"
            :disabled="saving || registros.length === 0"
            class="btn btn-primary"
          >
            {{ saving ? 'Salvando...' : 'Salvar Frequência' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useToast } from 'vue-toastification'
import frequenciaService, { type Aula, type LancarChamadaInput } from '@/services/frequencia.service'

interface Props {
  aula: Aula | null
}

const props = defineProps<Props>()
const emit = defineEmits<{
  close: []
  saved: []
}>()

const toast = useToast()

interface RegistroLocal {
  alunoId: string
  status: 'P' | 'F' | 'J'
  observacao?: string
  aluno?: {
    id: string
    nome: string
    matricula: string
  }
}

const loading = ref(false)
const saving = ref(false)
const registros = ref<RegistroLocal[]>([])

const contadores = computed(() => {
  return {
    presentes: registros.value.filter(r => r.status === 'P').length,
    faltas: registros.value.filter(r => r.status === 'F').length,
    justificadas: registros.value.filter(r => r.status === 'J').length
  }
})

async function loadAlunos() {
  if (!props.aula) return
  
  loading.value = true
  try {
    // Busca alunos da turma através do serviço
    const { default: turmasService } = await import('@/services/turmas.service')
    const turmaDetalhes = await turmasService.getById(props.aula.turmaId)
    const alunos = turmaDetalhes.alunos?.map((m: any) => m.aluno) || []

    // Busca frequência já lançada (se existir)
    let frequenciaExistente: any[] = []
    try {
      const freq = await frequenciaService.getFrequenciaAula(props.aula.id)
      frequenciaExistente = freq.registros || []
    } catch (error) {
      // Frequência ainda não foi lançada
    }

    // Inicializa registros
    registros.value = alunos.map((aluno: any) => {
      const registroExistente = frequenciaExistente.find((r: any) => r.alunoId === aluno.id)
      return {
        alunoId: aluno.id,
        status: registroExistente?.status || 'P', // Default: Presente
        observacao: registroExistente?.observacao || '',
        aluno: {
          id: aluno.id,
          nome: aluno.nome,
          matricula: aluno.matricula
        }
      }
    })
  } catch (error: any) {
    toast.error(error.message || 'Erro ao carregar alunos')
    emit('close')
  } finally {
    loading.value = false
  }
}

function setStatus(alunoId: string, status: 'P' | 'F' | 'J') {
  const registro = registros.value.find(r => r.alunoId === alunoId)
  if (registro) {
    registro.status = status
  }
}

function marcarTodos(status: 'P' | 'F' | 'J') {
  registros.value.forEach(registro => {
    registro.status = status
  })
}

function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('pt-BR')
}

async function salvarFrequencia() {
  if (registros.value.length === 0) {
    toast.warning('Nenhum aluno para lançar frequência')
    return
  }

  if (!props.aula) return

  saving.value = true
  try {
    const input: LancarChamadaInput = {
      aulaId: props.aula.id,
      registros: registros.value.map(r => ({
        alunoId: r.alunoId,
        status: r.status,
        observacao: r.observacao || undefined
      }))
    }

    await frequenciaService.lancarChamada(input)
    emit('saved')
  } catch (error: any) {
    toast.error(error.response?.data?.message || 'Erro ao salvar frequência')
  } finally {
    saving.value = false
  }
}

onMounted(() => {
  loadAlunos()
})
</script>

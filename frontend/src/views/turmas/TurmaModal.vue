<template>
  <div class="fixed inset-0 z-50 overflow-y-auto">
    <!-- Overlay -->
    <div class="fixed inset-0 bg-black bg-opacity-50 transition-opacity" @click="$emit('close')"></div>

    <!-- Modal -->
    <div class="flex min-h-full items-center justify-center p-4">
      <div class="relative bg-white rounded-lg shadow-xl max-w-2xl w-full">
        <!-- Header -->
        <div class="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 class="text-2xl font-bold text-gray-900">
            {{ isEditing ? 'Editar Turma' : 'Nova Turma' }}
          </h2>
          <button
            @click="$emit('close')"
            class="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Form -->
        <form @submit.prevent="handleSubmit" class="p-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <!-- Código -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Código <span class="text-red-500">*</span>
              </label>
              <input
                v-model="form.codigo"
                type="text"
                class="input"
                placeholder="Ex: 1A"
                required
                maxlength="10"
              />
            </div>

            <!-- Nome -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Nome <span class="text-red-500">*</span>
              </label>
              <input
                v-model="form.nome"
                type="text"
                class="input"
                placeholder="Ex: Turma 1A - Manhã"
                required
                maxlength="100"
              />
            </div>

            <!-- Ano Letivo -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Ano Letivo <span class="text-red-500">*</span>
              </label>
              <select v-model="form.anoLetivoId" class="input" required>
                <option value="">Selecione...</option>
                <option v-for="ano in anosLetivos" :key="ano.id" :value="ano.id">
                  {{ ano.ano }} - {{ formatStatus(ano.status) }}
                </option>
              </select>
            </div>

            <!-- Série -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Série <span class="text-red-500">*</span>
              </label>
              <input
                v-model="form.serie"
                type="text"
                class="input"
                placeholder="Ex: 1º Ano"
                required
                maxlength="50"
              />
            </div>

            <!-- Turno -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Turno <span class="text-red-500">*</span>
              </label>
              <select v-model="form.turno" class="input" required>
                <option value="">Selecione...</option>
                <option value="MANHA">Manhã</option>
                <option value="TARDE">Tarde</option>
                <option value="NOITE">Noite</option>
                <option value="INTEGRAL">Integral</option>
              </select>
            </div>

            <!-- Capacidade Máxima -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Capacidade Máxima <span class="text-red-500">*</span>
              </label>
              <input
                v-model.number="form.capacidadeMaxima"
                type="number"
                class="input"
                placeholder="Ex: 30"
                required
                min="1"
                max="100"
              />
            </div>

            <!-- Sala -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Sala
              </label>
              <input
                v-model="form.sala"
                type="text"
                class="input"
                placeholder="Ex: Sala 101"
                maxlength="50"
              />
            </div>

            <!-- Professor Regente -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Professor Regente
              </label>
              <select v-model="form.professorRegenteId" class="input">
                <option :value="null">Nenhum</option>
                <option v-for="professor in professores" :key="professor.id" :value="professor.id">
                  {{ professor.user?.name || 'Sem nome' }}
                </option>
              </select>
            </div>
          </div>

          <!-- Status (apenas para edição) -->
          <div v-if="isEditing" class="mt-4">
            <label class="flex items-center">
              <input
                v-model="form.active"
                type="checkbox"
                class="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
              />
              <span class="ml-2 text-sm text-gray-700">Turma Ativa</span>
            </label>
          </div>

          <!-- Mensagem de erro -->
          <div v-if="errorMessage" class="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
            <p class="text-sm text-red-600">{{ errorMessage }}</p>
          </div>

          <!-- Botões -->
          <div class="flex justify-end gap-3 mt-6 pt-6 border-t border-gray-200">
            <button
              type="button"
              @click="$emit('close')"
              class="btn btn-secondary"
              :disabled="loading"
            >
              Cancelar
            </button>
            <button
              type="submit"
              class="btn btn-primary"
              :disabled="loading"
            >
              {{ loading ? 'Salvando...' : 'Salvar' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useToast } from 'vue-toastification'
import turmasService from '@/services/turmas.service'
import type { Turma, AnoLetivo, Professor } from '@/types'

interface Props {
  turma?: Turma | null
}

interface Emits {
  (e: 'close'): void
  (e: 'saved'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()
const toast = useToast()

const loading = ref(false)
const errorMessage = ref('')
const anosLetivos = ref<AnoLetivo[]>([])
const professores = ref<Professor[]>([])

const isEditing = computed(() => !!props.turma)

const form = ref({
  codigo: '',
  nome: '',
  anoLetivoId: '',
  serie: '',
  turno: '' as 'MANHA' | 'TARDE' | 'NOITE' | 'INTEGRAL' | '',
  capacidadeMaxima: 30,
  sala: '',
  professorRegenteId: null as string | null,
  active: true
})

function formatStatus(status: string): string {
  const statusMap: Record<string, string> = {
    'ATIVO': 'Ativo',
    'INATIVO': 'Inativo',
    'PLANEJAMENTO': 'Planejamento',
    'ENCERRADO': 'Encerrado'
  }
  return statusMap[status] || status
}

async function loadAnosLetivos() {
  try {
    anosLetivos.value = await turmasService.getAnosLetivos()
  } catch (error) {
    console.error('Erro ao carregar anos letivos:', error)
    toast.error('Erro ao carregar anos letivos')
  }
}

async function loadProfessores() {
  try {
    professores.value = await turmasService.getProfessoresDisponiveis()
  } catch (error) {
    console.error('Erro ao carregar professores:', error)
    toast.error('Erro ao carregar professores')
  }
}

async function handleSubmit() {
  errorMessage.value = ''
  loading.value = true

  try {
    const data: any = {
      codigo: form.value.codigo,
      nome: form.value.nome,
      anoLetivoId: form.value.anoLetivoId,
      serie: form.value.serie,
      turno: form.value.turno || undefined,
      capacidadeMaxima: form.value.capacidadeMaxima,
      sala: form.value.sala || undefined,
      professorRegenteId: form.value.professorRegenteId || undefined,
      ...(isEditing.value && { active: form.value.active })
    }

    if (isEditing.value && props.turma) {
      await turmasService.update(props.turma.id, data)
      toast.success('Turma atualizada com sucesso')
    } else {
      await turmasService.create(data)
      toast.success('Turma criada com sucesso')
    }

    emit('saved')
  } catch (error: any) {
    console.error('Erro ao salvar turma:', error)
    errorMessage.value = error.response?.data?.message || 'Erro ao salvar turma'
  } finally {
    loading.value = false
  }
}

function populateForm() {
  if (props.turma) {
    form.value = {
      codigo: props.turma.codigo,
      nome: props.turma.nome,
      anoLetivoId: props.turma.anoLetivoId,
      serie: props.turma.serie,
      turno: props.turma.turno as 'MANHA' | 'TARDE' | 'NOITE' | 'INTEGRAL' | '',
      capacidadeMaxima: props.turma.capacidadeMaxima,
      sala: props.turma.sala || '',
      professorRegenteId: props.turma.professorRegenteId || null,
      active: props.turma.active
    }
  }
}

onMounted(() => {
  loadAnosLetivos()
  loadProfessores()
  populateForm()
})
</script>

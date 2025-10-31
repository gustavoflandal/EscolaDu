<template>
  <div class="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
    <!-- Overlay -->
    <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" @click="$emit('close')"></div>

    <!-- Modal -->
    <div class="flex min-h-full items-center justify-center p-4">
      <div class="relative transform overflow-hidden rounded-lg bg-white shadow-xl transition-all w-full max-w-3xl">
        <!-- Header -->
        <div class="bg-gray-50 px-6 py-4 border-b border-gray-200">
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-semibold text-gray-900" id="modal-title">
              {{ programa ? 'Editar Programa de Ensino' : 'Novo Programa de Ensino' }}
            </h3>
            <button
              @click="$emit('close')"
              class="text-gray-400 hover:text-gray-500 focus:outline-none"
            >
              <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <!-- Body -->
        <form @submit.prevent="handleSubmit">
          <div class="px-6 py-4 space-y-4 max-h-[70vh] overflow-y-auto">
            <!-- Código -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Código <span class="text-red-500">*</span>
              </label>
              <input
                v-model="form.codigo"
                type="text"
                required
                class="input uppercase"
                placeholder="Ex: PORT-1ANO-2025"
                maxlength="50"
                @input="form.codigo = form.codigo.toUpperCase()"
              />
              <p class="mt-1 text-xs text-gray-500">
                Sugestão: [DISCIPLINA]-[SÉRIE]-[ANO] (ex: MAT-2ANO-2025). Apenas letras maiúsculas, números e hífens.
              </p>
            </div>

            <!-- Nome -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Nome do Programa <span class="text-red-500">*</span>
              </label>
              <input
                v-model="form.nome"
                type="text"
                required
                class="input"
                placeholder="Ex: Programa de Português - 1º Ano"
                maxlength="200"
              />
            </div>

            <!-- Grid: Série, Período, Ano Letivo -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <!-- Série -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Série <span class="text-red-500">*</span>
                </label>
                <select v-model="form.serie" required class="input">
                  <option value="">Selecione...</option>
                  <option value="1º Ano">1º Ano</option>
                  <option value="2º Ano">2º Ano</option>
                  <option value="3º Ano">3º Ano</option>
                  <option value="4º Ano">4º Ano</option>
                  <option value="5º Ano">5º Ano</option>
                  <option value="6º Ano">6º Ano</option>
                  <option value="7º Ano">7º Ano</option>
                  <option value="8º Ano">8º Ano</option>
                  <option value="9º Ano">9º Ano</option>
                </select>
              </div>

              <!-- Período -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Período
                </label>
                <select v-model="form.periodo" class="input">
                  <option value="">Anual</option>
                  <option value="1º Bimestre">1º Bimestre</option>
                  <option value="2º Bimestre">2º Bimestre</option>
                  <option value="3º Bimestre">3º Bimestre</option>
                  <option value="4º Bimestre">4º Bimestre</option>
                  <option value="1º Trimestre">1º Trimestre</option>
                  <option value="2º Trimestre">2º Trimestre</option>
                  <option value="3º Trimestre">3º Trimestre</option>
                  <option value="1º Semestre">1º Semestre</option>
                  <option value="2º Semestre">2º Semestre</option>
                </select>
              </div>

              <!-- Ano Letivo -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Ano Letivo <span class="text-red-500">*</span>
                </label>
                <input
                  v-model.number="form.anoLetivo"
                  type="number"
                  required
                  class="input"
                  :min="currentYear - 1"
                  :max="currentYear + 1"
                  placeholder="2025"
                />
              </div>
            </div>

            <!-- Carga Horária -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Carga Horária (horas)
              </label>
              <input
                v-model.number="form.cargaHoraria"
                type="number"
                class="input"
                min="0"
                placeholder="Ex: 80"
              />
              <p class="mt-1 text-xs text-gray-500">
                Carga horária total do programa em horas
              </p>
            </div>

            <!-- Descrição -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Descrição
              </label>
              <textarea
                v-model="form.descricao"
                rows="4"
                class="input"
                placeholder="Descreva o programa de ensino, seus objetivos gerais, metodologia..."
              ></textarea>
            </div>

            <!-- Observações -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Observações
              </label>
              <textarea
                v-model="form.observacoes"
                rows="3"
                class="input"
                placeholder="Observações adicionais, materiais necessários, etc..."
              ></textarea>
            </div>

            <!-- Status -->
            <div class="flex items-center">
              <input
                v-model="form.active"
                type="checkbox"
                id="programa-active"
                class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label for="programa-active" class="ml-2 block text-sm text-gray-700">
                Programa ativo
              </label>
            </div>
          </div>

          <!-- Footer -->
          <div class="bg-gray-50 px-6 py-4 border-t border-gray-200 flex justify-end gap-3">
            <button
              type="button"
              @click="$emit('close')"
              class="btn btn-secondary"
              :disabled="saving"
            >
              Cancelar
            </button>
            <button
              type="submit"
              class="btn btn-primary"
              :disabled="saving"
            >
              <span v-if="saving">Salvando...</span>
              <span v-else>{{ programa ? 'Atualizar' : 'Criar Programa' }}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from 'vue'
import { useToast } from 'vue-toastification'
import programasEnsinoService from '@/services/programas-ensino.service'

// Props
interface Props {
  programa?: any
  disciplinaId: string
}

const props = defineProps<Props>()

// Emits
const emit = defineEmits<{
  (e: 'close'): void
  (e: 'saved'): void
}>()

const toast = useToast()
const saving = ref(false)
const currentYear = new Date().getFullYear()

// Form data
const form = reactive({
  codigo: '',
  nome: '',
  descricao: '',
  serie: '',
  periodo: '',
  anoLetivo: currentYear,
  cargaHoraria: null as number | null,
  observacoes: '',
  active: true
})

// Preencher form ao editar
watch(() => props.programa, (programa) => {
  if (programa) {
    form.codigo = programa.codigo || ''
    form.nome = programa.nome || ''
    form.descricao = programa.descricao || ''
    form.serie = programa.serie || ''
    form.periodo = programa.periodo || ''
    form.anoLetivo = programa.anoLetivo || currentYear
    form.cargaHoraria = programa.cargaHoraria || null
    form.observacoes = programa.observacoes || ''
    form.active = programa.active ?? true
  }
}, { immediate: true })

// Submit
const handleSubmit = async () => {
  try {
    saving.value = true

    const data = {
      codigo: form.codigo.toUpperCase().trim(),
      nome: form.nome.trim(),
      disciplinaId: props.disciplinaId,
      serie: form.serie,
      periodo: form.periodo || null,
      anoLetivo: form.anoLetivo,
      cargaHoraria: form.cargaHoraria || null,
      observacoes: form.observacoes || null,
      descricao: form.descricao || null,
      active: form.active
    }

    console.log('Enviando dados:', data)

    if (props.programa) {
      await programasEnsinoService.update(props.programa.id, data)
      toast.success('Programa de ensino atualizado com sucesso')
    } else {
      await programasEnsinoService.create(data)
      toast.success('Programa de ensino criado com sucesso')
    }

    emit('saved')
  } catch (error: any) {
    console.error('Erro ao salvar programa:', error)
    const errorMessage = error.response?.data?.error?.message || 
                        error.response?.data?.message ||
                        'Erro ao salvar programa de ensino'
    toast.error(errorMessage)
    
    // Mostrar detalhes do erro no console
    if (error.response?.data) {
      console.error('Detalhes do erro:', error.response.data)
    }
  } finally {
    saving.value = false
  }
}
</script>

<style scoped>
.uppercase {
  text-transform: uppercase;
}
</style>

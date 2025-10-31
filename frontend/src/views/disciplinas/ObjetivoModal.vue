<template>
  <div class="fixed inset-0 z-50 overflow-y-auto">
    <!-- Overlay -->
    <div class="fixed inset-0 bg-black bg-opacity-50 transition-opacity" @click="$emit('close')"></div>

    <!-- Modal -->
    <div class="flex min-h-full items-center justify-center p-4">
      <div class="relative bg-white rounded-lg shadow-xl max-w-3xl w-full">
        <!-- Header -->
        <div class="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 class="text-2xl font-bold text-gray-900">
            {{ isEditing ? 'Editar Objetivo de Aprendizagem' : 'Novo Objetivo de Aprendizagem' }}
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
            <!-- Código BNCC -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Código BNCC <span class="text-red-500">*</span>
              </label>
              <input
                v-model="form.codigoBNCC"
                type="text"
                class="input"
                placeholder="Ex: EF01MA01"
                required
                maxlength="50"
              />
              <p class="text-xs text-gray-500 mt-1">
                Código oficial da Base Nacional Comum Curricular
              </p>
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

            <!-- Período -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Período <span class="text-red-500">*</span>
              </label>
              <select v-model="form.periodo" class="input" required>
                <option value="">Selecione...</option>
                <option value="1º Bimestre">1º Bimestre</option>
                <option value="2º Bimestre">2º Bimestre</option>
                <option value="3º Bimestre">3º Bimestre</option>
                <option value="4º Bimestre">4º Bimestre</option>
                <option value="1º Trimestre">1º Trimestre</option>
                <option value="2º Trimestre">2º Trimestre</option>
                <option value="3º Trimestre">3º Trimestre</option>
                <option value="1º Semestre">1º Semestre</option>
                <option value="2º Semestre">2º Semestre</option>
                <option value="Anual">Anual</option>
              </select>
            </div>
          </div>

          <!-- Descrição -->
          <div class="mt-4">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Descrição <span class="text-red-500">*</span>
            </label>
            <textarea
              v-model="form.descricao"
              class="input min-h-[100px]"
              placeholder="Descreva o objetivo de aprendizagem conforme BNCC"
              required
              maxlength="500"
              rows="4"
            ></textarea>
            <p class="text-xs text-gray-500 mt-1">
              {{ form.descricao.length }} / 500 caracteres
            </p>
          </div>

          <!-- Competência (opcional) -->
          <div class="mt-4">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Competência
            </label>
            <input
              v-model="form.competencia"
              type="text"
              class="input"
              placeholder="Ex: Competência 1 - Comunicação"
              maxlength="200"
            />
            <p class="text-xs text-gray-500 mt-1">
              Competência geral ou específica da BNCC relacionada
            </p>
          </div>

          <!-- Habilidade (opcional) -->
          <div class="mt-4">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Habilidade
            </label>
            <textarea
              v-model="form.habilidade"
              class="input min-h-[80px]"
              placeholder="Descreva a habilidade específica a ser desenvolvida"
              maxlength="500"
              rows="3"
            ></textarea>
            <p class="text-xs text-gray-500 mt-1">
              {{ form.habilidade?.length || 0 }} / 500 caracteres
            </p>
          </div>

          <!-- Status (apenas para edição) -->
          <div v-if="isEditing" class="mt-4">
            <label class="flex items-center">
              <input
                v-model="form.active"
                type="checkbox"
                class="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
              />
              <span class="ml-2 text-sm text-gray-700">Objetivo Ativo</span>
            </label>
          </div>

          <!-- Botões -->
          <div class="flex justify-end gap-3 mt-6 pt-6 border-t border-gray-200">
            <button
              type="button"
              @click="$emit('close')"
              class="btn btn-secondary"
            >
              Cancelar
            </button>
            <button
              type="submit"
              :disabled="saving"
              class="btn btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {{ saving ? 'Salvando...' : (isEditing ? 'Salvar' : 'Criar') }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useToast } from 'vue-toastification'
import disciplinasService from '@/services/disciplinas.service'
import type { ObjetivoAprendizagem } from '@/types'

// Props
const props = defineProps<{
  objetivo?: ObjetivoAprendizagem
  disciplinaId: string
}>()

// Emits
const emit = defineEmits<{
  (e: 'close'): void
  (e: 'saved'): void
}>()

const toast = useToast()

// Estado
const saving = ref(false)

// Form
const form = ref({
  codigoBNCC: '',
  descricao: '',
  serie: '',
  periodo: '',
  competencia: '' as string | undefined,
  habilidade: '' as string | undefined,
  active: true
})

// Computed
const isEditing = computed(() => !!props.objetivo)

// Inicializar form
const initForm = () => {
  if (props.objetivo) {
    form.value = {
      codigoBNCC: props.objetivo.codigoBNCC,
      descricao: props.objetivo.descricao,
      serie: props.objetivo.serie,
      periodo: props.objetivo.periodo,
      competencia: props.objetivo.competencia || undefined,
      habilidade: props.objetivo.habilidade || undefined,
      active: props.objetivo.active
    }
  }
}

// Submit
const handleSubmit = async () => {
  try {
    saving.value = true

    if (isEditing.value && props.objetivo) {
      await disciplinasService.updateObjetivo(props.objetivo.id, form.value)
      toast.success('Objetivo atualizado com sucesso')
    } else {
      await disciplinasService.createObjetivo(props.disciplinaId, form.value)
      toast.success('Objetivo criado com sucesso')
    }

    emit('saved')
  } catch (error: any) {
    const errorMessage = error.response?.data?.error?.message || 'Erro ao salvar objetivo'
    toast.error(errorMessage)
  } finally {
    saving.value = false
  }
}

// Lifecycle
onMounted(() => {
  initForm()
})
</script>

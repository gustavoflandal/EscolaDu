<template>
  <div v-if="isOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div class="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
      <!-- Header -->
      <div class="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
        <h2 class="text-xl font-bold text-gray-900">
          {{ isEditMode ? 'Editar Objetivo de Aprendizagem' : 'Novo Objetivo de Aprendizagem' }}
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
      <form @submit.prevent="handleSubmit" class="p-6 space-y-4">
        <!-- Código BNCC -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Código BNCC *
          </label>
          <input
            v-model="formData.codigoBNCC"
            @input="formData.codigoBNCC = formData.codigoBNCC.toUpperCase()"
            type="text"
            class="input"
            placeholder="Ex: EF05MA01"
            required
            :disabled="saving"
          />
          <p class="text-xs text-gray-500 mt-1">
            Use apenas letras maiúsculas, números e hífens
          </p>
        </div>

        <!-- Descrição -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Descrição *
          </label>
          <textarea
            v-model="formData.descricao"
            rows="4"
            class="input"
            placeholder="Descreva o objetivo de aprendizagem..."
            required
            :disabled="saving"
          ></textarea>
          <p class="text-xs text-gray-500 mt-1">
            {{ formData.descricao.length }} caracteres (mínimo 10)
          </p>
        </div>

        <!-- Ordem -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Ordem de Apresentação
          </label>
          <input
            v-model.number="formData.ordem"
            type="number"
            min="1"
            class="input"
            placeholder="Deixe vazio para adicionar ao final"
            :disabled="saving"
          />
          <p class="text-xs text-gray-500 mt-1">
            Ordem de apresentação do objetivo no programa
          </p>
        </div>

        <!-- Competência -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Competência
          </label>
          <textarea
            v-model="formData.competencia"
            rows="2"
            class="input"
            placeholder="Competência relacionada (opcional)"
            :disabled="saving"
          ></textarea>
        </div>

        <!-- Habilidade -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Habilidade
          </label>
          <textarea
            v-model="formData.habilidade"
            rows="2"
            class="input"
            placeholder="Habilidade relacionada (opcional)"
            :disabled="saving"
          ></textarea>
        </div>

        <!-- Pontuação Meta -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Pontuação Meta
          </label>
          <input
            v-model.number="formData.pontuacaoMeta"
            type="number"
            min="0"
            max="999.99"
            step="0.01"
            class="input"
            placeholder="Ex: 8.50"
            :disabled="saving"
          />
          <p class="text-xs text-gray-500 mt-1">
            Pontuação esperada para atingir este objetivo (opcional)
          </p>
        </div>

        <!-- Status (apenas em modo de edição) -->
        <div v-if="isEditMode" class="flex items-center">
          <input
            id="active"
            v-model="formData.active"
            type="checkbox"
            class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            :disabled="saving"
          />
          <label for="active" class="ml-2 block text-sm text-gray-700">
            Objetivo ativo
          </label>
        </div>

        <!-- Error Message -->
        <div v-if="errorMessage" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {{ errorMessage }}
        </div>

        <!-- Actions -->
        <div class="flex justify-end gap-3 pt-4 border-t">
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
            :disabled="saving || !isFormValid"
          >
            <span v-if="saving" class="flex items-center gap-2">
              <svg class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Salvando...
            </span>
            <span v-else>
              {{ isEditMode ? 'Atualizar' : 'Criar' }} Objetivo
            </span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useToast } from 'vue-toastification'
import objetivosService from '@/services/objetivos-aprendizagem.service'
import type { ObjetivoAprendizagem, CreateObjetivoInput, UpdateObjetivoInput } from '@/services/objetivos-aprendizagem.service'

const props = defineProps<{
  isOpen: boolean
  programaEnsinoId: string
  objetivo?: ObjetivoAprendizagem
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'saved'): void
}>()

const toast = useToast()
const saving = ref(false)
const errorMessage = ref('')

const isEditMode = computed(() => !!props.objetivo)

const formData = ref({
  codigoBNCC: '',
  descricao: '',
  ordem: undefined as number | undefined,
  competencia: '',
  habilidade: '',
  pontuacaoMeta: undefined as number | undefined,
  active: true,
})

const isFormValid = computed(() => {
  return (
    formData.value.codigoBNCC.length > 0 &&
    formData.value.descricao.length >= 10
  )
})

// Resetar form quando modal abre/fecha
watch(() => props.isOpen, (newVal) => {
  if (newVal) {
    if (props.objetivo) {
      // Modo edição: preencher com dados existentes
      formData.value = {
        codigoBNCC: props.objetivo.codigoBNCC,
        descricao: props.objetivo.descricao,
        ordem: props.objetivo.ordem,
        competencia: props.objetivo.competencia || '',
        habilidade: props.objetivo.habilidade || '',
        pontuacaoMeta: props.objetivo.pontuacaoMeta ? Number(props.objetivo.pontuacaoMeta) : undefined,
        active: props.objetivo.active,
      }
    } else {
      // Modo criação: limpar form
      formData.value = {
        codigoBNCC: '',
        descricao: '',
        ordem: undefined,
        competencia: '',
        habilidade: '',
        pontuacaoMeta: undefined,
        active: true,
      }
    }
    errorMessage.value = ''
  }
})

const handleSubmit = async () => {
  if (!isFormValid.value) return

  saving.value = true
  errorMessage.value = ''

  try {
    console.log('💾 Submitting form:', { isEditMode: isEditMode.value, formData: formData.value })

    if (isEditMode.value && props.objetivo) {
      // Atualizar objetivo existente
      const updateData: UpdateObjetivoInput = {}
      
      // Sempre enviar código e descrição (obrigatórios)
      updateData.codigoBNCC = formData.value.codigoBNCC
      updateData.descricao = formData.value.descricao
      
      // Enviar ordem se tiver valor
      if (formData.value.ordem) {
        updateData.ordem = formData.value.ordem
      }
      
      // Enviar competencia se tiver valor ou se mudou para vazio
      if (formData.value.competencia || props.objetivo.competencia) {
        updateData.competencia = formData.value.competencia || null
      }
      
      // Enviar habilidade se tiver valor ou se mudou para vazio
      if (formData.value.habilidade || props.objetivo.habilidade) {
        updateData.habilidade = formData.value.habilidade || null
      }
      
      // Enviar pontuacaoMeta se tiver valor válido ou null
      if (formData.value.pontuacaoMeta !== undefined && !isNaN(formData.value.pontuacaoMeta as number)) {
        updateData.pontuacaoMeta = formData.value.pontuacaoMeta
      } else if (formData.value.pontuacaoMeta === undefined || isNaN(formData.value.pontuacaoMeta as number)) {
        updateData.pontuacaoMeta = null
      }
      
      // Enviar active
      updateData.active = formData.value.active
      
      console.log('📤 Update data:', updateData)
      await objetivosService.update(props.objetivo.id, updateData)
      toast.success('Objetivo atualizado com sucesso!')
    } else {
      // Criar novo objetivo
      const createData: CreateObjetivoInput = {
        codigoBNCC: formData.value.codigoBNCC,
        descricao: formData.value.descricao,
        programaEnsinoId: props.programaEnsinoId,
        ordem: formData.value.ordem || undefined,
        competencia: formData.value.competencia || null,
        habilidade: formData.value.habilidade || null,
        pontuacaoMeta: (formData.value.pontuacaoMeta && !isNaN(formData.value.pontuacaoMeta)) ? formData.value.pontuacaoMeta : null,
      }
      await objetivosService.create(createData)
      toast.success('Objetivo criado com sucesso!')
    }

    emit('saved')
    emit('close')
  } catch (error: any) {
    console.error('❌ Error saving objetivo:', error)
    errorMessage.value = error.response?.data?.error?.message || 'Erro ao salvar objetivo'
    toast.error(errorMessage.value)
  } finally {
    saving.value = false
  }
}
</script>

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
            {{ isEditing ? 'Editar Disciplina' : 'Nova Disciplina' }}
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
                placeholder="Ex: MAT"
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
                placeholder="Ex: Matemática"
                required
                maxlength="100"
              />
            </div>

            <!-- Área de Conhecimento -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Área de Conhecimento
              </label>
              <select v-model="form.areaConhecimento" class="input">
                <option value="">Nenhuma</option>
                <option v-for="area in areasConhecimento" :key="area" :value="area">
                  {{ area }}
                </option>
                <option value="_custom">+ Adicionar nova área</option>
              </select>
              <!-- Input customizado para nova área -->
              <input
                v-if="form.areaConhecimento === '_custom'"
                v-model="customArea"
                type="text"
                class="input mt-2"
                placeholder="Digite a nova área"
                maxlength="100"
              />
            </div>

            <!-- Carga Horária Semanal -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Carga Horária Semanal <span class="text-red-500">*</span>
              </label>
              <input
                v-model.number="form.cargaHorariaSemanal"
                type="number"
                class="input"
                placeholder="Ex: 5"
                required
                min="1"
                max="40"
              />
              <p class="text-xs text-gray-500 mt-1">Horas por semana</p>
            </div>
          </div>

          <!-- Descrição -->
          <div class="mt-4">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Descrição
            </label>
            <textarea
              v-model="form.descricao"
              class="input min-h-[100px]"
              placeholder="Descrição da disciplina, conteúdos abordados, etc."
              maxlength="500"
              rows="4"
            ></textarea>
            <p class="text-xs text-gray-500 mt-1">
              {{ form.descricao?.length || 0 }} / 500 caracteres
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
              <span class="ml-2 text-sm text-gray-700">Disciplina Ativa</span>
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
import { ref, computed, onMounted, watch } from 'vue'
import { useToast } from 'vue-toastification'
import disciplinasService from '@/services/disciplinas.service'
import type { Disciplina } from '@/types'

// Props
const props = defineProps<{
  disciplina?: Disciplina
}>()

// Emits
const emit = defineEmits<{
  (e: 'close'): void
  (e: 'saved'): void
}>()

const toast = useToast()

// Estado
const saving = ref(false)
const areasConhecimento = ref<string[]>([])
const customArea = ref('')

// Form
const form = ref({
  codigo: '',
  nome: '',
  areaConhecimento: '' as string | undefined,
  cargaHorariaSemanal: 4,
  descricao: '' as string | undefined,
  active: true
})

// Computed
const isEditing = computed(() => !!props.disciplina)

// Watchers
watch(() => form.value.areaConhecimento, (newValue) => {
  if (newValue !== '_custom') {
    customArea.value = ''
  }
})

watch(customArea, (newValue) => {
  if (newValue && form.value.areaConhecimento === '_custom') {
    // Atualiza a área customizada
  }
})

// Carregar áreas de conhecimento
const loadAreasConhecimento = async () => {
  try {
    areasConhecimento.value = await disciplinasService.getAreasConhecimento()
  } catch (error: any) {
    console.error('Erro ao carregar áreas de conhecimento:', error)
  }
}

// Inicializar form
const initForm = () => {
  if (props.disciplina) {
    form.value = {
      codigo: props.disciplina.codigo,
      nome: props.disciplina.nome,
      areaConhecimento: props.disciplina.areaConhecimento || undefined,
      cargaHorariaSemanal: props.disciplina.cargaHorariaSemanal,
      descricao: props.disciplina.descricao || undefined,
      active: props.disciplina.active
    }
  }
}

// Submit
const handleSubmit = async () => {
  try {
    saving.value = true

    // Se área customizada, usar o valor do input
    const dataToSend = {
      ...form.value,
      areaConhecimento: form.value.areaConhecimento === '_custom' 
        ? customArea.value || undefined
        : form.value.areaConhecimento || undefined
    }

    if (isEditing.value && props.disciplina) {
      await disciplinasService.update(props.disciplina.id, dataToSend)
      toast.success('Disciplina atualizada com sucesso')
    } else {
      await disciplinasService.create(dataToSend)
      toast.success('Disciplina criada com sucesso')
    }

    emit('saved')
  } catch (error: any) {
    const errorMessage = error.response?.data?.error?.message || 'Erro ao salvar disciplina'
    toast.error(errorMessage)
  } finally {
    saving.value = false
  }
}

// Lifecycle
onMounted(() => {
  loadAreasConhecimento()
  initForm()
})
</script>

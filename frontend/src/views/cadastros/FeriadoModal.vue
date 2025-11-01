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
            {{ isEditing ? 'Editar Feriado' : 'Novo Feriado' }}
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
            <!-- Nome -->
            <div class="md:col-span-2">
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Nome do Feriado <span class="text-red-500">*</span>
              </label>
              <input
                v-model="form.nome"
                type="text"
                class="input"
                placeholder="Ex: Dia da Independência"
                required
                maxlength="100"
              />
            </div>

            <!-- Data -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Data <span class="text-red-500">*</span>
              </label>
              <input
                v-model="form.data"
                type="date"
                class="input"
                required
              />
            </div>

            <!-- Tipo -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Tipo <span class="text-red-500">*</span>
              </label>
              <select v-model="form.tipo" class="input" required>
                <option value="">Selecione...</option>
                <option value="NACIONAL">Nacional</option>
                <option value="ESTADUAL">Estadual</option>
                <option value="MUNICIPAL">Municipal</option>
                <option value="ESCOLAR">Escolar</option>
              </select>
            </div>
          </div>

          <!-- Recorrente -->
          <div class="mt-4">
            <label class="flex items-center">
              <input
                v-model="form.recorrente"
                type="checkbox"
                class="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
              />
              <span class="ml-2 text-sm text-gray-700">Feriado Recorrente (repete todo ano)</span>
            </label>
          </div>

          <!-- Status (apenas para edição) -->
          <div v-if="isEditing" class="mt-4">
            <label class="flex items-center">
              <input
                v-model="form.active"
                type="checkbox"
                class="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
              />
              <span class="ml-2 text-sm text-gray-700">Feriado Ativo</span>
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
import { ref, computed, onMounted } from 'vue'
import { useToast } from 'vue-toastification'
import { feriadosService, type Feriado, type FeriadoCreateInput, type FeriadoUpdateInput, TipoFeriado } from '@/services/feriados.service'

interface Props {
  feriado?: Feriado
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

const isEditing = computed(() => !!props.feriado)

const form = ref<FeriadoCreateInput & { active?: boolean }>({
  nome: '',
  data: '',
  tipo: '' as TipoFeriado,
  recorrente: false,
  active: true
})

onMounted(() => {
  if (props.feriado) {
    // Converter data do formato ISO para YYYY-MM-DD para o input date
    const dataObj = new Date(props.feriado.data)
    const dataFormatada = dataObj.toISOString().split('T')[0]

    form.value = {
      nome: props.feriado.nome,
      data: dataFormatada,
      tipo: props.feriado.tipo,
      recorrente: props.feriado.recorrente,
      active: props.feriado.active
    }
  }
})

async function handleSubmit() {
  try {
    loading.value = true
    errorMessage.value = ''

    if (isEditing.value && props.feriado) {
      await feriadosService.update(props.feriado.id, form.value as FeriadoUpdateInput)
      toast.success('Feriado atualizado com sucesso')
    } else {
      await feriadosService.create(form.value)
      toast.success('Feriado cadastrado com sucesso')
    }

    emit('saved')
  } catch (error: any) {
    console.error('Erro ao salvar feriado:', error)
    errorMessage.value = error.response?.data?.error?.message || 'Erro ao salvar feriado'
  } finally {
    loading.value = false
  }
}
</script>

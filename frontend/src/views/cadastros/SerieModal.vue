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
            {{ isEditing ? 'Editar Série' : 'Nova Série' }}
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
                placeholder="Ex: 1ANO"
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
                placeholder="Ex: 1º Ano"
                required
                maxlength="50"
              />
            </div>

            <!-- Nível de Ensino -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Nível de Ensino <span class="text-red-500">*</span>
              </label>
              <select v-model="form.nivelEnsino" class="input" required>
                <option value="">Selecione...</option>
                <option value="Infantil">Educação Infantil</option>
                <option value="Fundamental I">Ensino Fundamental I</option>
                <option value="Fundamental II">Ensino Fundamental II</option>
                <option value="Médio">Ensino Médio</option>
              </select>
            </div>

            <!-- Ordem -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Ordem <span class="text-red-500">*</span>
              </label>
              <input
                v-model.number="form.ordem"
                type="number"
                class="input"
                placeholder="Ex: 1"
                required
                min="1"
                max="99"
              />
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
              <span class="ml-2 text-sm text-gray-700">Série Ativa</span>
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
import { seriesService, type Serie, type SerieCreateInput, type SerieUpdateInput } from '@/services/series.service'

interface Props {
  serie?: Serie
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

const isEditing = computed(() => !!props.serie)

const form = ref<SerieCreateInput & { active?: boolean }>({
  codigo: '',
  nome: '',
  nivelEnsino: '',
  ordem: 1,
  active: true
})

onMounted(() => {
  if (props.serie) {
    form.value = {
      codigo: props.serie.codigo,
      nome: props.serie.nome,
      nivelEnsino: props.serie.nivelEnsino,
      ordem: props.serie.ordem,
      active: props.serie.active
    }
  }
})

async function handleSubmit() {
  try {
    loading.value = true
    errorMessage.value = ''

    if (isEditing.value && props.serie) {
      await seriesService.update(props.serie.id, form.value as SerieUpdateInput)
      toast.success('Série atualizada com sucesso')
    } else {
      await seriesService.create(form.value)
      toast.success('Série cadastrada com sucesso')
    }

    emit('saved')
  } catch (error: any) {
    console.error('Erro ao salvar série:', error)
    errorMessage.value = error.response?.data?.error?.message || 'Erro ao salvar série'
  } finally {
    loading.value = false
  }
}
</script>

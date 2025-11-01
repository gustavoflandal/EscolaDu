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
            {{ isEditing ? 'Editar Sala' : 'Nova Sala' }}
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
                placeholder="Ex: S101"
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
                placeholder="Ex: Sala 101"
                required
                maxlength="100"
              />
            </div>

            <!-- Capacidade -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Capacidade <span class="text-red-500">*</span>
              </label>
              <input
                v-model.number="form.capacidade"
                type="number"
                class="input"
                placeholder="Ex: 30"
                required
                min="1"
                max="200"
              />
            </div>

            <!-- Bloco -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Bloco
              </label>
              <input
                v-model="form.bloco"
                type="text"
                class="input"
                placeholder="Ex: A, B, Principal..."
                maxlength="10"
              />
            </div>

            <!-- Andar -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Andar
              </label>
              <input
                v-model="form.andar"
                type="text"
                class="input"
                placeholder="Ex: Térreo, 1º, 2º..."
                maxlength="10"
              />
            </div>
          </div>

          <!-- Recursos (campo completo) -->
          <div class="mt-4">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Recursos Disponíveis
            </label>
            <textarea
              v-model="form.recursos"
              class="input"
              placeholder="Ex: Projetor, Ar-condicionado, Lousa digital..."
              rows="3"
              maxlength="255"
            ></textarea>
          </div>

          <!-- Status (apenas para edição) -->
          <div v-if="isEditing" class="mt-4">
            <label class="flex items-center">
              <input
                v-model="form.active"
                type="checkbox"
                class="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
              />
              <span class="ml-2 text-sm text-gray-700">Sala Ativa</span>
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
import { salasService, type Sala, type SalaCreateInput, type SalaUpdateInput } from '@/services/salas.service'

interface Props {
  sala?: Sala
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

const isEditing = computed(() => !!props.sala)

const form = ref<SalaCreateInput & { active?: boolean }>({
  codigo: '',
  nome: '',
  capacidade: 30,
  bloco: '',
  andar: '',
  recursos: '',
  active: true
})

onMounted(() => {
  if (props.sala) {
    form.value = {
      codigo: props.sala.codigo,
      nome: props.sala.nome,
      capacidade: props.sala.capacidade,
      bloco: props.sala.bloco || '',
      andar: props.sala.andar || '',
      recursos: props.sala.recursos || '',
      active: props.sala.active
    }
  }
})

async function handleSubmit() {
  try {
    loading.value = true
    errorMessage.value = ''

    const payload = {
      ...form.value,
      bloco: form.value.bloco || undefined,
      andar: form.value.andar || undefined,
      recursos: form.value.recursos || undefined
    }

    if (isEditing.value && props.sala) {
      await salasService.update(props.sala.id, payload as SalaUpdateInput)
      toast.success('Sala atualizada com sucesso')
    } else {
      await salasService.create(payload)
      toast.success('Sala cadastrada com sucesso')
    }

    emit('saved')
  } catch (error: any) {
    console.error('Erro ao salvar sala:', error)
    errorMessage.value = error.response?.data?.error?.message || 'Erro ao salvar sala'
  } finally {
    loading.value = false
  }
}
</script>

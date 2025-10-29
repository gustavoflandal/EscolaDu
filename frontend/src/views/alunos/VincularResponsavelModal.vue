<template>
  <Teleport to="body">
    <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity z-50 flex items-center justify-center">
      <div class="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <!-- Header -->
        <div class="px-6 py-4 border-b border-gray-200">
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-semibold text-gray-900">Vincular Responsável</h3>
            <button
              @click="$emit('close')"
              class="text-gray-400 hover:text-gray-500"
            >
              <span class="sr-only">Fechar</span>
              <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <!-- Body -->
        <div class="px-6 py-4">
          <form @submit.prevent="handleSubmit">
            <!-- Filtro de Busca -->
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Filtrar Responsáveis
              </label>
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Digite o nome, email ou CPF do responsável..."
                class="input"
                @input="searchResponsaveis"
              />
            </div>

            <!-- Grid de Responsáveis -->
            <div class="mb-4">
              <div v-if="loading" class="text-center py-8 text-gray-500">
                Carregando responsáveis...
              </div>
              
              <div v-else-if="responsaveisEncontrados.length > 0" class="border rounded-lg overflow-hidden">
                <div class="max-h-96 overflow-y-auto">
                  <table class="min-w-full divide-y divide-gray-200">
                    <thead class="bg-gray-50 sticky top-0">
                      <tr>
                        <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Selecionar
                        </th>
                        <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Nome
                        </th>
                        <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Tipo de Vínculo
                        </th>
                        <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          CPF
                        </th>
                        <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Contato
                        </th>
                      </tr>
                    </thead>
                    <tbody class="bg-white divide-y divide-gray-200">
                      <tr
                        v-for="responsavel in responsaveisEncontrados"
                        :key="responsavel.id"
                        @click="selectResponsavel(responsavel)"
                        class="hover:bg-gray-50 cursor-pointer transition-colors"
                        :class="{ 'bg-primary-50': responsavelSelecionado?.id === responsavel.id }"
                      >
                        <td class="px-4 py-3 whitespace-nowrap">
                          <input
                            type="radio"
                            :checked="responsavelSelecionado?.id === responsavel.id"
                            class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                            @click.stop="selectResponsavel(responsavel)"
                          />
                        </td>
                        <td class="px-4 py-3">
                          <div class="text-sm font-medium text-gray-900">{{ responsavel.name }}</div>
                        </td>
                        <td class="px-4 py-3 whitespace-nowrap">
                          <span
                            :class="[
                              'px-2 py-1 text-xs font-semibold rounded-full',
                              getTipoVinculoColor(responsavel.tipoVinculo)
                            ]"
                          >
                            {{ formatTipoVinculo(responsavel.tipoVinculo) }}
                          </span>
                        </td>
                        <td class="px-4 py-3 whitespace-nowrap">
                          <div class="text-sm text-gray-500">{{ formatCPF(responsavel.cpf) }}</div>
                        </td>
                        <td class="px-4 py-3">
                          <div class="text-sm text-gray-900">{{ responsavel.email }}</div>
                          <div class="text-sm text-gray-500">{{ formatPhone(responsavel.phone) }}</div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              
              <div v-else class="text-center py-8 text-gray-500 border rounded-lg">
                {{ searchQuery ? 'Nenhum responsável encontrado' : 'Digite para buscar responsáveis' }}
              </div>
            </div>

            <!-- Responsável Selecionado -->
            <div v-if="responsavelSelecionado" class="mb-4 p-4 bg-primary-50 rounded-lg border border-primary-200">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm font-medium text-gray-900 mb-1">Responsável Selecionado:</p>
                  <p class="text-sm text-gray-700">{{ responsavelSelecionado.name }} - {{ formatCPF(responsavelSelecionado.cpf) }}</p>
                </div>
                <button
                  type="button"
                  @click="clearSelection"
                  class="text-gray-400 hover:text-gray-600"
                >
                  <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <!-- Prioridade de Contato -->
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Prioridade de Contato <span class="text-red-500">*</span>
              </label>
              <input
                v-model.number="form.prioridadeContato"
                type="number"
                min="1"
                max="10"
                required
                class="input"
              />
              <p class="text-xs text-gray-500 mt-1">De 1 (mais prioritário) a 10 (menos prioritário)</p>
            </div>

            <!-- Botões -->
            <div class="flex justify-end gap-3 mt-6">
              <button
                type="button"
                @click="$emit('close')"
                class="btn btn-secondary"
              >
                Cancelar
              </button>
              <button
                type="submit"
                class="btn btn-primary"
                :disabled="!responsavelSelecionado || submitting"
              >
                {{ submitting ? 'Salvando...' : 'Vincular' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useToast } from 'vue-toastification';
import responsaveisService, { type Responsavel, type CreateVinculoData } from '@/services/responsaveis.service';

interface Props {
  alunoId: string;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  close: [];
  vinculoCriado: [];
}>();

const toast = useToast();
const searchQuery = ref('');
const responsaveisEncontrados = ref<Responsavel[]>([]);
const responsavelSelecionado = ref<Responsavel | null>(null);
const submitting = ref(false);
const loading = ref(false);

const form = ref({
  prioridadeContato: 1
});

let searchTimeout: ReturnType<typeof setTimeout> | undefined;

async function loadResponsaveis() {
  loading.value = true;
  try {
    const response = await responsaveisService.list({ limit: 100 });
    responsaveisEncontrados.value = response.data || [];
  } catch (error: any) {
    console.error('Erro ao carregar responsáveis:', error);
    toast.error('Erro ao carregar responsáveis');
  } finally {
    loading.value = false;
  }
}

async function searchResponsaveis() {
  clearTimeout(searchTimeout);
  
  if (searchQuery.value.length === 0) {
    loadResponsaveis();
    return;
  }

  searchTimeout = setTimeout(async () => {
    loading.value = true;
    try {
      const response = await responsaveisService.list({ search: searchQuery.value, limit: 100 });
      responsaveisEncontrados.value = response.data || [];
    } catch (error: any) {
      console.error('Erro ao buscar responsáveis:', error);
      toast.error('Erro ao buscar responsáveis');
    } finally {
      loading.value = false;
    }
  }, 500);
}

function selectResponsavel(responsavel: Responsavel) {
  responsavelSelecionado.value = responsavel;
}

function clearSelection() {
  responsavelSelecionado.value = null;
}

function formatCPF(cpf: string): string {
  return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
}

function formatPhone(phone: string): string {
  if (phone.length === 11) {
    return phone.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  }
  return phone.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
}

function formatTipoVinculo(tipo: string): string {
  const tipos: Record<string, string> = {
    'PAI': 'Pai',
    'MAE': 'Mãe',
    'AVO': 'Avó/Avô',
    'TUTOR': 'Tutor',
    'OUTRO': 'Outro'
  };
  return tipos[tipo] || tipo;
}

function getTipoVinculoColor(tipo: string): string {
  const colors: Record<string, string> = {
    'PAI': 'bg-indigo-100 text-indigo-800',
    'MAE': 'bg-pink-100 text-pink-800',
    'AVO': 'bg-purple-100 text-purple-800',
    'TUTOR': 'bg-orange-100 text-orange-800',
    'OUTRO': 'bg-gray-100 text-gray-800'
  };
  return colors[tipo] || 'bg-gray-100 text-gray-800';
}

async function handleSubmit() {
  if (!responsavelSelecionado.value) {
    toast.error('Selecione um responsável');
    return;
  }

  submitting.value = true;

  try {
    const data: CreateVinculoData = {
      alunoId: props.alunoId,
      prioridadeContato: form.value.prioridadeContato
    };

    await responsaveisService.createVinculo(responsavelSelecionado.value.id, data);
    toast.success('Vínculo criado com sucesso!');
    emit('vinculoCriado');
  } catch (error: any) {
    toast.error(error.response?.data?.error?.message || 'Erro ao criar vínculo');
    console.error('Erro ao criar vínculo:', error);
  } finally {
    submitting.value = false;
  }
}

onMounted(() => {
  loadResponsaveis();
});
</script>

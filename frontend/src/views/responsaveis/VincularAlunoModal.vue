<template>
  <Teleport to="body">
    <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity z-50 flex items-center justify-center">
      <div class="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <!-- Header -->
        <div class="px-6 py-4 border-b border-gray-200">
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-semibold text-gray-900">Vincular Aluno</h3>
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
                Filtrar Alunos
              </label>
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Digite o nome ou matrícula do aluno..."
                class="input"
                @input="searchAlunos"
              />
            </div>

            <!-- Grid de Alunos -->
            <div class="mb-4">
              <div v-if="loading" class="text-center py-8 text-gray-500">
                Carregando alunos...
              </div>
              
              <div v-else-if="alunosEncontrados.length > 0" class="border rounded-lg overflow-hidden">
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
                          Matrícula
                        </th>
                        <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody class="bg-white divide-y divide-gray-200">
                      <tr
                        v-for="aluno in alunosEncontrados"
                        :key="aluno.id"
                        @click="selectAluno(aluno)"
                        class="hover:bg-gray-50 cursor-pointer transition-colors"
                        :class="{ 'bg-primary-50': alunoSelecionado?.id === aluno.id }"
                      >
                        <td class="px-4 py-3 whitespace-nowrap">
                          <input
                            type="radio"
                            :checked="alunoSelecionado?.id === aluno.id"
                            class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                            @click.stop="selectAluno(aluno)"
                          />
                        </td>
                        <td class="px-4 py-3 whitespace-nowrap">
                          <div class="text-sm font-medium text-gray-900">{{ aluno.nome }}</div>
                        </td>
                        <td class="px-4 py-3 whitespace-nowrap">
                          <div class="text-sm text-gray-500">{{ aluno.matricula }}</div>
                        </td>
                        <td class="px-4 py-3 whitespace-nowrap">
                          <span
                            :class="[
                              'px-2 py-1 text-xs font-semibold rounded-full',
                              aluno.status === 'ATIVO' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                            ]"
                          >
                            {{ aluno.status }}
                          </span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              
              <div v-else class="text-center py-8 text-gray-500 border rounded-lg">
                {{ searchQuery ? 'Nenhum aluno encontrado' : 'Digite para buscar alunos' }}
              </div>
            </div>

            <!-- Aluno Selecionado -->
            <div v-if="alunoSelecionado" class="mb-4 p-4 bg-primary-50 rounded-lg border border-primary-200">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm font-medium text-gray-900 mb-1">Aluno Selecionado:</p>
                  <p class="text-sm text-gray-700">{{ alunoSelecionado.nome }} - {{ alunoSelecionado.matricula }}</p>
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
                :disabled="!alunoSelecionado || submitting"
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
import responsaveisService, { type CreateVinculoData } from '@/services/responsaveis.service';
import { alunosService } from '@/services/alunos.service';
import type { Aluno } from '@/types';

interface Props {
  responsavelId: string;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  close: [];
  vinculoCriado: [];
}>();

const toast = useToast();
const searchQuery = ref('');
const alunosEncontrados = ref<Aluno[]>([]);
const alunoSelecionado = ref<Aluno | null>(null);
const submitting = ref(false);
const loading = ref(false);

const form = ref({
  prioridadeContato: 1
});

let searchTimeout: ReturnType<typeof setTimeout> | undefined;

async function loadAlunos() {
  loading.value = true;
  try {
    const response = await alunosService.list({ limit: 100 });
    alunosEncontrados.value = response.data || [];
  } catch (error: any) {
    console.error('Erro ao carregar alunos:', error);
    toast.error('Erro ao carregar alunos');
  } finally {
    loading.value = false;
  }
}

async function searchAlunos() {
  clearTimeout(searchTimeout);
  
  if (searchQuery.value.length === 0) {
    loadAlunos();
    return;
  }

  searchTimeout = setTimeout(async () => {
    loading.value = true;
    try {
      const response = await alunosService.list({ search: searchQuery.value, limit: 100 });
      alunosEncontrados.value = response.data || [];
    } catch (error: any) {
      console.error('Erro ao buscar alunos:', error);
      toast.error('Erro ao buscar alunos');
    } finally {
      loading.value = false;
    }
  }, 500);
}

function selectAluno(aluno: Aluno) {
  alunoSelecionado.value = aluno;
}

function clearSelection() {
  alunoSelecionado.value = null;
}

async function handleSubmit() {
  if (!alunoSelecionado.value) {
    toast.error('Selecione um aluno');
    return;
  }

  submitting.value = true;

  try {
    const data: CreateVinculoData = {
      alunoId: alunoSelecionado.value.id,
      prioridadeContato: form.value.prioridadeContato
    };

    await responsaveisService.createVinculo(props.responsavelId, data);
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
  loadAlunos();
});
</script>

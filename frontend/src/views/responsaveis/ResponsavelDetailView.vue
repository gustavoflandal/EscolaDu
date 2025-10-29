<template>
  <div>
    <!-- Cabeçalho -->
    <div class="mb-6">
      <div class="flex justify-between items-center">
        <h1 class="text-2xl font-bold text-gray-900">Detalhes do Responsável</h1>
        <div class="flex gap-2">
          <button @click="$router.back()" class="btn btn-secondary">
            ← Voltar
          </button>
          <RouterLink
            :to="`/responsaveis/${responsavel?.id}/editar`"
            class="btn btn-secondary"
          >
            Editar
          </RouterLink>
          <button
            @click="confirmDelete"
            class="btn bg-red-600 hover:bg-red-700 text-white"
          >
            Excluir
          </button>
        </div>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="text-center py-12">
      <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      <p class="text-gray-600 mt-2">Carregando...</p>
    </div>

    <!-- Conteúdo -->
    <div v-else-if="responsavel" class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Informações Pessoais -->
      <div class="lg:col-span-2 bg-white shadow rounded-lg p-6">
        <h2 class="text-lg font-semibold text-gray-900 mb-4">Informações Pessoais</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="text-sm font-medium text-gray-500">Nome</label>
            <p class="text-gray-900">{{ responsavel.name }}</p>
          </div>
          <div>
            <label class="text-sm font-medium text-gray-500">Email</label>
            <p class="text-gray-900">{{ responsavel.email }}</p>
          </div>
          <div>
            <label class="text-sm font-medium text-gray-500">CPF</label>
            <p class="text-gray-900">{{ formatCPF(responsavel.cpf) }}</p>
          </div>
          <div>
            <label class="text-sm font-medium text-gray-500">RG</label>
            <p class="text-gray-900">{{ responsavel.rg || '-' }}</p>
          </div>
          <div>
            <label class="text-sm font-medium text-gray-500">Tipo de Vínculo</label>
            <p>
              <span
                :class="[
                  'px-2 py-1 text-xs font-semibold rounded-full',
                  getTipoVinculoColor(responsavel.tipoVinculo)
                ]"
              >
                {{ getTipoVinculoLabel(responsavel.tipoVinculo) }}
              </span>
            </p>
          </div>
          <div>
            <label class="text-sm font-medium text-gray-500">Telefone Principal</label>
            <p class="text-gray-900">{{ formatPhone(responsavel.phone) }}</p>
          </div>
          <div>
            <label class="text-sm font-medium text-gray-500">Telefone Secundário</label>
            <p class="text-gray-900">
              {{ responsavel.telefoneSecundario ? formatPhone(responsavel.telefoneSecundario) : '-' }}
            </p>
          </div>
          <div>
            <label class="text-sm font-medium text-gray-500">Profissão</label>
            <p class="text-gray-900">{{ responsavel.profissao || '-' }}</p>
          </div>
          <div>
            <label class="text-sm font-medium text-gray-500">Status</label>
            <p>
              <span
                :class="[
                  'px-2 py-1 text-xs font-semibold rounded-full',
                  responsavel.active
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-100 text-gray-800'
                ]"
              >
                {{ responsavel.active ? 'Ativo' : 'Inativo' }}
              </span>
            </p>
          </div>
          <div class="md:col-span-2">
            <label class="text-sm font-medium text-gray-500">Endereço</label>
            <p class="text-gray-900">{{ responsavel.endereco || '-' }}</p>
          </div>
        </div>
      </div>

      <!-- Informações do Sistema -->
      <div class="bg-white shadow rounded-lg p-6">
        <h2 class="text-lg font-semibold text-gray-900 mb-4">Informações do Sistema</h2>
        <div class="space-y-4">
          <div>
            <label class="text-sm font-medium text-gray-500">Cadastrado em</label>
            <p class="text-gray-900">{{ formatDate(responsavel.createdAt) }}</p>
          </div>
          <div>
            <label class="text-sm font-medium text-gray-500">Última atualização</label>
            <p class="text-gray-900">{{ formatDate(responsavel.updatedAt) }}</p>
          </div>
        </div>
      </div>

      <!-- Alunos Vinculados -->
      <div class="lg:col-span-3 bg-white shadow rounded-lg p-6">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-lg font-semibold text-gray-900">Alunos Vinculados</h2>
          <button @click="openVinculoModal" class="btn btn-primary">
            + Vincular Aluno
          </button>
        </div>

        <div v-if="alunos.length > 0" class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Aluno</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Prioridade de Contato</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Ações</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="aluno in alunos" :key="aluno.alunoId">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm font-medium text-gray-900">{{ aluno.nome }}</div>
                  <div class="text-sm text-gray-500">Matrícula: {{ aluno.matricula }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ aluno.prioridadeContato }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span
                    :class="[
                      'px-2 py-1 text-xs font-semibold rounded-full',
                      aluno.status === 'ATIVO' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    ]"
                  >
                    {{ aluno.status === 'ATIVO' ? 'Ativo' : 'Inativo' }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    @click="confirmRemoveVinculo(aluno.vinculoId || '')"
                    class="text-red-600 hover:text-red-900"
                    :disabled="!aluno.vinculoId"
                  >
                    Remover
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div v-else class="text-center py-6 text-gray-500">
          Nenhum aluno vinculado
        </div>
      </div>
    </div>

    <!-- Modal de Vínculo -->
    <VincularAlunoModal
      v-if="showVinculoModal"
      :responsavel-id="responsavel?.id || ''"
      @close="closeVinculoModal"
      @vinculo-criado="handleVinculoCriado"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { RouterLink, useRoute, useRouter } from 'vue-router';
import { useToast } from 'vue-toastification';
import responsaveisService, { type Responsavel, type AlunoVinculo } from '@/services/responsaveis.service';
import VincularAlunoModal from './VincularAlunoModal.vue';

const route = useRoute();
const router = useRouter();
const toast = useToast();

const loading = ref(false);
const responsavel = ref<Responsavel | null>(null);
const alunos = ref<AlunoVinculo[]>([]);
const showVinculoModal = ref(false);

function formatCPF(cpf: string): string {
  return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
}

function formatPhone(phone: string): string {
  if (phone.length === 11) {
    return phone.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  }
  return phone.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
}

function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

function getTipoVinculoLabel(tipo: string): string {
  const labels: Record<string, string> = {
    PAI: 'Pai',
    MAE: 'Mãe',
    AVO: 'Avó/Avô',
    TUTOR: 'Tutor',
    OUTRO: 'Outro'
  };
  return labels[tipo] || tipo;
}

function getTipoVinculoColor(tipo: string): string {
  const colors: Record<string, string> = {
    PAI: 'bg-indigo-100 text-indigo-800',
    MAE: 'bg-pink-100 text-pink-800',
    AVO: 'bg-purple-100 text-purple-800',
    TUTOR: 'bg-green-100 text-green-800',
    OUTRO: 'bg-gray-100 text-gray-800'
  };
  return colors[tipo] || 'bg-gray-100 text-gray-800';
}

async function loadResponsavel() {
  try {
    loading.value = true;
    const id = route.params.id as string;
    responsavel.value = await responsaveisService.getById(id);
  } catch (error: any) {
    toast.error(error.response?.data?.error?.message || 'Erro ao carregar responsável');
    router.push('/responsaveis');
  } finally {
    loading.value = false;
  }
}

async function loadAlunos() {
  try {
    const id = route.params.id as string;
    alunos.value = await responsaveisService.getAlunos(id);
  } catch (error: any) {
    toast.error('Erro ao carregar alunos vinculados');
  }
}

async function confirmDelete() {
  if (confirm(`Tem certeza que deseja excluir o responsável ${responsavel.value?.name}?`)) {
    try {
      await responsaveisService.delete(responsavel.value!.id);
      toast.success('Responsável excluído com sucesso!');
      router.push('/responsaveis');
    } catch (error: any) {
      toast.error(error.response?.data?.error?.message || 'Erro ao excluir responsável');
    }
  }
}

async function confirmRemoveVinculo(vinculoId: string) {
  if (confirm('Tem certeza que deseja remover este vínculo?')) {
    try {
      await responsaveisService.removeVinculo(vinculoId);
      toast.success('Vínculo removido com sucesso!');
      loadAlunos();
    } catch (error: any) {
      toast.error(error.response?.data?.error?.message || 'Erro ao remover vínculo');
    }
  }
}

function openVinculoModal() {
  showVinculoModal.value = true;
}

function closeVinculoModal() {
  showVinculoModal.value = false;
}

function handleVinculoCriado() {
  closeVinculoModal();
  loadAlunos();
}

onMounted(() => {
  loadResponsavel();
  loadAlunos();
});
</script>

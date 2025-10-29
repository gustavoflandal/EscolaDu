<template>
  <div>
    <!-- Cabeçalho -->
    <div class="flex justify-between items-center mb-6">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Responsáveis</h1>
        <p class="text-gray-600 mt-1">Gerencie os responsáveis pelos alunos</p>
      </div>
      <RouterLink to="/responsaveis/novo" class="btn btn-primary">
        + Novo Responsável
      </RouterLink>
    </div>

    <!-- Filtros -->
    <div class="bg-white p-4 rounded-lg shadow mb-6">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Buscar</label>
          <input
            v-model="filters.search"
            type="text"
            placeholder="Nome, email ou CPF..."
            class="input"
            @input="debouncedSearch"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Status</label>
          <select v-model="filters.active" class="input" @change="loadResponsaveis">
            <option value="">Todos</option>
            <option value="true">Ativos</option>
            <option value="false">Inativos</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="text-center py-12">
      <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      <p class="text-gray-600 mt-2">Carregando responsáveis...</p>
    </div>

    <!-- Tabela de Responsáveis -->
    <div v-else-if="responsaveis.length > 0" class="bg-white shadow rounded-lg overflow-hidden">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Responsável
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Tipo de Vínculo
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Contato
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Alunos Vinculados
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Ações
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="responsavel in responsaveis" :key="responsavel.id" class="hover:bg-gray-50">
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="flex items-center">
                <div class="flex-shrink-0 h-10 w-10">
                  <div
                    class="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-700 font-semibold"
                  >
                    {{ getInitials(responsavel.name) }}
                  </div>
                </div>
                <div class="ml-4">
                  <div class="text-sm font-medium text-gray-900">{{ responsavel.name }}</div>
                  <div class="text-sm text-gray-500">{{ formatCPF(responsavel.cpf) }}</div>
                </div>
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span
                :class="[
                  'px-2 inline-flex text-xs leading-5 font-semibold rounded-full',
                  getTipoVinculoColor(responsavel.tipoVinculo)
                ]"
              >
                {{ formatTipoVinculo(responsavel.tipoVinculo) }}
              </span>
            </td>
            <td class="px-6 py-4">
              <div class="text-sm text-gray-900">{{ responsavel.email }}</div>
              <div class="text-sm text-gray-500">{{ formatPhone(responsavel.phone) }}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="flex items-center">
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {{ responsavel.alunosVinculados || 0 }} aluno(s)
                </span>
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span
                :class="[
                  'px-2 inline-flex text-xs leading-5 font-semibold rounded-full',
                  responsavel.active
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-100 text-gray-800'
                ]"
              >
                {{ responsavel.active ? 'Ativo' : 'Inativo' }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
              <RouterLink
                :to="`/responsaveis/${responsavel.id}`"
                class="text-primary-600 hover:text-primary-900 mr-3"
              >
                Ver
              </RouterLink>
              <RouterLink
                :to="`/responsaveis/${responsavel.id}/editar`"
                class="text-indigo-600 hover:text-indigo-900 mr-3"
              >
                Editar
              </RouterLink>
              <button
                @click="confirmDelete(responsavel)"
                class="text-red-600 hover:text-red-900"
              >
                Excluir
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Paginação -->
      <div v-if="pagination.totalPages > 1" class="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
        <div class="flex items-center justify-between">
          <div class="text-sm text-gray-700">
            Mostrando {{ (pagination.page - 1) * pagination.limit + 1 }} até
            {{ Math.min(pagination.page * pagination.limit, pagination.total) }} de
            {{ pagination.total }} resultados
          </div>
          <div class="flex gap-2">
            <button
              @click="changePage(pagination.page - 1)"
              :disabled="pagination.page === 1"
              class="btn btn-secondary"
              :class="{ 'opacity-50 cursor-not-allowed': pagination.page === 1 }"
            >
              Anterior
            </button>
            <button
              @click="changePage(pagination.page + 1)"
              :disabled="pagination.page >= pagination.totalPages"
              class="btn btn-secondary"
              :class="{ 'opacity-50 cursor-not-allowed': pagination.page >= pagination.totalPages }"
            >
              Próxima
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Estado vazio -->
    <div v-else class="text-center py-12 bg-white rounded-lg shadow">
      <p class="text-gray-500">Nenhum responsável encontrado</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { RouterLink } from 'vue-router';
import { useToast } from 'vue-toastification';
import responsaveisService, { type Responsavel } from '@/services/responsaveis.service';

const toast = useToast();
const loading = ref(false);
const responsaveis = ref<Responsavel[]>([]);
const filters = ref({
  search: '',
  active: ''
});

const pagination = ref({
  page: 1,
  limit: 10,
  total: 0,
  totalPages: 0
});

let searchTimeout: ReturnType<typeof setTimeout> | undefined;

function debouncedSearch() {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    loadResponsaveis();
  }, 500);
}

async function loadResponsaveis() {
  try {
    loading.value = true;
    const params: any = {
      page: pagination.value.page,
      limit: pagination.value.limit
    };

    if (filters.value.search) params.search = filters.value.search;
    if (filters.value.active !== '') params.active = filters.value.active === 'true';

    const response = await responsaveisService.list(params);
    responsaveis.value = response.data || [];
    pagination.value = {
      page: response.pagination?.page || 1,
      limit: response.pagination?.limit || 10,
      total: response.pagination?.total || 0,
      totalPages: response.pagination?.totalPages || 0
    };
  } catch (error: any) {
    responsaveis.value = [];
    toast.error(error.response?.data?.error?.message || 'Erro ao carregar responsáveis');
    console.error('Erro ao carregar responsáveis:', error);
  } finally {
    loading.value = false;
  }
}

function changePage(page: number) {
  pagination.value.page = page;
  loadResponsaveis();
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .slice(0, 2)
    .map(n => n[0])
    .join('')
    .toUpperCase();
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

async function confirmDelete(responsavel: Responsavel) {
  if (confirm(`Tem certeza que deseja excluir o responsável ${responsavel.name}?`)) {
    try {
      await responsaveisService.delete(responsavel.id);
      toast.success('Responsável excluído com sucesso!');
      loadResponsaveis();
    } catch (error: any) {
      toast.error(error.response?.data?.error?.message || 'Erro ao excluir responsável');
    }
  }
}

onMounted(() => {
  loadResponsaveis();
});
</script>

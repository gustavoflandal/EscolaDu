<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-3xl font-bold text-gray-900">Responsáveis</h1>
      <RouterLink to="/responsaveis/novo" class="btn btn-primary">
        Novo Responsável
      </RouterLink>
    </div>

    <div class="card mb-6">
      <div class="flex gap-4">
        <input
          v-model="filters.search"
          type="text"
          placeholder="Buscar por nome, CPF ou email..."
          class="input flex-1"
          @input="handleSearch"
        />
      </div>
    </div>

    <div v-if="loading" class="text-center py-12">
      <p class="text-gray-600">Carregando...</p>
    </div>

    <div v-else-if="responsaveis.length === 0" class="card text-center py-12">
      <p class="text-gray-600">Nenhum responsável encontrado.</p>
    </div>

    <div v-else class="card">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nome
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                CPF
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Telefone
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Parentesco
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Alunos
              </th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ações
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="responsavel in responsaveis" :key="responsavel.id" class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900">{{ responsavel.user.name }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-500">{{ formatCPF(responsavel.cpf) }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-500">{{ responsavel.email }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-500">{{ responsavel.telefonePrincipal }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                  {{ getTipoVinculoLabel(responsavel.tipoVinculo) }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-500">
                  {{ responsavel.vinculos?.length || 0 }} aluno(s)
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                <RouterLink
                  :to="`/responsaveis/${responsavel.id}/editar`"
                  class="text-primary-600 hover:text-primary-900"
                >
                  Editar
                </RouterLink>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div v-if="pagination.totalPages > 1" class="mt-4 flex justify-between items-center">
        <div class="text-sm text-gray-700">
          Mostrando {{ responsaveis.length }} de {{ pagination.total }} responsáveis
        </div>
        <div class="flex gap-2">
          <button
            @click="goToPage(pagination.page - 1)"
            :disabled="pagination.page === 1"
            class="btn btn-secondary"
          >
            Anterior
          </button>
          <button
            @click="goToPage(pagination.page + 1)"
            :disabled="pagination.page === pagination.totalPages"
            class="btn btn-secondary"
          >
            Próxima
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { responsaveisService, type Responsavel } from '@/services/responsaveis.service'

const responsaveis = ref<Responsavel[]>([])
const loading = ref(false)
const filters = ref({
  search: '',
})
const pagination = ref({
  page: 1,
  limit: 10,
  total: 0,
  totalPages: 0,
})

let searchTimeout: NodeJS.Timeout

function handleSearch() {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    loadResponsaveis()
  }, 500)
}

async function loadResponsaveis() {
  loading.value = true
  try {
    const response = await responsaveisService.list({
      ...filters.value,
      page: pagination.value.page,
      limit: pagination.value.limit,
    })
    responsaveis.value = response.data
    pagination.value = {
      page: response.meta.page,
      limit: response.meta.limit,
      total: response.meta.total,
      totalPages: response.meta.totalPages,
    }
  } catch (error) {
    console.error('Erro ao carregar responsáveis:', error)
  } finally {
    loading.value = false
  }
}

function goToPage(page: number) {
  pagination.value.page = page
  loadResponsaveis()
}

function formatCPF(cpf: string) {
  return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
}

function getTipoVinculoLabel(tipo: string): string {
  const labels: Record<string, string> = {
    PAI: 'Pai',
    MAE: 'Mãe',
    AVO: 'Avô/Avó',
    TUTOR: 'Tutor',
    OUTRO: 'Outro'
  }
  return labels[tipo] || tipo
}

onMounted(() => {
  loadResponsaveis()
})
</script>

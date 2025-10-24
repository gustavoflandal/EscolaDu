<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-3xl font-bold text-gray-900">Alunos</h1>
      <RouterLink to="/alunos/novo" class="btn btn-primary">
        Novo Aluno
      </RouterLink>
    </div>

    <div class="card mb-6">
      <div class="flex gap-4">
        <input
          v-model="filters.search"
          type="text"
          placeholder="Buscar por nome, matrícula ou CPF..."
          class="input flex-1"
          @input="handleSearch"
        />
        <select v-model="filters.active" class="input w-48" @change="loadAlunos">
          <option :value="undefined">Todos</option>
          <option :value="true">Ativos</option>
          <option :value="false">Inativos</option>
        </select>
      </div>
    </div>

    <div v-if="loading" class="text-center py-12">
      <p class="text-gray-600">Carregando...</p>
    </div>

    <div v-else-if="alunos.length === 0" class="card text-center py-12">
      <p class="text-gray-600">Nenhum aluno encontrado.</p>
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
                Matrícula
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Data Nascimento
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
            <tr v-for="aluno in alunos" :key="aluno.id" class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900">{{ aluno.nome }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-500">{{ aluno.matricula }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-500">{{ formatDate(aluno.dataNascimento) }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  :class="[
                    'px-2 inline-flex text-xs leading-5 font-semibold rounded-full',
                    aluno.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  ]"
                >
                  {{ aluno.active ? 'Ativo' : 'Inativo' }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                <RouterLink
                  :to="`/alunos/${aluno.id}`"
                  class="text-primary-600 hover:text-primary-900"
                >
                  Ver
                </RouterLink>
                <RouterLink
                  :to="`/alunos/${aluno.id}/editar`"
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
          Mostrando {{ alunos.length }} de {{ pagination.total }} alunos
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
import { alunosService } from '@/services/alunos.service'
import type { Aluno } from '@/types'
import { format } from 'date-fns'

const alunos = ref<Aluno[]>([])
const loading = ref(false)
const filters = ref({
  search: '',
  active: undefined as boolean | undefined
})
const pagination = ref({
  page: 1,
  limit: 10,
  total: 0,
  totalPages: 0
})

let searchTimeout: NodeJS.Timeout

function handleSearch() {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    loadAlunos()
  }, 500)
}

async function loadAlunos() {
  loading.value = true
  try {
    const response = await alunosService.list({
      ...filters.value,
      page: pagination.value.page,
      limit: pagination.value.limit
    })
    alunos.value = response.data
    pagination.value = {
      page: response.page,
      limit: response.limit,
      total: response.total,
      totalPages: response.totalPages
    }
  } catch (error) {
    console.error('Erro ao carregar alunos:', error)
  } finally {
    loading.value = false
  }
}

function goToPage(page: number) {
  pagination.value.page = page
  loadAlunos()
}

function formatDate(date: string) {
  return format(new Date(date), 'dd/MM/yyyy')
}

onMounted(() => {
  loadAlunos()
})
</script>

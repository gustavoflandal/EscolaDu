<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-3xl font-bold text-gray-900">Alunos</h1>
      <div class="flex items-center gap-3">
        <RouterLink to="/" class="btn btn-secondary">
          ← Voltar
        </RouterLink>
        <RouterLink to="/alunos/novo" class="btn btn-primary">
          Novo Aluno
        </RouterLink>
      </div>
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
        <select v-model="filters.status" class="input w-48" @change="loadAlunos">
          <option value="">Todos</option>
          <option value="ATIVO">Ativos</option>
          <option value="INATIVO">Inativos</option>
          <option value="TRANSFERIDO">Transferidos</option>
          <option value="EVADIDO">Evadidos</option>
          <option value="CONCLUIDO">Concluídos</option>
        </select>
        <select v-model.number="pagination.limit" class="input w-40" @change="onLimitChange">
          <option :value="10">10 por página</option>
          <option :value="25">25 por página</option>
          <option :value="50">50 por página</option>
          <option :value="100">100 por página</option>
          <option :value="0">Todos</option>
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
              <td class="px-6 py-2 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900">{{ aluno.nome }}</div>
              </td>
              <td class="px-6 py-2 whitespace-nowrap">
                <div class="text-sm text-gray-500">{{ aluno.matricula }}</div>
              </td>
              <td class="px-6 py-2 whitespace-nowrap">
                <div class="text-sm text-gray-500">{{ formatDate(aluno.dataNascimento) }}</div>
              </td>
              <td class="px-6 py-2 whitespace-nowrap">
                <span
                  :class="[
                    'px-2 inline-flex text-xs leading-4 font-semibold rounded-full',
                    getStatusClass(aluno.status)
                  ]"
                >
                  {{ getStatusLabel(aluno.status) }}
                </span>
              </td>
              <td class="px-6 py-2 whitespace-nowrap text-right text-sm font-medium">
                <div class="flex justify-end gap-2">
                  <RouterLink
                    :to="`/alunos/${aluno.id}`"
                    class="text-blue-600 hover:text-blue-900"
                    title="Visualizar"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </RouterLink>
                  <RouterLink
                    :to="`/alunos/${aluno.id}/editar`"
                    class="text-yellow-600 hover:text-yellow-900"
                    title="Editar"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </RouterLink>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Paginação -->
      <div v-if="pagination.totalPages > 1 && !viewAll" class="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
        <div class="flex items-center justify-between">
          <div class="flex-1 flex justify-between sm:hidden">
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
          <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p class="text-sm text-gray-700">
                Mostrando
                <span class="font-medium">{{ (pagination.page - 1) * pagination.limit + 1 }}</span>
                até
                <span class="font-medium">{{
                  Math.min(pagination.page * pagination.limit, pagination.total)
                }}</span>
                de
                <span class="font-medium">{{ pagination.total }}</span>
                resultados
              </p>
            </div>
            <div>
              <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                <button
                  @click="goToPage(pagination.page - 1)"
                  :disabled="pagination.page === 1"
                  class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Anterior
                </button>
                <button
                  @click="goToPage(pagination.page + 1)"
                  :disabled="pagination.page === pagination.totalPages"
                  class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Próxima
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>
      <div v-else-if="!viewAll" class="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
        <p class="text-sm text-gray-700">
          Mostrando <span class="font-medium">{{ alunos.length }}</span> de <span class="font-medium">{{ pagination.total }}</span> alunos
        </p>
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
  status: '' as string
})
const pagination = ref({
  page: 1,
  limit: 10,
  total: 0,
  totalPages: 0
})

const viewAll = ref(false)

let searchTimeout: ReturnType<typeof setTimeout> | undefined

function handleSearch() {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    loadAlunos()
  }, 500)
}

function getStatusClass(status: string): string {
  const classes: Record<string, string> = {
    'ATIVO': 'bg-green-100 text-green-800',
    'INATIVO': 'bg-gray-100 text-gray-800',
    'TRANSFERIDO': 'bg-blue-100 text-blue-800',
    'EVADIDO': 'bg-red-100 text-red-800',
    'CONCLUIDO': 'bg-purple-100 text-purple-800'
  }
  return classes[status] || 'bg-gray-100 text-gray-800'
}

function getStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    'ATIVO': 'Ativo',
    'INATIVO': 'Inativo',
    'TRANSFERIDO': 'Transferido',
    'EVADIDO': 'Evadido',
    'CONCLUIDO': 'Concluído'
  }
  return labels[status] || status
}

async function loadAlunos() {
  loading.value = true
  try {
    const response = await alunosService.list({
      ...filters.value,
      page: pagination.value.page,
      limit: pagination.value.limit
    })
    // Backend may return pagination metadata in different shapes.
    // Handle both: { data: [], page, limit, total, totalPages }
    // and { data: [], meta: { page, limit, total, totalPages } }
    if ((response as any).meta) {
      alunos.value = (response as any).data || []
      const meta = (response as any).meta
      pagination.value = {
        page: meta.page || 1,
        limit: meta.limit ?? pagination.value.limit,
        total: meta.total || 0,
        totalPages: meta.totalPages || 0
      }
    } else {
      alunos.value = (response as any).data || []
      pagination.value = {
        page: (response as any).page || 1,
        limit: (response as any).limit ?? pagination.value.limit,
        total: (response as any).total || 0,
        totalPages: (response as any).totalPages || 0
      }
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

function onLimitChange() {
  // When limit changes, reset to first page and reload
  pagination.value.page = 1
  viewAll.value = pagination.value.limit === 0
  loadAlunos()
}

function formatDate(date: string) {
  return format(new Date(date), 'dd/MM/yyyy')
}

onMounted(() => {
  loadAlunos()
})
</script>

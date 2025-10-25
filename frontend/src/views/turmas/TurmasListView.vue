<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-3xl font-bold text-gray-900">Turmas</h1>
      <RouterLink to="/turmas/novo" class="btn btn-primary">
        Nova Turma
      </RouterLink>
    </div>

    <div class="card mb-6">
      <div class="grid grid-cols-1 gap-4 md:grid-cols-4">
        <input
          v-model="filters.search"
          type="text"
          placeholder="Buscar por código, nome ou sala..."
          class="input"
          @input="handleSearch"
        />
        <select v-model="filters.serie" @change="loadTurmas" class="input">
          <option value="">Todas as séries</option>
          <option value="1º ANO">1º Ano</option>
          <option value="2º ANO">2º Ano</option>
          <option value="3º ANO">3º Ano</option>
          <option value="4º ANO">4º Ano</option>
          <option value="5º ANO">5º Ano</option>
        </select>
        <select v-model="filters.turno" @change="loadTurmas" class="input">
          <option value="">Todos os turnos</option>
          <option value="MANHA">Manhã</option>
          <option value="TARDE">Tarde</option>
          <option value="NOITE">Noite</option>
          <option value="INTEGRAL">Integral</option>
        </select>
        <select v-model="filters.anoLetivoId" @change="loadTurmas" class="input">
          <option value="">Todos os anos</option>
          <option v-for="ano in anosLetivos" :key="ano.id" :value="ano.id">
            {{ ano.ano }}
          </option>
        </select>
      </div>
    </div>

    <div v-if="loading" class="text-center py-12">
      <p class="text-gray-600">Carregando...</p>
    </div>

    <div v-else-if="turmas.length === 0" class="card text-center py-12">
      <p class="text-gray-600">Nenhuma turma encontrada.</p>
    </div>

    <div v-else class="card">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Código
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nome
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Série
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Turno
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Professor
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Alunos
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Sala
              </th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ações
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="turma in turmas" :key="turma.id" class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900">{{ turma.codigo }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900">{{ turma.nome }}</div>
                <div class="text-xs text-gray-500">Ano: {{ turma.anoLetivo.ano }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                  {{ turma.serie }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-purple-100 text-purple-800">
                  {{ getTurnoLabel(turma.turno) }}
                </span>
              </td>
              <td class="px-6 py-4">
                <div class="text-sm text-gray-900">
                  {{ turma.professorRegente?.user.name || '-' }}
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-500">
                  {{ turma._count?.matriculas || 0 }} / {{ turma.capacidadeMaxima }}
                </div>
                <div class="w-full bg-gray-200 rounded-full h-2 mt-1">
                  <div
                    class="h-2 rounded-full"
                    :class="getCapacidadeClass(turma._count?.matriculas || 0, turma.capacidadeMaxima)"
                    :style="{ width: `${getCapacidadePercentage(turma._count?.matriculas || 0, turma.capacidadeMaxima)}%` }"
                  ></div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-500">{{ turma.sala || '-' }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                <RouterLink
                  :to="`/turmas/${turma.id}/editar`"
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
          Mostrando {{ turmas.length }} de {{ pagination.total }} turmas
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
import { turmasService, type Turma, type AnoLetivo } from '@/services/turmas.service'

const turmas = ref<Turma[]>([])
const anosLetivos = ref<AnoLetivo[]>([])
const loading = ref(false)
const filters = ref({
  search: '',
  serie: '',
  turno: '',
  anoLetivoId: '',
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
    loadTurmas()
  }, 500)
}

async function loadTurmas() {
  loading.value = true
  try {
    const response = await turmasService.list({
      ...filters.value,
      page: pagination.value.page,
      limit: pagination.value.limit,
    })
    turmas.value = response.data
    pagination.value = {
      page: response.meta.page,
      limit: response.meta.limit,
      total: response.meta.total,
      totalPages: response.meta.totalPages,
    }
  } catch (error) {
    console.error('Erro ao carregar turmas:', error)
  } finally {
    loading.value = false
  }
}

async function loadAnosLetivos() {
  try {
    anosLetivos.value = await turmasService.getAnosLetivos()
  } catch (error) {
    console.error('Erro ao carregar anos letivos:', error)
  }
}

function goToPage(page: number) {
  pagination.value.page = page
  loadTurmas()
}

function getTurnoLabel(turno: string): string {
  const labels: Record<string, string> = {
    MANHA: 'Manhã',
    TARDE: 'Tarde',
    NOITE: 'Noite',
    INTEGRAL: 'Integral'
  }
  return labels[turno] || turno
}

function getCapacidadePercentage(atual: number, maxima: number): number {
  return Math.min((atual / maxima) * 100, 100)
}

function getCapacidadeClass(atual: number, maxima: number): string {
  const percentage = (atual / maxima) * 100
  if (percentage >= 90) return 'bg-red-500'
  if (percentage >= 70) return 'bg-yellow-500'
  return 'bg-green-500'
}

onMounted(() => {
  loadAnosLetivos()
  loadTurmas()
})
</script>

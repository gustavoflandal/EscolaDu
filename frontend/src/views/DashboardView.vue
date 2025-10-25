<template>
  <div>
    <h1 class="text-3xl font-bold text-gray-900 mb-8">Dashboard</h1>

    <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
      <div class="card">
        <div class="flex items-center">
          <div class="flex-1">
            <p class="text-sm font-medium text-gray-600">Total de Alunos</p>
            <p class="text-3xl font-bold text-gray-900 mt-2">{{ stats.totalAlunos }}</p>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="flex items-center">
          <div class="flex-1">
            <p class="text-sm font-medium text-gray-600">Turmas Ativas</p>
            <p class="text-3xl font-bold text-gray-900 mt-2">{{ stats.totalTurmas }}</p>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="flex items-center">
          <div class="flex-1">
            <p class="text-sm font-medium text-gray-600">Frequência Média</p>
            <p class="text-3xl font-bold text-gray-900 mt-2">{{ stats.frequenciaMedia }}%</p>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="flex items-center">
          <div class="flex-1">
            <p class="text-sm font-medium text-gray-600">Desempenho Médio</p>
            <p class="text-3xl font-bold text-gray-900 mt-2">{{ stats.desempenhoMedio }}%</p>
          </div>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div class="card">
        <h2 class="text-xl font-semibold text-gray-900 mb-4">Bem-vindo!</h2>
        <p class="text-gray-600 mb-4">
          Sistema de Gerenciamento Escolar - SGE
        </p>
        <p class="text-sm text-gray-500">
          Use o menu acima para navegar pelos diferentes módulos do sistema.
        </p>
      </div>

      <div class="card">
        <h2 class="text-xl font-semibold text-gray-900 mb-4">Ações Rápidas</h2>
        <div class="space-y-3">
          <RouterLink to="/alunos/novo" class="btn btn-primary w-full block text-center">
            Cadastrar Novo Aluno
          </RouterLink>
          <RouterLink to="/frequencia" class="btn btn-secondary w-full block text-center">
            Lançar Frequência
          </RouterLink>
          <RouterLink to="/objetivos" class="btn btn-secondary w-full block text-center">
            Avaliar Objetivos
          </RouterLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { dashboardService, type DashboardStats } from '@/services/dashboard.service'
import { useToast } from 'vue-toastification'

const toast = useToast()
const stats = ref<DashboardStats>({
  totalAlunos: 0,
  totalTurmas: 0,
  frequenciaMedia: 0,
  desempenhoMedio: 0
})
const loading = ref(false)

async function loadStats() {
  loading.value = true
  try {
    stats.value = await dashboardService.getStats()
  } catch (error) {
    console.error('Erro ao carregar estatísticas:', error)
    toast.error('Erro ao carregar estatísticas do dashboard')
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadStats()
})
</script>

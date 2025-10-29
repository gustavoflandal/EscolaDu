<template>
  <div>
    <h1 class="text-3xl font-bold text-gray-900 mb-8">Dashboard</h1>

    <div v-if="loading" class="text-center py-12">
      <p class="text-gray-600">Carregando estatísticas...</p>
    </div>

    <div v-else>
      <!-- Cards de Estatísticas -->
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
              <p class="text-3xl font-bold mt-2" :class="stats.frequenciaMedia >= 75 ? 'text-green-600' : 'text-red-600'">
                {{ stats.frequenciaMedia }}%
              </p>
            </div>
          </div>
        </div>

        <div class="card">
          <div class="flex items-center">
            <div class="flex-1">
              <p class="text-sm font-medium text-gray-600">Desempenho Médio</p>
              <p class="text-3xl font-bold mt-2" :class="stats.desempenhoMedio >= 70 ? 'text-green-600' : 'text-red-600'">
                {{ stats.desempenhoMedio }}%
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Alertas -->
      <div v-if="stats.alertas.frequenciaBaixa > 0 || stats.alertas.desempenhoCritico > 0" class="mb-8">
        <div class="card bg-yellow-50 border-l-4 border-yellow-400">
          <div class="flex">
            <div class="flex-shrink-0">
              <svg class="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z" clip-rule="evenodd" />
              </svg>
            </div>
            <div class="ml-3">
              <h3 class="text-sm font-medium text-yellow-800">Atenção!</h3>
              <div class="mt-2 text-sm text-yellow-700">
                <ul class="list-disc list-inside space-y-1">
                  <li v-if="stats.alertas.frequenciaBaixa > 0">
                    {{ stats.alertas.frequenciaBaixa }} aluno(s) com frequência abaixo de 75%
                  </li>
                  <li v-if="stats.alertas.desempenhoCritico > 0">
                    {{ stats.alertas.desempenhoCritico }} aluno(s) com desempenho crítico
                  </li>
                </ul>
              </div>
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
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { dashboardService, type DashboardStats } from '@/services/dashboard.service'
import { useToast } from 'vue-toastification'

const toast = useToast()
const loading = ref(true)
const stats = ref<DashboardStats>({
  totalAlunos: 0,
  totalTurmas: 0,
  frequenciaMedia: 0,
  desempenhoMedio: 0,
  alertas: {
    frequenciaBaixa: 0,
    desempenhoCritico: 0
  }
})

onMounted(async () => {
  try {
    loading.value = true
    stats.value = await dashboardService.getStats()
  } catch (error) {
    toast.error('Erro ao carregar estatísticas do dashboard')
    console.error('Erro:', error)
  } finally {
    loading.value = false
  }
})
</script>

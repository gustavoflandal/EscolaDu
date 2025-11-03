<template>
  <div>
    <!-- Cabeçalho -->
    <div class="flex items-center justify-between mb-8">
      <h1 class="text-3xl font-bold text-gray-900">Relatório de Frequência</h1>
      <RouterLink to="/" class="btn btn-secondary">Voltar</RouterLink>
    </div>

    <!-- Filtros -->
    <div class="card mb-6">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Turma</label>
          <select v-model="filters.turmaId" class="input" @change="loadRelatorio">
            <option :value="undefined">Selecione uma turma</option>
            <option v-for="turma in turmas" :key="turma.id" :value="turma.id">
              {{ turma.codigo }} - {{ turma.nome }}
            </option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Data Início</label>
          <input
            v-model="filters.dataInicio"
            type="date"
            class="input"
            @change="loadRelatorio"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Data Fim</label>
          <input
            v-model="filters.dataFim"
            type="date"
            class="input"
            @change="loadRelatorio"
          />
        </div>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="text-center py-8">
      <p class="text-gray-600">Carregando relatório...</p>
    </div>

    <!-- Nenhuma turma selecionada -->
    <div v-else-if="!filters.turmaId" class="card text-center py-12">
      <svg class="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
      </svg>
      <p class="text-gray-600 text-lg">Selecione uma turma para visualizar o relatório</p>
    </div>

    <!-- Relatório -->
    <div v-else>
      <!-- Cards de Estatísticas -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div class="card">
          <div class="flex items-center">
            <div class="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <div>
              <p class="text-sm text-gray-600">Total de Alunos</p>
              <p class="text-2xl font-bold text-gray-900">{{ relatorio.totalAlunos || 0 }}</p>
            </div>
          </div>
        </div>

        <div class="card">
          <div class="flex items-center">
            <div class="p-3 rounded-full bg-green-100 text-green-600 mr-4">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p class="text-sm text-gray-600">Frequência Média</p>
              <p class="text-2xl font-bold text-green-600">
                {{ relatorio.frequenciaMedia?.toFixed(1) || 0 }}%
              </p>
            </div>
          </div>
        </div>

        <div class="card">
          <div class="flex items-center">
            <div class="p-3 rounded-full bg-yellow-100 text-yellow-600 mr-4">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div>
              <p class="text-sm text-gray-600">Alertas (<75%)</p>
              <p class="text-2xl font-bold text-yellow-600">
                {{ relatorio.alunosComAlerta?.length || 0 }}
              </p>
            </div>
          </div>
        </div>

        <div class="card">
          <div class="flex items-center">
            <div class="p-3 rounded-full bg-purple-100 text-purple-600 mr-4">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <p class="text-sm text-gray-600">Total de Aulas</p>
              <p class="text-2xl font-bold text-gray-900">{{ relatorio.totalAulas || 0 }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Alertas de Frequência Baixa -->
      <div v-if="relatorio.alunosComAlerta && relatorio.alunosComAlerta.length > 0" class="card mb-6 border-l-4 border-yellow-500">
        <div class="flex items-start">
          <div class="flex-shrink-0">
            <svg class="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <div class="ml-3 flex-1">
            <h3 class="text-lg font-medium text-yellow-800">Alunos com Frequência Abaixo de 75%</h3>
            <div class="mt-2 text-sm text-yellow-700">
              <ul class="list-disc list-inside space-y-1">
                <li v-for="aluno in relatorio.alunosComAlerta" :key="aluno.alunoId">
                  <strong>{{ aluno.aluno?.nome }}</strong> - {{ aluno.percentualPresenca.toFixed(1) }}%
                  ({{ aluno.presentes }} presentes / {{ aluno.totalAulas }} aulas)
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <!-- Tabela de Frequência por Aluno -->
      <div class="card overflow-hidden p-0 mb-6">
        <div class="px-6 py-4 bg-gray-50 border-b border-gray-200">
          <h3 class="text-lg font-medium text-gray-900">Frequência por Aluno</h3>
        </div>
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Aluno</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Matrícula</th>
                <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Total Aulas</th>
                <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Presentes</th>
                <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Faltas</th>
                <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Justificadas</th>
                <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">% Presença</th>
                <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Status</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-if="!relatorio.alunos || relatorio.alunos.length === 0">
                <td colspan="8" class="px-6 py-8 text-center text-gray-500">
                  Nenhum dado de frequência disponível para o período selecionado
                </td>
              </tr>
              <tr v-for="aluno in relatorio.alunos" :key="aluno.alunoId" class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {{ aluno.aluno?.nome || 'Aluno não encontrado' }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {{ aluno.aluno?.matricula || '-' }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600 text-center">
                  {{ aluno.totalAulas }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-green-600 text-center font-medium">
                  {{ aluno.presentes }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-red-600 text-center font-medium">
                  {{ aluno.faltas }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-yellow-600 text-center font-medium">
                  {{ aluno.justificadas }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-center">
                  <span
                    :class="[
                      'px-3 py-1 rounded-full font-semibold',
                      aluno.percentualPresenca >= 90 ? 'bg-green-100 text-green-800' :
                      aluno.percentualPresenca >= 75 ? 'bg-blue-100 text-blue-800' :
                      aluno.percentualPresenca >= 60 ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    ]"
                  >
                    {{ aluno.percentualPresenca.toFixed(1) }}%
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-center">
                  <span
                    v-if="aluno.percentualPresenca < 75"
                    class="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800"
                  >
                    ⚠️ Baixa
                  </span>
                  <span
                    v-else
                    class="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800"
                  >
                    ✓ Normal
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Frequência por Disciplina -->
      <div v-if="relatorio.porDisciplina && relatorio.porDisciplina.length > 0" class="card overflow-hidden p-0">
        <div class="px-6 py-4 bg-gray-50 border-b border-gray-200">
          <h3 class="text-lg font-medium text-gray-900">Frequência por Disciplina</h3>
        </div>
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Disciplina</th>
                <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Total Aulas</th>
                <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Média Presença</th>
                <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Média Faltas</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="disciplina in relatorio.porDisciplina" :key="disciplina.disciplinaId" class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {{ disciplina.disciplina?.nome || 'Disciplina não encontrada' }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600 text-center">
                  {{ disciplina.totalAulas }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-green-600 text-center font-medium">
                  {{ disciplina.mediaPresentes.toFixed(1) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-red-600 text-center font-medium">
                  {{ disciplina.mediaFaltas.toFixed(1) }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { useToast } from 'vue-toastification'
import frequenciaService from '@/services/frequencia.service'
import type { Turma } from '@/types'

const toast = useToast()

const loading = ref(false)
const turmas = ref<Turma[]>([])
const relatorio = ref<any>({})

const filters = ref<{
  turmaId?: string
  dataInicio?: string
  dataFim?: string
}>({
  turmaId: undefined,
  dataInicio: undefined,
  dataFim: undefined
})

async function loadTurmas() {
  try {
    const { default: turmasService } = await import('@/services/turmas.service')
    const result = await turmasService.list({ ativa: true, limit: 100 })
    turmas.value = result.data
  } catch (error) {
    console.error('Erro ao carregar turmas:', error)
  }
}

async function loadRelatorio() {
  if (!filters.value.turmaId) {
    relatorio.value = {}
    return
  }

  loading.value = true
  try {
    const result = await frequenciaService.getFrequenciaTurma(
      filters.value.turmaId,
      {
        dataInicio: filters.value.dataInicio,
        dataFim: filters.value.dataFim
      }
    )
    relatorio.value = result
  } catch (error: any) {
    toast.error(error.response?.data?.message || 'Erro ao carregar relatório')
    relatorio.value = {}
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadTurmas()
  
  // Define período padrão: mês atual
  const hoje = new Date()
  const primeiroDiaMes = new Date(hoje.getFullYear(), hoje.getMonth(), 1)
  filters.value.dataInicio = primeiroDiaMes.toISOString().split('T')[0]
  filters.value.dataFim = hoje.toISOString().split('T')[0]
})
</script>

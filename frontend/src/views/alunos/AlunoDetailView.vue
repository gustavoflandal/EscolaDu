<template>
  <div>
    <div v-if="loading" class="text-center py-12">
      <p class="text-gray-600">Carregando...</p>
    </div>

    <div v-else-if="aluno">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-3xl font-bold text-gray-900">{{ aluno.nome }}</h1>
        <div class="flex gap-2">
          <RouterLink :to="`/alunos/${aluno.id}/editar`" class="btn btn-primary">
            Editar
          </RouterLink>
          <RouterLink to="/alunos" class="btn btn-secondary">
            Voltar
          </RouterLink>
        </div>
      </div>

      <!-- Estatísticas -->
      <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <div class="card">
          <p class="text-sm font-medium text-gray-600">Frequência</p>
          <p class="text-3xl font-bold text-gray-900 mt-2">
            {{ stats?.percentualFrequencia?.toFixed(1) || 0 }}%
          </p>
        </div>
        <div class="card">
          <p class="text-sm font-medium text-gray-600">Desempenho</p>
          <p class="text-3xl font-bold text-gray-900 mt-2">
            {{ stats?.percentualDesempenho?.toFixed(1) || 0 }}%
          </p>
        </div>
        <div class="card">
          <p class="text-sm font-medium text-gray-600">Total Aulas</p>
          <p class="text-3xl font-bold text-gray-900 mt-2">{{ stats?.totalAulas || 0 }}</p>
        </div>
        <div class="card">
          <p class="text-sm font-medium text-gray-600">Total Faltas</p>
          <p class="text-3xl font-bold text-gray-900 mt-2">{{ stats?.aulasFaltas || 0 }}</p>
        </div>
      </div>

      <!-- Dados do Aluno -->
      <div class="card mb-6">
        <h2 class="text-xl font-semibold text-gray-900 mb-4">Informações Pessoais</h2>
        <dl class="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
          <div>
            <dt class="text-sm font-medium text-gray-500">Matrícula</dt>
            <dd class="mt-1 text-sm text-gray-900">{{ aluno.matricula }}</dd>
          </div>
          <div>
            <dt class="text-sm font-medium text-gray-500">Data de Nascimento</dt>
            <dd class="mt-1 text-sm text-gray-900">{{ formatDate(aluno.dataNascimento) }}</dd>
          </div>
          <div v-if="aluno.cpf">
            <dt class="text-sm font-medium text-gray-500">CPF</dt>
            <dd class="mt-1 text-sm text-gray-900">{{ aluno.cpf }}</dd>
          </div>
          <div v-if="aluno.genero">
            <dt class="text-sm font-medium text-gray-500">Sexo</dt>
            <dd class="mt-1 text-sm text-gray-900">{{ formatGenero(aluno.genero) }}</dd>
          </div>
          <div v-if="aluno.telefone">
            <dt class="text-sm font-medium text-gray-500">Telefone</dt>
            <dd class="mt-1 text-sm text-gray-900">{{ aluno.telefone }}</dd>
          </div>
          <div v-if="aluno.email">
            <dt class="text-sm font-medium text-gray-500">E-mail</dt>
            <dd class="mt-1 text-sm text-gray-900">{{ aluno.email }}</dd>
          </div>
          <div v-if="aluno.endereco" class="sm:col-span-2">
            <dt class="text-sm font-medium text-gray-500">Endereço</dt>
            <dd class="mt-1 text-sm text-gray-900">{{ aluno.endereco }}</dd>
          </div>
        </dl>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import { alunosService } from '@/services/alunos.service'
import type { Aluno, AlunoStats } from '@/types'
import { format } from 'date-fns'

const route = useRoute()
const aluno = ref<Aluno | null>(null)
const stats = ref<AlunoStats | null>(null)
const loading = ref(false)

async function loadAluno() {
  loading.value = true
  try {
    const [alunoData, statsData] = await Promise.all([
      alunosService.getById(route.params.id as string),
      alunosService.getStats(route.params.id as string)
    ])
    aluno.value = alunoData
    stats.value = statsData
  } catch (error) {
    console.error('Erro ao carregar aluno:', error)
  } finally {
    loading.value = false
  }
}

function formatDate(date: string) {
  return format(new Date(date), 'dd/MM/yyyy')
}

function formatGenero(genero: string) {
  const generos: Record<string, string> = {
    'M': 'Masculino',
    'F': 'Feminino',
    'Outro': 'Outro'
  }
  return generos[genero] || genero
}

onMounted(() => {
  loadAluno()
})
</script>

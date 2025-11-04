<template>
  <div>
    <!-- Cabeçalho -->
    <div class="flex items-center justify-between mb-8">
      <h1 class="text-3xl font-bold text-gray-900">Mapa de Proficiência</h1>
      <RouterLink to="/objetivos" class="btn btn-secondary">Voltar</RouterLink>
    </div>

    <!-- Filtros -->
    <div class="card mb-6">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Aluno *</label>
          <select v-model="selectedAlunoId" class="input" @change="onAlunoChange" required>
            <option :value="null">Selecione um aluno</option>
            <option v-for="aluno in alunos" :key="aluno.id" :value="aluno.id">
              {{ aluno.nome }} - {{ aluno.matricula }}
            </option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Turma *</label>
          <select
            v-model="selectedTurmaId"
            class="input"
            @change="loadProgramas"
            :disabled="!selectedAlunoId"
            required
          >
            <option :value="null">Selecione uma turma</option>
            <option v-for="turma in turmasDoAluno" :key="turma.id" :value="turma.id">
              {{ turma.nome }} - {{ turma.serie }}
            </option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Programa *</label>
          <select
            v-model="selectedProgramaId"
            class="input"
            @change="loadMapa"
            :disabled="!selectedTurmaId"
            required
          >
            <option :value="null">Selecione um programa</option>
            <option v-for="programa in programas" :key="programa.id" :value="programa.id">
              {{ programa.nome }} ({{ programa.disciplina?.nome }})
            </option>
          </select>
        </div>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="text-center py-12">
      <p class="text-gray-600">Carregando mapa de proficiência...</p>
    </div>

    <!-- Mapa de Proficiência -->
    <div v-else-if="mapa" class="space-y-6">
      <!-- Cards de Estatísticas -->
      <div class="grid grid-cols-2 md:grid-cols-6 gap-4">
        <div class="card text-center">
          <p class="text-sm text-gray-600 mb-1">Total</p>
          <p class="text-3xl font-bold text-gray-900">{{ mapa.estatisticas.totalObjetivos }}</p>
        </div>
        <div class="card text-center bg-green-50 border-green-200">
          <p class="text-sm text-green-700 mb-1">Atingidos</p>
          <p class="text-3xl font-bold text-green-800">{{ mapa.estatisticas.atingidos }}</p>
        </div>
        <div class="card text-center bg-yellow-50 border-yellow-200">
          <p class="text-sm text-yellow-700 mb-1">Em Desenvolvimento</p>
          <p class="text-3xl font-bold text-yellow-800">{{ mapa.estatisticas.emDesenvolvimento }}</p>
        </div>
        <div class="card text-center bg-red-50 border-red-200">
          <p class="text-sm text-red-700 mb-1">Não Atingidos</p>
          <p class="text-3xl font-bold text-red-800">{{ mapa.estatisticas.naoAtingidos }}</p>
        </div>
        <div class="card text-center bg-gray-50 border-gray-200">
          <p class="text-sm text-gray-700 mb-1">Não Avaliados</p>
          <p class="text-3xl font-bold text-gray-800">{{ mapa.estatisticas.naoAvaliados }}</p>
        </div>
        <div class="card text-center bg-blue-50 border-blue-200">
          <p class="text-sm text-blue-700 mb-1">% Atingido</p>
          <p class="text-3xl font-bold text-blue-800">
            {{ mapa.estatisticas.percentualAtingido.toFixed(1) }}%
          </p>
        </div>
      </div>

      <!-- Informações do Aluno -->
      <div class="card bg-blue-50 border-blue-200">
        <div class="flex items-center justify-between">
          <div>
            <h3 class="text-lg font-semibold text-blue-900">{{ mapa.aluno.nome }}</h3>
            <p class="text-sm text-blue-700">
              Matrícula: {{ mapa.aluno.matricula }} | Turma: {{ mapa.turma.nome }} |
              Programa: {{ mapa.programaEnsino.nome }}
            </p>
          </div>
          <button @click="printMapa" class="btn btn-secondary">
            🖨️ Imprimir
          </button>
        </div>
      </div>

      <!-- Matriz de Objetivos -->
      <div class="card p-0 overflow-hidden">
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase w-16">
                  Código
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Objetivo de Aprendizagem
                </th>
                <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase w-24">
                  Status
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase w-32">
                  Data Avaliação
                </th>
                <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase w-24">
                  Evidências
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Observação
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="objetivo in mapa.objetivos" :key="objetivo.id" class="hover:bg-gray-50">
                <td class="px-6 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                  {{ objetivo.codigoBNCC }}
                </td>
                <td class="px-6 py-3 text-sm text-gray-900">
                  {{ objetivo.descricao }}
                </td>
                <td class="px-6 py-3 text-center">
                  <span :class="getStatusBadgeClass(getStatus(objetivo.id))">
                    {{ getStatusLabel(getStatus(objetivo.id)) }}
                  </span>
                </td>
                <td class="px-6 py-3 whitespace-nowrap text-sm text-gray-600">
                  {{ getDataAvaliacao(objetivo.id) }}
                </td>
                <td class="px-6 py-3 text-center">
                  <span
                    v-if="getEvidenciasCount(objetivo.id) > 0"
                    class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                  >
                    {{ getEvidenciasCount(objetivo.id) }} 📎
                  </span>
                  <span v-else class="text-gray-400 text-xs">-</span>
                </td>
                <td class="px-6 py-3 text-sm text-gray-600">
                  {{ getObservacao(objetivo.id) || '-' }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Legenda -->
      <div class="card bg-gray-50">
        <p class="text-sm font-semibold text-gray-700 mb-3">Legenda de Status:</p>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
          <div class="flex items-center gap-2">
            <span class="badge badge-success">A</span>
            <span class="text-gray-700">Atingido</span>
          </div>
          <div class="flex items-center gap-2">
            <span class="badge badge-warning">D</span>
            <span class="text-gray-700">Em Desenvolvimento</span>
          </div>
          <div class="flex items-center gap-2">
            <span class="badge badge-danger">N</span>
            <span class="text-gray-700">Não Atingido</span>
          </div>
          <div class="flex items-center gap-2">
            <span class="badge badge-secondary">NA</span>
            <span class="text-gray-700">Não Avaliado</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Mensagem inicial -->
    <div v-else class="card text-center py-12">
      <p class="text-gray-500">
        Selecione um aluno, turma e programa de ensino para visualizar o mapa de proficiência
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { RouterLink } from 'vue-router';
import objetivosAvaliacoesService, {
  type MapaProficiencia,
} from '@/services/objetivos-avaliacoes.service';
import { alunosService } from '@/services/alunos.service';
import turmasService from '@/services/turmas.service';
import programasEnsinoService from '@/services/programas-ensino.service';
import type { Aluno, Turma } from '@/types';

interface ProgramaEnsino {
  id: string;
  nome: string;
  disciplina?: {
    id: string;
    nome: string;
  };
}

// Estado
const loading = ref(false);
const alunos = ref<Aluno[]>([]);
const turmasDoAluno = ref<Turma[]>([]);
const programas = ref<ProgramaEnsino[]>([]);
const mapa = ref<MapaProficiencia | null>(null);
const selectedAlunoId = ref<string | null>(null);
const selectedTurmaId = ref<string | null>(null);
const selectedProgramaId = ref<string | null>(null);

// Métodos
onMounted(async () => {
  await loadAlunos();
});

async function loadAlunos() {
  try {
    const response = await alunosService.list({});
    alunos.value = response.data || response;
  } catch (error: any) {
    alert('Erro ao carregar alunos: ' + error.message);
  }
}

async function onAlunoChange() {
  selectedTurmaId.value = null;
  selectedProgramaId.value = null;
  mapa.value = null;

  if (selectedAlunoId.value) {
    await loadTurmasDoAluno();
  }
}

async function loadTurmasDoAluno() {
  try {
    // Obter turmas do aluno através das matrículas ativas
    const response = await turmasService.list({});
    // Filtrar turmas que o aluno está matriculado
    // TODO: Ajustar para filtrar corretamente com endpoint específico
    turmasDoAluno.value = response.data || response;
  } catch (error: any) {
    alert('Erro ao carregar turmas: ' + error.message);
  }
}

async function loadProgramas() {
  if (!selectedTurmaId.value) return;

  try {
    const response = await programasEnsinoService.list({});
    programas.value = response.data || response;
  } catch (error: any) {
    alert('Erro ao carregar programas: ' + error.message);
  }
}

async function loadMapa() {
  if (!selectedAlunoId.value || !selectedTurmaId.value || !selectedProgramaId.value) return;

  try {
    loading.value = true;
    mapa.value = await objetivosAvaliacoesService.getMapaProficiencia(
      selectedAlunoId.value,
      selectedTurmaId.value,
      selectedProgramaId.value
    );
  } catch (error: any) {
    alert('Erro ao carregar mapa de proficiência: ' + error.message);
  } finally {
    loading.value = false;
  }
}

function getStatus(objetivoId: string): string {
  const avaliacao = mapa.value?.avaliacoes.find((a) => a.objetivoId === objetivoId);
  return avaliacao?.status || 'NA';
}

function getDataAvaliacao(objetivoId: string): string {
  const avaliacao = mapa.value?.avaliacoes.find((a) => a.objetivoId === objetivoId);
  if (!avaliacao) return '-';
  return new Date(avaliacao.dataAvaliacao).toLocaleDateString('pt-BR');
}

function getEvidenciasCount(objetivoId: string): number {
  const avaliacao = mapa.value?.avaliacoes.find((a) => a.objetivoId === objetivoId);
  return avaliacao?._count?.evidencias || 0;
}

function getObservacao(objetivoId: string): string | undefined {
  const avaliacao = mapa.value?.avaliacoes.find((a) => a.objetivoId === objetivoId);
  return avaliacao?.observacao;
}

function getStatusLabel(status: string): string {
  switch (status) {
    case 'A':
      return 'Atingido';
    case 'D':
      return 'Em Desenvolvimento';
    case 'N':
      return 'Não Atingido';
    case 'NA':
      return 'Não Avaliado';
    default:
      return '-';
  }
}

function getStatusBadgeClass(status: string): string {
  switch (status) {
    case 'A':
      return 'badge badge-success';
    case 'D':
      return 'badge badge-warning';
    case 'N':
      return 'badge badge-danger';
    case 'NA':
      return 'badge badge-secondary';
    default:
      return 'badge';
  }
}

function printMapa() {
  window.print();
}
</script>

<style scoped>
@media print {
  .btn,
  nav {
    display: none;
  }
}
</style>

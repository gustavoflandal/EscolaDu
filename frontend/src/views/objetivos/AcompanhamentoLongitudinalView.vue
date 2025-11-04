<template>
  <div>
    <!-- Cabeçalho -->
    <div class="flex items-center justify-between mb-8">
      <h1 class="text-3xl font-bold text-gray-900">Acompanhamento Longitudinal</h1>
      <RouterLink to="/objetivos" class="btn btn-secondary">Voltar</RouterLink>
    </div>

    <!-- Filtros -->
    <div class="card mb-6">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Aluno *</label>
          <select v-model="selectedAlunoId" class="input" @change="loadAcompanhamento" required>
            <option :value="null">Selecione um aluno</option>
            <option v-for="aluno in alunos" :key="aluno.id" :value="aluno.id">
              {{ aluno.nome }} - {{ aluno.matricula }}
            </option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Programa (Opcional)</label>
          <select v-model="selectedProgramaId" class="input" @change="loadAcompanhamento">
            <option :value="null">Todos os programas</option>
            <option v-for="programa in programas" :key="programa.id" :value="programa.id">
              {{ programa.nome }} ({{ programa.disciplina?.nome }})
            </option>
          </select>
        </div>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="text-center py-12">
      <p class="text-gray-600">Carregando acompanhamento longitudinal...</p>
    </div>

    <!-- Acompanhamento Longitudinal -->
    <div v-else-if="acompanhamento" class="space-y-6">
      <!-- Informações do Aluno -->
      <div class="card bg-blue-50 border-blue-200">
        <h3 class="text-lg font-semibold text-blue-900">{{ acompanhamento.aluno.nome }}</h3>
        <p class="text-sm text-blue-700">
          Matrícula: {{ acompanhamento.aluno.matricula }} |
          Anos letivos registrados: {{ acompanhamento.anosLetivos.length }}
        </p>
      </div>

      <!-- Gráfico de Evolução -->
      <div class="card">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Evolução do Percentual de Atingimento</h3>
        <div class="h-64 flex items-end justify-around gap-2">
          <div
            v-for="anoLetivo in acompanhamento.anosLetivos"
            :key="anoLetivo.ano"
            class="flex-1 flex flex-col items-center"
          >
            <div
              class="w-full bg-blue-500 rounded-t transition-all hover:bg-blue-600"
              :style="{
                height: `${anoLetivo.estatisticas.percentualAtingido}%`,
                minHeight: '4px'
              }"
              :title="`${anoLetivo.estatisticas.percentualAtingido.toFixed(1)}%`"
            ></div>
            <p class="text-sm font-semibold text-gray-900 mt-2">
              {{ anoLetivo.estatisticas.percentualAtingido.toFixed(1) }}%
            </p>
            <p class="text-xs text-gray-600">{{ anoLetivo.ano }}</p>
          </div>
        </div>
      </div>

      <!-- Timeline de Anos Letivos -->
      <div class="space-y-6">
        <h3 class="text-lg font-semibold text-gray-900">Histórico por Ano Letivo</h3>

        <div
          v-for="(anoLetivo, index) in acompanhamento.anosLetivos"
          :key="anoLetivo.ano"
          class="relative"
        >
          <!-- Linha da timeline (exceto no último) -->
          <div
            v-if="index < acompanhamento.anosLetivos.length - 1"
            class="absolute left-6 top-14 bottom-0 w-0.5 bg-gray-300"
          ></div>

          <!-- Card do Ano -->
          <div class="card ml-14 relative">
            <!-- Marcador circular -->
            <div
              class="absolute -left-20 top-6 w-12 h-12 rounded-full flex items-center justify-center font-bold text-white shadow-md"
              :class="getAnoColor(anoLetivo.estatisticas.percentualAtingido)"
            >
              {{ anoLetivo.ano }}
            </div>

            <!-- Conteúdo -->
            <div class="space-y-4">
              <!-- Estatísticas do Ano -->
              <div class="grid grid-cols-2 md:grid-cols-6 gap-3">
                <div class="text-center">
                  <p class="text-xs text-gray-600">Total</p>
                  <p class="text-2xl font-bold text-gray-900">
                    {{ anoLetivo.estatisticas.totalObjetivos }}
                  </p>
                </div>
                <div class="text-center bg-green-50 rounded p-2">
                  <p class="text-xs text-green-700">Atingidos</p>
                  <p class="text-2xl font-bold text-green-800">
                    {{ anoLetivo.estatisticas.atingidos }}
                  </p>
                </div>
                <div class="text-center bg-yellow-50 rounded p-2">
                  <p class="text-xs text-yellow-700">Em Desenv.</p>
                  <p class="text-2xl font-bold text-yellow-800">
                    {{ anoLetivo.estatisticas.emDesenvolvimento }}
                  </p>
                </div>
                <div class="text-center bg-red-50 rounded p-2">
                  <p class="text-xs text-red-700">Não Ating.</p>
                  <p class="text-2xl font-bold text-red-800">
                    {{ anoLetivo.estatisticas.naoAtingidos }}
                  </p>
                </div>
                <div class="text-center bg-gray-50 rounded p-2">
                  <p class="text-xs text-gray-700">Não Aval.</p>
                  <p class="text-2xl font-bold text-gray-800">
                    {{ anoLetivo.estatisticas.naoAvaliados }}
                  </p>
                </div>
                <div class="text-center bg-blue-50 rounded p-2">
                  <p class="text-xs text-blue-700">% Atingido</p>
                  <p class="text-2xl font-bold text-blue-800">
                    {{ anoLetivo.estatisticas.percentualAtingido.toFixed(1) }}%
                  </p>
                </div>
              </div>

              <!-- Botão para expandir/recolher -->
              <button
                @click="toggleAno(anoLetivo.ano)"
                class="text-sm text-blue-600 hover:text-blue-800"
              >
                {{ expandedAnos.has(anoLetivo.ano) ? '▼ Recolher' : '▶ Ver detalhes' }}
                ({{ anoLetivo.avaliacoes.length }} avaliações)
              </button>

              <!-- Detalhes Expandidos -->
              <div v-if="expandedAnos.has(anoLetivo.ano)" class="space-y-2">
                <div class="overflow-x-auto">
                  <table class="min-w-full divide-y divide-gray-200">
                    <thead class="bg-gray-50">
                      <tr>
                        <th class="px-4 py-2 text-left text-xs font-medium text-gray-500">
                          Objetivo
                        </th>
                        <th class="px-4 py-2 text-center text-xs font-medium text-gray-500">
                          Status
                        </th>
                        <th class="px-4 py-2 text-left text-xs font-medium text-gray-500">
                          Data
                        </th>
                        <th class="px-4 py-2 text-left text-xs font-medium text-gray-500">
                          Turma
                        </th>
                        <th class="px-4 py-2 text-left text-xs font-medium text-gray-500">
                          Programa
                        </th>
                      </tr>
                    </thead>
                    <tbody class="bg-white divide-y divide-gray-200">
                      <tr v-for="aval in anoLetivo.avaliacoes" :key="aval.id" class="text-sm">
                        <td class="px-4 py-2">
                          {{ aval.objetivo.codigoBNCC }} - {{ aval.objetivo.descricao }}
                        </td>
                        <td class="px-4 py-2 text-center">
                          <span :class="getStatusBadgeClass(aval.status)">
                            {{ getStatusLabel(aval.status) }}
                          </span>
                        </td>
                        <td class="px-4 py-2 text-gray-600">
                          {{ formatDate(aval.dataAvaliacao) }}
                        </td>
                        <td class="px-4 py-2 text-gray-600">
                          {{ aval.turma.nome }}
                        </td>
                        <td class="px-4 py-2 text-gray-600">
                          {{ aval.objetivo.programaEnsino?.nome }}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Resumo Geral -->
      <div class="card bg-gray-50">
        <h3 class="text-lg font-semibold text-gray-900 mb-3">Análise Geral</h3>
        <div class="space-y-2 text-sm text-gray-700">
          <p>
            <strong>Tendência:</strong>
            {{ getTendencia() }}
          </p>
          <p>
            <strong>Melhor ano:</strong>
            {{ getMelhorAno() }}
          </p>
          <p>
            <strong>Total de avaliações:</strong>
            {{ getTotalAvaliacoes() }}
          </p>
        </div>
      </div>
    </div>

    <!-- Mensagem inicial -->
    <div v-else class="card text-center py-12">
      <p class="text-gray-500">Selecione um aluno para visualizar o acompanhamento longitudinal</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { RouterLink } from 'vue-router';
import objetivosAvaliacoesService, {
  type AcompanhamentoLongitudinal,
} from '@/services/objetivos-avaliacoes.service';
import { alunosService } from '@/services/alunos.service';
import programasEnsinoService from '@/services/programas-ensino.service';
import type { Aluno } from '@/types';

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
const programas = ref<ProgramaEnsino[]>([]);
const acompanhamento = ref<AcompanhamentoLongitudinal | null>(null);
const selectedAlunoId = ref<string | null>(null);
const selectedProgramaId = ref<string | null>(null);
const expandedAnos = ref<Set<number>>(new Set());

// Métodos
onMounted(async () => {
  await Promise.all([loadAlunos(), loadProgramas()]);
});

async function loadAlunos() {
  try {
    const response = await alunosService.list({});
    alunos.value = response.data || response;
  } catch (error: any) {
    alert('Erro ao carregar alunos: ' + error.message);
  }
}

async function loadProgramas() {
  try {
    const response = await programasEnsinoService.list({});
    programas.value = response.data || response;
  } catch (error: any) {
    alert('Erro ao carregar programas: ' + error.message);
  }
}

async function loadAcompanhamento() {
  if (!selectedAlunoId.value) return;

  try {
    loading.value = true;
    acompanhamento.value = await objetivosAvaliacoesService.getAcompanhamentoLongitudinal(
      selectedAlunoId.value,
      selectedProgramaId.value || undefined
    );
    expandedAnos.value.clear();
  } catch (error: any) {
    alert('Erro ao carregar acompanhamento: ' + error.message);
  } finally {
    loading.value = false;
  }
}

function toggleAno(ano: number) {
  if (expandedAnos.value.has(ano)) {
    expandedAnos.value.delete(ano);
  } else {
    expandedAnos.value.add(ano);
  }
}

function getAnoColor(percentual: number): string {
  if (percentual >= 80) return 'bg-green-500';
  if (percentual >= 60) return 'bg-yellow-500';
  if (percentual >= 40) return 'bg-orange-500';
  return 'bg-red-500';
}

function getStatusLabel(status: string): string {
  switch (status) {
    case 'A':
      return 'Atingido';
    case 'D':
      return 'Em Desenv.';
    case 'N':
      return 'Não Ating.';
    case 'NA':
      return 'Não Aval.';
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

function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('pt-BR');
}

function getTendencia(): string {
  if (!acompanhamento.value || acompanhamento.value.anosLetivos.length < 2) {
    return 'Dados insuficientes para análise de tendência';
  }

  const anos = acompanhamento.value.anosLetivos;
  const primeiro = anos[0].estatisticas.percentualAtingido;
  const ultimo = anos[anos.length - 1].estatisticas.percentualAtingido;
  const diferenca = ultimo - primeiro;

  if (diferenca > 10) return `📈 Crescimento significativo (+${diferenca.toFixed(1)}%)`;
  if (diferenca > 0) return `📊 Crescimento moderado (+${diferenca.toFixed(1)}%)`;
  if (diferenca === 0) return '➡️ Estável';
  if (diferenca > -10) return `📉 Declínio moderado (${diferenca.toFixed(1)}%)`;
  return `📉 Declínio significativo (${diferenca.toFixed(1)}%)`;
}

function getMelhorAno(): string {
  if (!acompanhamento.value || acompanhamento.value.anosLetivos.length === 0) {
    return 'N/A';
  }

  const melhor = acompanhamento.value.anosLetivos.reduce((prev, curr) =>
    curr.estatisticas.percentualAtingido > prev.estatisticas.percentualAtingido ? curr : prev
  );

  return `${melhor.ano} (${melhor.estatisticas.percentualAtingido.toFixed(1)}%)`;
}

function getTotalAvaliacoes(): number {
  if (!acompanhamento.value) return 0;
  return acompanhamento.value.anosLetivos.reduce(
    (total, ano) => total + ano.avaliacoes.length,
    0
  );
}
</script>

<style scoped>
/* Timeline styles */
.relative {
  position: relative;
}

/* Badge styles */
.badge {
  @apply inline-flex items-center px-2 py-1 rounded-full text-xs font-medium;
}

.badge-success {
  @apply bg-green-100 text-green-800;
}

.badge-warning {
  @apply bg-yellow-100 text-yellow-800;
}

.badge-danger {
  @apply bg-red-100 text-red-800;
}

.badge-secondary {
  @apply bg-gray-100 text-gray-800;
}
</style>

<template>
  <div>
    <!-- Cabeçalho -->
    <div class="flex items-center justify-between mb-8">
      <h1 class="text-3xl font-bold text-gray-900">Avaliação de Objetivos de Aprendizagem</h1>
      <RouterLink to="/objetivos" class="btn btn-secondary">Voltar</RouterLink>
    </div>

    <!-- Filtros -->
    <div class="card mb-6">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Turma *</label>
          <select
            v-model="selectedTurmaId"
            class="input"
            @change="onTurmaChange"
            required
          >
            <option :value="null">Selecione uma turma</option>
            <option v-for="turma in turmas" :key="turma.id" :value="turma.id">
              {{ turma.nome }} - {{ turma.serie.nome }}
            </option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Programa de Ensino *</label>
          <select
            v-model="selectedProgramaId"
            class="input"
            @change="loadObjetivos"
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
      <p class="text-gray-600">Carregando dados...</p>
    </div>

    <!-- Grade de Avaliação -->
    <div v-else-if="selectedTurmaId && selectedProgramaId" class="card p-0 overflow-hidden">
      <!-- Informações -->
      <div class="bg-blue-50 p-4 border-b border-blue-100">
        <p class="text-sm text-blue-800">
          <strong>Total de objetivos:</strong> {{ objetivos.length }} |
          <strong>Total de alunos:</strong> {{ alunos.length }} |
          <strong>Avaliações pendentes:</strong> {{ pendingCount }}
        </p>
      </div>

      <!-- Tabela -->
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50 sticky top-0 z-10">
            <tr>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase sticky left-0 bg-gray-50 border-r border-gray-200">
                Aluno
              </th>
              <th
                v-for="objetivo in objetivos"
                :key="objetivo.id"
                class="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase border-r border-gray-100"
                style="min-width: 80px; max-width: 120px;"
              >
                <div class="truncate" :title="objetivo.descricao">
                  {{ objetivo.codigo }}
                </div>
              </th>
              <th class="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase bg-gray-100">
                Ações
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="aluno in alunos" :key="aluno.id" class="hover:bg-gray-50">
              <!-- Nome do Aluno -->
              <td class="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-900 sticky left-0 bg-white border-r border-gray-200">
                <div class="flex items-center">
                  <div>
                    <p>{{ aluno.nome }}</p>
                    <p class="text-xs text-gray-500">{{ aluno.matricula }}</p>
                  </div>
                </div>
              </td>

              <!-- Células de Avaliação -->
              <td
                v-for="objetivo in objetivos"
                :key="objetivo.id"
                class="px-2 py-2 text-center border-r border-gray-100"
              >
                <select
                  v-model="avaliacoes[`${aluno.id}-${objetivo.id}`]"
                  class="w-full text-xs rounded border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  :class="getStatusClass(avaliacoes[`${aluno.id}-${objetivo.id}`])"
                  @change="markAsModified(aluno.id, objetivo.id)"
                >
                  <option value="">-</option>
                  <option value="A">A</option>
                  <option value="D">D</option>
                  <option value="N">N</option>
                  <option value="NA">NA</option>
                </select>
              </td>

              <!-- Botão de Evidências (desabilitado temporariamente) -->
              <td class="px-4 py-2 text-center bg-gray-50">
                <button
                  disabled
                  class="text-gray-400 cursor-not-allowed text-xs"
                  title="Em breve: Gerenciar evidências"
                >
                  📎
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Legenda -->
      <div class="bg-gray-50 p-4 border-t border-gray-200">
        <div class="flex items-center gap-6 text-xs">
          <span class="font-semibold text-gray-700">Legenda:</span>
          <span class="flex items-center gap-1">
            <span class="inline-block w-4 h-4 rounded bg-green-100 border border-green-300"></span>
            <strong>A</strong> = Atingido
          </span>
          <span class="flex items-center gap-1">
            <span class="inline-block w-4 h-4 rounded bg-yellow-100 border border-yellow-300"></span>
            <strong>D</strong> = Em Desenvolvimento
          </span>
          <span class="flex items-center gap-1">
            <span class="inline-block w-4 h-4 rounded bg-red-100 border border-red-300"></span>
            <strong>N</strong> = Não Atingido
          </span>
          <span class="flex items-center gap-1">
            <span class="inline-block w-4 h-4 rounded bg-gray-100 border border-gray-300"></span>
            <strong>NA</strong> = Não Avaliado
          </span>
        </div>
      </div>

      <!-- Botão Salvar -->
      <div class="p-4 border-t border-gray-200 bg-white flex justify-between items-center">
        <p class="text-sm text-gray-600">
          {{ modifiedCount }} avaliação(ões) modificada(s)
        </p>
        <button
          @click="salvarAvaliacoes"
          class="btn btn-primary"
          :disabled="modifiedCount === 0 || saving"
        >
          {{ saving ? 'Salvando...' : 'Salvar Avaliações' }}
        </button>
      </div>
    </div>

    <!-- Mensagem inicial -->
    <div v-else class="card text-center py-12">
      <p class="text-gray-500">Selecione uma turma e um programa de ensino para começar a avaliar</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { RouterLink } from 'vue-router';
import objetivosAvaliacoesService, {
  type ObjetivoAprendizagem,
  type StatusAvaliacao,
} from '@/services/objetivos-avaliacoes.service';
import turmasService from '@/services/turmas.service';
import programasEnsinoService from '@/services/programas-ensino.service';
import { alunosService } from '@/services/alunos.service';
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
const saving = ref(false);
const turmas = ref<Turma[]>([]);
const programas = ref<ProgramaEnsino[]>([]);
const objetivos = ref<ObjetivoAprendizagem[]>([]);
const alunos = ref<Aluno[]>([]);
const selectedTurmaId = ref<string | null>(null);
const selectedProgramaId = ref<string | null>(null);

// Avaliações: chave = "alunoId-objetivoId", valor = status
const avaliacoes = ref<Record<string, StatusAvaliacao | ''>>({});
const modified = ref<Set<string>>(new Set());

// Computed
const modifiedCount = computed(() => modified.value.size);
const pendingCount = computed(() => {
  let count = 0;
  for (const aluno of alunos.value) {
    for (const objetivo of objetivos.value) {
      const key = `${aluno.id}-${objetivo.id}`;
      if (!avaliacoes.value[key] || avaliacoes.value[key] === 'NA') {
        count++;
      }
    }
  }
  return count;
});

// Métodos
onMounted(async () => {
  await loadTurmas();
});

async function loadTurmas() {
  try {
    const response = await turmasService.list({ ativa: true });
    turmas.value = Array.isArray(response) ? response : (response?.data || []);
    console.log('🏫 Turmas carregadas:', turmas.value.length);
    if (turmas.value.length > 0) {
      console.log('🏫 Primeira turma (série):', turmas.value[0].serie);
    }
  } catch (error: any) {
    console.error('❌ Erro ao carregar turmas:', error);
    alert('Erro ao carregar turmas: ' + error.message);
  }
}

async function onTurmaChange() {
  selectedProgramaId.value = null;
  objetivos.value = [];
  alunos.value = [];
  avaliacoes.value = {};
  modified.value.clear();

  if (selectedTurmaId.value) {
    await Promise.all([loadProgramas(), loadAlunos()]);
  }
}

async function loadProgramas() {
  try {
    loading.value = true;
    
    // Buscar turma selecionada para obter a série
    const turmaSelecionada = turmas.value.find(t => t.id === selectedTurmaId.value);
    
    if (!turmaSelecionada) {
      programas.value = [];
      return;
    }

    // Extrair ID da série (serie agora é sempre um objeto com id)
    const serieId = typeof turmaSelecionada.serie === 'object' 
      ? (turmaSelecionada.serie as any)?.id 
      : turmaSelecionada.serie;

    console.log('📚 Buscando programas para série:', serieId, turmaSelecionada.serie);

    // Filtrar programas pela série da turma (usando serieId)
    const response = await programasEnsinoService.list({
      serie: serieId,
      active: true
    });
    
    console.log('📚 Programas retornados:', response);
    
    // O service já retorna os dados diretamente
    programas.value = Array.isArray(response) ? response : (response?.data || []);
    
    console.log('📚 Total de programas carregados:', programas.value.length);
  } catch (error: any) {
    console.error('❌ Erro ao carregar programas:', error);
    alert('Erro ao carregar programas: ' + error.message);
  } finally {
    loading.value = false;
  }
}

async function loadAlunos() {
  try {
    const response = await alunosService.list({});
    // TODO: filtrar alunos pela turma
    alunos.value = response.data || response;
  } catch (error: any) {
    alert('Erro ao carregar alunos: ' + error.message);
  }
}

async function loadObjetivos() {
  if (!selectedProgramaId.value) return;

  try {
    loading.value = true;
    objetivos.value = [];
    avaliacoes.value = {};
    modified.value.clear();

    // Carregar objetivos do programa
    const objResponse = await programasEnsinoService.getObjetivos(selectedProgramaId.value);
    objetivos.value = objResponse.sort((a: any, b: any) => a.ordem - b.ordem);

    // Carregar avaliações existentes
    const avalResponse = await objetivosAvaliacoesService.listAvaliacoes({
      turmaId: selectedTurmaId.value!,
      programaEnsinoId: selectedProgramaId.value,
      limit: 1000,
    });

    // Preencher matriz com avaliações existentes
    for (const aval of avalResponse.data) {
      const key = `${aval.alunoId}-${aval.objetivoId}`;
      avaliacoes.value[key] = aval.status;
    }
  } catch (error: any) {
    alert('Erro ao carregar objetivos: ' + error.message);
  } finally {
    loading.value = false;
  }
}

function markAsModified(alunoId: string, objetivoId: string) {
  modified.value.add(`${alunoId}-${objetivoId}`);
}

function getStatusClass(status: StatusAvaliacao | '' | undefined): string {
  switch (status) {
    case 'A':
      return 'bg-green-100 border-green-300 text-green-800';
    case 'D':
      return 'bg-yellow-100 border-yellow-300 text-yellow-800';
    case 'N':
      return 'bg-red-100 border-red-300 text-red-800';
    case 'NA':
      return 'bg-gray-100 border-gray-300 text-gray-600';
    default:
      return 'bg-white';
  }
}

async function salvarAvaliacoes() {
  if (modifiedCount.value === 0) return;

  const confirmacao = confirm(
    `Você está prestes a salvar ${modifiedCount.value} avaliação(ões). Deseja continuar?`
  );
  if (!confirmacao) return;

  try {
    saving.value = true;

    // Montar array de avaliações modificadas
    const avaliacoesParaSalvar = Array.from(modified.value)
      .map((key) => {
        const [alunoId, objetivoId] = key.split('-');
        const status = avaliacoes.value[key];
        if (!status) return null;

        return {
          alunoId,
          objetivoId,
          status: status as StatusAvaliacao,
        };
      })
      .filter((a) => a !== null);

    // Salvar em lote
    const result = await objetivosAvaliacoesService.avaliarLote({
      turmaId: selectedTurmaId.value!,
      programaEnsinoId: selectedProgramaId.value!,
      avaliacoes: avaliacoesParaSalvar as any,
    });

    if (result.erro > 0) {
      alert(
        `Avaliações salvas com sucesso: ${result.sucesso}\nErros: ${result.erro}\nVerifique o console para detalhes.`
      );
      console.error('Erros nas avaliações:', result.erros);
    } else {
      alert(`${result.sucesso} avaliação(ões) salva(s) com sucesso!`);
    }

    // Limpar modificações
    modified.value.clear();

    // Recarregar para atualizar IDs
    await loadObjetivos();
  } catch (error: any) {
    alert('Erro ao salvar avaliações: ' + error.message);
  } finally {
    saving.value = false;
  }
}
</script>

<style scoped>
/* Estilos customizados para a tabela */
table {
  border-collapse: separate;
  border-spacing: 0;
}

thead th {
  position: sticky;
  top: 0;
  z-index: 20;
}

thead th.sticky {
  left: 0;
  z-index: 30;
}

tbody td.sticky {
  left: 0;
  z-index: 10;
}

/* Scroll horizontal */
.overflow-x-auto {
  max-height: calc(100vh - 400px);
  overflow-y: auto;
}
</style>

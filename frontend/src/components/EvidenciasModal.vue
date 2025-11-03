<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="show" class="fixed inset-0 z-50 overflow-y-auto">
        <!-- Overlay -->
        <div
          class="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
          @click="close"
        ></div>

        <!-- Modal -->
        <div class="flex min-h-full items-center justify-center p-4">
          <div
            class="relative bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            @click.stop
          >
            <!-- Header -->
            <div class="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
              <div>
                <h3 class="text-lg font-semibold text-gray-900">Evidências de Aprendizagem</h3>
                <p class="text-sm text-gray-600">{{ aluno?.nome }} - {{ aluno?.matricula }}</p>
              </div>
              <button
                @click="close"
                class="text-gray-400 hover:text-gray-600 transition"
              >
                <span class="text-2xl">×</span>
              </button>
            </div>

            <!-- Loading -->
            <div v-if="loading" class="p-8 text-center">
              <p class="text-gray-600">Carregando evidências...</p>
            </div>

            <!-- Conteúdo -->
            <div v-else class="p-6 space-y-6">
              <!-- Formulário de Nova Evidência -->
              <div class="card bg-blue-50 border-blue-200">
                <h4 class="text-sm font-semibold text-blue-900 mb-3">📎 Adicionar Nova Evidência</h4>
                <form @submit.prevent="adicionarEvidencia" class="space-y-3">
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label class="block text-xs font-medium text-gray-700 mb-1">
                        Avaliação *
                      </label>
                      <select
                        v-model="novaEvidencia.avaliacaoObjetivoId"
                        class="input text-sm"
                        required
                      >
                        <option value="">Selecione um objetivo avaliado</option>
                        <option
                          v-for="aval in avaliacoesDoAluno"
                          :key="aval.id"
                          :value="aval.id"
                        >
                          {{ aval.objetivo.codigo }} - {{ aval.objetivo.descricao.substring(0, 50) }}...
                        </option>
                      </select>
                    </div>

                    <div>
                      <label class="block text-xs font-medium text-gray-700 mb-1">Tipo *</label>
                      <select v-model="novaEvidencia.tipo" class="input text-sm" required>
                        <option value="">Selecione</option>
                        <option value="FOTO">📷 Foto</option>
                        <option value="VIDEO">🎥 Vídeo</option>
                        <option value="DOCUMENTO">📄 Documento</option>
                        <option value="TEXTO">📝 Texto</option>
                        <option value="ATIVIDADE">✏️ Atividade</option>
                        <option value="PROJETO">🎯 Projeto</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label class="block text-xs font-medium text-gray-700 mb-1">
                      URL do Arquivo (Opcional)
                    </label>
                    <input
                      v-model="novaEvidencia.arquivoUrl"
                      type="url"
                      class="input text-sm"
                      placeholder="https://..."
                    />
                  </div>

                  <div>
                    <label class="block text-xs font-medium text-gray-700 mb-1">Descrição *</label>
                    <textarea
                      v-model="novaEvidencia.descricao"
                      class="input text-sm"
                      rows="3"
                      required
                      placeholder="Descreva a evidência de aprendizagem..."
                    ></textarea>
                  </div>

                  <div class="flex justify-end">
                    <button type="submit" class="btn btn-primary btn-sm" :disabled="salvando">
                      {{ salvando ? 'Salvando...' : '✓ Adicionar Evidência' }}
                    </button>
                  </div>
                </form>
              </div>

              <!-- Lista de Evidências Agrupadas por Objetivo -->
              <div v-if="evidenciasPorObjetivo.length > 0" class="space-y-4">
                <h4 class="text-sm font-semibold text-gray-900">📋 Evidências Existentes</h4>

                <div
                  v-for="grupo in evidenciasPorObjetivo"
                  :key="grupo.objetivo.id"
                  class="card"
                >
                  <!-- Cabeçalho do Objetivo -->
                  <div class="flex items-start justify-between mb-3 pb-3 border-b border-gray-200">
                    <div>
                      <p class="text-sm font-semibold text-gray-900">
                        {{ grupo.objetivo.codigo }} - {{ grupo.objetivo.descricao }}
                      </p>
                      <p class="text-xs text-gray-600 mt-1">
                        Status: <span :class="getStatusClass(grupo.avaliacao.status)">
                          {{ getStatusLabel(grupo.avaliacao.status) }}
                        </span>
                      </p>
                    </div>
                    <span class="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                      {{ grupo.evidencias.length }} evidência(s)
                    </span>
                  </div>

                  <!-- Lista de Evidências -->
                  <div class="space-y-2">
                    <div
                      v-for="evidencia in grupo.evidencias"
                      :key="evidencia.id"
                      class="flex items-start gap-3 p-3 bg-gray-50 rounded border border-gray-200"
                    >
                      <div class="text-2xl flex-shrink-0">
                        {{ getTipoIcon(evidencia.tipo) }}
                      </div>
                      <div class="flex-1 min-w-0">
                        <p class="text-sm font-medium text-gray-900">
                          {{ getTipoLabel(evidencia.tipo) }}
                        </p>
                        <p class="text-xs text-gray-600 mt-1">{{ evidencia.descricao }}</p>
                        <div class="flex items-center gap-3 mt-2">
                          <p class="text-xs text-gray-500">
                            {{ formatDate(evidencia.createdAt) }}
                          </p>
                          <a
                            v-if="evidencia.arquivoUrl"
                            :href="evidencia.arquivoUrl"
                            target="_blank"
                            class="text-xs text-blue-600 hover:underline"
                          >
                            🔗 Abrir arquivo
                          </a>
                        </div>
                      </div>
                      <button
                        @click="excluirEvidencia(evidencia.id)"
                        class="text-red-600 hover:text-red-800 text-sm"
                        title="Excluir evidência"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Mensagem quando não há evidências -->
              <div v-else class="text-center py-8">
                <p class="text-gray-500 text-sm">Nenhuma evidência cadastrada ainda</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import objetivosAvaliacoesService, {
  type EvidenciasPorObjetivo,
  type AvaliacaoObjetivo,
  type TipoEvidencia,
} from '@/services/objetivos-avaliacoes.service';

interface Props {
  show: boolean;
  alunoId: string | null;
  turmaId?: string | null;
  aluno?: { nome: string; matricula: string };
}

const props = defineProps<Props>();
const emit = defineEmits<{
  close: [];
  updated: [];
}>();

// Estado
const loading = ref(false);
const salvando = ref(false);
const evidenciasPorObjetivo = ref<EvidenciasPorObjetivo[]>([]);
const avaliacoesDoAluno = ref<AvaliacaoObjetivo[]>([]);

const novaEvidencia = ref({
  avaliacaoObjetivoId: '',
  tipo: '' as TipoEvidencia | '',
  arquivoUrl: '',
  descricao: '',
});

// Watch para carregar dados quando o modal abre
watch(
  () => props.show,
  async (newValue) => {
    if (newValue && props.alunoId) {
      await loadEvidencias();
    }
  }
);

async function loadEvidencias() {
  if (!props.alunoId) return;

  try {
    loading.value = true;

    // Carregar evidências agrupadas por objetivo
    evidenciasPorObjetivo.value = await objetivosAvaliacoesService.getEvidenciasPorAluno(
      props.alunoId,
      props.turmaId || undefined
    );

    // Carregar avaliações do aluno para o select
    const response = await objetivosAvaliacoesService.listAvaliacoes({
      alunoId: props.alunoId,
      turmaId: props.turmaId || undefined,
      limit: 1000,
    });
    avaliacoesDoAluno.value = response.data;
  } catch (error: any) {
    alert('Erro ao carregar evidências: ' + error.message);
  } finally {
    loading.value = false;
  }
}

async function adicionarEvidencia() {
  if (!props.alunoId || !novaEvidencia.value.tipo || !novaEvidencia.value.descricao) return;

  try {
    salvando.value = true;

    await objetivosAvaliacoesService.createEvidencia({
      avaliacaoObjetivoId: novaEvidencia.value.avaliacaoObjetivoId,
      alunoId: props.alunoId,
      tipo: novaEvidencia.value.tipo as TipoEvidencia,
      arquivoUrl: novaEvidencia.value.arquivoUrl || undefined,
      descricao: novaEvidencia.value.descricao,
    });

    // Limpar formulário
    novaEvidencia.value = {
      avaliacaoObjetivoId: '',
      tipo: '',
      arquivoUrl: '',
      descricao: '',
    };

    // Recarregar evidências
    await loadEvidencias();
    emit('updated');

    alert('Evidência adicionada com sucesso!');
  } catch (error: any) {
    alert('Erro ao adicionar evidência: ' + error.message);
  } finally {
    salvando.value = false;
  }
}

async function excluirEvidencia(evidenciaId: string) {
  if (!confirm('Deseja realmente excluir esta evidência?')) return;

  try {
    await objetivosAvaliacoesService.deleteEvidencia(evidenciaId);
    await loadEvidencias();
    emit('updated');
    alert('Evidência excluída com sucesso!');
  } catch (error: any) {
    alert('Erro ao excluir evidência: ' + error.message);
  }
}

function close() {
  emit('close');
}

function getStatusClass(status: string): string {
  const classes: Record<string, string> = {
    A: 'badge badge-success',
    D: 'badge badge-warning',
    N: 'badge badge-danger',
    NA: 'badge badge-secondary',
  };
  return classes[status] || '';
}

function getStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    A: 'Atingido',
    D: 'Em Desenvolvimento',
    N: 'Não Atingido',
    NA: 'Não Avaliado',
  };
  return labels[status] || '-';
}

function getTipoIcon(tipo: string): string {
  const icons: Record<string, string> = {
    FOTO: '📷',
    VIDEO: '🎥',
    DOCUMENTO: '📄',
    TEXTO: '📝',
    ATIVIDADE: '✏️',
    PROJETO: '🎯',
  };
  return icons[tipo] || '📎';
}

function getTipoLabel(tipo: string): string {
  const labels: Record<string, string> = {
    FOTO: 'Foto',
    VIDEO: 'Vídeo',
    DOCUMENTO: 'Documento',
    TEXTO: 'Texto',
    ATIVIDADE: 'Atividade',
    PROJETO: 'Projeto',
  };
  return labels[tipo] || tipo;
}

function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

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

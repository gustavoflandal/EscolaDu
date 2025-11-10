<template>
  <div>
    <!-- Loading -->
    <div v-if="loading" class="text-center py-8">
      <p class="text-gray-600">Carregando turma...</p>
    </div>

    <!-- Conteúdo -->
    <div v-else-if="turma">
      <!-- Cabeçalho -->
      <div class="flex items-center justify-between mb-8">
        <div>
          <h1 class="text-3xl font-bold text-gray-900">{{ turma.nome }}</h1>
          <p class="text-gray-600 mt-1">{{ turma.codigo }} • {{ typeof turma.serie === 'object' ? turma.serie.nome : turma.serie }} • {{ formatTurno(turma.turno) }}</p>
        </div>
        <button
          @click="$router.back()"
          class="btn btn-secondary"
        >
          Voltar
        </button>
      </div>

      <!-- Cards de Estatísticas -->
      <div v-if="stats" class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div class="card">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600">Total de Alunos</p>
              <p class="text-3xl font-bold text-gray-900 mt-2">{{ stats.totalAlunos }}</p>
            </div>
            <div class="p-3 bg-blue-100 rounded-lg">
              <svg class="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div class="card">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600">Vagas Disponíveis</p>
              <p class="text-3xl font-bold text-gray-900 mt-2">{{ stats.vagasDisponiveis }}</p>
            </div>
            <div class="p-3 bg-green-100 rounded-lg">
              <svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div class="card">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600">Ocupação</p>
              <p class="text-3xl font-bold text-gray-900 mt-2">{{ stats.percentualOcupacao.toFixed(0) }}%</p>
            </div>
            <div class="p-3 bg-purple-100 rounded-lg">
              <svg class="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
              </svg>
            </div>
          </div>
        </div>

        <div class="card">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600">Alunos Ativos</p>
              <p class="text-3xl font-bold text-gray-900 mt-2">{{ stats.alunosAtivos }}</p>
            </div>
            <div class="p-3 bg-yellow-100 rounded-lg">
              <svg class="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <!-- Informações da Turma -->
      <div class="card mb-8">
        <h2 class="text-xl font-bold text-gray-900 mb-6">Informações da Turma</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <p class="text-sm text-gray-600">Ano Letivo</p>
            <p class="text-base font-medium text-gray-900 mt-1">{{ turma.anoLetivo?.ano || '-' }}</p>
          </div>
          <div>
            <p class="text-sm text-gray-600">Sala</p>
            <p class="text-base font-medium text-gray-900 mt-1">{{ turma.sala?.nome || '-' }}</p>
          </div>
          <div>
            <p class="text-sm text-gray-600">Capacidade Máxima</p>
            <p class="text-base font-medium text-gray-900 mt-1">{{ turma.capacidadeMaxima }} alunos</p>
          </div>
          <div>
            <p class="text-sm text-gray-600">Professor Regente</p>
            <p class="text-base font-medium text-gray-900 mt-1">{{ turma.professorRegente?.nome || '-' }}</p>
          </div>
          <div>
            <p class="text-sm text-gray-600">Status</p>
            <span v-if="turma.active" class="inline-block px-3 py-1 text-sm rounded-full bg-green-100 text-green-800 mt-1">
              Ativa
            </span>
            <span v-else class="inline-block px-3 py-1 text-sm rounded-full bg-red-100 text-red-800 mt-1">
              Inativa
            </span>
          </div>
        </div>
      </div>

      <!-- Lista de Alunos -->
      <div class="card p-0 overflow-hidden">
        <div class="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 class="text-xl font-bold text-gray-900">Alunos Matriculados</h2>
          <button
            v-if="hasPermission('turmas', 'update')"
            @click="showAddAlunoModal = true"
            class="btn btn-primary"
            :disabled="stats?.vagasDisponiveis === 0"
          >
            Adicionar Aluno
          </button>
        </div>

        <!-- Tabela de Alunos -->
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Matrícula</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nome</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Data Nascimento</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Data Matrícula</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th v-if="hasPermission('turmas', 'update')" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Ações</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-if="!turma.alunos || turma.alunos.length === 0">
                <td :colspan="hasPermission('turmas', 'update') ? 6 : 5" class="px-6 py-8 text-center text-gray-500">
                  Nenhum aluno matriculado nesta turma
                </td>
              </tr>
              <tr v-for="matricula in turma.alunos" :key="matricula.id" class="hover:bg-gray-50">
                <td class="px-6 py-2 whitespace-nowrap text-sm font-medium text-gray-900">
                  {{ matricula.aluno.matricula }}
                </td>
                <td class="px-6 py-2 whitespace-nowrap text-sm text-gray-900">
                  {{ matricula.aluno.nome }}
                </td>
                <td class="px-6 py-2 whitespace-nowrap text-sm text-gray-600">
                  {{ formatDate(matricula.aluno.dataNascimento) }}
                </td>
                <td class="px-6 py-2 whitespace-nowrap text-sm text-gray-600">
                  {{ formatDate(matricula.dataMatricula) }}
                </td>
                <td class="px-6 py-2 whitespace-nowrap">
                  <span :class="getStatusClass(matricula.status)">
                    {{ formatStatus(matricula.status) }}
                  </span>
                </td>
                <td v-if="hasPermission('turmas', 'update')" class="px-6 py-2 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    @click="removeAluno(matricula)"
                    class="text-red-600 hover:text-red-900"
                    title="Remover aluno"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <!-- Rodapé informativo -->
        <div v-if="turma.alunos && turma.alunos.length > 0" class="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
          <p class="text-sm text-gray-700">
            Total de <span class="font-medium">{{ turma.alunos.length }}</span> aluno(s) matriculado(s)
          </p>
        </div>
      </div>
    </div>

    <!-- Modal de Adicionar Aluno -->
    <div v-if="showAddAlunoModal" class="fixed inset-0 z-50 overflow-y-auto">
      <div class="fixed inset-0 bg-black bg-opacity-50 transition-opacity" @click="showAddAlunoModal = false"></div>
      <div class="flex min-h-full items-center justify-center p-4">
        <div class="relative bg-white rounded-lg shadow-xl max-w-2xl w-full">
          <div class="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 class="text-2xl font-bold text-gray-900">Adicionar Aluno</h2>
            <button @click="showAddAlunoModal = false" class="text-gray-400 hover:text-gray-600">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div class="p-6">
            <!-- Busca -->
            <div class="mb-4">
              <input
                v-model="searchAluno"
                type="text"
                class="input"
                placeholder="Buscar aluno por nome ou matrícula..."
                @input="debounceSearchAluno"
              />
            </div>

            <!-- Loading -->
            <div v-if="loadingAlunos" class="text-center py-8">
              <p class="text-gray-600">Carregando alunos...</p>
            </div>

            <!-- Lista de Alunos Disponíveis -->
            <div v-else class="max-h-96 overflow-y-auto">
              <div v-if="alunosDisponiveis.length === 0" class="text-center py-8 text-gray-500">
                Nenhum aluno disponível
              </div>
              <div
                v-for="aluno in alunosDisponiveis"
                :key="aluno.id"
                class="flex items-center justify-between p-4 border border-gray-200 rounded-lg mb-2 hover:bg-gray-50"
              >
                <div>
                  <p class="font-medium text-gray-900">{{ aluno.nome }}</p>
                  <p class="text-sm text-gray-600">Matrícula: {{ aluno.matricula }}</p>
                </div>
                <button
                  @click="addAluno(aluno.id)"
                  class="btn btn-primary btn-sm"
                  :disabled="addingAluno"
                >
                  Adicionar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de Edição -->
    <TurmaModal
      v-if="showEditModal"
      :turma="turma"
      @close="showEditModal = false"
      @saved="handleSaved"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
import turmasService from '@/services/turmas.service'
import { usePermissions } from '@/composables/usePermissions'
import type { Turma, TurmaStats, Aluno, MatriculaTurma } from '@/types'
import TurmaModal from './TurmaModal.vue'

const route = useRoute()
const router = useRouter()
const toast = useToast()
const { hasPermission } = usePermissions()

const loading = ref(false)
const turma = ref<Turma | null>(null)
const stats = ref<TurmaStats | null>(null)
const showEditModal = ref(false)
const showAddAlunoModal = ref(false)
const loadingAlunos = ref(false)
const addingAluno = ref(false)
const alunosDisponiveis = ref<Aluno[]>([])
const searchAluno = ref('')

let searchTimeout: ReturnType<typeof setTimeout>

function formatTurno(turno: string): string {
  const turnos: Record<string, string> = {
    'MANHA': 'Manhã',
    'TARDE': 'Tarde',
    'NOITE': 'Noite',
    'INTEGRAL': 'Integral'
  }
  return turnos[turno] || turno
}

function formatDate(date: string | Date): string {
  if (!date) return '-'
  const d = new Date(date)
  return d.toLocaleDateString('pt-BR')
}

function formatStatus(status: string): string {
  const statusMap: Record<string, string> = {
    'ATIVO': 'Ativo',
    'MATRICULADO': 'Matriculado',
    'TRANSFERIDO': 'Transferido',
    'CONCLUIDO': 'Concluído',
    'TRANCADO': 'Trancado'
  }
  return statusMap[status] || status
}

function getStatusClass(status: string): string {
  const classes: Record<string, string> = {
    'ATIVO': 'px-2 py-1 text-xs rounded-full bg-green-100 text-green-800',
    'MATRICULADO': 'px-2 py-1 text-xs rounded-full bg-green-100 text-green-800',
    'TRANSFERIDO': 'px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800',
    'CONCLUIDO': 'px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800',
    'TRANCADO': 'px-2 py-1 text-xs rounded-full bg-red-100 text-red-800'
  }
  return classes[status] || 'px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800'
}

async function loadTurma() {
  loading.value = true
  try {
    const id = route.params.id as string
    turma.value = await turmasService.getById(id)
  } catch (error: any) {
    toast.error(error.response?.data?.message || 'Erro ao carregar turma')
    router.push('/turmas')
  } finally {
    loading.value = false
  }
}

async function loadStats() {
  try {
    const id = route.params.id as string
    stats.value = await turmasService.getStats(id)
  } catch (error) {
    console.error('Erro ao carregar estatísticas:', error)
  }
}

async function loadAlunosDisponiveis() {
  loadingAlunos.value = true
  try {
    const id = route.params.id as string
    alunosDisponiveis.value = await turmasService.getAlunosDisponiveis(id, searchAluno.value || undefined)
  } catch (error: any) {
    toast.error(error.response?.data?.message || 'Erro ao carregar alunos disponíveis')
  } finally {
    loadingAlunos.value = false
  }
}

function debounceSearchAluno() {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    loadAlunosDisponiveis()
  }, 500)
}

async function addAluno(alunoId: string) {
  addingAluno.value = true
  try {
    const id = route.params.id as string
    await turmasService.addAluno(id, {
      alunoId,
      dataMatricula: new Date().toISOString()
    })
    toast.success('Aluno adicionado à turma com sucesso')
    showAddAlunoModal.value = false
    searchAluno.value = ''
    await loadTurma()
    await loadStats()
  } catch (error: any) {
    toast.error(error.response?.data?.message || 'Erro ao adicionar aluno')
  } finally {
    addingAluno.value = false
  }
}

async function removeAluno(matricula: MatriculaTurma) {
  if (!confirm(`Tem certeza que deseja remover o aluno "${matricula.aluno.nome}" da turma?\n\nO status da matrícula será alterado para TRANSFERIDO.`)) {
    return
  }

  try {
    const id = route.params.id as string
    await turmasService.removeAluno(id, matricula.alunoId)
    toast.success('Aluno removido da turma com sucesso')
    await loadTurma()
    await loadStats()
  } catch (error: any) {
    toast.error(error.response?.data?.message || 'Erro ao remover aluno')
  }
}

function openEditModal() {
  showEditModal.value = true
}

async function handleSaved() {
  showEditModal.value = false
  await loadTurma()
  await loadStats()
}

onMounted(() => {
  loadTurma()
  loadStats()
})

// Carregar alunos disponíveis quando o modal abrir
const showAddAlunoModalWatcher = ref(showAddAlunoModal)
showAddAlunoModalWatcher.value = showAddAlunoModal.value

if (showAddAlunoModal.value) {
  loadAlunosDisponiveis()
}

// Watch para carregar alunos quando o modal abrir
import { watch } from 'vue'
watch(showAddAlunoModal, (newValue) => {
  if (newValue) {
    searchAluno.value = ''
    loadAlunosDisponiveis()
  }
})
</script>

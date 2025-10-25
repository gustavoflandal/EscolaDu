<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-3xl font-bold text-gray-900">
        {{ isEdit ? 'Editar Turma' : 'Nova Turma' }}
      </h1>
      <RouterLink to="/turmas" class="btn btn-secondary">
        Voltar
      </RouterLink>
    </div>

    <div class="card">
      <!-- Abas -->
      <div class="border-b border-gray-200 mb-6">
        <nav class="-mb-px flex space-x-8">
          <button
            @click="activeTab = 'dados'"
            :class="[
              'py-4 px-1 border-b-2 font-medium text-sm',
              activeTab === 'dados'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            ]"
          >
            Dados da Turma
          </button>
          <button
            v-if="isEdit"
            @click="activeTab = 'alunos'"
            :class="[
              'py-4 px-1 border-b-2 font-medium text-sm',
              activeTab === 'alunos'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            ]"
          >
            Alunos Matriculados
            <span class="ml-2 bg-gray-200 text-gray-700 py-0.5 px-2 rounded-full text-xs">
              {{ alunosMatriculados.length }}
            </span>
          </button>
        </nav>
      </div>

      <!-- Aba: Dados da Turma -->
      <div v-show="activeTab === 'dados'">
        <form @submit.prevent="handleSubmit" class="space-y-8">
          <!-- Informações Básicas -->
          <div>
            <h2 class="text-xl font-semibold text-gray-900 mb-4">Informações Básicas</h2>
            <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Código *
                </label>
                <input
                  v-model="form.codigo"
                  type="text"
                  required
                  class="input"
                  placeholder="Ex: 1A-2025"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Nome da Turma *
                </label>
                <input
                  v-model="form.nome"
                  type="text"
                  required
                  class="input"
                  placeholder="Ex: 1º Ano A"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Ano Letivo *
                </label>
                <select v-model="form.anoLetivoId" required class="input">
                  <option value="">Selecione</option>
                  <option v-for="ano in anosLetivos" :key="ano.id" :value="ano.id">
                    {{ ano.ano }}
                  </option>
                </select>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Série *
                </label>
                <select v-model="form.serie" required class="input">
                  <option value="">Selecione</option>
                  <option value="1º ANO">1º Ano</option>
                  <option value="2º ANO">2º Ano</option>
                  <option value="3º ANO">3º Ano</option>
                  <option value="4º ANO">4º Ano</option>
                  <option value="5º ANO">5º Ano</option>
                </select>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Turno *
                </label>
                <select v-model="form.turno" required class="input">
                  <option value="">Selecione</option>
                  <option value="MANHA">Manhã</option>
                  <option value="TARDE">Tarde</option>
                  <option value="NOITE">Noite</option>
                  <option value="INTEGRAL">Integral</option>
                </select>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Sala
                </label>
                <input
                  v-model="form.sala"
                  type="text"
                  class="input"
                  placeholder="Ex: Sala 101"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Capacidade Máxima
                </label>
                <input
                  v-model.number="form.capacidadeMaxima"
                  type="number"
                  min="1"
                  max="100"
                  class="input"
                  placeholder="30"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Professor Regente
                </label>
                <select v-model="form.professorRegenteId" class="input">
                  <option value="">Nenhum</option>
                  <option v-for="prof in professores" :key="prof.id" :value="prof.id">
                    {{ prof.user.name }}
                  </option>
                </select>
              </div>

              <div v-if="isEdit" class="sm:col-span-2">
                <label class="flex items-center">
                  <input v-model="form.active" type="checkbox" class="mr-2" />
                  <span class="text-sm font-medium text-gray-700">Turma ativa</span>
                </label>
              </div>
            </div>
          </div>

          <div class="flex justify-end gap-4">
            <RouterLink to="/turmas" class="btn btn-secondary">
              Cancelar
            </RouterLink>
            <button type="submit" :disabled="loading" class="btn btn-primary">
              {{ loading ? 'Salvando...' : 'Salvar' }}
            </button>
          </div>
        </form>
      </div>

      <!-- Aba: Alunos -->
      <div v-show="activeTab === 'alunos' && isEdit">
        <div class="mb-4 flex justify-between items-center">
          <h2 class="text-lg font-semibold text-gray-900">
            Alunos ({{ alunosMatriculados.length }}/{{ turma?.capacidadeMaxima }})
          </h2>
          <button
            @click="openMatricularModal"
            :disabled="alunosMatriculados.length >= (turma?.capacidadeMaxima || 30)"
            class="btn btn-primary"
          >
            + Vincular Aluno
          </button>
        </div>

        <!-- Grid de Alunos -->
        <div v-if="alunosMatriculados.length === 0" class="text-center py-12 bg-gray-50 rounded-lg">
          <p class="text-gray-500">Nenhum aluno matriculado ainda.</p>
          <button
            @click="openMatricularModal"
            class="mt-4 text-primary-600 hover:text-primary-800 font-medium"
          >
            Clique aqui para vincular o primeiro aluno
          </button>
        </div>

        <div v-else class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nome
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Matrícula
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Data Nascimento
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Gênero
                </th>
                <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="matricula in alunosMatriculados" :key="matricula.id" class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm font-medium text-gray-900">{{ matricula.aluno.nome }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-500">{{ matricula.aluno.matricula }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-500">
                    {{ matricula.aluno.dataNascimento ? formatDate(matricula.aluno.dataNascimento) : '-' }}
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-500">{{ getGeneroLabel(matricula.aluno.genero) }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                  <button
                    @click="handleDesmatricular(matricula.alunoId)"
                    class="text-red-600 hover:text-red-900"
                  >
                    Remover
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Modal de Vincular Aluno -->
    <div
      v-if="showMatricularModal"
      class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50"
      @click.self="closeMatricularModal"
    >
      <div class="relative top-20 mx-auto p-5 border w-full max-w-3xl shadow-lg rounded-md bg-white">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-semibold text-gray-900">Vincular Aluno à Turma</h3>
          <button @click="closeMatricularModal" class="text-gray-400 hover:text-gray-600">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div class="mb-4">
          <input
            v-model="searchAluno"
            type="text"
            placeholder="Buscar aluno por nome ou matrícula..."
            class="input"
          />
        </div>

        <div v-if="filteredAlunos.length === 0" class="text-center py-8 text-gray-500">
          Nenhum aluno disponível para vincular
        </div>

        <div v-else class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nome
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Matrícula
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Data Nascimento
                </th>
                <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ação
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="aluno in filteredAlunos" :key="aluno.id" class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm font-medium text-gray-900">{{ aluno.nome }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-500">{{ aluno.matricula }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-500">
                    {{ aluno.dataNascimento ? formatDate(aluno.dataNascimento) : '-' }}
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    @click="handleMatricular(aluno.id)"
                    :disabled="loadingMatricula"
                    class="text-primary-600 hover:text-primary-900 disabled:opacity-50"
                  >
                    {{ loadingMatricula ? 'Vinculando...' : 'Vincular' }}
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="flex justify-end gap-4 pt-4 mt-4 border-t">
          <button type="button" @click="closeMatricularModal" class="btn btn-secondary">
            Fechar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter, RouterLink } from 'vue-router'
import {
  turmasService,
  type CreateTurmaDTO,
  type UpdateTurmaDTO,
  type Turma,
  type Matricula,
  type AnoLetivo
} from '@/services/turmas.service'
import { professoresService, type Professor } from '@/services/professores.service'
import { alunosService, type Aluno } from '@/services/alunos.service'

const route = useRoute()
const router = useRouter()

const activeTab = ref('dados')
const loading = ref(false)
const loadingMatricula = ref(false)
const showMatricularModal = ref(false)
const searchAluno = ref('')

const isEdit = computed(() => !!route.params.id)
const turmaId = computed(() => route.params.id as string)

const form = ref<CreateTurmaDTO | UpdateTurmaDTO>({
  codigo: '',
  nome: '',
  anoLetivoId: '',
  serie: '',
  turno: '',
  capacidadeMaxima: 30,
  sala: '',
  professorRegenteId: '',
  active: true,
})

const turma = ref<Turma>()
const alunosMatriculados = ref<Matricula[]>([])
const anosLetivos = ref<AnoLetivo[]>([])
const professores = ref<Professor[]>([])
const todosAlunos = ref<Aluno[]>([])

const alunosDisponiveis = computed(() => {
  const matriculadosIds = alunosMatriculados.value.map(m => m.alunoId)
  return todosAlunos.value.filter(a => !matriculadosIds.includes(a.id) && a.active)
})

const filteredAlunos = computed(() => {
  if (!searchAluno.value) return alunosDisponiveis.value
  const search = searchAluno.value.toLowerCase()
  return alunosDisponiveis.value.filter(a =>
    a.nome.toLowerCase().includes(search) ||
    a.matricula.toLowerCase().includes(search)
  )
})

async function loadTurma() {
  if (!isEdit.value) return

  try {
    turma.value = await turmasService.getById(turmaId.value)
    form.value = {
      codigo: turma.value.codigo,
      nome: turma.value.nome,
      anoLetivoId: turma.value.anoLetivoId,
      serie: turma.value.serie,
      turno: turma.value.turno,
      capacidadeMaxima: turma.value.capacidadeMaxima,
      sala: turma.value.sala || '',
      professorRegenteId: turma.value.professorRegenteId || '',
      active: turma.value.active,
    }
    alunosMatriculados.value = turma.value.matriculas || []
  } catch (error) {
    console.error('Erro ao carregar turma:', error)
    alert('Erro ao carregar dados da turma')
  }
}

async function loadAnosLetivos() {
  try {
    anosLetivos.value = await turmasService.getAnosLetivos()
  } catch (error) {
    console.error('Erro ao carregar anos letivos:', error)
  }
}

async function loadProfessores() {
  try {
    const response = await professoresService.list({ limit: 100 })
    professores.value = response.data.filter(p => p.active)
  } catch (error) {
    console.error('Erro ao carregar professores:', error)
  }
}

async function loadAlunos() {
  try {
    console.log('🔍 Iniciando carregamento de alunos...')
    const response = await alunosService.list({ limit: 1000, active: true })
    console.log('📦 Resposta da API:', response)
    todosAlunos.value = response.data
    console.log('✅ Alunos carregados:', todosAlunos.value.length)
    console.log('📋 Dados dos alunos:', todosAlunos.value)
  } catch (error) {
    console.error('❌ Erro ao carregar alunos:', error)
  }
}

async function handleSubmit() {
  loading.value = true
  try {
    if (isEdit.value) {
      await turmasService.update(turmaId.value, form.value as UpdateTurmaDTO)
      alert('Turma atualizada com sucesso!')
    } else {
      const turma = await turmasService.create(form.value as CreateTurmaDTO)
      alert('Turma criada com sucesso!')
      router.push(`/turmas/${turma.id}/editar`)
    }
  } catch (error: any) {
    console.error('Erro ao salvar turma:', error)
    alert(error.response?.data?.error?.message || 'Erro ao salvar turma')
  } finally {
    loading.value = false
  }
}

async function openMatricularModal() {
  console.log('🚨 Abrindo modal de vincular aluno...')
  console.log('📋 todosAlunos.value.length ANTES:', todosAlunos.value.length)
  searchAluno.value = ''
  showMatricularModal.value = true
  // Carregar alunos se ainda não foram carregados
  if (todosAlunos.value.length === 0) {
    console.log('🔄 Carregando alunos...')
    await loadAlunos()
  }
  console.log('📋 todosAlunos.value.length DEPOIS:', todosAlunos.value.length)
  console.log('📋 alunosDisponiveis.value.length:', alunosDisponiveis.value.length)
  console.log('📋 filteredAlunos.value.length:', filteredAlunos.value.length)
}

function closeMatricularModal() {
  showMatricularModal.value = false
}

async function handleMatricular(alunoId: string) {
  if (!alunoId) return

  loadingMatricula.value = true
  try {
    await turmasService.matricularAluno(turmaId.value, alunoId)
    alert('Aluno vinculado com sucesso!')
    await loadTurma()
  } catch (error: any) {
    console.error('Erro ao vincular aluno:', error)
    alert(error.response?.data?.error?.message || 'Erro ao vincular aluno')
  } finally {
    loadingMatricula.value = false
  }
}

async function handleDesmatricular(alunoId: string) {
  if (!confirm('Deseja realmente desmatricular este aluno?')) return

  try {
    await turmasService.desmatricularAluno(turmaId.value, alunoId)
    alert('Aluno desmatriculado com sucesso!')
    await loadTurma()
  } catch (error: any) {
    console.error('Erro ao desmatricular aluno:', error)
    alert(error.response?.data?.error?.message || 'Erro ao desmatricular aluno')
  }
}

function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('pt-BR')
}

function getGeneroLabel(genero?: string): string {
  if (!genero) return '-'
  const labels: Record<string, string> = {
    M: 'Masculino',
    F: 'Feminino'
  }
  return labels[genero] || genero
}

onMounted(async () => {
  loadAnosLetivos()
  loadProfessores()
  if (isEdit.value) {
    await loadTurma()
    await loadAlunos()
  }
})
</script>

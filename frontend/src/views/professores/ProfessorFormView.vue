<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-3xl font-bold text-gray-900">
        {{ isEdit ? 'Editar Professor' : 'Novo Professor' }}
      </h1>
      <RouterLink to="/professores" class="btn btn-secondary">
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
            Dados do Professor
          </button>
          <button
            v-if="isEdit"
            @click="activeTab = 'formacoes'"
            :class="[
              'py-4 px-1 border-b-2 font-medium text-sm',
              activeTab === 'formacoes'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            ]"
          >
            Formações
            <span class="ml-2 bg-gray-200 text-gray-700 py-0.5 px-2 rounded-full text-xs">
              {{ formacoes.length }}
            </span>
          </button>
        </nav>
      </div>

      <!-- Aba: Dados do Professor -->
      <div v-show="activeTab === 'dados'">
        <form @submit.prevent="handleSubmit" class="space-y-8">
          <!-- Dados Pessoais -->
          <div>
            <h2 class="text-xl font-semibold text-gray-900 mb-4">Dados Pessoais</h2>
            <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div class="sm:col-span-2">
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Nome Completo *
                </label>
                <input
                  v-model="form.nome"
                  type="text"
                  required
                  class="input"
                  placeholder="Nome completo"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  CPF
                </label>
                <input
                  v-model="form.cpf"
                  type="text"
                  maxlength="11"
                  class="input"
                  placeholder="00000000000"
                  :disabled="isEdit"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Telefone
                </label>
                <input
                  v-model="form.telefone"
                  type="tel"
                  class="input"
                  placeholder="(00) 00000-0000"
                />
              </div>

              <div v-if="!isEdit">
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Email *
                </label>
                <input
                  v-model="form.email"
                  type="email"
                  required
                  class="input"
                  placeholder="email@exemplo.com"
                />
              </div>

              <div v-if="!isEdit">
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Senha *
                </label>
                <input
                  v-model="form.senha"
                  type="password"
                  required
                  minlength="6"
                  class="input"
                  placeholder="Mínimo 6 caracteres"
                />
              </div>
            </div>
          </div>

          <!-- Dados Profissionais -->
          <div>
            <h2 class="text-xl font-semibold text-gray-900 mb-4">Dados Profissionais</h2>
            <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Registro Profissional
                </label>
                <input
                  v-model="form.registroProfissional"
                  type="text"
                  class="input"
                  placeholder="Ex: RP-2024-001"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Especialidade
                </label>
                <input
                  v-model="form.especialidade"
                  type="text"
                  class="input"
                  placeholder="Ex: Matemática e Física"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Carga Horária Semanal
                </label>
                <input
                  v-model.number="form.cargaHoraria"
                  type="number"
                  min="0"
                  class="input"
                  placeholder="Ex: 40"
                />
              </div>

              <div v-if="isEdit" class="flex items-center">
                <label class="flex items-center">
                  <input v-model="form.active" type="checkbox" class="mr-2" />
                  <span class="text-sm font-medium text-gray-700">Professor ativo</span>
                </label>
              </div>
            </div>
          </div>

          <div class="flex justify-end gap-4">
            <RouterLink to="/professores" class="btn btn-secondary">
              Cancelar
            </RouterLink>
            <button type="submit" :disabled="loading" class="btn btn-primary">
              {{ loading ? 'Salvando...' : 'Salvar' }}
            </button>
          </div>
        </form>
      </div>

      <!-- Aba: Formações -->
      <div v-show="activeTab === 'formacoes' && isEdit">
        <div class="mb-4 flex justify-between items-center">
          <h2 class="text-lg font-semibold text-gray-900">
            Formações Acadêmicas
          </h2>
          <button
            @click="openFormacaoModal()"
            class="btn btn-primary"
          >
            + Nova Formação
          </button>
        </div>

        <!-- Grid de Formações -->
        <div v-if="formacoes.length === 0" class="text-center py-12 bg-gray-50 rounded-lg">
          <p class="text-gray-500">Nenhuma formação cadastrada ainda.</p>
          <button
            @click="openFormacaoModal()"
            class="mt-4 text-primary-600 hover:text-primary-800 font-medium"
          >
            Clique aqui para adicionar a primeira formação
          </button>
        </div>

        <div v-else class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nível
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Curso
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Instituição
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Período
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="formacao in formacoes" :key="formacao.id" class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                    {{ getNivelLabel(formacao.nivel) }}
                  </span>
                </td>
                <td class="px-6 py-4">
                  <div class="text-sm font-medium text-gray-900">{{ formacao.curso }}</div>
                  <div v-if="formacao.areaConhecimento" class="text-xs text-gray-500">
                    {{ formacao.areaConhecimento }}
                  </div>
                </td>
                <td class="px-6 py-4">
                  <div class="text-sm text-gray-500">{{ formacao.instituicao }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-500">
                    {{ formatDate(formacao.dataInicio) }} - 
                    {{ formacao.emAndamento ? 'Em andamento' : formatDate(formacao.dataConclusao) }}
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span
                    :class="[
                      'px-2 inline-flex text-xs leading-5 font-semibold rounded-full',
                      formacao.emAndamento
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-green-100 text-green-800'
                    ]"
                  >
                    {{ formacao.emAndamento ? 'Em curso' : 'Concluído' }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                  <button
                    @click="openFormacaoModal(formacao)"
                    class="text-primary-600 hover:text-primary-900"
                  >
                    Editar
                  </button>
                  <button
                    @click="handleDeleteFormacao(formacao.id)"
                    class="text-red-600 hover:text-red-900"
                  >
                    Excluir
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Modal de Formação -->
    <div
      v-if="showFormacaoModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      @click.self="closeFormacaoModal"
    >
      <div class="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div class="p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">
            {{ formacaoForm.id ? 'Editar Formação' : 'Nova Formação' }}
          </h3>

          <form @submit.prevent="handleFormacaoSubmit" class="space-y-4">
            <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div class="sm:col-span-2">
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Nível *
                </label>
                <select v-model="formacaoForm.nivel" required class="input">
                  <option value="">Selecione</option>
                  <option value="FUNDAMENTAL">Ensino Fundamental</option>
                  <option value="MEDIO">Ensino Médio</option>
                  <option value="TECNICO">Técnico</option>
                  <option value="GRADUACAO">Graduação</option>
                  <option value="POS_GRADUACAO">Pós-Graduação</option>
                  <option value="MESTRADO">Mestrado</option>
                  <option value="DOUTORADO">Doutorado</option>
                </select>
              </div>

              <div class="sm:col-span-2">
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Curso *
                </label>
                <input
                  v-model="formacaoForm.curso"
                  type="text"
                  required
                  class="input"
                  placeholder="Nome do curso"
                />
              </div>

              <div class="sm:col-span-2">
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Instituição *
                </label>
                <input
                  v-model="formacaoForm.instituicao"
                  type="text"
                  required
                  class="input"
                  placeholder="Nome da instituição"
                />
              </div>

              <div class="sm:col-span-2">
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Área de Conhecimento
                </label>
                <input
                  v-model="formacaoForm.areaConhecimento"
                  type="text"
                  class="input"
                  placeholder="Ex: Educação, Linguagens, Matemática"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Data de Início *
                </label>
                <input
                  v-model="formacaoForm.dataInicio"
                  type="date"
                  required
                  class="input"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Data de Conclusão
                </label>
                <input
                  v-model="formacaoForm.dataConclusao"
                  type="date"
                  :disabled="formacaoForm.emAndamento"
                  class="input"
                />
              </div>

              <div class="sm:col-span-2">
                <label class="flex items-center">
                  <input
                    v-model="formacaoForm.emAndamento"
                    type="checkbox"
                    @change="onEmAndamentoChange"
                    class="mr-2"
                  />
                  <span class="text-sm font-medium text-gray-700">Formação em andamento</span>
                </label>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Carga Horária (horas)
                </label>
                <input
                  v-model.number="formacaoForm.cargaHoraria"
                  type="number"
                  min="0"
                  class="input"
                  placeholder="Ex: 360"
                />
              </div>

              <div class="sm:col-span-2">
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Observações
                </label>
                <textarea
                  v-model="formacaoForm.observacoes"
                  rows="3"
                  class="input"
                  placeholder="Observações adicionais..."
                ></textarea>
              </div>
            </div>

            <div class="flex justify-end gap-4 mt-6">
              <button type="button" @click="closeFormacaoModal" class="btn btn-secondary">
                Cancelar
              </button>
              <button type="submit" :disabled="loadingFormacao" class="btn btn-primary">
                {{ loadingFormacao ? 'Salvando...' : 'Salvar' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter, RouterLink } from 'vue-router'
import {
  professoresService,
  type CreateProfessorDTO,
  type UpdateProfessorDTO,
  type Formacao,
  type CreateFormacaoDTO,
  type UpdateFormacaoDTO
} from '@/services/professores.service'

const route = useRoute()
const router = useRouter()

const activeTab = ref('dados')
const loading = ref(false)
const loadingFormacao = ref(false)
const showFormacaoModal = ref(false)

const isEdit = computed(() => !!route.params.id)
const professorId = computed(() => route.params.id as string)

const form = ref<CreateProfessorDTO | UpdateProfessorDTO>({
  nome: '',
  email: '',
  senha: '',
  cpf: '',
  telefone: '',
  registroProfissional: '',
  especialidade: '',
  cargaHoraria: undefined,
  active: true,
})

const formacoes = ref<Formacao[]>([])

const formacaoForm = ref<CreateFormacaoDTO & { id?: string }>({
  nivel: '',
  curso: '',
  instituicao: '',
  areaConhecimento: '',
  dataInicio: '',
  dataConclusao: '',
  emAndamento: false,
  cargaHoraria: undefined,
  observacoes: '',
})

async function loadProfessor() {
  if (!isEdit.value) return

  try {
    const professor = await professoresService.getById(professorId.value)
    form.value = {
      nome: professor.user.name,
      telefone: professor.user.phone || '',
      registroProfissional: professor.registroProfissional || '',
      especialidade: professor.especialidade || '',
      cargaHoraria: professor.cargaHoraria,
      active: professor.active,
    }
    formacoes.value = professor.formacoes || []
  } catch (error) {
    console.error('Erro ao carregar professor:', error)
    alert('Erro ao carregar dados do professor')
  }
}

async function handleSubmit() {
  loading.value = true
  try {
    if (isEdit.value) {
      await professoresService.update(professorId.value, form.value as UpdateProfessorDTO)
      alert('Professor atualizado com sucesso!')
    } else {
      const professor = await professoresService.create(form.value as CreateProfessorDTO)
      alert('Professor criado com sucesso!')
      router.push(`/professores/${professor.id}/editar`)
    }
  } catch (error: any) {
    console.error('Erro ao salvar professor:', error)
    alert(error.response?.data?.error?.message || 'Erro ao salvar professor')
  } finally {
    loading.value = false
  }
}

function openFormacaoModal(formacao?: Formacao) {
  if (formacao) {
    formacaoForm.value = {
      id: formacao.id,
      nivel: formacao.nivel,
      curso: formacao.curso,
      instituicao: formacao.instituicao,
      areaConhecimento: formacao.areaConhecimento || '',
      dataInicio: formacao.dataInicio.split('T')[0],
      dataConclusao: formacao.dataConclusao ? formacao.dataConclusao.split('T')[0] : '',
      emAndamento: formacao.emAndamento,
      cargaHoraria: formacao.cargaHoraria,
      observacoes: formacao.observacoes || '',
    }
  } else {
    formacaoForm.value = {
      nivel: '',
      curso: '',
      instituicao: '',
      areaConhecimento: '',
      dataInicio: '',
      dataConclusao: '',
      emAndamento: false,
      cargaHoraria: undefined,
      observacoes: '',
    }
  }
  showFormacaoModal.value = true
}

function closeFormacaoModal() {
  showFormacaoModal.value = false
}

function onEmAndamentoChange() {
  if (formacaoForm.value.emAndamento) {
    formacaoForm.value.dataConclusao = ''
  }
}

async function handleFormacaoSubmit() {
  loadingFormacao.value = true
  try {
    const data: CreateFormacaoDTO | UpdateFormacaoDTO = {
      nivel: formacaoForm.value.nivel,
      curso: formacaoForm.value.curso,
      instituicao: formacaoForm.value.instituicao,
      areaConhecimento: formacaoForm.value.areaConhecimento || undefined,
      dataInicio: formacaoForm.value.dataInicio,
      dataConclusao: formacaoForm.value.dataConclusao || undefined,
      emAndamento: formacaoForm.value.emAndamento,
      cargaHoraria: formacaoForm.value.cargaHoraria,
      observacoes: formacaoForm.value.observacoes || undefined,
    }

    if (formacaoForm.value.id) {
      await professoresService.updateFormacao(professorId.value, formacaoForm.value.id, data)
      alert('Formação atualizada com sucesso!')
    } else {
      await professoresService.addFormacao(professorId.value, data as CreateFormacaoDTO)
      alert('Formação adicionada com sucesso!')
    }

    closeFormacaoModal()
    await loadProfessor()
  } catch (error: any) {
    console.error('Erro ao salvar formação:', error)
    alert(error.response?.data?.error?.message || 'Erro ao salvar formação')
  } finally {
    loadingFormacao.value = false
  }
}

async function handleDeleteFormacao(formacaoId: string) {
  if (!confirm('Deseja realmente excluir esta formação?')) return

  try {
    await professoresService.deleteFormacao(professorId.value, formacaoId)
    alert('Formação excluída com sucesso!')
    await loadProfessor()
  } catch (error: any) {
    console.error('Erro ao excluir formação:', error)
    alert(error.response?.data?.error?.message || 'Erro ao excluir formação')
  }
}

function getNivelLabel(nivel: string): string {
  const labels: Record<string, string> = {
    FUNDAMENTAL: 'Fundamental',
    MEDIO: 'Médio',
    TECNICO: 'Técnico',
    GRADUACAO: 'Graduação',
    POS_GRADUACAO: 'Pós-Graduação',
    MESTRADO: 'Mestrado',
    DOUTORADO: 'Doutorado',
  }
  return labels[nivel] || nivel
}

function formatDate(date?: string): string {
  if (!date) return '-'
  return new Date(date).toLocaleDateString('pt-BR')
}

onMounted(() => {
  loadProfessor()
})
</script>

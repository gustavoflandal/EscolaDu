<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-3xl font-bold text-gray-900">
        {{ isEdit ? 'Editar Responsável' : 'Novo Responsável' }}
      </h1>
      <RouterLink to="/responsaveis" class="btn btn-secondary">
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
            Dados do Responsável
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
            Alunos Vinculados
            <span class="ml-2 bg-gray-200 text-gray-700 py-0.5 px-2 rounded-full text-xs">
              {{ alunosVinculados.length }}
            </span>
          </button>
        </nav>
      </div>

      <!-- Aba: Dados do Responsável -->
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
                CPF *
              </label>
              <input
                v-model="form.cpf"
                type="text"
                required
                maxlength="11"
                class="input"
                placeholder="00000000000"
                :disabled="isEdit"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                RG
              </label>
              <input
                v-model="form.rg"
                type="text"
                class="input"
                placeholder="000000000"
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
                minlength="8"
                class="input"
                placeholder="Mínimo 8 caracteres"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Profissão
              </label>
              <input
                v-model="form.profissao"
                type="text"
                class="input"
                placeholder="Profissão"
              />
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Tipo de Parentesco *
              </label>
              <select v-model="form.tipoVinculo" required class="input">
                <option value="">Selecione</option>
                <option value="PAI">Pai</option>
                <option value="MAE">Mãe</option>
                <option value="AVO">Avô/Avó</option>
                <option value="TUTOR">Tutor</option>
                <option value="OUTRO">Outro</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Contatos -->
        <div>
          <h2 class="text-xl font-semibold text-gray-900 mb-4">Contatos</h2>
          <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Telefone Principal *
              </label>
              <input
                v-model="form.telefonePrincipal"
                type="tel"
                required
                class="input"
                placeholder="(00) 00000-0000"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Telefone Secundário
              </label>
              <input
                v-model="form.telefoneSecundario"
                type="tel"
                class="input"
                placeholder="(00) 00000-0000"
              />
            </div>
          </div>
        </div>

        <!-- Endereço -->
        <div>
          <h2 class="text-xl font-semibold text-gray-900 mb-4">Endereço</h2>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Endereço Completo
            </label>
            <input
              v-model="form.endereco"
              type="text"
              class="input"
              placeholder="Rua, número, bairro, cidade - UF"
            />
          </div>
        </div>

          <div class="flex justify-end gap-4">
            <RouterLink to="/responsaveis" class="btn btn-secondary">
              Cancelar
            </RouterLink>
            <button type="submit" :disabled="loading" class="btn btn-primary">
              {{ loading ? 'Salvando...' : 'Salvar' }}
            </button>
          </div>
        </form>
      </div>

      <!-- Aba: Alunos Vinculados -->
      <div v-show="activeTab === 'alunos' && isEdit">
        <div class="mb-4 flex justify-between items-center">
          <h2 class="text-lg font-semibold text-gray-900">
            Alunos Vinculados a este Responsável
          </h2>
          <button
            @click="openVincularModal"
            class="btn btn-primary"
          >
            + Vincular Aluno
          </button>
        </div>

        <!-- Grid de Alunos Vinculados -->
        <div v-if="alunosVinculados.length === 0" class="text-center py-12 bg-gray-50 rounded-lg">
          <p class="text-gray-500">Nenhum aluno vinculado ainda.</p>
          <button
            @click="openVincularModal"
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
                  Nome do Aluno
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Matrícula
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Prioridade
                </th>
                <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="vinculo in alunosVinculados" :key="vinculo.alunoId" class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm font-medium text-gray-900">{{ vinculo.nome }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-500">{{ vinculo.matricula }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-500">{{ vinculo.prioridadeContato }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    @click="handleDesvincular(vinculo.alunoId)"
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

    <!-- Modal: Vincular Aluno -->
    <div
      v-if="showVincularModal"
      class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50"
      @click.self="closeVincularModal"
    >
      <div class="relative top-20 mx-auto p-5 border w-full max-w-3xl shadow-lg rounded-md bg-white">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-semibold text-gray-900">Vincular Aluno ao Responsável</h3>
          <button @click="closeVincularModal" class="text-gray-400 hover:text-gray-600">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div class="mb-4">
          <input
            v-model="searchAlunoVinculo"
            type="text"
            placeholder="Buscar aluno por nome ou matrícula..."
            class="input"
          />
        </div>

        <div v-if="filteredAlunosVinculo.length === 0" class="text-center py-8 text-gray-500">
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
              <tr v-for="aluno in filteredAlunosVinculo" :key="aluno.id" class="hover:bg-gray-50">
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
                    @click="handleVincularDireto(aluno.id)"
                    :disabled="loadingVinculo"
                    class="text-primary-600 hover:text-primary-900 disabled:opacity-50"
                  >
                    {{ loadingVinculo ? 'Vinculando...' : 'Vincular' }}
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="flex justify-end gap-4 pt-4 mt-4 border-t">
          <button type="button" @click="closeVincularModal" class="btn btn-secondary">
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
import { responsaveisService, type CreateResponsavelDTO } from '@/services/responsaveis.service'
import { alunosService } from '@/services/alunos.service'
import { useToast } from 'vue-toastification'
import type { Aluno } from '@/types'

const route = useRoute()
const router = useRouter()
const toast = useToast()

const isEdit = computed(() => !!route.params.id)
const loading = ref(false)
const loadingVinculo = ref(false)
const responsavel = ref<any>(null)
const alunosVinculados = ref<any[]>([])
const todosAlunos = ref<Aluno[]>([])
const activeTab = ref('dados')
const showVincularModal = ref(false)
const searchAlunoVinculo = ref('')

const form = ref<CreateResponsavelDTO>({
  nome: '',
  email: '',
  senha: '',
  cpf: '',
  rg: '',
  tipoVinculo: '',
  telefonePrincipal: '',
  telefoneSecundario: '',
  profissao: '',
  endereco: '',
})

const alunosDisponiveis = computed(() => {
  const vinculadosIds = alunosVinculados.value.map((v) => v.alunoId)
  return todosAlunos.value.filter((a) => !vinculadosIds.includes(a.id) && a.active)
})

const filteredAlunosVinculo = computed(() => {
  if (!searchAlunoVinculo.value) return alunosDisponiveis.value
  const search = searchAlunoVinculo.value.toLowerCase()
  return alunosDisponiveis.value.filter(a =>
    a.nome.toLowerCase().includes(search) ||
    a.matricula.toLowerCase().includes(search)
  )
})

async function loadResponsavel() {
  if (!isEdit.value) return

  try {
    responsavel.value = await responsaveisService.getById(route.params.id as string)
    form.value = {
      nome: responsavel.value.user.name,
      email: responsavel.value.email,
      senha: '',
      cpf: responsavel.value.cpf,
      rg: responsavel.value.rg || '',
      tipoVinculo: responsavel.value.tipoVinculo || '',
      telefonePrincipal: responsavel.value.telefonePrincipal,
      telefoneSecundario: responsavel.value.telefoneSecundario || '',
      profissao: responsavel.value.profissao || '',
      endereco: responsavel.value.endereco || '',
    }

    await loadAlunosVinculados()
  } catch (error) {
    toast.error('Erro ao carregar responsável')
    router.push('/responsaveis')
  }
}

async function loadAlunosVinculados() {
  if (!isEdit.value) return

  try {
    alunosVinculados.value = await responsaveisService.getAlunos(route.params.id as string)
  } catch (error) {
    console.error('Erro ao carregar alunos vinculados:', error)
  }
}

async function loadAlunos() {
  try {
    console.log('🔍 [Responsavel] Iniciando carregamento de alunos...')
    const response = await alunosService.list({ limit: 1000, active: true })
    console.log('📦 [Responsavel] Resposta da API:', response)
    todosAlunos.value = response.data
    console.log('✅ [Responsavel] Alunos disponíveis:', todosAlunos.value.length)
    console.log('📊 [Responsavel] Alunos vinculados:', alunosVinculados.value.length)
  } catch (error) {
    console.error('❌ [Responsavel] Erro ao carregar alunos:', error)
  }
}

async function handleSubmit() {
  loading.value = true
  try {
    if (isEdit.value) {
      await responsaveisService.update(route.params.id as string, {
        nome: form.value.nome,
        cpf: form.value.cpf,
        rg: form.value.rg,
        tipoVinculo: form.value.tipoVinculo,
        telefonePrincipal: form.value.telefonePrincipal,
        telefoneSecundario: form.value.telefoneSecundario,
        profissao: form.value.profissao,
        endereco: form.value.endereco,
      })
      toast.success('Responsável atualizado com sucesso!')
    } else {
      const result = await responsaveisService.create(form.value)
      toast.success('Responsável cadastrado com sucesso!')
      // Redireciona para edição para permitir vincular alunos
      router.push(`/responsaveis/${result.id}/editar`)
    }
  } catch (error: any) {
    toast.error(error.response?.data?.error?.message || 'Erro ao salvar responsável')
  } finally {
    loading.value = false
  }
}

async function openVincularModal() {
  console.log('🚨 [Responsavel] Abrindo modal de vincular aluno...')
  console.log('📋 [Responsavel] todosAlunos.value.length ANTES:', todosAlunos.value.length)
  showVincularModal.value = true
  searchAlunoVinculo.value = ''
  // Carregar alunos se ainda não foram carregados
  if (todosAlunos.value.length === 0) {
    console.log('🔄 [Responsavel] Carregando alunos...')
    await loadAlunos()
  }
  console.log('📋 [Responsavel] todosAlunos.value.length DEPOIS:', todosAlunos.value.length)
  console.log('📋 [Responsavel] alunosDisponiveis.value.length:', alunosDisponiveis.value.length)
  console.log('📋 [Responsavel] filteredAlunosVinculo.value.length:', filteredAlunosVinculo.value.length)
}

function closeVincularModal() {
  showVincularModal.value = false
  searchAlunoVinculo.value = ''
}

function getTipoVinculoLabel(tipo: string): string {
  const labels: Record<string, string> = {
    PAI: 'Pai',
    MAE: 'Mãe',
    AVO: 'Avô/Avó',
    TUTOR: 'Tutor',
    OUTRO: 'Outro'
  }
  return labels[tipo] || tipo
}

function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('pt-BR')
}

async function handleVincularDireto(alunoId: string) {
  loadingVinculo.value = true
  try {
    await responsaveisService.vincularAluno(
      route.params.id as string,
      alunoId,
      1 // Prioridade padrão
    )

    toast.success('Aluno vinculado com sucesso!')
    await loadAlunosVinculados()
  } catch (error: any) {
    toast.error(error.response?.data?.error?.message || 'Erro ao vincular aluno')
  } finally {
    loadingVinculo.value = false
  }
}

async function handleDesvincular(alunoId: string) {
  if (!confirm('Deseja realmente remover este vínculo?')) return

  try {
    await responsaveisService.desvincularAluno(route.params.id as string, alunoId)
    toast.success('Vínculo removido com sucesso!')
    await loadAlunosVinculados()
  } catch (error: any) {
    toast.error(error.response?.data?.error?.message || 'Erro ao remover vínculo')
  }
}

onMounted(async () => {
  await loadResponsavel()
  await loadAlunos()
})
</script>

<template>
  <div>
    <div v-if="loading" class="flex justify-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
    </div>

    <div v-else-if="professor">
      <!-- Cabeçalho -->
      <div class="card mb-6">
        <div class="flex items-center justify-between">
          <div class="flex items-center">
            <div class="h-20 w-20 rounded-full bg-primary-100 flex items-center justify-center">
              <span class="text-primary-600 font-bold text-2xl">
                {{ getInitials(professor.user?.name || '') }}
              </span>
            </div>
            <div class="ml-6">
              <h1 class="text-3xl font-bold text-gray-900">{{ professor.user?.name }}</h1>
              <p class="text-gray-600 mt-1">{{ professor.user?.email }}</p>
              <span
                :class="[
                  'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mt-2',
                  professor.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                ]"
              >
                {{ professor.active ? 'Ativo' : 'Inativo' }}
              </span>
            </div>
          </div>
          <RouterLink to="/professores" class="btn btn-secondary">
            ← Voltar
          </RouterLink>
        </div>
      </div>

      <!-- Informações Gerais -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div class="card">
          <h2 class="text-xl font-semibold text-gray-900 mb-4">Informações Pessoais</h2>
          <dl class="space-y-3">
            <div>
              <dt class="text-sm font-medium text-gray-500">CPF</dt>
              <dd class="text-sm text-gray-900">{{ professor.user?.cpf }}</dd>
            </div>
            <div>
              <dt class="text-sm font-medium text-gray-500">Telefone</dt>
              <dd class="text-sm text-gray-900">{{ professor.user?.phone }}</dd>
            </div>
            <div>
              <dt class="text-sm font-medium text-gray-500">Email</dt>
              <dd class="text-sm text-gray-900">{{ professor.user?.email }}</dd>
            </div>
          </dl>
        </div>

        <div class="card">
          <h2 class="text-xl font-semibold text-gray-900 mb-4">Informações Profissionais</h2>
          <dl class="space-y-3">
            <div>
              <dt class="text-sm font-medium text-gray-500">Registro Profissional</dt>
              <dd class="text-sm text-gray-900">{{ professor.registroProfissional }}</dd>
            </div>
            <div>
              <dt class="text-sm font-medium text-gray-500">Carga Horária</dt>
              <dd class="text-sm text-gray-900">{{ professor.cargaHoraria }} horas</dd>
            </div>
            <div>
              <dt class="text-sm font-medium text-gray-500">Total de Turmas</dt>
              <dd class="text-sm text-gray-900">{{ professor._count?.turmas || 0 }}</dd>
            </div>
          </dl>
        </div>
      </div>

      <!-- Formações -->
      <div class="card p-0 overflow-hidden">
        <div class="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 class="text-xl font-semibold text-gray-900">Formações</h2>
          <button @click="showFormacaoModal = true" class="btn btn-primary">
            + Adicionar Formação
          </button>
        </div>

        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nome</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Descrição</th>
                <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Ações</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-if="!professor.formacoes || professor.formacoes.length === 0">
                <td colspan="3" class="px-6 py-8 text-center text-gray-500">
                  Nenhuma formação cadastrada
                </td>
              </tr>
              <tr v-for="formacao in professor.formacoes" :key="formacao.id" class="hover:bg-gray-50">
                <td class="px-6 py-2 whitespace-nowrap text-sm font-medium text-gray-900">
                  {{ formacao.nome }}
                </td>
                <td class="px-6 py-2 text-sm text-gray-600">
                  {{ formacao.descricao || '-' }}
                </td>
                <td class="px-6 py-2 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    @click="deleteFormacao(formacao.id)"
                    class="text-red-600 hover:text-red-900"
                    title="Excluir"
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
        <div v-if="professor.formacoes && professor.formacoes.length > 0" class="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
          <p class="text-sm text-gray-700">
            Total de <span class="font-medium">{{ professor.formacoes.length }}</span> formação(ões)
          </p>
        </div>
      </div>
    </div>

    <!-- Modal Formação -->
    <div
      v-if="showFormacaoModal"
      class="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50"
      @click.self="showFormacaoModal = false"
    >
      <div class="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Nova Formação</h3>
        <form @submit.prevent="createFormacao" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Nome *</label>
            <input
              v-model="formacaoForm.nome"
              type="text"
              class="input"
              placeholder="Ex: Pedagogia"
              required
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Descrição</label>
            <textarea
              v-model="formacaoForm.descricao"
              class="input"
              rows="3"
              placeholder="Descrição opcional"
            ></textarea>
          </div>
          <div class="flex justify-end gap-4">
            <button type="button" @click="showFormacaoModal = false" class="btn btn-secondary">
              Cancelar
            </button>
            <button type="submit" class="btn btn-primary">Adicionar</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import { useToast } from 'vue-toastification'
import { professoresService } from '@/services/professores.service'
import type { Professor } from '@/types'

const route = useRoute()
const toast = useToast()

const loading = ref(false)
const professor = ref<Professor | null>(null)
const showFormacaoModal = ref(false)
const formacaoForm = ref({
  nome: '',
  descricao: ''
})

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

async function loadProfessor() {
  loading.value = true
  try {
    professor.value = await professoresService.getById(route.params.id as string)
  } catch (error: any) {
    toast.error('Erro ao carregar professor')
  } finally {
    loading.value = false
  }
}

async function createFormacao() {
  if (!professor.value) return

  try {
    await professoresService.createFormacao({
      professorId: professor.value.id,
      nome: formacaoForm.value.nome,
      descricao: formacaoForm.value.descricao || undefined
    })
    toast.success('Formação adicionada com sucesso!')
    showFormacaoModal.value = false
    formacaoForm.value = { nome: '', descricao: '' }
    loadProfessor()
  } catch (error: any) {
    toast.error(error.response?.data?.message || 'Erro ao adicionar formação')
  }
}

async function deleteFormacao(id: string) {
  if (!confirm('Tem certeza que deseja remover esta formação?')) return

  try {
    await professoresService.deleteFormacao(id)
    toast.success('Formação removida com sucesso!')
    loadProfessor()
  } catch (error: any) {
    toast.error('Erro ao remover formação')
  }
}

onMounted(() => {
  loadProfessor()
})
</script>

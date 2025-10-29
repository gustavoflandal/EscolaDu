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

      <!-- Responsáveis Vinculados -->
      <div class="card">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-xl font-semibold text-gray-900">Responsáveis</h2>
          <button @click="openVinculoModal" class="btn btn-primary btn-sm">
            + Vincular Responsável
          </button>
        </div>

        <div v-if="responsaveis.length > 0" class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Responsável</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contato</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tipo de Vínculo</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Prioridade</th>
                <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Ações</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="resp in responsaveis" :key="resp.responsavelId">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm font-medium text-gray-900">{{ resp.nome }}</div>
                  <div class="text-sm text-gray-500">CPF: {{ formatCPF(resp.cpf) }}</div>
                </td>
                <td class="px-6 py-4">
                  <div class="text-sm text-gray-900">{{ resp.email || '-' }}</div>
                  <div class="text-sm text-gray-500">{{ resp.telefone ? formatPhone(resp.telefone) : '-' }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span
                    :class="[
                      'px-2 py-1 text-xs font-semibold rounded-full',
                      getTipoVinculoColor(resp.tipoVinculo)
                    ]"
                  >
                    {{ getTipoVinculoLabel(resp.tipoVinculo) }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ resp.prioridadeContato }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    @click="confirmRemoveVinculo(resp.vinculoId || '')"
                    class="text-red-600 hover:text-red-900"
                    :disabled="!resp.vinculoId"
                  >
                    Remover
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div v-else class="text-center py-6 text-gray-500">
          Nenhum responsável vinculado
        </div>
      </div>
    </div>

    <!-- Modal de Vínculo -->
    <VincularResponsavelModal
      v-if="showVinculoModal"
      :aluno-id="aluno?.id || ''"
      @close="closeVinculoModal"
      @vinculo-criado="handleVinculoCriado"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import { useToast } from 'vue-toastification'
import { alunosService } from '@/services/alunos.service'
import responsaveisService from '@/services/responsaveis.service'
import type { Aluno, AlunoStats } from '@/types'
import type { AlunoVinculo } from '@/services/responsaveis.service'
import { format } from 'date-fns'
import VincularResponsavelModal from './VincularResponsavelModal.vue'

const route = useRoute()
const toast = useToast()
const aluno = ref<Aluno | null>(null)
const stats = ref<AlunoStats | null>(null)
interface ResponsavelVinculo {
  vinculoId?: string;
  responsavelId: string;
  nome: string;
  cpf: string;
  email: string;
  telefone: string;
  tipoVinculo: string;
  prioridadeContato: number;
  alunoId: string;
  matricula: string;
  status: string;
}

const responsaveis = ref<ResponsavelVinculo[]>([])
const loading = ref(false)
const showVinculoModal = ref(false)

async function loadAluno() {
  loading.value = true
  try {
    const [alunoData, statsData] = await Promise.all([
      alunosService.getById(route.params.id as string),
      alunosService.getStats(route.params.id as string)
    ])
    aluno.value = alunoData
    stats.value = statsData
    await loadResponsaveis()
  } catch (error) {
    console.error('Erro ao carregar aluno:', error)
  } finally {
    loading.value = false
  }
}

async function loadResponsaveis() {
  try {
    // Buscar responsáveis vinculados a este aluno
    const response = await responsaveisService.list({ limit: 100 })
    const todosResponsaveis = response.data || []
    
    // Filtrar apenas os responsáveis que têm vínculo com este aluno
    const vinculos: any[] = []
    todosResponsaveis.forEach(resp => {
      resp.alunos?.forEach(aluno => {
        if (aluno.alunoId === route.params.id) {
          vinculos.push({
            vinculoId: aluno.vinculoId,
            responsavelId: resp.id,
            nome: resp.name,
            cpf: resp.cpf,
            email: resp.email,
            telefone: resp.phone,
            tipoVinculo: resp.tipoVinculo,
            prioridadeContato: aluno.prioridadeContato,
            alunoId: aluno.alunoId,
            matricula: aluno.matricula,
            status: aluno.status
          })
        }
      })
    })
    responsaveis.value = vinculos
  } catch (error) {
    console.error('Erro ao carregar responsáveis:', error)
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

function formatCPF(cpf: string): string {
  return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
}

function formatPhone(phone: string): string {
  if (phone.length === 11) {
    return phone.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3')
  }
  return phone.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3')
}

function getTipoVinculoLabel(tipo: string): string {
  const labels: Record<string, string> = {
    PAI: 'Pai',
    MAE: 'Mãe',
    AVO: 'Avó/Avô',
    TUTOR: 'Tutor',
    OUTRO: 'Outro'
  }
  return labels[tipo] || tipo
}

function getTipoVinculoColor(tipo: string): string {
  const colors: Record<string, string> = {
    PAI: 'bg-indigo-100 text-indigo-800',
    MAE: 'bg-pink-100 text-pink-800',
    AVO: 'bg-purple-100 text-purple-800',
    TUTOR: 'bg-green-100 text-green-800',
    OUTRO: 'bg-gray-100 text-gray-800'
  }
  return colors[tipo] || 'bg-gray-100 text-gray-800'
}

function openVinculoModal() {
  showVinculoModal.value = true
}

function closeVinculoModal() {
  showVinculoModal.value = false
}

function handleVinculoCriado() {
  closeVinculoModal()
  loadResponsaveis()
}

async function confirmRemoveVinculo(vinculoId: string) {
  if (!vinculoId) return
  
  if (confirm('Tem certeza que deseja remover este vínculo?')) {
    try {
      await responsaveisService.removeVinculo(vinculoId)
      toast.success('Vínculo removido com sucesso!')
      loadResponsaveis()
    } catch (error: any) {
      toast.error(error.response?.data?.error?.message || 'Erro ao remover vínculo')
    }
  }
}

onMounted(() => {
  loadAluno()
})
</script>

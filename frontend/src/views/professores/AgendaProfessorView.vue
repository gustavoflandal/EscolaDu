<template>
  <div>
    <!-- Cabeçalho -->
    <div class="flex items-center justify-between mb-8">
      <h1 class="text-3xl font-bold text-gray-900">Agenda de Professores</h1>
      <RouterLink to="/" class="btn btn-secondary">Voltar</RouterLink>
    </div>

    <!-- Filtros -->
    <div class="card mb-6">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Professor</label>
          <select v-model="professorSelecionado" class="input" @change="loadAgenda">
            <option value="">Selecione um professor...</option>
            <option v-for="professor in professores" :key="professor.id" :value="professor.id">
              {{ professor.user?.name }}
            </option>
          </select>
        </div>
        <div class="flex items-end gap-2">
          <button
            @click="loadAgenda"
            class="btn btn-primary"
            :disabled="!professorSelecionado || loading"
          >
            <svg v-if="loading" class="animate-spin h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            {{ loading ? 'Carregando...' : 'Buscar Agenda' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="text-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
      <p class="text-gray-600 mt-4">Carregando agenda...</p>
    </div>

    <!-- Agenda Semanal -->
    <div v-else-if="agenda && agenda.professor" class="space-y-6">
      <!-- Info do Professor -->
      <div class="card">
        <h2 class="text-xl font-semibold text-gray-900 mb-4">
          {{ agenda.professor.nome }}
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <span class="text-gray-600">Email:</span>
            <span class="ml-2 font-medium">{{ agenda.professor.email }}</span>
          </div>
          <div>
            <span class="text-gray-600">Registro:</span>
            <span class="ml-2 font-medium">{{ agenda.professor.registroProfissional }}</span>
          </div>
          <div>
            <span class="text-gray-600">Total de Aulas:</span>
            <span class="ml-2 font-medium">{{ agenda.totalAulas }} aulas/semana</span>
          </div>
        </div>
      </div>

      <!-- Grade Semanal -->
      <div class="grid grid-cols-1 gap-4">
        <div
          v-for="dia in agenda.agendaSemanal"
          :key="dia.diaSemana"
          class="card"
        >
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-semibold text-gray-900">
              {{ dia.diaSemanaLabel }}
            </h3>
            <span class="text-sm text-gray-500">
              {{ dia.aulas.length }} {{ dia.aulas.length === 1 ? 'aula' : 'aulas' }}
            </span>
          </div>

          <!-- Sem aulas -->
          <div v-if="dia.aulas.length === 0" class="text-center py-8 text-gray-400">
            Nenhuma aula agendada
          </div>

          <!-- Lista de Aulas -->
          <div v-else class="space-y-3">
            <div
              v-for="aula in dia.aulas"
              :key="aula.id"
              class="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
            >
              <div class="flex items-start justify-between">
                <div class="flex-1">
                  <div class="flex items-center gap-2 mb-2">
                    <span class="font-semibold text-gray-900">
                      {{ aula.horarioInicio }} - {{ aula.horarioFim }}
                    </span>
                    <span class="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                      {{ aula.disciplina.codigo }}
                    </span>
                  </div>
                  <h4 class="text-base font-medium text-gray-900 mb-1">
                    {{ aula.disciplina.nome }}
                  </h4>
                  <div class="flex flex-wrap gap-3 text-sm text-gray-600">
                    <span>
                      <svg class="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      {{ aula.turma.nome }}
                    </span>
                    <span>
                      <svg class="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                      {{ aula.turma.sala || 'Sem sala definida' }}
                    </span>
                    <span>
                      <svg class="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                      {{ aula.turma.serie }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Mensagem quando nenhum professor está selecionado -->
    <div v-else class="card text-center py-12">
      <svg class="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
      <p class="text-gray-600">Selecione um professor para visualizar a agenda</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { useToast } from 'vue-toastification'
import { professoresService } from '@/services/professores.service'

const toast = useToast()

const loading = ref(false)
const professores = ref<any[]>([])
const professorSelecionado = ref('')
const agenda = ref<any>(null)

const loadProfessores = async () => {
  try {
    const response = await professoresService.list({ active: true, limit: 1000 })
    professores.value = response.data.data || []
  } catch (error: any) {
    console.error('Erro ao carregar professores:', error)
    toast.error('Erro ao carregar professores')
  }
}

const loadAgenda = async () => {
  if (!professorSelecionado.value) {
    toast.warning('Selecione um professor')
    return
  }

  loading.value = true
  try {
    agenda.value = await professoresService.getAgenda(professorSelecionado.value)
  } catch (error: any) {
    console.error('Erro ao carregar agenda:', error)
    toast.error(error.response?.data?.message || 'Erro ao carregar agenda')
    agenda.value = null
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadProfessores()
})
</script>

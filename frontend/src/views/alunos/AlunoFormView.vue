<template>
  <div>
    <h1 class="text-3xl font-bold text-gray-900 mb-8">
      {{ isEdit ? 'Editar Aluno' : 'Novo Aluno' }}
    </h1>

    <div class="card max-w-2xl">
      <form @submit.prevent="handleSubmit" class="space-y-6">
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
              placeholder="Nome completo do aluno"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Data de Nascimento *
            </label>
            <input
              v-model="form.dataNascimento"
              type="date"
              required
              class="input"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Matrícula *
            </label>
            <input
              v-model="form.matricula"
              type="text"
              required
              class="input"
              placeholder="000000"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              CPF
            </label>
            <input
              v-model="form.cpf"
              type="text"
              class="input"
              placeholder="000.000.000-00"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Sexo *
            </label>
            <select v-model="form.sexo" required class="input">
              <option value="">Selecione</option>
              <option value="M">Masculino</option>
              <option value="F">Feminino</option>
              <option value="Outro">Outro</option>
            </select>
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

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              E-mail
            </label>
            <input
              v-model="form.email"
              type="email"
              class="input"
              placeholder="aluno@email.com"
            />
          </div>

          <div class="sm:col-span-2">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Endereço
            </label>
            <input
              v-model="form.endereco"
              type="text"
              class="input"
              placeholder="Rua, número"
            />
          </div>

          <div class="sm:col-span-2">
            <label class="flex items-center">
              <input
                v-model="form.active"
                type="checkbox"
                class="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
              />
              <span class="ml-2 text-sm font-medium text-gray-700">Aluno ativo</span>
            </label>
            <p class="text-xs text-gray-500 mt-1 ml-6">
              Desmarque para desativar o aluno (não aparecerá em listagens ativas)
            </p>
          </div>
        </div>

        <div class="flex justify-end gap-4">
          <RouterLink to="/alunos" class="btn btn-secondary">
            Cancelar
          </RouterLink>
          <button type="submit" :disabled="loading" class="btn btn-primary">
            {{ loading ? 'Salvando...' : 'Salvar' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter, RouterLink } from 'vue-router'
import { alunosService } from '@/services/alunos.service'
import { useToast } from 'vue-toastification'

const route = useRoute()
const router = useRouter()
const toast = useToast()

const isEdit = computed(() => !!route.params.id)
const loading = ref(false)

const form = ref({
  nome: '',
  dataNascimento: '',
  matricula: '',
  cpf: '',
  sexo: '',
  telefone: '',
  email: '',
  endereco: '',
  active: true,
})

async function loadAluno() {
  if (!isEdit.value) return
  
  try {
    const aluno = await alunosService.getById(route.params.id as string)
    form.value = {
      nome: aluno.nome,
      dataNascimento: aluno.dataNascimento.split('T')[0],
      matricula: aluno.matricula,
      cpf: aluno.cpf || '',
      sexo: aluno.sexo,
      telefone: aluno.telefone || '',
      email: aluno.email || '',
      endereco: aluno.endereco || '',
      active: aluno.active !== false, // Default true se não vier
    }
  } catch (error) {
    toast.error('Erro ao carregar aluno')
    router.push('/alunos')
  }
}

async function handleSubmit() {
  loading.value = true
  try {
    if (isEdit.value) {
      await alunosService.update(route.params.id as string, form.value)
      toast.success('Aluno atualizado com sucesso!')
    } else {
      await alunosService.create(form.value)
      toast.success('Aluno cadastrado com sucesso!')
    }
    router.push('/alunos')
  } catch (error: any) {
    toast.error(error.response?.data?.message || 'Erro ao salvar aluno')
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadAluno()
})
</script>

<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-3xl font-bold text-gray-900">
        {{ isEdit ? 'Editar Aluno' : 'Novo Aluno' }}
      </h1>
      <button @click="$router.back()" class="btn btn-secondary">
        ← Voltar
      </button>
    </div>

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
            <select v-model="form.genero" required class="input">
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

          <!-- Status - Apenas em modo de edição -->
          <div v-if="isEdit" class="sm:col-span-2">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Status *
            </label>
            <select v-model="form.status" required class="input">
              <option value="ATIVO">Ativo</option>
              <option value="INATIVO">Inativo</option>
              <option value="TRANSFERIDO">Transferido</option>
              <option value="EVADIDO">Evadido</option>
              <option value="CONCLUIDO">Concluído</option>
            </select>
            <p class="mt-1 text-xs text-gray-500">
              Status acadêmico atual do aluno
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

const form = ref<{
  nome: string;
  dataNascimento: string;
  matricula: string;
  cpf: string;
  genero: 'M' | 'F' | 'Outro' | '';
  telefone: string;
  email: string;
  endereco: string;
  status: 'ATIVO' | 'INATIVO' | 'TRANSFERIDO' | 'EVADIDO' | 'CONCLUIDO';
}>({
  nome: '',
  dataNascimento: '',
  matricula: '',
  cpf: '',
  genero: '',
  telefone: '',
  email: '',
  endereco: '',
  status: 'ATIVO'
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
      genero: aluno.genero || '',
      telefone: aluno.telefone || '',
      email: aluno.email || '',
      endereco: aluno.endereco || '',
      status: aluno.status || 'ATIVO'
    }
  } catch (error) {
    toast.error('Erro ao carregar aluno')
    router.push('/alunos')
  }
}

async function handleSubmit() {
  loading.value = true
  try {
    const data = {
      ...form.value,
      genero: form.value.genero || undefined
    }
    
    if (isEdit.value) {
      await alunosService.update(route.params.id as string, data)
      toast.success('Aluno atualizado com sucesso!')
    } else {
      await alunosService.create(data)
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

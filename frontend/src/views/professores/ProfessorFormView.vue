<template>
  <div>
    <h1 class="text-3xl font-bold text-gray-900 mb-8">
      {{ isEdit ? 'Editar Professor' : 'Novo Professor' }}
    </h1>

    <div class="card max-w-2xl">
      <form @submit.prevent="handleSubmit" class="space-y-6">
        <!-- Seleção de Usuário (apenas na criação) -->
        <div v-if="!isEdit" class="sm:col-span-2">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Usuário *
          </label>
          <select v-model="form.userId" class="input" required>
            <option value="">Selecione um usuário</option>
            <option v-for="user in availableUsers" :key="user.id" :value="user.id">
              {{ user.name }} ({{ user.email }})
            </option>
          </select>
        </div>

        <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <!-- Registro Profissional -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Registro Profissional *
            </label>
            <input
              v-model="form.registroProfissional"
              type="text"
              class="input"
              placeholder="Ex: RP001"
              required
            />
          </div>

          <!-- Carga Horária -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Carga Horária (horas) *
            </label>
            <input
              v-model.number="form.cargaHoraria"
              type="number"
              min="1"
              max="60"
              class="input"
              placeholder="Ex: 40"
              required
            />
          </div>

          <!-- Status -->
          <div class="sm:col-span-2">
            <label class="flex items-center">
              <input v-model="form.active" type="checkbox" class="checkbox mr-2" />
              <span class="text-sm font-medium text-gray-700">Professor ativo</span>
            </label>
          </div>
        </div>

        <!-- Botões -->
        <div class="flex justify-end gap-4">
          <RouterLink to="/professores" class="btn btn-secondary">
            Cancelar
          </RouterLink>
          <button type="submit" class="btn btn-primary" :disabled="loading">
            {{ loading ? 'Salvando...' : isEdit ? 'Atualizar' : 'Cadastrar' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter, RouterLink } from 'vue-router'
import { useToast } from 'vue-toastification'
import { professoresService } from '@/services/professores.service'
import usersService from '@/services/users.service'
import type { User } from '@/types'

const route = useRoute()
const router = useRouter()
const toast = useToast()

const isEdit = computed(() => !!route.params.id)
const loading = ref(false)
const availableUsers = ref<User[]>([])

const form = ref({
  userId: '',
  registroProfissional: '',
  cargaHoraria: 40,
  active: true
})

async function loadUsers() {
  try {
    const response = await usersService.list({ active: true })
    availableUsers.value = response.data
  } catch (error) {
    console.error('Erro ao carregar usuários:', error)
  }
}

async function loadProfessor() {
  if (!isEdit.value) return

  try {
    const professor = await professoresService.getById(route.params.id as string)
    form.value = {
      userId: professor.userId,
      registroProfissional: professor.registroProfissional,
      cargaHoraria: professor.cargaHoraria,
      active: professor.active
    }
  } catch (error: any) {
    toast.error('Erro ao carregar professor')
    router.push('/professores')
  }
}

async function handleSubmit() {
  loading.value = true
  try {
    if (isEdit.value) {
      await professoresService.update(route.params.id as string, {
        registroProfissional: form.value.registroProfissional,
        cargaHoraria: form.value.cargaHoraria,
        active: form.value.active
      })
      toast.success('Professor atualizado com sucesso!')
    } else {
      await professoresService.create(form.value)
      toast.success('Professor cadastrado com sucesso!')
    }
    router.push('/professores')
  } catch (error: any) {
    toast.error(error.response?.data?.message || 'Erro ao salvar professor')
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  if (!isEdit.value) {
    loadUsers()
  }
  loadProfessor()
})
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <div class="card max-w-md w-full">
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold text-gray-900">SGE</h1>
        <p class="text-gray-600 mt-2">Sistema de Gerenciamento Escolar</p>
      </div>

      <form @submit.prevent="handleLogin" class="space-y-6">
        <div>
          <label for="email" class="block text-sm font-medium text-gray-700 mb-2">
            E-mail
          </label>
          <input
            id="email"
            v-model="credentials.email"
            type="email"
            required
            class="input"
            placeholder="seu@email.com"
          />
        </div>

        <div>
          <label for="password" class="block text-sm font-medium text-gray-700 mb-2">
            Senha
          </label>
          <input
            id="password"
            v-model="credentials.senha"
            type="password"
            required
            class="input"
            placeholder="••••••••"
          />
        </div>

        <button
          type="submit"
          :disabled="loading"
          class="btn btn-primary w-full"
        >
          {{ loading ? 'Entrando...' : 'Entrar' }}
        </button>
      </form>

      <div class="mt-6 text-center text-sm text-gray-600">
        <p>Credenciais padrão:</p>
        <p class="mt-1"><strong>admin@sge.com</strong> / <strong>Admin@2024</strong></p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useToast } from 'vue-toastification'

const router = useRouter()
const authStore = useAuthStore()
const toast = useToast()

const credentials = ref({
  email: '',
  senha: ''
})

const loading = ref(false)

async function handleLogin() {
  if (loading.value) return // Previne múltiplos cliques
  
  loading.value = true
  try {
    console.log('🔑 Tentando fazer login...')
    await authStore.login(credentials.value)
    console.log('✅ Login realizado com sucesso!', { 
      user: authStore.user,
      token: authStore.token?.substring(0, 20) + '...',
      isAuthenticated: authStore.isAuthenticated 
    })
    toast.success('Login realizado com sucesso!')
    console.log('📤 Redirecionando para /')
    await router.push('/')
    console.log('✅ Redirecionamento concluído')
  } catch (error: any) {
    console.error('❌ Erro no login:', error)
    const errorMessage = error.response?.data?.error?.message || 
                        error.response?.data?.message || 
                        'Erro ao fazer login'
    toast.error(errorMessage)
  } finally {
    loading.value = false
  }
}
</script>

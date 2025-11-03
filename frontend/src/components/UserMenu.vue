<template>
  <div class="relative" ref="menuRef">
    <!-- Botão do Menu -->
    <button
      @click="toggleMenu"
      class="flex items-center space-x-3 focus:outline-none focus:ring-2 focus:ring-primary-500 rounded-lg px-3 py-2 hover:bg-gray-50 transition-colors"
    >
      <!-- Avatar -->
      <div class="flex-shrink-0">
        <div
          v-if="user?.avatar"
          class="h-10 w-10 rounded-full bg-gray-200 overflow-hidden"
        >
          <img :src="user.avatar" :alt="user.name" class="h-full w-full object-cover" />
        </div>
        <div
          v-else
          class="h-10 w-10 rounded-full bg-primary-500 flex items-center justify-center text-white font-semibold"
        >
          {{ getInitials(user?.name) }}
        </div>
      </div>

      <!-- Nome e Role -->
      <div class="hidden md:block text-left">
        <p class="text-sm font-medium text-gray-900">{{ user?.name }}</p>
        <p class="text-xs text-gray-500">{{ getRoleName(user?.roles) }}</p>
      </div>

      <!-- Ícone -->
      <svg
        class="h-5 w-5 text-gray-400 transition-transform"
        :class="{ 'rotate-180': isOpen }"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path
          fill-rule="evenodd"
          d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
          clip-rule="evenodd"
        />
      </svg>
    </button>

    <!-- Dropdown Menu -->
    <Transition
      enter-active-class="transition ease-out duration-100"
      enter-from-class="transform opacity-0 scale-95"
      enter-to-class="transform opacity-100 scale-100"
      leave-active-class="transition ease-in duration-75"
      leave-from-class="transform opacity-100 scale-100"
      leave-to-class="transform opacity-0 scale-95"
    >
      <div
        v-show="isOpen"
        class="absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 divide-y divide-gray-100 z-50"
      >
        <!-- Informações do Usuário -->
        <div class="px-4 py-3">
          <p class="text-sm font-medium text-gray-900">{{ user?.name }}</p>
          <p class="text-sm text-gray-500 truncate">{{ user?.email }}</p>
        </div>

        <!-- Menu Items -->
        <div class="py-1">
          <RouterLink
            to="/perfil"
            @click="closeMenu"
            class="group flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors"
          >
            <svg
              class="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fill-rule="evenodd"
                d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                clip-rule="evenodd"
              />
            </svg>
            Meu Perfil
          </RouterLink>

          <RouterLink
            to="/configuracoes"
            @click="closeMenu"
            class="group flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors"
          >
            <svg
              class="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fill-rule="evenodd"
                d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z"
                clip-rule="evenodd"
              />
            </svg>
            Configurações
          </RouterLink>
        </div>

        <!-- Logout -->
        <div class="py-1">
          <button
            @click="handleLogout"
            class="group flex w-full items-center px-4 py-2 text-sm text-red-700 hover:bg-red-50 hover:text-red-900 transition-colors"
          >
            <svg
              class="mr-3 h-5 w-5 text-red-400 group-hover:text-red-500"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fill-rule="evenodd"
                d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z"
                clip-rule="evenodd"
              />
            </svg>
            Sair
          </button>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useToast } from 'vue-toastification'

const router = useRouter()
const authStore = useAuthStore()
const toast = useToast()

const user = authStore.user
const isOpen = ref(false)
const menuRef = ref<HTMLElement | null>(null)

function toggleMenu() {
  isOpen.value = !isOpen.value
}

function closeMenu() {
  isOpen.value = false
}

function getInitials(name?: string): string {
  if (!name) return '?'
  const parts = name.split(' ')
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase()
  }
  return name.substring(0, 2).toUpperCase()
}

function getRoleName(roles?: any[]): string {
  if (!roles || roles.length === 0) return 'Sem perfil'
  return roles[0].name || 'Usuário'
}

function handleLogout() {
  authStore.logout()
  toast.success('Logout realizado com sucesso!')
  router.push('/login')
  closeMenu()
}

// Fechar menu ao clicar fora
function handleClickOutside(event: MouseEvent) {
  if (menuRef.value && !menuRef.value.contains(event.target as Node)) {
    closeMenu()
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

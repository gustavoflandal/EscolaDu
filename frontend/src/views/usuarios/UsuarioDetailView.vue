<template>
  <div>
    <!-- Loading -->
    <div v-if="loading" class="text-center py-12">
      <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      <p class="text-gray-600 mt-2">Carregando...</p>
    </div>

    <!-- Conteúdo -->
    <div v-else-if="user">
      <!-- Cabeçalho -->
      <div class="mb-6">
        <div class="flex justify-between items-center mb-4">
          <div>
            <h1 class="text-3xl font-bold text-gray-900">{{ user.name }}</h1>
            <p class="text-gray-600 mt-1">Detalhes do usuário</p>
          </div>
          <div>
            <RouterLink to="/usuarios" class="btn btn-secondary">
              ← Voltar
            </RouterLink>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Informações Principais -->
        <div class="lg:col-span-2 space-y-6">
          <!-- Dados Pessoais -->
          <div class="card">
            <h2 class="text-lg font-semibold text-gray-900 mb-4">Dados Pessoais</h2>
            <dl class="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <dt class="text-sm font-medium text-gray-500">Nome Completo</dt>
                <dd class="mt-1 text-sm text-gray-900">{{ user.name }}</dd>
              </div>
              <div>
                <dt class="text-sm font-medium text-gray-500">E-mail</dt>
                <dd class="mt-1 text-sm text-gray-900">{{ user.email }}</dd>
              </div>
              <div>
                <dt class="text-sm font-medium text-gray-500">CPF</dt>
                <dd class="mt-1 text-sm text-gray-900">
                  {{ user.cpf ? formatCPF(user.cpf) : 'Não informado' }}
                </dd>
              </div>
              <div>
                <dt class="text-sm font-medium text-gray-500">Telefone</dt>
                <dd class="mt-1 text-sm text-gray-900">
                  {{ user.phone ? formatPhone(user.phone) : 'Não informado' }}
                </dd>
              </div>
              <div>
                <dt class="text-sm font-medium text-gray-500">Status</dt>
                <dd class="mt-1">
                  <span
                    :class="[
                      'px-2 inline-flex text-xs leading-5 font-semibold rounded-full',
                      user.active
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    ]"
                  >
                    {{ user.active ? 'Ativo' : 'Inativo' }}
                  </span>
                </dd>
              </div>
              <div>
                <dt class="text-sm font-medium text-gray-500">Cadastro</dt>
                <dd class="mt-1 text-sm text-gray-900">
                  {{ formatDate(user.createdAt) }}
                </dd>
              </div>
            </dl>
          </div>

          <!-- Permissões -->
          <div class="card">
            <h2 class="text-lg font-semibold text-gray-900 mb-4">Permissões</h2>
            <div v-if="loadingPermissions" class="text-center py-4">
              <div class="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-primary-600"></div>
            </div>
            <div v-else-if="permissions.length > 0" class="space-y-3">
              <div v-for="group in groupedPermissions" :key="group.resource" class="border-l-4 border-primary-500 pl-4">
                <h3 class="text-sm font-semibold text-gray-900 mb-2">{{ group.resource }}</h3>
                <div class="flex flex-wrap gap-2">
                  <span
                    v-for="permission in group.permissions"
                    :key="permission"
                    class="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-700"
                  >
                    {{ permission }}
                  </span>
                </div>
              </div>
            </div>
            <p v-else class="text-sm text-gray-500">
              Nenhuma permissão atribuída
            </p>
          </div>
        </div>

        <!-- Sidebar -->
        <div class="space-y-6">
          <!-- Perfis -->
          <div class="card">
            <h2 class="text-lg font-semibold text-gray-900 mb-4">Perfis de Acesso</h2>
            <div class="space-y-2">
              <div
                v-for="role in user.roles"
                :key="role.id"
                class="p-3 bg-blue-50 border border-blue-200 rounded-lg"
              >
                <p class="text-sm font-medium text-blue-900">{{ role.name }}</p>
                <p v-if="role.description" class="text-xs text-blue-700 mt-1">
                  {{ role.description }}
                </p>
              </div>
            </div>
          </div>

          <!-- Informações do Sistema -->
          <div class="card">
            <h2 class="text-lg font-semibold text-gray-900 mb-4">Informações</h2>
            <dl class="space-y-3">
              <div>
                <dt class="text-xs font-medium text-gray-500">ID do Usuário</dt>
                <dd class="mt-1 text-xs text-gray-900 font-mono">{{ user.id }}</dd>
              </div>
              <div>
                <dt class="text-xs font-medium text-gray-500">Criado em</dt>
                <dd class="mt-1 text-xs text-gray-900">{{ formatDate(user.createdAt) }}</dd>
              </div>
              <div>
                <dt class="text-xs font-medium text-gray-500">Última atualização</dt>
                <dd class="mt-1 text-xs text-gray-900">{{ formatDate(user.updatedAt) }}</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter, RouterLink } from 'vue-router';
import { useToast } from 'vue-toastification';
import usersService from '@/services/users.service';
import type { User } from '@/types';

const route = useRoute();
const router = useRouter();
const toast = useToast();

const loading = ref(false);
const loadingPermissions = ref(false);
const user = ref<User | null>(null);
const permissions = ref<string[]>([]);

const groupedPermissions = computed(() => {
  const groups: Record<string, string[]> = {};
  
  permissions.value.forEach(perm => {
    const [resource, action] = perm.split(':');
    if (!groups[resource]) {
      groups[resource] = [];
    }
    groups[resource].push(action);
  });

  return Object.entries(groups).map(([resource, perms]) => ({
    resource,
    permissions: perms
  }));
});

function formatCPF(cpf: string): string {
  return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
}

function formatPhone(phone: string): string {
  if (phone.length === 11) {
    return phone.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  }
  return phone.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
}

function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

async function loadUser() {
  try {
    loading.value = true;
    user.value = await usersService.getById(route.params.id as string);
  } catch (error: any) {
    toast.error(error.response?.data?.error?.message || 'Erro ao carregar usuário');
    router.push('/usuarios');
  } finally {
    loading.value = false;
  }
}

async function loadPermissions() {
  try {
    loadingPermissions.value = true;
    permissions.value = await usersService.getPermissions(route.params.id as string);
  } catch (error: any) {
    console.error('Erro ao carregar permissões:', error);
  } finally {
    loadingPermissions.value = false;
  }
}

async function confirmDelete() {
  if (!user.value) return;

  if (confirm(`Tem certeza que deseja excluir o usuário ${user.value.name}?`)) {
    try {
      await usersService.delete(user.value.id);
      toast.success('Usuário excluído com sucesso!');
      router.push('/usuarios');
    } catch (error: any) {
      toast.error(error.response?.data?.error?.message || 'Erro ao excluir usuário');
    }
  }
}

onMounted(() => {
  loadUser();
  loadPermissions();
});
</script>

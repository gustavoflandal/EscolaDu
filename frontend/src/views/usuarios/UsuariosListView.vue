<template>
  <div>
    <!-- Cabeçalho -->
    <div class="flex justify-between items-center mb-6">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Usuários</h1>
        <p class="text-gray-600 mt-1">Gerencie os usuários do sistema</p>
      </div>
      <RouterLink to="/usuarios/novo" class="btn btn-primary">
        + Novo Usuário
      </RouterLink>
    </div>

    <!-- Filtros -->
    <div class="bg-white p-4 rounded-lg shadow mb-6">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Buscar</label>
          <input
            v-model="filters.search"
            type="text"
            placeholder="Nome, email ou CPF..."
            class="input"
            @input="debouncedSearch"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Perfil</label>
          <select v-model="filters.roleId" class="input" @change="loadUsers">
            <option value="">Todos os perfis</option>
            <option v-for="role in roles" :key="role.id" :value="role.id">
              {{ role.name }}
            </option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Status</label>
          <select v-model="filters.active" class="input" @change="loadUsers">
            <option value="">Todos</option>
            <option value="true">Ativos</option>
            <option value="false">Inativos</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="text-center py-12">
      <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      <p class="text-gray-600 mt-2">Carregando usuários...</p>
    </div>

    <!-- Tabela de Usuários -->
    <div v-else-if="users.length > 0" class="bg-white shadow rounded-lg overflow-hidden">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Usuário
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Email / Telefone
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Perfis
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Ações
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="user in users" :key="user.id" class="hover:bg-gray-50">
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="flex items-center">
                    <div class="flex-shrink-0 h-10 w-10">
                      <div
                        :class="[ 'h-10 w-10 rounded-full flex items-center justify-center font-semibold', getAvatarClasses(user) ]"
                      >
                        {{ getInitials(user.name) }}
                      </div>
                    </div>
                <div class="ml-4">
                  <div class="text-sm font-medium text-gray-900">{{ user.name }}</div>
                  <div class="text-sm text-gray-500">{{ user.cpf || 'CPF não informado' }}</div>
                </div>
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm text-gray-900">{{ user.email }}</div>
              <div class="text-sm text-gray-500">{{ user.phone || 'Telefone não informado' }}</div>
            </td>
            <td class="px-6 py-4">
              <div class="flex flex-wrap gap-1">
                <span
                  v-for="role in user.roles"
                  :key="role.id"
                  :class="[ 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium', getRoleBadgeClasses(role) ]"
                >
                  {{ role.name }}
                </span>
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
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
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
              <div class="flex justify-end gap-2">
                <RouterLink
                  :to="`/usuarios/${user.id}`"
                  class="text-blue-600 hover:text-blue-900"
                  title="Visualizar"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </RouterLink>
                <RouterLink
                  :to="`/usuarios/${user.id}/editar`"
                  class="text-yellow-600 hover:text-yellow-900"
                  title="Editar"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </RouterLink>
                <button
                  @click="confirmDelete(user)"
                  class="text-red-600 hover:text-red-900"
                  title="Excluir"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Paginação -->
      <div v-if="pagination.totalPages > 1" class="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
        <div class="flex items-center justify-between">
          <div class="flex-1 flex justify-between sm:hidden">
            <button
              @click="changePage(pagination.page - 1)"
              :disabled="pagination.page === 1"
              class="btn btn-secondary"
            >
              Anterior
            </button>
            <button
              @click="changePage(pagination.page + 1)"
              :disabled="pagination.page >= pagination.totalPages"
              class="btn btn-secondary"
            >
              Próxima
            </button>
          </div>
          <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p class="text-sm text-gray-700">
                Mostrando
                <span class="font-medium">{{ (pagination.page - 1) * pagination.limit + 1 }}</span>
                até
                <span class="font-medium">{{
                  Math.min(pagination.page * pagination.limit, pagination.total)
                }}</span>
                de
                <span class="font-medium">{{ pagination.total }}</span>
                resultados
              </p>
            </div>
            <div>
              <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                <button
                  @click="changePage(pagination.page - 1)"
                  :disabled="pagination.page === 1"
                  class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Anterior
                </button>
                <button
                  @click="changePage(pagination.page + 1)"
                  :disabled="pagination.page >= pagination.totalPages"
                  class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Próxima
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Estado vazio -->
    <div v-else class="text-center py-12 bg-white rounded-lg shadow">
      <p class="text-gray-500">Nenhum usuário encontrado</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { RouterLink } from 'vue-router';
import { useToast } from 'vue-toastification';
import usersService from '@/services/users.service';
import type { User } from '@/types';
import { rolesService, type Role } from '@/services/roles.service';

type RoleColor = {
  badgeBg: string;
  badgeText: string;
  avatarBg: string;
  avatarText: string;
};

const roleColorMap: Record<string, RoleColor> = {
  Administrador: { badgeBg: 'bg-indigo-100', badgeText: 'text-indigo-800', avatarBg: 'bg-indigo-100', avatarText: 'text-indigo-700' },
  Coordenador: { badgeBg: 'bg-green-100', badgeText: 'text-green-800', avatarBg: 'bg-green-100', avatarText: 'text-green-700' },
  Professor: { badgeBg: 'bg-yellow-100', badgeText: 'text-yellow-800', avatarBg: 'bg-yellow-100', avatarText: 'text-yellow-700' },
  'Responsável': { badgeBg: 'bg-purple-100', badgeText: 'text-purple-800', avatarBg: 'bg-purple-100', avatarText: 'text-purple-700' },
  // default
  default: { badgeBg: 'bg-blue-100', badgeText: 'text-blue-800', avatarBg: 'bg-primary-100', avatarText: 'text-primary-700' }
};

function getRoleBadgeClasses(role: { name: string }) {
  const color = roleColorMap[role.name] || roleColorMap.default;
  return `${color.badgeBg} ${color.badgeText}`;
}

function getAvatarClasses(user: User) {
  const primaryRole = user.roles && user.roles.length > 0 ? user.roles[0].name : '';
  const color = roleColorMap[primaryRole] || roleColorMap.default;
  return `${color.avatarBg} ${color.avatarText}`;
}

const toast = useToast();
const loading = ref(false);
const users = ref<User[]>([]);
const roles = ref<Role[]>([]);
const filters = ref({
  search: '',
  roleId: '',
  active: ''
});

const pagination = ref({
  page: 1,
  limit: 10,
  total: 0,
  totalPages: 0
});

let searchTimeout: ReturnType<typeof setTimeout> | undefined;

function debouncedSearch() {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    loadUsers();
  }, 500);
}

async function loadUsers() {
  try {
    loading.value = true;
    const params: any = {
      page: pagination.value.page,
      limit: pagination.value.limit
    };

    if (filters.value.search) params.search = filters.value.search;
    if (filters.value.roleId) params.roleId = filters.value.roleId;
    if (filters.value.active !== '') params.active = filters.value.active === 'true';

    const response = await usersService.list(params);
    users.value = response.data || [];
    pagination.value = {
      page: response.pagination?.page || 1,
      limit: response.pagination?.limit || 10,
      total: response.pagination?.total || 0,
      totalPages: response.pagination?.totalPages || 0
    };
  } catch (error: any) {
    users.value = [];
    toast.error(error.response?.data?.error?.message || 'Erro ao carregar usuários');
    console.error('Erro ao carregar usuários:', error);
  } finally {
    loading.value = false;
  }
}

async function loadRoles() {
  try {
    roles.value = await rolesService.list();
  } catch (error) {
    console.error('Erro ao carregar perfis:', error);
  }
}

function changePage(page: number) {
  pagination.value.page = page;
  loadUsers();
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .slice(0, 2)
    .map(n => n[0])
    .join('')
    .toUpperCase();
}

async function confirmDelete(user: User) {
  if (confirm(`Tem certeza que deseja excluir o usuário ${user.name}?`)) {
    try {
      await usersService.delete(user.id);
      toast.success('Usuário excluído com sucesso!');
      loadUsers();
    } catch (error: any) {
      toast.error(error.response?.data?.error?.message || 'Erro ao excluir usuário');
    }
  }
}

onMounted(() => {
  loadUsers();
  loadRoles();
});
</script>

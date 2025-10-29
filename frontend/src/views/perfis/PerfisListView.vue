<template>
  <div>
    <!-- Cabeçalho -->
    <div class="flex justify-between items-center mb-6">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Perfis de Acesso</h1>
        <p class="text-gray-600 mt-1">Gerencie os perfis e suas permissões</p>
      </div>
      <RouterLink to="/perfis/novo" class="btn btn-primary">
        + Novo Perfil
      </RouterLink>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="text-center py-12">
      <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      <p class="text-gray-600 mt-2">Carregando perfis...</p>
    </div>

    <!-- Lista de Perfis -->
    <div v-else-if="roles.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="role in roles"
        :key="role.id"
        class="card hover:shadow-lg transition-shadow"
      >
        <!-- Header do Card -->
        <div class="flex justify-between items-start mb-4">
          <div class="flex-1">
            <h3 class="text-lg font-semibold text-gray-900">{{ role.name }}</h3>
            <p v-if="role.description" class="text-sm text-gray-600 mt-1">
              {{ role.description }}
            </p>
          </div>
          <span
            :class="[
              'px-2 py-1 text-xs font-semibold rounded-full',
              role.active
                ? 'bg-green-100 text-green-800'
                : 'bg-gray-100 text-gray-800'
            ]"
          >
            {{ role.active ? 'Ativo' : 'Inativo' }}
          </span>
        </div>

        <!-- Estatísticas -->
        <div class="space-y-3 mb-4">
          <div class="flex items-center justify-between text-sm">
            <span class="text-gray-600">Usuários:</span>
            <span class="font-semibold text-gray-900">
              {{ role._count?.users || 0 }}
            </span>
          </div>
          <div class="flex items-center justify-between text-sm">
            <span class="text-gray-600">Permissões:</span>
            <span class="font-semibold text-gray-900">
              {{ role.permissions?.length || 0 }}
            </span>
          </div>
        </div>

        <!-- Permissões Preview -->
        <div v-if="role.permissions && role.permissions.length > 0" class="mb-4">
          <p class="text-xs font-medium text-gray-500 mb-2">
            Recursos com acesso ({{ getUniqueResources(role.permissions).length }} recursos):
          </p>
          <div class="flex flex-wrap gap-1">
            <span
              v-for="resource in getUniqueResources(role.permissions)"
              :key="resource"
              class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800"
            >
              {{ formatResourceName(resource) }}
            </span>
          </div>
        </div>

        <!-- Ações -->
        <div class="flex gap-2 pt-4 border-t border-gray-200">
          <RouterLink
            :to="`/perfis/${role.id}/editar`"
            class="flex-1 btn btn-secondary text-center"
          >
            Editar
          </RouterLink>
          <button
            @click="confirmDelete(role)"
            class="flex-1 btn bg-red-600 hover:bg-red-700 text-white"
            :disabled="(role._count?.users || 0) > 0"
            :title="(role._count?.users || 0) > 0 ? 'Não é possível excluir perfis com usuários' : ''"
          >
            Excluir
          </button>
        </div>
      </div>
    </div>

    <!-- Estado vazio -->
    <div v-else class="text-center py-12 bg-white rounded-lg shadow">
      <p class="text-gray-500">Nenhum perfil cadastrado</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { RouterLink } from 'vue-router';
import { useToast } from 'vue-toastification';
import { rolesService, type Role, type Permission } from '@/services/roles.service';

const toast = useToast();
const loading = ref(false);
const roles = ref<Role[]>([]);

const resourceNames: Record<string, string> = {
  users: 'Usuários',
  roles: 'Perfis',
  permissions: 'Permissões',
  alunos: 'Alunos',
  turmas: 'Turmas',
  disciplinas: 'Disciplinas',
  professores: 'Professores',
  frequencia: 'Frequência',
  objetivos: 'Objetivos',
  avaliacoes: 'Avaliações',
  recuperacao: 'Recuperação',
  planejamento: 'Planejamento',
  comunicados: 'Comunicados',
  notificacoes: 'Notificações',
  relatorios: 'Relatórios',
  dashboard: 'Dashboard'
};

function getUniqueResources(permissions: Permission[]): string[] {
  const resources = new Set(permissions.map(p => p.resource));
  return Array.from(resources).sort();
}

function formatResourceName(resource: string): string {
  return resourceNames[resource] || resource;
}

async function loadRoles() {
  try {
    loading.value = true;
    roles.value = await rolesService.list();
  } catch (error: any) {
    toast.error(error.response?.data?.error?.message || 'Erro ao carregar perfis');
  } finally {
    loading.value = false;
  }
}

async function confirmDelete(role: Role) {
  if ((role._count?.users || 0) > 0) {
    toast.warning('Não é possível excluir perfis que possuem usuários vinculados');
    return;
  }

  if (confirm(`Tem certeza que deseja excluir o perfil ${role.name}?`)) {
    try {
      await rolesService.delete(role.id);
      toast.success('Perfil excluído com sucesso!');
      loadRoles();
    } catch (error: any) {
      toast.error(error.response?.data?.error?.message || 'Erro ao excluir perfil');
    }
  }
}

onMounted(() => {
  loadRoles();
});
</script>

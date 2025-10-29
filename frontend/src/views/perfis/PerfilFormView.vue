<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-3xl font-bold text-gray-900">
        {{ isEdit ? 'Editar Perfil' : 'Novo Perfil' }}
      </h1>
      <button @click="$router.back()" class="btn btn-secondary">
        ← Voltar
      </button>
    </div>

    <div class="card max-w-4xl">
      <form @submit.prevent="handleSubmit" class="space-y-6">
        <!-- Informações Básicas -->
        <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Nome do Perfil *
            </label>
            <input
              v-model="form.name"
              type="text"
              required
              class="input"
              placeholder="Ex: Administrador, Professor..."
            />
          </div>

          <div v-if="isEdit">
            <label class="flex items-center space-x-3 pt-6">
              <input
                type="checkbox"
                v-model="form.active"
                class="h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
              />
              <span class="text-sm font-medium text-gray-700">
                Perfil ativo
              </span>
            </label>
          </div>

          <div class="sm:col-span-2">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Descrição
            </label>
            <textarea
              v-model="form.description"
              rows="3"
              class="input"
              placeholder="Descreva as responsabilidades e acesso deste perfil..."
            ></textarea>
          </div>
        </div>

        <!-- Permissões -->
        <div>
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Permissões</h3>
          
          <!-- Loading Permissões -->
          <div v-if="loadingPermissions" class="text-center py-8">
            <div class="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-primary-600"></div>
            <p class="text-gray-600 mt-2 text-sm">Carregando permissões...</p>
          </div>

          <!-- Seleção de Permissões -->
          <div v-else class="space-y-4">
            <!-- Ações Rápidas -->
            <div class="flex gap-2 pb-4 border-b border-gray-200">
              <button
                type="button"
                @click="selectAllPermissions"
                class="btn btn-secondary text-sm"
              >
                Selecionar Todas
              </button>
              <button
                type="button"
                @click="clearAllPermissions"
                class="btn btn-secondary text-sm"
              >
                Limpar Seleção
              </button>
              <div class="ml-auto text-sm text-gray-600">
                {{ form.permissionIds.length }} de {{ allPermissions.length }} selecionadas
              </div>
            </div>

            <!-- Permissões Agrupadas -->
            <div
              v-for="group in permissionGroups"
              :key="group.resource"
              class="border border-gray-200 rounded-lg p-4"
            >
              <div class="flex items-center justify-between mb-3">
                <h4 class="text-sm font-semibold text-gray-900">
                  {{ formatResourceName(group.resource) }}
                </h4>
                <div class="flex gap-2">
                  <button
                    type="button"
                    @click="selectGroupPermissions(group.permissions)"
                    class="text-xs text-primary-600 hover:text-primary-700"
                  >
                    Selecionar Todas
                  </button>
                  <button
                    type="button"
                    @click="clearGroupPermissions(group.permissions)"
                    class="text-xs text-gray-600 hover:text-gray-700"
                  >
                    Limpar
                  </button>
                </div>
              </div>
              <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <label
                  v-for="permission in group.permissions"
                  :key="permission.id"
                  class="flex items-center space-x-2 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    :value="permission.id"
                    v-model="form.permissionIds"
                    class="h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                  />
                  <span class="text-sm text-gray-700">
                    {{ formatActionName(permission.action) }}
                  </span>
                </label>
              </div>
            </div>
          </div>
        </div>

        <div class="flex justify-end gap-4 pt-6 border-t border-gray-200">
          <RouterLink to="/perfis" class="btn btn-secondary">
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
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter, RouterLink } from 'vue-router';
import { useToast } from 'vue-toastification';
import {
  rolesService,
  permissionsService,
  type CreateRoleData,
  type UpdateRoleData,
  type PermissionGroup,
  type Permission
} from '@/services/roles.service';

const route = useRoute();
const router = useRouter();
const toast = useToast();

const isEdit = computed(() => !!route.params.id);
const loading = ref(false);
const loadingPermissions = ref(false);
const allPermissions = ref<Permission[]>([]);
const permissionGroups = ref<PermissionGroup[]>([]);

const form = ref<CreateRoleData & { active?: boolean }>({
  name: '',
  description: '',
  permissionIds: [],
  active: true
});

const resourceNames: Record<string, string> = {
  users: 'Usuários',
  roles: 'Perfis',
  permissions: 'Permissões',
  alunos: 'Alunos',
  turmas: 'Turmas',
  disciplinas: 'Disciplinas',
  professores: 'Professores',
  frequencia: 'Frequência',
  objetivos: 'Objetivos de Aprendizagem',
  avaliacoes: 'Avaliações',
  recuperacao: 'Recuperação',
  planejamento: 'Planejamento',
  comunicados: 'Comunicados',
  notificacoes: 'Notificações',
  relatorios: 'Relatórios',
  dashboard: 'Dashboard'
};

const actionNames: Record<string, string> = {
  create: 'Criar',
  read: 'Visualizar',
  update: 'Editar',
  delete: 'Excluir',
  export: 'Exportar'
};

function formatResourceName(resource: string): string {
  return resourceNames[resource] || resource;
}

function formatActionName(action: string): string {
  return actionNames[action] || action;
}

function selectAllPermissions() {
  form.value.permissionIds = allPermissions.value.map(p => p.id);
}

function clearAllPermissions() {
  form.value.permissionIds = [];
}

function selectGroupPermissions(permissions: Permission[]) {
  const ids = permissions.map(p => p.id);
  form.value.permissionIds = [
    ...new Set([...form.value.permissionIds, ...ids])
  ];
}

function clearGroupPermissions(permissions: Permission[]) {
  const ids = permissions.map(p => p.id);
  form.value.permissionIds = form.value.permissionIds.filter(
    id => !ids.includes(id)
  );
}

async function loadPermissions() {
  try {
    loadingPermissions.value = true;
    
    // Carrega permissões agrupadas
    permissionGroups.value = await permissionsService.listGrouped();
    
    // Monta lista plana de todas as permissões
    allPermissions.value = permissionGroups.value.flatMap(g => g.permissions);
  } catch (error: any) {
    toast.error('Erro ao carregar permissões');
  } finally {
    loadingPermissions.value = false;
  }
}

async function loadRole() {
  if (!route.params.id) return;

  try {
    loading.value = true;
    const role = await rolesService.getById(route.params.id as string);
    
    form.value = {
      name: role.name,
      description: role.description || '',
      permissionIds: role.permissions.map(p => p.id),
      active: role.active
    };
  } catch (error: any) {
    toast.error(error.response?.data?.error?.message || 'Erro ao carregar perfil');
    router.push('/perfis');
  } finally {
    loading.value = false;
  }
}

async function handleSubmit() {
  if (form.value.permissionIds.length === 0) {
    toast.warning('Selecione pelo menos uma permissão');
    return;
  }

  try {
    loading.value = true;

    if (isEdit.value) {
      const updateData: UpdateRoleData = {
        name: form.value.name,
        description: form.value.description || undefined,
        permissionIds: form.value.permissionIds,
        active: form.value.active
      };

      await rolesService.update(route.params.id as string, updateData);
      toast.success('Perfil atualizado com sucesso!');
    } else {
      const createData: CreateRoleData = {
        name: form.value.name,
        description: form.value.description || undefined,
        permissionIds: form.value.permissionIds
      };

      await rolesService.create(createData);
      toast.success('Perfil criado com sucesso!');
    }

    router.push('/perfis');
  } catch (error: any) {
    toast.error(error.response?.data?.error?.message || 'Erro ao salvar perfil');
  } finally {
    loading.value = false;
  }
}

onMounted(async () => {
  await loadPermissions();
  if (isEdit.value) {
    await loadRole();
  }
});
</script>

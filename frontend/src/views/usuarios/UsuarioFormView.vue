<template>
  <div>
    <h1 class="text-3xl font-bold text-gray-900 mb-8">
      {{ isEdit ? 'Editar Usuário' : 'Novo Usuário' }}
    </h1>

    <div class="card max-w-2xl">
      <form @submit.prevent="handleSubmit" class="space-y-6">
        <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div class="sm:col-span-2">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Nome Completo *
            </label>
            <input
              v-model="form.name"
              type="text"
              required
              class="input"
              placeholder="Nome completo do usuário"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              E-mail *
            </label>
            <input
              v-model="form.email"
              type="email"
              required
              class="input"
              placeholder="usuario@email.com"
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
              maxlength="14"
              @input="formatCPF"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Telefone
            </label>
            <input
              v-model="form.phone"
              type="tel"
              class="input"
              placeholder="(00) 00000-0000"
              maxlength="15"
              @input="formatPhone"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              {{ isEdit ? 'Nova Senha' : 'Senha *' }}
            </label>
            <input
              v-model="form.password"
              type="password"
              :required="!isEdit"
              class="input"
              placeholder="Mínimo 8 caracteres"
              minlength="8"
            />
            <p v-if="isEdit" class="mt-1 text-xs text-gray-500">
              Deixe em branco para manter a senha atual
            </p>
          </div>

          <div class="sm:col-span-2">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Perfis de Acesso *
            </label>
            <div class="space-y-2">
              <label
                v-for="role in roles"
                :key="role.id"
                class="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
              >
                <input
                  type="checkbox"
                  :value="role.id"
                  v-model="form.roleIds"
                  class="h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                />
                <div class="flex-1">
                  <p class="text-sm font-medium text-gray-900">{{ role.name }}</p>
                  <p v-if="role.description" class="text-xs text-gray-500">{{ role.description }}</p>
                </div>
              </label>
            </div>
            <p class="mt-2 text-xs text-gray-500">
              Selecione um ou mais perfis para o usuário
            </p>
          </div>

          <!-- Status - Apenas em modo de edição -->
          <div v-if="isEdit" class="sm:col-span-2">
            <label class="flex items-center space-x-3">
              <input
                type="checkbox"
                v-model="form.active"
                class="h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
              />
              <span class="text-sm font-medium text-gray-700">
                Usuário ativo
              </span>
            </label>
            <p class="mt-1 text-xs text-gray-500 ml-7">
              Desmarque para desativar o acesso do usuário ao sistema
            </p>
          </div>
        </div>

        <div class="flex justify-end gap-4">
          <RouterLink to="/usuarios" class="btn btn-secondary">
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
import usersService, { type CreateUserData, type UpdateUserData } from '@/services/users.service';
import { rolesService, type Role } from '@/services/roles.service';

const route = useRoute();
const router = useRouter();
const toast = useToast();

const isEdit = computed(() => !!route.params.id);
const loading = ref(false);
const roles = ref<Role[]>([]);

const form = ref<CreateUserData & { active?: boolean }>({
  name: '',
  email: '',
  password: '',
  cpf: '',
  phone: '',
  roleIds: [],
  active: true
});

function formatCPF(event: Event) {
  const input = event.target as HTMLInputElement;
  let value = input.value.replace(/\D/g, '');
  
  if (value.length > 11) value = value.slice(0, 11);
  
  if (value.length >= 10) {
    value = value.replace(/(\d{3})(\d{3})(\d{3})(\d{1,2})/, '$1.$2.$3-$4');
  } else if (value.length >= 7) {
    value = value.replace(/(\d{3})(\d{3})(\d{1,3})/, '$1.$2.$3');
  } else if (value.length >= 4) {
    value = value.replace(/(\d{3})(\d{1,3})/, '$1.$2');
  }
  
  form.value.cpf = value;
}

function formatPhone(event: Event) {
  const input = event.target as HTMLInputElement;
  let value = input.value.replace(/\D/g, '');
  
  if (value.length > 11) value = value.slice(0, 11);
  
  if (value.length >= 11) {
    value = value.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  } else if (value.length >= 7) {
    value = value.replace(/(\d{2})(\d{4})(\d{1,4})/, '($1) $2-$3');
  } else if (value.length >= 3) {
    value = value.replace(/(\d{2})(\d{1,5})/, '($1) $2');
  }
  
  form.value.phone = value;
}

async function loadRoles() {
  try {
    roles.value = await rolesService.list();
  } catch (error: any) {
    toast.error('Erro ao carregar perfis');
  }
}

async function loadUser() {
  if (!route.params.id) return;

  try {
    loading.value = true;
    const user = await usersService.getById(route.params.id as string);
    
    form.value = {
      name: user.name,
      email: user.email,
      password: '',
      cpf: user.cpf || '',
      phone: user.phone || '',
      roleIds: user.roles.map(r => r.id),
      active: user.active
    };
  } catch (error: any) {
    toast.error(error.response?.data?.error?.message || 'Erro ao carregar usuário');
    router.push('/usuarios');
  } finally {
    loading.value = false;
  }
}

async function handleSubmit() {
  if (form.value.roleIds.length === 0) {
    toast.warning('Selecione pelo menos um perfil de acesso');
    return;
  }

  try {
    loading.value = true;

    // Remove formatação do CPF
    const cpf = form.value.cpf?.replace(/\D/g, '') || undefined;
    const phone = form.value.phone?.replace(/\D/g, '') || undefined;

    if (isEdit.value) {
      const updateData: UpdateUserData = {
        name: form.value.name,
        email: form.value.email,
        cpf,
        phone,
        roleIds: form.value.roleIds,
        active: form.value.active
      };

      // Só envia senha se foi preenchida
      if (form.value.password) {
        updateData.password = form.value.password;
      }

      await usersService.update(route.params.id as string, updateData);
      toast.success('Usuário atualizado com sucesso!');
    } else {
      const createData: CreateUserData = {
        name: form.value.name,
        email: form.value.email,
        password: form.value.password,
        cpf,
        phone,
        roleIds: form.value.roleIds
      };

      await usersService.create(createData);
      toast.success('Usuário criado com sucesso!');
    }

    router.push('/usuarios');
  } catch (error: any) {
    toast.error(error.response?.data?.error?.message || 'Erro ao salvar usuário');
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  loadRoles();
  if (isEdit.value) {
    loadUser();
  }
});
</script>

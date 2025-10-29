<template>
  <div>
    <!-- Cabeçalho -->
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-gray-900">
        {{ isEdit ? 'Editar Responsável' : 'Novo Responsável' }}
      </h1>
      <button @click="$router.back()" class="btn btn-secondary">
        ← Voltar
      </button>
    </div>

    <!-- Formulário -->
    <div class="bg-white shadow rounded-lg p-6">
      <form @submit.prevent="handleSubmit">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Nome -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Nome Completo <span class="text-red-500">*</span>
            </label>
            <input
              v-model="form.name"
              type="text"
              required
              minlength="3"
              maxlength="100"
              class="input"
              :class="{ 'border-red-500': errors.name }"
            />
            <p v-if="errors.name" class="text-red-500 text-xs mt-1">{{ errors.name }}</p>
          </div>

          <!-- Email -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Email <span class="text-red-500">*</span>
            </label>
            <input
              v-model="form.email"
              type="email"
              required
              class="input"
              :class="{ 'border-red-500': errors.email }"
            />
            <p v-if="errors.email" class="text-red-500 text-xs mt-1">{{ errors.email }}</p>
          </div>

          <!-- CPF -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              CPF <span class="text-red-500">*</span>
            </label>
            <input
              v-model="form.cpf"
              type="text"
              required
              maxlength="14"
              :disabled="isEdit"
              class="input"
              :class="{ 'border-red-500': errors.cpf, 'bg-gray-100 cursor-not-allowed': isEdit }"
              @input="handleCPFInput"
            />
            <p v-if="errors.cpf" class="text-red-500 text-xs mt-1">{{ errors.cpf }}</p>
            <p v-if="isEdit" class="text-gray-500 text-xs mt-1">CPF não pode ser alterado</p>
          </div>

          <!-- Tipo de Vínculo -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Tipo de Vínculo <span class="text-red-500">*</span>
            </label>
            <select
              v-model="form.tipoVinculo"
              required
              class="input"
              :class="{ 'border-red-500': errors.tipoVinculo }"
            >
              <option value="">Selecione...</option>
              <option value="PAI">Pai</option>
              <option value="MAE">Mãe</option>
              <option value="AVO">Avó/Avô</option>
              <option value="TUTOR">Tutor</option>
              <option value="OUTRO">Outro</option>
            </select>
            <p v-if="errors.tipoVinculo" class="text-red-500 text-xs mt-1">{{ errors.tipoVinculo }}</p>
          </div>

          <!-- Telefone Principal -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Telefone Principal <span class="text-red-500">*</span>
            </label>
            <input
              v-model="form.phone"
              type="text"
              required
              maxlength="15"
              class="input"
              :class="{ 'border-red-500': errors.phone }"
              @input="handlePhoneInput"
            />
            <p v-if="errors.phone" class="text-red-500 text-xs mt-1">{{ errors.phone }}</p>
          </div>

          <!-- Senha (somente na criação) -->
          <div v-if="!isEdit">
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Senha <span class="text-red-500">*</span>
            </label>
            <input
              v-model="form.password"
              type="password"
              required
              minlength="8"
              class="input"
              :class="{ 'border-red-500': errors.password }"
            />
            <p v-if="errors.password" class="text-red-500 text-xs mt-1">{{ errors.password }}</p>
            <p class="text-gray-500 text-xs mt-1">Mínimo de 8 caracteres</p>
          </div>

          <!-- RG -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">RG</label>
            <input
              v-model="form.rg"
              type="text"
              maxlength="20"
              class="input"
            />
          </div>

          <!-- Telefone Secundário -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Telefone Secundário</label>
            <input
              v-model="form.telefoneSecundario"
              type="text"
              maxlength="15"
              class="input"
              @input="handleSecondaryPhoneInput"
            />
          </div>

          <!-- Profissão -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Profissão</label>
            <input
              v-model="form.profissao"
              type="text"
              maxlength="100"
              class="input"
            />
          </div>
        </div>

        <!-- Endereço -->
        <div class="mt-6">
          <label class="block text-sm font-medium text-gray-700 mb-1">Endereço</label>
          <textarea
            v-model="form.endereco"
            rows="3"
            class="input"
          ></textarea>
        </div>

        <!-- Status (somente na edição) -->
        <div v-if="isEdit" class="mt-6">
          <label class="flex items-center">
            <input
              v-model="form.active"
              type="checkbox"
              class="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
            />
            <span class="ml-2 text-sm text-gray-700">Responsável ativo</span>
          </label>
        </div>

        <!-- Botões -->
        <div class="flex justify-end gap-3 mt-6">
          <RouterLink to="/responsaveis" class="btn btn-secondary">
            Cancelar
          </RouterLink>
          <button type="submit" class="btn btn-primary" :disabled="submitting">
            {{ submitting ? 'Salvando...' : 'Salvar' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { RouterLink, useRoute, useRouter } from 'vue-router';
import { useToast } from 'vue-toastification';
import responsaveisService, { type CreateResponsavelData, type UpdateResponsavelData } from '@/services/responsaveis.service';

const route = useRoute();
const router = useRouter();
const toast = useToast();

const isEdit = computed(() => !!route.params.id);
const submitting = ref(false);

const form = ref<CreateResponsavelData & { active?: boolean }>({
  name: '',
  email: '',
  cpf: '',
  phone: '',
  password: '',
  tipoVinculo: '' as any,
  rg: '',
  telefoneSecundario: '',
  profissao: '',
  endereco: ''
});

const errors = ref<Record<string, string>>({});

function handleCPFInput(event: Event) {
  const input = event.target as HTMLInputElement;
  let value = input.value.replace(/\D/g, '');
  
  if (value.length > 11) value = value.slice(0, 11);
  
  if (value.length > 9) {
    value = value.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  } else if (value.length > 6) {
    value = value.replace(/(\d{3})(\d{3})(\d{3})/, '$1.$2.$3');
  } else if (value.length > 3) {
    value = value.replace(/(\d{3})(\d{3})/, '$1.$2');
  }
  
  form.value.cpf = value;
}

function handlePhoneInput(event: Event) {
  const input = event.target as HTMLInputElement;
  let value = input.value.replace(/\D/g, '');
  
  if (value.length > 11) value = value.slice(0, 11);
  
  if (value.length > 10) {
    value = value.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  } else if (value.length > 6) {
    value = value.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3');
  } else if (value.length > 2) {
    value = value.replace(/(\d{2})(\d{0,5})/, '($1) $2');
  }
  
  form.value.phone = value;
}

function handleSecondaryPhoneInput(event: Event) {
  const input = event.target as HTMLInputElement;
  let value = input.value.replace(/\D/g, '');
  
  if (value.length > 11) value = value.slice(0, 11);
  
  if (value.length > 10) {
    value = value.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  } else if (value.length > 6) {
    value = value.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3');
  } else if (value.length > 2) {
    value = value.replace(/(\d{2})(\d{0,5})/, '($1) $2');
  }
  
  form.value.telefoneSecundario = value;
}

function validateForm(): boolean {
  errors.value = {};

  if (!form.value.name || form.value.name.length < 3) {
    errors.value.name = 'Nome deve ter no mínimo 3 caracteres';
  }

  if (!form.value.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.value.email)) {
    errors.value.email = 'Email inválido';
  }

  const cpfDigits = form.value.cpf.replace(/\D/g, '');
  if (!cpfDigits || cpfDigits.length !== 11) {
    errors.value.cpf = 'CPF deve ter 11 dígitos';
  }

  const phoneDigits = form.value.phone.replace(/\D/g, '');
  if (!phoneDigits || (phoneDigits.length !== 10 && phoneDigits.length !== 11)) {
    errors.value.phone = 'Telefone deve ter 10 ou 11 dígitos';
  }

  if (!form.value.tipoVinculo) {
    errors.value.tipoVinculo = 'Tipo de vínculo é obrigatório';
  }

  if (!isEdit.value && (!form.value.password || form.value.password.length < 8)) {
    errors.value.password = 'Senha deve ter no mínimo 8 caracteres';
  }

  return Object.keys(errors.value).length === 0;
}

async function handleSubmit() {
  if (!validateForm()) {
    toast.error('Por favor, corrija os erros no formulário');
    return;
  }

  submitting.value = true;

  try {
    const data: any = {
      name: form.value.name,
      email: form.value.email,
      phone: form.value.phone.replace(/\D/g, ''),
      tipoVinculo: form.value.tipoVinculo,
      rg: form.value.rg,
      telefoneSecundario: form.value.telefoneSecundario?.replace(/\D/g, ''),
      profissao: form.value.profissao,
      endereco: form.value.endereco
    };

    if (isEdit.value) {
      data.active = form.value.active;
      await responsaveisService.update(route.params.id as string, data as UpdateResponsavelData);
      toast.success('Responsável atualizado com sucesso!');
    } else {
      data.cpf = form.value.cpf.replace(/\D/g, '');
      data.password = form.value.password;
      await responsaveisService.create(data as CreateResponsavelData);
      toast.success('Responsável criado com sucesso!');
    }

    router.push('/responsaveis');
  } catch (error: any) {
    toast.error(error.response?.data?.error?.message || 'Erro ao salvar responsável');
    console.error('Erro ao salvar responsável:', error);
  } finally {
    submitting.value = false;
  }
}

async function loadResponsavel() {
  try {
    const id = route.params.id as string;
    const responsavel = await responsaveisService.getById(id);
    
    form.value = {
      name: responsavel.name,
      email: responsavel.email,
      cpf: responsavel.cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4'),
      phone: responsavel.phone.length === 11
        ? responsavel.phone.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3')
        : responsavel.phone.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3'),
      password: '',
      tipoVinculo: responsavel.tipoVinculo,
      rg: responsavel.rg || '',
      telefoneSecundario: responsavel.telefoneSecundario
        ? (responsavel.telefoneSecundario.length === 11
            ? responsavel.telefoneSecundario.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3')
            : responsavel.telefoneSecundario.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3'))
        : '',
      profissao: responsavel.profissao || '',
      endereco: responsavel.endereco || '',
      active: responsavel.active
    };
  } catch (error: any) {
    toast.error(error.response?.data?.error?.message || 'Erro ao carregar responsável');
    router.push('/responsaveis');
  }
}

onMounted(() => {
  if (isEdit.value) {
    loadResponsavel();
  }
});
</script>

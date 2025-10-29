# 📐 Arquitetura e Design System - SGE Frontend

## 📑 Índice

1. [Visão Geral](#visão-geral)
2. [Stack Tecnológica](#stack-tecnológica)
3. [Arquitetura de Pastas](#arquitetura-de-pastas)
4. [Design System](#design-system)
5. [Padrões de Código](#padrões-de-código)
6. [Componentes Reutilizáveis](#componentes-reutilizáveis)
7. [Gerenciamento de Estado](#gerenciamento-de-estado)
8. [Roteamento](#roteamento)
9. [Integração com API](#integração-com-api)
10. [Boas Práticas](#boas-práticas)

---

## 🎯 Visão Geral

O frontend do SGE (Sistema de Gerenciamento Escolar) é uma aplicação **Single Page Application (SPA)** construída com Vue.js 3, seguindo os padrões mais modernos de desenvolvimento web. A aplicação utiliza **Composition API** e **TypeScript** para garantir type-safety e melhor manutenibilidade.

### Características Principais

- ✅ **Vue 3** com Composition API e `<script setup>`
- ✅ **TypeScript** para type-safety
- ✅ **Tailwind CSS** para estilização
- ✅ **Pinia** para gerenciamento de estado
- ✅ **Vue Router** para navegação
- ✅ **Axios** para requisições HTTP
- ✅ **Vite** como bundler (build ultrarrápido)
- ✅ **Design responsivo** (mobile-first)

---

## 🛠️ Stack Tecnológica

### Core
- **Vue.js 3.4.21** - Framework progressivo
- **TypeScript 5.4** - Superset tipado do JavaScript
- **Vite 5.1.5** - Build tool de próxima geração

### Bibliotecas Principais
```json
{
  "vue": "^3.4.21",              // Framework principal
  "vue-router": "^4.3.0",        // Roteamento SPA
  "pinia": "^2.1.7",             // State management
  "axios": "^1.6.7",             // HTTP client
  "vue-toastification": "^2.0.0-rc.5", // Notificações toast
  "chart.js": "^4.4.2",          // Gráficos e dashboards
  "vue-chartjs": "^5.3.0",       // Wrapper Vue para Chart.js
  "@vueuse/core": "^10.9.0",     // Composables utilitários
  "date-fns": "^3.3.1"           // Manipulação de datas
}
```

### Estilização
- **Tailwind CSS 3.4.1** - Framework CSS utility-first
- **PostCSS 8.4.35** - Processador CSS
- **Autoprefixer 10.4.18** - Vendor prefixes automáticos

### Ferramentas de Desenvolvimento
- **ESLint** - Linting JavaScript/TypeScript
- **Prettier** - Formatação de código
- **Vue TSC** - Type checking para Vue

---

## 📁 Arquitetura de Pastas

```
frontend/
├── src/
│   ├── assets/              # Recursos estáticos (imagens, fontes, etc)
│   ├── components/          # Componentes reutilizáveis
│   │   ├── common/          # Componentes genéricos (Button, Input, Modal)
│   │   ├── forms/           # Componentes de formulário
│   │   └── layout/          # Componentes de layout (Header, Sidebar)
│   ├── layouts/             # Layouts de página
│   │   └── DashboardLayout.vue
│   ├── router/              # Configuração de rotas
│   │   └── index.ts
│   ├── services/            # Serviços de API
│   │   ├── api.ts           # Instância Axios configurada
│   │   ├── auth.service.ts
│   │   ├── alunos.service.ts
│   │   └── dashboard.service.ts
│   ├── stores/              # Stores Pinia (gerenciamento de estado)
│   │   └── auth.ts
│   ├── types/               # Definições TypeScript
│   │   └── index.ts
│   ├── utils/               # Funções utilitárias
│   │   ├── formatters.ts    # Formatação de dados
│   │   └── validators.ts    # Validações
│   ├── views/               # Páginas da aplicação
│   │   ├── auth/            # Páginas de autenticação
│   │   ├── alunos/          # Páginas de alunos
│   │   ├── turmas/          # Páginas de turmas
│   │   ├── frequencia/      # Páginas de frequência
│   │   ├── objetivos/       # Páginas de objetivos
│   │   └── relatorios/      # Páginas de relatórios
│   ├── App.vue              # Componente raiz
│   ├── main.ts              # Entry point
│   └── style.css            # Estilos globais
├── public/                  # Arquivos públicos estáticos
├── index.html               # HTML principal
├── vite.config.ts           # Configuração Vite
├── tailwind.config.js       # Configuração Tailwind
├── tsconfig.json            # Configuração TypeScript
└── package.json             # Dependências e scripts
```

### Convenções de Nomenclatura

#### Componentes Vue
- **PascalCase** para nomes de arquivos: `UserProfile.vue`, `DataTable.vue`
- **Sempre multi-palavra** para componentes: ❌ `User.vue` → ✅ `UserCard.vue`
- **Prefixo Base** para componentes base: `BaseButton.vue`, `BaseInput.vue`

#### Views (Páginas)
- **PascalCase** terminando em `View.vue`: `DashboardView.vue`, `AlunosListView.vue`
- **Organizar por feature**: `alunos/AlunosListView.vue`, `alunos/AlunoFormView.vue`

#### Services
- **camelCase** terminando em `.service.ts`: `auth.service.ts`, `alunos.service.ts`
- **Export default** objeto com métodos: `export const authService = { ... }`

#### Stores
- **camelCase**: `auth.ts`, `user.ts`
- **Nome da store** no defineStore: `defineStore('auth', ...)`

#### Types
- **PascalCase** para interfaces e tipos: `User`, `LoginRequest`, `ApiResponse`
- **Sufixos descritivos**: `LoginRequest`, `UserResponse`, `AlunoStats`

---

## 🎨 Design System

### Paleta de Cores

#### Cores Primárias (Azul)
```css
primary: {
  50:  '#eff6ff',  /* Backgrounds hover */
  100: '#dbeafe',  /* Backgrounds light */
  200: '#bfdbfe',  /* Borders light */
  300: '#93c5fd',  /* Disabled states */
  400: '#60a5fa',  /* Hover states */
  500: '#3b82f6',  /* Primary color */
  600: '#2563eb',  /* Main interactive (botões, links) */
  700: '#1d4ed8',  /* Hover darker */
  800: '#1e40af',  /* Active states */
  900: '#1e3a8a',  /* Text em destaque */
}
```

**Uso:**
- **600** (`#2563eb`) - Cor principal do sistema (botões primários, links)
- **700** (`#1d4ed8`) - Hover de elementos primários
- **500** (`#3b82f6`) - Ícones e elementos secundários
- **100** (`#dbeafe`) - Backgrounds de destaque
- **50** (`#eff6ff`) - Backgrounds hover suaves

#### Cores Neutras (Escala de Cinza)
```css
gray: {
  50:  '#f9fafb',  /* Backgrounds muito claros */
  100: '#f3f4f6',  /* Background principal da aplicação */
  200: '#e5e7eb',  /* Borders, divisores */
  300: '#d1d5db',  /* Borders hover */
  400: '#9ca3af',  /* Texto placeholder */
  500: '#6b7280',  /* Texto secundário */
  600: '#4b5563',  /* Texto padrão */
  700: '#374151',  /* Texto escuro */
  800: '#1f2937',  /* Títulos */
  900: '#111827',  /* Texto principal, cabeçalhos */
}
```

**Uso:**
- **900** (`#111827`) - Títulos e textos principais
- **700** (`#374151`) - Textos de corpo
- **500** (`#6b7280`) - Textos secundários, labels
- **400** (`#9ca3af`) - Placeholders, textos desabilitados
- **200** (`#e5e7eb`) - Borders de inputs, cards
- **100** (`#f3f4f6`) - Background da aplicação

#### Cores Semânticas

**Sucesso (Verde)**
```css
green: {
  50:  '#f0fdf4',
  500: '#22c55e',  /* Ícones de sucesso */
  600: '#16a34a',  /* Botões de sucesso */
  700: '#15803d',  /* Hover sucesso */
}
```

**Aviso (Amarelo)**
```css
yellow: {
  50:  '#fefce8',
  400: '#facc15',  /* Ícones de aviso */
  500: '#eab308',  /* Alertas */
  600: '#ca8a04',  /* Borders de aviso */
}
```

**Erro/Perigo (Vermelho)**
```css
red: {
  50:  '#fef2f2',
  500: '#ef4444',  /* Ícones de erro */
  600: '#dc2626',  /* Botões de perigo */
  700: '#b91c1c',  /* Hover perigo */
}
```

**Informação (Azul claro)**
```css
blue: {
  50:  '#eff6ff',
  500: '#3b82f6',  /* Ícones informativos */
  600: '#2563eb',  /* Alertas informativos */
}
```

### Tipografia

#### Fonte
```css
font-family: Inter, system-ui, Avenir, Helvetica, Arial, sans-serif;
```

**Hierarquia:**

```css
/* Títulos de Página */
.text-3xl { font-size: 1.875rem; line-height: 2.25rem; } /* 30px */
font-weight: 700 (bold)
color: gray-900

/* Títulos de Seção */
.text-2xl { font-size: 1.5rem; line-height: 2rem; }     /* 24px */
font-weight: 600 (semibold)
color: gray-900

/* Títulos de Card */
.text-xl { font-size: 1.25rem; line-height: 1.75rem; }  /* 20px */
font-weight: 600 (semibold)
color: gray-900

/* Subtítulos */
.text-lg { font-size: 1.125rem; line-height: 1.75rem; } /* 18px */
font-weight: 500 (medium)
color: gray-700

/* Corpo de Texto */
.text-base { font-size: 1rem; line-height: 1.5rem; }    /* 16px */
font-weight: 400 (regular)
color: gray-700

/* Texto Secundário */
.text-sm { font-size: 0.875rem; line-height: 1.25rem; } /* 14px */
font-weight: 400 (regular)
color: gray-600

/* Texto Pequeno (Labels) */
.text-xs { font-size: 0.75rem; line-height: 1rem; }     /* 12px */
font-weight: 500 (medium)
color: gray-500
```

**Exemplo de uso:**
```vue
<h1 class="text-3xl font-bold text-gray-900">Título da Página</h1>
<h2 class="text-xl font-semibold text-gray-900">Seção</h2>
<p class="text-base text-gray-700">Texto de corpo</p>
<span class="text-sm text-gray-600">Texto secundário</span>
<label class="text-sm font-medium text-gray-700">Label do campo</label>
```

### Espaçamento

**Sistema de Espaçamento Tailwind (escala 4px):**

```css
0: 0px
1: 0.25rem  /* 4px  */ - Espaçamento mínimo
2: 0.5rem   /* 8px  */ - Entre ícone e texto
3: 0.75rem  /* 12px */ - Padding pequeno
4: 1rem     /* 16px */ - Padrão entre elementos
5: 1.25rem  /* 20px */ - Entre grupos
6: 1.5rem   /* 24px */ - Padding de cards
8: 2rem     /* 32px */ - Entre seções
10: 2.5rem  /* 40px */ - Margens grandes
12: 3rem    /* 48px */ - Espaçamento de página
```

**Padrões:**
- **Padding de Card:** `p-6` (24px)
- **Margin entre seções:** `mb-8` (32px)
- **Gap entre elementos:** `gap-4` (16px)
- **Espaço entre inputs:** `space-y-4` (16px vertical)

### Arredondamento (Border Radius)

```css
rounded-none: 0px
rounded-sm:   0.125rem  /* 2px  */
rounded:      0.25rem   /* 4px  */ - Padrão mínimo
rounded-md:   0.375rem  /* 6px  */ - Cards pequenos
rounded-lg:   0.5rem    /* 8px  */ - Botões, inputs, cards (PADRÃO)
rounded-xl:   0.75rem   /* 12px */ - Cards grandes
rounded-2xl:  1rem      /* 16px */ - Modais
rounded-full: 9999px           - Avatares, badges circulares
```

**Uso recomendado:**
- **Botões e Inputs:** `rounded-lg` (8px)
- **Cards:** `rounded-lg` (8px)
- **Modais:** `rounded-2xl` (16px)
- **Avatares:** `rounded-full`

### Sombras (Shadows)

```css
/* Hover em cards */
shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05)

/* Cards padrão */
shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 
           0 2px 4px -1px rgba(0, 0, 0, 0.06)

/* Cards em destaque */
shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 
           0 4px 6px -2px rgba(0, 0, 0, 0.05)

/* Modais */
shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 
           0 10px 10px -5px rgba(0, 0, 0, 0.04)

/* Dropdowns */
shadow-2xl: 0 25px 50px -12px rgba(0, 0, 0, 0.25)
```

**Uso recomendado:**
- **Cards normais:** `shadow-md`
- **Hover em cards:** `hover:shadow-lg`
- **Modais:** `shadow-xl`
- **Dropdowns:** `shadow-2xl`

### Transições

**Duração padrão:**
```css
duration-200: 200ms  /* Padrão para hover, focus */
duration-300: 300ms  /* Transições suaves */
duration-500: 500ms  /* Animações mais longas */
```

**Ease functions:**
```css
ease-in-out  /* Padrão */
ease-in      /* Para aparecer */
ease-out     /* Para desaparecer */
```

**Exemplo:**
```vue
<button class="transition-colors duration-200 hover:bg-primary-700">
  Botão
</button>
```

---

## 🧩 Componentes e Classes Utilitárias

### Classes Base (Definidas em style.css)

#### Botões

```css
/* Classe Base */
.btn {
  @apply px-4 py-2 rounded-lg font-medium transition-colors duration-200;
}

/* Variantes */
.btn-primary {
  @apply bg-primary-600 text-white hover:bg-primary-700 
         disabled:opacity-50 disabled:cursor-not-allowed;
}

.btn-secondary {
  @apply bg-gray-200 text-gray-800 hover:bg-gray-300;
}

.btn-danger {
  @apply bg-red-600 text-white hover:bg-red-700;
}
```

**Uso:**
```vue
<button class="btn btn-primary">Salvar</button>
<button class="btn btn-secondary">Cancelar</button>
<button class="btn btn-danger">Excluir</button>
```

**Tamanhos:**
```vue
<!-- Pequeno -->
<button class="btn btn-primary px-3 py-1.5 text-sm">Pequeno</button>

<!-- Normal (padrão) -->
<button class="btn btn-primary">Normal</button>

<!-- Grande -->
<button class="btn btn-primary px-6 py-3 text-lg">Grande</button>
```

#### Inputs

```css
.input {
  @apply w-full px-3 py-2 border border-gray-300 rounded-lg 
         focus:ring-2 focus:ring-primary-500 focus:border-transparent 
         text-gray-900 bg-white;
}
```

**Uso:**
```vue
<input type="text" class="input" placeholder="Digite aqui..." />
<textarea class="input" rows="4"></textarea>
<select class="input">
  <option>Opção 1</option>
</select>
```

**Estados:**
```vue
<!-- Erro -->
<input class="input border-red-500 focus:ring-red-500" />

<!-- Sucesso -->
<input class="input border-green-500 focus:ring-green-500" />

<!-- Disabled -->
<input class="input opacity-50 cursor-not-allowed" disabled />
```

#### Cards

```css
.card {
  @apply bg-white rounded-lg shadow-md p-6;
}
```

**Uso:**
```vue
<div class="card">
  <h2 class="text-xl font-semibold text-gray-900 mb-4">Título</h2>
  <p class="text-gray-700">Conteúdo do card</p>
</div>
```

**Variantes:**
```vue
<!-- Card hover -->
<div class="card hover:shadow-lg transition-shadow duration-200">
  Conteúdo
</div>

<!-- Card com border colorido -->
<div class="card border-l-4 border-primary-600">
  Conteúdo com destaque
</div>

<!-- Card de alerta -->
<div class="card bg-yellow-50 border-l-4 border-yellow-400">
  Alerta
</div>
```

### Padrões de Layout

#### Container Principal
```vue
<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
  <!-- Conteúdo com margem responsiva -->
</div>
```

#### Grid Responsivo
```vue
<!-- 1 coluna mobile, 2 tablet, 4 desktop -->
<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
  <div class="card">Item 1</div>
  <div class="card">Item 2</div>
  <div class="card">Item 3</div>
  <div class="card">Item 4</div>
</div>
```

#### Flex com espaçamento
```vue
<div class="flex items-center justify-between mb-6">
  <h1 class="text-2xl font-bold">Título</h1>
  <button class="btn btn-primary">Ação</button>
</div>
```

### Formulários

#### Estrutura de Formulário Padrão

**Layout da Página:**
```vue
<template>
  <div>
    <!-- Título da Página -->
    <h1 class="text-3xl font-bold text-gray-900 mb-8">
      {{ isEdit ? 'Editar Item' : 'Novo Item' }}
    </h1>

    <!-- Card do Formulário -->
    <div class="card max-w-2xl">
      <form @submit.prevent="handleSubmit" class="space-y-6">
        <!-- Grid de Campos -->
        <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
          
          <!-- Campo de largura completa -->
          <div class="sm:col-span-2">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Nome Completo *
            </label>
            <input
              v-model="form.nome"
              type="text"
              required
              class="input"
              placeholder="Nome completo"
            />
          </div>

          <!-- Campo de meia largura -->
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

          <!-- Campo de meia largura -->
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

          <!-- Select -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Categoria *
            </label>
            <select v-model="form.categoria" required class="input">
              <option value="">Selecione</option>
              <option value="opcao1">Opção 1</option>
              <option value="opcao2">Opção 2</option>
            </select>
          </div>

          <!-- Campo opcional (sem asterisco) -->
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

        </div>

        <!-- Botões de Ação -->
        <div class="flex justify-end gap-4">
          <RouterLink to="/rota-anterior" class="btn btn-secondary">
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
import { useToast } from 'vue-toastification'

const route = useRoute()
const router = useRouter()
const toast = useToast()

const isEdit = computed(() => !!route.params.id)
const loading = ref(false)

const form = ref({
  nome: '',
  dataNascimento: '',
  matricula: '',
  categoria: '',
  telefone: ''
})

async function handleSubmit() {
  loading.value = true
  try {
    if (isEdit.value) {
      // await service.update(route.params.id, form.value)
      toast.success('Item atualizado com sucesso!')
    } else {
      // await service.create(form.value)
      toast.success('Item cadastrado com sucesso!')
    }
    router.push('/rota-anterior')
  } catch (error: any) {
    toast.error(error.response?.data?.message || 'Erro ao salvar')
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  // Carregar dados se for edição
  if (isEdit.value) {
    // loadData()
  }
})
</script>
```

**Convenções de Formulário:**

1. **Título:** 
   - Usar `text-3xl font-bold text-gray-900 mb-8`
   - Texto dinâmico: `{{ isEdit ? 'Editar X' : 'Novo X' }}`

2. **Container do Formulário:**
   - Sempre envolver em `<div class="card max-w-2xl">`
   - `max-w-2xl` limita a largura para melhor leitura

3. **Grid de Campos:**
   - Usar `grid grid-cols-1 gap-6 sm:grid-cols-2`
   - Mobile: 1 coluna | Desktop: 2 colunas
   - Gap de 24px (`gap-6`) entre campos

4. **Campos de Largura Completa:**
   - Adicionar classe `sm:col-span-2` na div do campo
   - Usar para: nomes completos, endereços, observações, textareas

5. **Labels:**
   - Sempre usar: `block text-sm font-medium text-gray-700 mb-2`
   - Asterisco (*) para campos obrigatórios
   - Sem asterisco para campos opcionais

6. **Inputs:**
   - Sempre usar classe `input` (definida no style.css)
   - Adicionar `required` nos campos obrigatórios
   - Placeholder descritivo e curto

7. **Botões de Ação:**
   - Container: `flex justify-end gap-4`
   - Ordem: Cancelar (secundário) → Salvar (primário)
   - Cancelar: `RouterLink` com `btn btn-secondary`
   - Salvar: `button type="submit"` com `btn btn-primary`
   - Estado de loading: `:disabled="loading"` e texto condicional

8. **Validação e Feedback:**
   - Usar `vue-toastification` para mensagens de sucesso/erro
   - Validação HTML5 nativa com `required`
   - Para validações customizadas, adicionar mensagens abaixo do campo:
   ```vue
   <p v-if="errors.campo" class="mt-1 text-sm text-red-600">
     {{ errors.campo }}
   </p>
   ```

**Exemplo Completo (Formulário de Aluno):**
```vue
<template>
  <div>
    <h1 class="text-3xl font-bold text-gray-900 mb-8">
      {{ isEdit ? 'Editar Aluno' : 'Novo Aluno' }}
    </h1>

    <div class="card max-w-2xl">
      <form @submit.prevent="handleSubmit" class="space-y-6">
        <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <!-- Nome completo - largura total -->
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

          <!-- Data de nascimento - meia largura -->
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

          <!-- Matrícula - meia largura -->
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

          <!-- CPF - meia largura, opcional -->
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

          <!-- Sexo - meia largura, select -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Sexo *
            </label>
            <select v-model="form.sexo" required class="input">
              <option value="">Selecione</option>
              <option value="M">Masculino</option>
              <option value="F">Feminino</option>
              <option value="Outro">Outro</option>
            </select>
          </div>

          <!-- Telefone - meia largura, opcional -->
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

          <!-- Email - meia largura, opcional -->
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

          <!-- Endereço - largura total -->
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
        </div>

        <!-- Botões de ação -->
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
```

### Tabelas

#### Estrutura de Tabela Padrão
```vue
<div class="card overflow-hidden p-0">
  <div class="overflow-x-auto">
    <table class="min-w-full divide-y divide-gray-200">
      <thead class="bg-gray-50">
        <tr>
          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Nome
          </th>
          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Email
          </th>
          <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
            Ações
          </th>
        </tr>
      </thead>
      <tbody class="bg-white divide-y divide-gray-200">
        <tr v-for="item in items" :key="item.id" class="hover:bg-gray-50">
          <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
            {{ item.nome }}
          </td>
          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
            {{ item.email }}
          </td>
          <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
            <button class="text-primary-600 hover:text-primary-900 mr-3">
              Editar
            </button>
            <button class="text-red-600 hover:text-red-900">
              Excluir
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</div>
```

### Badges e Status

```vue
<!-- Badge Padrão -->
<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
  Badge
</span>

<!-- Status -->
<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
  Ativo
</span>

<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
  Inativo
</span>

<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
  Pendente
</span>
```

### Alertas

```vue
<!-- Alerta de Sucesso -->
<div class="card bg-green-50 border-l-4 border-green-400 p-4">
  <div class="flex">
    <div class="flex-shrink-0">
      <!-- Ícone SVG -->
      <svg class="h-5 w-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
      </svg>
    </div>
    <div class="ml-3">
      <p class="text-sm text-green-800">Operação realizada com sucesso!</p>
    </div>
  </div>
</div>

<!-- Alerta de Erro -->
<div class="card bg-red-50 border-l-4 border-red-400 p-4">
  <div class="flex">
    <div class="flex-shrink-0">
      <svg class="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
      </svg>
    </div>
    <div class="ml-3">
      <p class="text-sm text-red-800">Ocorreu um erro ao processar a solicitação.</p>
    </div>
  </div>
</div>

<!-- Alerta de Aviso -->
<div class="card bg-yellow-50 border-l-4 border-yellow-400 p-4">
  <div class="flex">
    <div class="flex-shrink-0">
      <svg class="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
        <path fill-rule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z" clip-rule="evenodd" />
      </svg>
    </div>
    <div class="ml-3">
      <p class="text-sm text-yellow-800">Atenção: Esta ação não pode ser desfeita.</p>
    </div>
  </div>
</div>
```

---

## 💻 Padrões de Código Vue

### Estrutura de Componente

```vue
<template>
  <!-- Template HTML -->
  <div>
    <!-- Sempre envolver em um elemento raiz -->
  </div>
</template>

<script setup lang="ts">
// 1. Imports de bibliotecas externas
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'

// 2. Imports de composables e stores
import { useAuthStore } from '@/stores/auth'

// 3. Imports de services
import { alunosService } from '@/services/alunos.service'

// 4. Imports de types
import type { Aluno } from '@/types'

// 5. Imports de componentes
import BaseButton from '@/components/common/BaseButton.vue'

// 6. Props (se houver)
interface Props {
  id: string
  showDetails?: boolean
}
const props = withDefaults(defineProps<Props>(), {
  showDetails: false
})

// 7. Emits (se houver)
interface Emits {
  (e: 'update', value: string): void
  (e: 'close'): void
}
const emit = defineEmits<Emits>()

// 8. Composables e stores
const router = useRouter()
const authStore = useAuthStore()

// 9. Reactive state
const loading = ref(false)
const aluno = ref<Aluno | null>(null)

// 10. Computed properties
const nomeCompleto = computed(() => {
  return aluno.value ? aluno.value.nome : ''
})

// 11. Methods
async function loadAluno() {
  loading.value = true
  try {
    aluno.value = await alunosService.getById(props.id)
  } catch (error) {
    console.error('Erro ao carregar aluno:', error)
  } finally {
    loading.value = false
  }
}

// 12. Lifecycle hooks
onMounted(() => {
  loadAluno()
})
</script>

<style scoped>
/* Estilos específicos do componente (se necessário) */
/* Preferir classes Tailwind sempre que possível */
</style>
```

### Composables (Código Reutilizável)

```typescript
// composables/useConfirm.ts
import { ref } from 'vue'

export function useConfirm() {
  const isOpen = ref(false)
  const message = ref('')
  const resolvePromise = ref<((value: boolean) => void) | null>(null)

  function confirm(msg: string): Promise<boolean> {
    message.value = msg
    isOpen.value = true
    
    return new Promise((resolve) => {
      resolvePromise.value = resolve
    })
  }

  function handleConfirm() {
    resolvePromise.value?.(true)
    isOpen.value = false
  }

  function handleCancel() {
    resolvePromise.value?.(false)
    isOpen.value = false
  }

  return {
    isOpen,
    message,
    confirm,
    handleConfirm,
    handleCancel
  }
}
```

---

## 🔄 Gerenciamento de Estado (Pinia)

### Estrutura de Store

```typescript
// stores/alunos.ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { alunosService } from '@/services/alunos.service'
import type { Aluno } from '@/types'

export const useAlunosStore = defineStore('alunos', () => {
  // State
  const alunos = ref<Aluno[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Getters (computed)
  const totalAlunos = computed(() => alunos.value.length)
  const alunosAtivos = computed(() => 
    alunos.value.filter(a => a.status === 'ATIVO')
  )

  // Actions
  async function fetchAlunos() {
    loading.value = true
    error.value = null
    try {
      const response = await alunosService.list()
      alunos.value = response.data
    } catch (e: any) {
      error.value = e.message
      throw e
    } finally {
      loading.value = false
    }
  }

  async function addAluno(aluno: Partial<Aluno>) {
    const novoAluno = await alunosService.create(aluno)
    alunos.value.push(novoAluno)
    return novoAluno
  }

  async function updateAluno(id: string, data: Partial<Aluno>) {
    const alunoAtualizado = await alunosService.update(id, data)
    const index = alunos.value.findIndex(a => a.id === id)
    if (index !== -1) {
      alunos.value[index] = alunoAtualizado
    }
    return alunoAtualizado
  }

  async function deleteAluno(id: string) {
    await alunosService.delete(id)
    alunos.value = alunos.value.filter(a => a.id !== id)
  }

  return {
    // State
    alunos,
    loading,
    error,
    // Getters
    totalAlunos,
    alunosAtivos,
    // Actions
    fetchAlunos,
    addAluno,
    updateAluno,
    deleteAluno
  }
})
```

---

## 🛣️ Roteamento (Vue Router)

### Estrutura de Rotas

```typescript
// router/index.ts
import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/auth/LoginView.vue'),
      meta: { 
        requiresAuth: false,
        title: 'Login'
      }
    },
    {
      path: '/',
      component: () => import('@/layouts/DashboardLayout.vue'),
      meta: { requiresAuth: true },
      children: [
        {
          path: '',
          name: 'dashboard',
          component: () => import('@/views/DashboardView.vue'),
          meta: { title: 'Dashboard' }
        },
        {
          path: '/alunos',
          name: 'alunos',
          component: () => import('@/views/alunos/AlunosListView.vue'),
          meta: { title: 'Alunos' }
        },
        {
          path: '/alunos/novo',
          name: 'aluno-novo',
          component: () => import('@/views/alunos/AlunoFormView.vue'),
          meta: { title: 'Novo Aluno' }
        },
        {
          path: '/alunos/:id',
          name: 'aluno-detalhes',
          component: () => import('@/views/alunos/AlunoDetailView.vue'),
          meta: { title: 'Detalhes do Aluno' }
        }
      ]
    }
  ]
})

// Navigation guard
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth !== false)

  // Atualizar título da página
  document.title = `${to.meta.title || 'SGE'} - Sistema de Gerenciamento Escolar`

  if (requiresAuth) {
    if (!authStore.token) {
      next('/login')
      return
    }

    if (!authStore.user) {
      try {
        await authStore.fetchUser()
        next()
      } catch (error) {
        next('/login')
      }
      return
    }

    next()
  } else if (to.path === '/login' && authStore.isAuthenticated) {
    next('/')
  } else {
    next()
  }
})

export default router
```

---

## 🌐 Integração com API

### Configuração Axios

```typescript
// services/api.ts
import axios, { type AxiosError, type AxiosInstance } from 'axios'
import { useAuthStore } from '@/stores/auth'
import { useToast } from 'vue-toastification'

const toast = useToast()

const api: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001/api/v1',
  headers: {
    'Content-Type': 'application/json'
  }
})

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const authStore = useAuthStore()
    if (authStore.token) {
      config.headers.Authorization = `Bearer ${authStore.token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const authStore = useAuthStore()
    
    if (error.response?.status === 401) {
      try {
        await authStore.refreshToken()
        if (error.config) {
          return api.request(error.config)
        }
      } catch (refreshError) {
        authStore.logout()
        window.location.href = '/login'
      }
    }

    const message = (error.response?.data as any)?.message || 'Erro ao processar requisição'
    toast.error(message)

    return Promise.reject(error)
  }
)

export default api
```

### Padrão de Service

```typescript
// services/alunos.service.ts
import api from './api'
import type { Aluno, PaginatedResponse } from '@/types'

export interface AlunosFilters {
  search?: string
  active?: boolean
  page?: number
  limit?: number
}

export const alunosService = {
  async list(filters: AlunosFilters = {}): Promise<PaginatedResponse<Aluno>> {
    const { data } = await api.get<{ data: PaginatedResponse<Aluno> }>('/alunos', { 
      params: filters 
    })
    return data.data
  },

  async getById(id: string): Promise<Aluno> {
    const { data } = await api.get<{ data: Aluno }>(`/alunos/${id}`)
    return data.data
  },

  async create(aluno: Partial<Aluno>): Promise<Aluno> {
    const { data } = await api.post<{ data: Aluno }>('/alunos', aluno)
    return data.data
  },

  async update(id: string, aluno: Partial<Aluno>): Promise<Aluno> {
    const { data } = await api.put<{ data: Aluno }>(`/alunos/${id}`, aluno)
    return data.data
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/alunos/${id}`)
  }
}
```

---

## ✅ Boas Práticas

### TypeScript

1. **Sempre tipar props e emits**
```typescript
interface Props {
  userId: string
  showDetails?: boolean
}
const props = defineProps<Props>()
```

2. **Usar tipos para responses da API**
```typescript
interface ApiResponse<T> {
  success: boolean
  data: T
  message?: string
}
```

3. **Evitar `any`** - Usar `unknown` se necessário

### Performance

1. **Lazy loading de rotas**
```typescript
component: () => import('@/views/AlunosView.vue')
```

2. **Computed properties** para valores derivados
```typescript
const total = computed(() => items.value.reduce((sum, item) => sum + item.value, 0))
```

3. **v-memo** para listas grandes
```vue
<div v-for="item in items" :key="item.id" v-memo="[item.id, item.updatedAt]">
```

### Acessibilidade

1. **Labels em inputs**
```vue
<label for="email">Email</label>
<input id="email" type="email" />
```

2. **Alt em imagens**
```vue
<img :src="avatar" :alt="`Avatar de ${nome}`" />
```

3. **Roles ARIA quando necessário**
```vue
<div role="alert" class="error-message">
```

### Segurança

1. **Sanitizar HTML** - Evitar v-html com dados do usuário
2. **Validar dados** antes de enviar para API
3. **HTTPS** em produção
4. **Tokens** armazenados apenas em memória/localStorage com cuidado

---

## 📱 Responsividade

### Breakpoints Tailwind

```css
sm: 640px   /* Tablet pequeno */
md: 768px   /* Tablet */
lg: 1024px  /* Desktop */
xl: 1280px  /* Desktop grande */
2xl: 1536px /* Desktop extra grande */
```

### Padrão Mobile-First

```vue
<!-- Mobile: 1 coluna, Tablet: 2 colunas, Desktop: 4 colunas -->
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
```

```vue
<!-- Texto responsivo -->
<h1 class="text-2xl md:text-3xl lg:text-4xl font-bold">
```

```vue
<!-- Padding responsivo -->
<div class="px-4 sm:px-6 lg:px-8">
```

---

## 🎯 Checklist de Desenvolvimento

Ao criar uma nova feature, verificar:

- [ ] Componente usa TypeScript com tipos adequados
- [ ] Props e emits estão tipados
- [ ] Classes Tailwind seguem o design system
- [ ] Responsividade implementada (mobile-first)
- [ ] Loading states implementados
- [ ] Error handling implementado
- [ ] Validação de formulários (se aplicável)
- [ ] Acessibilidade (labels, alt, roles)
- [ ] Toast notifications para feedback
- [ ] Lazy loading de rotas
- [ ] Código limpo e comentado quando necessário
- [ ] Testes (se aplicável)

---

## 📚 Recursos e Referências

- [Vue 3 Documentation](https://vuejs.org/)
- [Tailwind CSS Documentation](https://tailwindcss.com/)
- [Pinia Documentation](https://pinia.vuejs.org/)
- [Vue Router Documentation](https://router.vuejs.org/)
- [TypeScript Documentation](https://www.typescriptlang.org/)
- [Heroicons](https://heroicons.com/) - Biblioteca de ícones SVG
- [VueUse](https://vueuse.org/) - Composables utilitários

---

**Última atualização:** 29 de outubro de 2025  
**Versão do documento:** 1.0.0  
**Mantido por:** Equipe EscolaDu

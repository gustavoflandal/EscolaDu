# Instruções para Completar o Módulo de Turmas

## Status Atual
- ✅ Backend 100% completo e funcional
- ✅ Frontend: Types e Service prontos
- ⏳ Frontend: Faltam 3 views Vue

## Arquivos que Faltam Criar

### 1. TurmasListView.vue (Listagem)
**Localização:** `frontend/src/views/turmas/TurmasListView.vue`

**Funcionalidades:**
- Tabela com todas as turmas
- Filtros: busca, ano letivo, turno, status
- Paginação
- Ações inline: Visualizar, Editar, Excluir
- Botão "Nova Turma" que abre modal
- Verificação de permissões para botões

**Imports necessários:**
```typescript
import turmasService from '@/services/turmas.service'
import { usePermissions } from '@/composables/usePermissions'
import TurmaModal from './TurmaModal.vue'
```

**Estrutura do template:**
- Header com título e botão "Nova Turma"
- Card de filtros (4 campos)
- Tabela com colunas: Código, Nome, Série, Turno, Ano, Alunos, Professor, Status, Ações
- Paginação
- Modal (condicional)

---

### 2. TurmaModal.vue (Modal de Criar/Editar)
**Localização:** `frontend/src/views/turmas/TurmaModal.vue`

**Props:**
- `turma?: Turma | null` - Se preenchido, é edição. Se null, é criação.

**Emits:**
- `close` - Fecha o modal
- `saved` - Dispara quando salva com sucesso

**Funcionalidades:**
- Modal overlay com fundo escuro
- Formulário com validação
- Carregar anos letivos e professores disponíveis
- Submit para criar ou atualizar
- Botões: Cancelar e Salvar

**Campos do formulário:**
1. Código (required, text)
2. Nome (required, text)
3. Ano Letivo (required, select com anos)
4. Série (required, text, ex: "1º Ano", "2º Ano")
5. Turno (required, select: Manhã, Tarde, Noite, Integral)
6. Capacidade Máxima (number, default: 30)
7. Sala (optional, text)
8. Professor Regente (optional, select com professores)

**Imports necessários:**
```typescript
import turmasService from '@/services/turmas.service'
import type { Turma, AnoLetivo, Professor } from '@/types'
```

**Estrutura do template:**
```vue
<div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
  <div class="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
    <h2>{{ isEdit ? 'Editar' : 'Nova' }} Turma</h2>
    <form @submit.prevent="handleSubmit">
      <!-- Grid com 2 colunas -->
      <!-- Campos do formulário -->
      <!-- Botões -->
    </form>
  </div>
</div>
```

---

### 3. TurmaDetailView.vue (Detalhes e Gerenciar Alunos)
**Localização:** `frontend/src/views/turmas/TurmaDetailView.vue`

**Funcionalidades:**
- Exibir informações da turma
- Exibir estatísticas (cards)
- Lista de alunos matriculados
- Botão "Adicionar Aluno" (abre modal de seleção)
- Botão "Remover" em cada aluno
- Botão "Voltar" e "Editar Turma"

**Seções:**
1. **Header**: Título, botões Voltar e Editar
2. **Informações da Turma**: Card com dados básicos
3. **Estatísticas**: 4 cards (Total Alunos, Vagas Disponíveis, % Ocupação, Alunos Ativos)
4. **Alunos Matriculados**: 
   - Botão "Adicionar Aluno"
   - Tabela com alunos
   - Modal para adicionar aluno (lista de disponíveis com busca)

**Imports necessários:**
```typescript
import turmasService from '@/services/turmas.service'
import { useRoute, useRouter } from 'vue-router'
import { usePermissions } from '@/composables/usePermissions'
```

---

## Configurações Adicionais

### 4. Adicionar Rotas
**Arquivo:** `frontend/src/router/index.ts`

Adicionar dentro das rotas do DashboardLayout:

```typescript
{
  path: '/turmas',
  name: 'Turmas',
  component: () => import('@/views/turmas/TurmasListView.vue'),
  meta: {
    requiresAuth: true,
    title: 'Turmas',
    module: 'turmas'
  }
},
{
  path: '/turmas/:id',
  name: 'TurmaDetail',
  component: () => import('@/views/turmas/TurmaDetailView.vue'),
  meta: {
    requiresAuth: true,
    title: 'Detalhes da Turma',
    module: 'turmas'
  }
}
```

### 5. Adicionar Link no Menu
**Arquivo:** `frontend/src/layouts/DashboardLayout.vue`

Adicionar após o link de Professores:

```vue
<RouterLink
  v-if="canAccessModule('turmas')"
  to="/turmas"
  class="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
  active-class="bg-primary-100 text-primary-700"
>
  Turmas
</RouterLink>
```

### 6. Atualizar usePermissions
**Arquivo:** `frontend/src/composables/usePermissions.ts`

Adicionar no `moduleResourceMap`:

```typescript
const moduleResourceMap: Record<string, string> = {
  'alunos': 'alunos',
  'professores': 'professores',
  'responsaveis': 'responsaveis',
  'turmas': 'turmas',  // ← ADICIONAR ESTA LINHA
  // ... outros
};
```

---

## Executar Seed de Permissões

No terminal do backend:

```bash
cd backend
npm run prisma:seed-permissions
```

---

## Teste Final

1. Faça login como usuário Coordenador
2. Acesse menu "Turmas"
3. Teste criar uma turma
4. Teste editar
5. Teste visualizar detalhes
6. Teste adicionar/remover alunos
7. Teste excluir turma vazia
8. Faça login como Professor e verifique que só pode visualizar

---

## Endpoints Disponíveis no Backend

```
GET    /api/v1/turmas                         - Lista turmas
GET    /api/v1/turmas/:id                     - Detalhes da turma
POST   /api/v1/turmas                         - Cria turma
PUT    /api/v1/turmas/:id                     - Atualiza turma
DELETE /api/v1/turmas/:id                     - Exclui turma
POST   /api/v1/turmas/:id/alunos              - Adiciona aluno
DELETE /api/v1/turmas/:id/alunos/:alunoId     - Remove aluno
GET    /api/v1/turmas/:id/alunos-disponiveis  - Lista alunos disponíveis
GET    /api/v1/turmas/:id/stats               - Estatísticas
GET    /api/v1/turmas/anos-letivos            - Lista anos letivos
GET    /api/v1/turmas/professores-disponiveis - Lista professores
```

---

## Classes CSS Disponíveis (Tailwind)

```css
.btn              - Botão base
.btn-primary      - Botão primário azul
.btn-secondary    - Botão secundário cinza
.btn-danger       - Botão vermelho
.input            - Input/select/textarea estilizado
.card             - Card branco com sombra
```

---

## Estrutura de Resposta da API

Todas as respostas seguem o padrão:

```typescript
{
  success: boolean
  data: T
  message?: string
}
```

Para paginação:

```typescript
{
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}
```

---

## Observações Importantes

1. **Validações**: Backend já valida tudo. Frontend deve ter validação básica e mostrar erros da API.

2. **Permissões**: 
   - Coordenador: CRUD completo
   - Professor: Apenas leitura
   - Usar `hasPermission('turmas', 'action')` nos botões

3. **Estados**: 
   - Loading: Mostrar "Carregando..."
   - Erro: Toast com mensagem
   - Sucesso: Toast e recarregar dados

4. **Formatações**:
   - Turno: MANHA → Manhã, TARDE → Tarde, etc.
   - Data: usar `new Date().toLocaleDateString('pt-BR')`
   - Números: `toLocaleString('pt-BR')`

5. **Modais**: 
   - Usar `position: fixed` com `z-index: 50`
   - Fundo escuro com `bg-opacity-50`
   - Centralizar com Flexbox

---

## Comandos Úteis

```bash
# Backend
cd backend
npm run dev          # Inicia servidor
npm run prisma:seed-permissions  # Roda seed

# Frontend  
cd frontend
npm run dev          # Inicia frontend
```

---

## Arquitetura Seguida

✅ Seguindo `ARQUITETURA_FRONTEND.md`:
- Composition API com `<script setup>`
- TypeScript com types centralizados
- Tailwind CSS para estilos
- Vue Router com meta.module
- Pinia para estado (se necessário)
- Axios via service centralizado

✅ Seguindo `ARQUITETURA_BACKEND.md`:
- MVC pattern
- Prisma ORM
- Zod validation
- JWT authentication
- Permission-based authorization
- Error handling middleware

---

Sucesso! 🎉

# Sistema de Permissões por Módulo - Documentação

## Resumo das Alterações

Foi implementado um sistema completo de controle de acesso baseado em permissões, que oculta/desabilita itens do menu principal quando o usuário não possui permissões para acessar determinados módulos.

## Arquivos Modificados

### Backend

#### 1. `backend/src/services/auth.service.ts`
**Alteração:** Modificado o método `me()` para incluir as permissões do usuário.

**O que foi feito:**
- O endpoint `/api/v1/auth/me` agora retorna não apenas os roles do usuário, mas também todas as permissões agregadas de todos os seus roles
- As permissões são coletadas de forma única (sem duplicatas)
- A resposta agora inclui:
  - `roles`: array de roles com suas permissões
  - `permissions`: array plano com todas as permissões únicas do usuário

**Exemplo de resposta:**
```json
{
  "id": "uuid",
  "email": "usuario@email.com",
  "name": "Nome do Usuário",
  "roles": [
    {
      "id": "role-uuid",
      "name": "Professor",
      "permissions": [
        {
          "id": "perm-uuid",
          "resource": "alunos",
          "action": "read"
        }
      ]
    }
  ],
  "permissions": [
    {
      "id": "perm-uuid",
      "resource": "alunos",
      "action": "read"
    }
  ]
}
```

### Frontend

#### 2. `frontend/src/types/index.ts`
**Alteração:** Adicionado campo `permissions` na interface `User`.

```typescript
export interface User {
  // ... campos existentes
  permissions?: Permission[]
}
```

#### 3. `frontend/src/composables/usePermissions.ts` (NOVO)
**Arquivo criado:** Composable para gerenciar verificações de permissões.

**Funções disponíveis:**
- `hasPermission(resource, action)`: Verifica se o usuário tem uma permissão específica
- `hasAnyPermissionForResource(resource)`: Verifica se o usuário tem qualquer permissão para um recurso
- `hasAnyPermission(permissions)`: Verifica se tem pelo menos uma das permissões especificadas
- `hasAllPermissions(permissions)`: Verifica se tem todas as permissões especificadas
- `hasRole(roleName)`: Verifica se o usuário possui um role específico
- `isAdmin`: Computed que verifica se o usuário é administrador
- `canAccessModule(moduleName)`: **Principal função** - verifica se o usuário pode acessar um módulo
- `userPermissions`: Lista reativa de permissões do usuário
- `userRoles`: Lista reativa de roles do usuário

**Mapeamento de módulos:**
```typescript
const moduleResourceMap: Record<string, string> = {
  'alunos': 'alunos',
  'responsaveis': 'responsaveis',
  'professores': 'professores',
  'turmas': 'turmas',
  'frequencia': 'frequencia',
  'objetivos': 'objetivos',
  'relatorios': 'relatorios',
  'usuarios': 'users',
  'perfis': 'roles',
  'dashboard': 'dashboard'
}
```

**Lógica de acesso:**
- Administradores têm acesso a todos os módulos
- Outros usuários precisam ter pelo menos uma permissão (qualquer action) para o recurso do módulo

#### 4. `frontend/src/layouts/DashboardLayout.vue`
**Alteração:** Menu dinâmico baseado em permissões.

**O que foi feito:**
- Importado o composable `usePermissions`
- Cada item do menu agora usa `v-if="canAccessModule('nome-do-modulo')"`
- Itens sem permissão são completamente ocultados (não aparecem no menu)

**Exemplo:**
```vue
<RouterLink
  v-if="canAccessModule('alunos')"
  to="/alunos"
  class="..."
>
  Alunos
</RouterLink>
```

#### 5. `frontend/src/router/index.ts`
**Alteração:** Adicionado controle de acesso nas rotas.

**O que foi feito:**
- Adicionado meta field `module` em cada rota que requer permissão
- Atualizado o navigation guard para verificar permissões antes de permitir navegação
- Se o usuário tentar acessar uma rota sem permissão (via URL direta), é redirecionado ao dashboard

**Exemplo de rota:**
```typescript
{
  path: '/alunos',
  name: 'alunos',
  component: () => import('@/views/alunos/AlunosListView.vue'),
  meta: { module: 'alunos' }
}
```

**Navigation Guard:**
```typescript
// Verifica permissão de módulo se especificada na rota
const moduleName = to.meta.module as string | undefined
if (moduleName) {
  const { usePermissions } = await import('@/composables/usePermissions')
  const { canAccessModule } = usePermissions()
  
  if (!canAccessModule(moduleName)) {
    // Usuário não tem permissão, redireciona para dashboard
    next('/')
    return
  }
}
```

## Como Funciona

### Fluxo de Verificação de Permissões

1. **Login do Usuário:**
   - Usuário faz login
   - Backend retorna tokens e dados básicos do usuário

2. **Carregamento de Permissões:**
   - Frontend chama `/api/v1/auth/me`
   - Backend retorna usuário com roles e permissões agregadas
   - Store de autenticação armazena os dados

3. **Renderização do Menu:**
   - `DashboardLayout` usa `canAccessModule()` para cada item
   - Itens sem permissão não são renderizados

4. **Navegação:**
   - Quando usuário tenta acessar uma rota, o router verifica permissões
   - Se não tiver permissão, redireciona para dashboard
   - Se tiver permissão, permite o acesso

### Exemplo de Uso em Novos Componentes

```vue
<script setup lang="ts">
import { usePermissions } from '@/composables/usePermissions'

const { 
  hasPermission, 
  canAccessModule, 
  isAdmin 
} = usePermissions()

// Verificar permissão específica
const canCreateAluno = hasPermission('alunos', 'create')
const canEditAluno = hasPermission('alunos', 'update')

// Verificar acesso ao módulo
const canAccessAlunos = canAccessModule('alunos')

// Verificar se é admin
if (isAdmin.value) {
  // Lógica especial para administradores
}
</script>

<template>
  <button v-if="canCreateAluno">
    Criar Novo Aluno
  </button>
  
  <button v-if="canEditAluno">
    Editar Aluno
  </button>
</template>
```

## Recursos vs Ações Comuns

Para referência, estas são as ações mais comuns no sistema:

- `read`: Visualizar/Listar
- `create`: Criar novo registro
- `update`: Editar registro existente
- `delete`: Excluir registro

## Módulos Mapeados

| Nome do Módulo | Recurso Backend | Descrição |
|---------------|----------------|-----------|
| `alunos` | `alunos` | Gerenciamento de Alunos |
| `responsaveis` | `responsaveis` | Gerenciamento de Responsáveis |
| `professores` | `professores` | Gerenciamento de Professores |
| `turmas` | `turmas` | Gerenciamento de Turmas |
| `frequencia` | `frequencia` | Controle de Frequência |
| `objetivos` | `objetivos` | Objetivos de Aprendizagem |
| `relatorios` | `relatorios` | Relatórios |
| `usuarios` | `users` | Gerenciamento de Usuários |
| `perfis` | `roles` | Gerenciamento de Perfis/Roles |
| `dashboard` | `dashboard` | Dashboard Principal |

## Tratamento de Administradores

Usuários com o role "Administrador" têm acesso total a todos os módulos, independente das permissões individuais configuradas.

## Considerações de Segurança

1. **Validação no Backend:** As permissões são sempre validadas no backend através dos middlewares `requirePermission`, `requireRole`, etc.

2. **Frontend é apenas UI:** A ocultação de itens no menu é apenas para melhorar a experiência do usuário. O backend sempre valida as permissões antes de processar qualquer ação.

3. **Proteção de Rotas:** Mesmo que um usuário tente acessar uma URL diretamente, o router guard impede o acesso.

## Testes Recomendados

1. **Criar um usuário com permissões limitadas:**
   - Dar apenas permissão de `read` em `alunos`
   - Verificar que apenas o menu "Alunos" aparece
   - Verificar que botões de edição/exclusão não aparecem nas views de alunos

2. **Tentar acessar rota sem permissão:**
   - Com usuário limitado, tentar acessar `/professores` diretamente
   - Deve ser redirecionado para `/`

3. **Administrador:**
   - Usuário com role "Administrador" deve ver todos os menus
   - Deve ter acesso a todas as funcionalidades

## Próximos Passos Recomendados

1. Adicionar controle granular dentro das views (botões de editar, criar, excluir)
2. Implementar feedback visual quando usuário tentar acessar recurso sem permissão
3. Criar página de "Acesso Negado" personalizada
4. Adicionar logs de tentativas de acesso não autorizado
5. Implementar cache de permissões para melhorar performance

## Suporte

Para adicionar novos módulos ao sistema de permissões:

1. Adicione o módulo no `moduleResourceMap` em `usePermissions.ts`
2. Adicione `meta: { module: 'nome-do-modulo' }` nas rotas correspondentes
3. Use `v-if="canAccessModule('nome-do-modulo')"` no menu
4. Certifique-se de que o backend tem o recurso e permissões correspondentes criados

## Troubleshooting

**Problema:** Menu não aparece após login
- **Solução:** Verifique se o endpoint `/auth/me` está retornando as permissões corretamente

**Problema:** Usuário continua vendo módulos sem permissão
- **Solução:** Limpe o localStorage e faça login novamente para atualizar o token

**Problema:** Administrador não vê todos os módulos
- **Solução:** Verifique se o role está exatamente como "Administrador" (case-sensitive)

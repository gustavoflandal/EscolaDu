# 🔘 Botões

## Classes Base

### Classe `.btn`

Todos os botões do sistema devem usar a classe base `.btn` definida em `style.css`:

```css
.btn {
  @apply px-4 py-2 rounded-lg font-medium transition-colors duration-200;
}
```

**Características**:
- Padding: `px-4 py-2` (16px horizontal, 8px vertical)
- Bordas arredondadas: `rounded-lg` (8px)
- Peso da fonte: `font-medium` (500)
- Transição suave: `transition-colors duration-200`

---

## Variantes de Botões

### Botão Primário (Primary)

Usado para ações principais e CTAs (Call to Action).

```vue
<button class="btn btn-primary">Salvar</button>
```

**Classe `.btn-primary` definida**:
```css
.btn-primary {
  @apply bg-primary-600 text-white hover:bg-primary-700 
         disabled:opacity-50 disabled:cursor-not-allowed;
}
```

**Características**:
- Fundo: `bg-primary-600` (#2563eb)
- Texto: `text-white`
- Hover: `hover:bg-primary-700` (#1d4ed8)
- Disabled: `disabled:opacity-50` + `disabled:cursor-not-allowed`

**Exemplos de uso**:
```vue
<!-- Salvar formulário -->
<button type="submit" class="btn btn-primary">Salvar</button>

<!-- Criar novo registro -->
<RouterLink to="/professores/novo" class="btn btn-primary">
  + Novo Professor
</RouterLink>

<!-- Ação principal -->
<button @click="handleSubmit" class="btn btn-primary">
  Confirmar
</button>
```

---

### Botão Secundário (Secondary)

Usado para ações secundárias, cancelamentos e navegação de retorno.

```vue
<button class="btn btn-secondary">Cancelar</button>
```

**Classe `.btn-secondary` definida**:
```css
.btn-secondary {
  @apply bg-gray-200 text-gray-800 hover:bg-gray-300;
}
```

**Características**:
- Fundo: `bg-gray-200` (#e5e7eb)
- Texto: `text-gray-800` (#1f2937)
- Hover: `hover:bg-gray-300` (#d1d5db)

**Exemplos de uso**:
```vue
<!-- Voltar -->
<RouterLink to="/" class="btn btn-secondary">
  ← Voltar
</RouterLink>

<!-- Cancelar -->
<button @click="handleCancel" class="btn btn-secondary">
  Cancelar
</button>

<!-- Limpar filtros -->
<button @click="clearFilters" class="btn btn-secondary w-full">
  Limpar Filtros
</button>

<!-- Fechar modal -->
<button @click="$emit('close')" class="btn btn-secondary">
  Fechar
</button>
```

---

### Botão de Perigo (Danger)

Usado para ações destrutivas como excluir, remover ou inativar.

```vue
<button class="btn btn-danger">Excluir</button>
```

**Classe `.btn-danger` definida**:
```css
.btn-danger {
  @apply bg-red-600 text-white hover:bg-red-700;
}
```

**Características**:
- Fundo: `bg-red-600` (#dc2626)
- Texto: `text-white`
- Hover: `hover:bg-red-700` (#b91c1c)

**Exemplos de uso**:
```vue
<!-- Excluir registro -->
<button @click="confirmDelete(item)" class="btn btn-danger">
  Excluir
</button>

<!-- Remover item -->
<button @click="removeItem()" class="btn btn-danger">
  Remover
</button>
```

---

## Tamanhos de Botão

### Botão Padrão
```vue
<button class="btn btn-primary">Botão Normal</button>
```
- Padding: `px-4 py-2` (16px x 8px)
- Texto: `font-medium` (tamanho base)

### Botão Full Width
```vue
<button class="btn btn-primary w-full">Botão Largo</button>
```
- Adicione `w-full` para botão de largura completa
- Comum em modais e formulários

**Exemplo**:
```vue
<button type="submit" class="btn btn-primary w-full">
  {{ loading ? 'Entrando...' : 'Entrar' }}
</button>
```

---

## Estados de Botão

### Hover
Todos os botões têm estado hover definido:
```vue
<button class="btn btn-primary">
  <!-- hover:bg-primary-700 já aplicado -->
</button>
```

### Disabled
```vue
<button class="btn btn-primary" :disabled="loading">
  Salvar
</button>
```

**Estilos disabled** (já incluídos em `.btn-primary`):
- `disabled:opacity-50`: Reduz opacidade para 50%
- `disabled:cursor-not-allowed`: Cursor de "não permitido"

**Exemplo com loading**:
```vue
<button 
  type="submit" 
  :disabled="loading || !isFormValid"
  class="btn btn-primary"
>
  <span v-if="loading">Salvando...</span>
  <span v-else>Salvar</span>
</button>
```

### Loading State
```vue
<button class="btn btn-primary" :disabled="saving">
  <span v-if="saving" class="flex items-center gap-2">
    <svg class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
      <circle class="opacity-25" cx="12" cy="12" r="10" 
              stroke="currentColor" stroke-width="4"></circle>
      <path class="opacity-75" fill="currentColor" 
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
    Salvando...
  </span>
  <span v-else>Salvar</span>
</button>
```

---

## Botões com Ícones

### Ícone + Texto
```vue
<button class="btn btn-primary flex items-center gap-2">
  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
          d="M12 4v16m8-8H4" />
  </svg>
  Adicionar
</button>
```

**Padrão**:
- Container: `flex items-center gap-2`
- Ícone: `w-4 h-4` (16px)
- Gap: `gap-2` (8px entre ícone e texto)

### Apenas Ícone (Icon Button)
```vue
<button class="text-blue-600 hover:text-blue-900" title="Visualizar">
  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
</button>
```

**Características**:
- Sem classe `.btn` (apenas ícone)
- Cor do texto define cor do ícone
- Tamanho: `w-5 h-5` (20px) para ações em tabelas
- Sempre incluir `title` para acessibilidade

---

## Grupos de Botões

### Botões Lado a Lado
```vue
<div class="flex gap-3">
  <button class="btn btn-secondary">Cancelar</button>
  <button class="btn btn-primary">Salvar</button>
</div>
```

**Padrão**:
- Container: `flex gap-3`
- Gap: `gap-3` (12px entre botões)
- Ordem: Secundário à esquerda, primário à direita

### Botões Empilhados
```vue
<div class="space-y-3">
  <RouterLink to="/alunos/novo" class="btn btn-primary w-full block text-center">
    Cadastrar Novo Aluno
  </RouterLink>
  <RouterLink to="/frequencia" class="btn btn-secondary w-full block text-center">
    Lançar Frequência
  </RouterLink>
</div>
```

**Padrão**:
- Container: `space-y-3`
- Botões: `w-full block text-center`
- Gap vertical: `space-y-3` (12px)

---

## Botões de Navegação

### Como Link (RouterLink)
```vue
<RouterLink to="/professores/novo" class="btn btn-primary">
  + Novo Professor
</RouterLink>
```

**Nota**: `RouterLink` aceita classes de botão normalmente.

### Link Simples (sem estilo de botão)
```vue
<RouterLink 
  to="/professores/${id}" 
  class="text-blue-600 hover:text-blue-900"
>
  Ver detalhes
</RouterLink>
```

---

## Botões de Ação em Tabelas

### Ícones de Ação
```vue
<td class="px-6 py-2 whitespace-nowrap text-right text-sm font-medium">
  <div class="flex justify-end gap-2">
    <!-- Visualizar -->
    <RouterLink
      :to="`/professores/${professor.id}`"
      class="text-blue-600 hover:text-blue-900"
      title="Visualizar"
    >
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
      </svg>
    </RouterLink>

    <!-- Editar -->
    <RouterLink
      :to="`/professores/${professor.id}/editar`"
      class="text-yellow-600 hover:text-yellow-900"
      title="Editar"
    >
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
      </svg>
    </RouterLink>

    <!-- Excluir -->
    <button
      @click="confirmDelete(professor)"
      class="text-red-600 hover:text-red-900"
      title="Excluir"
    >
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
      </svg>
    </button>
  </div>
</td>
```

**Padrões**:
- Container: `flex justify-end gap-2`
- Ícones: `w-5 h-5` (20px)
- Gap: `gap-2` (8px entre ícones)
- Cores:
  - Visualizar: `text-blue-600 hover:text-blue-900`
  - Editar: `text-yellow-600 hover:text-yellow-900`
  - Excluir: `text-red-600 hover:text-red-900`

---

## Botões de Paginação

```vue
<!-- Botão anterior -->
<button
  @click="previousPage"
  :disabled="pagination.page === 1"
  class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
>
  Anterior
</button>

<!-- Botão próxima -->
<button
  @click="nextPage"
  :disabled="pagination.page >= pagination.totalPages"
  class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
>
  Próxima
</button>
```

**Características**:
- Fundo branco: `bg-white`
- Borda: `border border-gray-300`
- Padding reduzido: `px-2 py-2`
- Bordas arredondadas apenas nas pontas: `rounded-l-md` / `rounded-r-md`
- Estados disabled incluídos

---

## Botões em Headers de Modal

### Botão de Fechar (X)
```vue
<button
  @click="$emit('close')"
  class="text-gray-400 hover:text-gray-600 transition-colors"
>
  <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
          d="M6 18L18 6M6 6l12 12" />
  </svg>
</button>
```

**Características**:
- Sem background
- Cor: `text-gray-400`
- Hover: `hover:text-gray-600`
- Ícone: `w-6 h-6` (24px)
- Transição: `transition-colors`

---

## Botões em Footers de Modal

```vue
<div class="flex justify-end gap-3 pt-4 border-t">
  <button type="button" @click="$emit('close')" class="btn btn-secondary">
    Cancelar
  </button>
  <button type="submit" class="btn btn-primary" :disabled="saving || !isFormValid">
    {{ isEditMode ? 'Atualizar' : 'Criar' }}
  </button>
</div>
```

**Padrões**:
- Container: `flex justify-end gap-3 pt-4 border-t`
- Alinhamento: `justify-end` (à direita)
- Gap: `gap-3` (12px)
- Border superior: `border-t`
- Ordem: Cancelar (secundário) à esquerda, Ação (primário) à direita

---

## Botões Mobile

### Versão Mobile de Paginação
```vue
<div class="flex-1 flex justify-between sm:hidden">
  <button @click="previousPage" :disabled="pagination.page === 1" class="btn btn-secondary">
    Anterior
  </button>
  <button @click="nextPage" :disabled="pagination.page >= pagination.totalPages" class="btn btn-secondary">
    Próxima
  </button>
</div>
```

**Características**:
- Ocultar em desktop: `sm:hidden`
- Layout flex: `flex justify-between`
- Usa classes `.btn` padrão

---

## ❌ Erros Comuns a Evitar

1. **Não usar classe base `.btn`**:
   ```vue
   ❌ <button class="px-4 py-2 bg-blue-600">
   ✅ <button class="btn btn-primary">
   ```

2. **Não incluir estado disabled**:
   ```vue
   ❌ <button class="btn btn-primary">Salvar</button>
   ✅ <button class="btn btn-primary" :disabled="loading">Salvar</button>
   ```

3. **Esquecer title em ícones**:
   ```vue
   ❌ <button class="text-blue-600"><svg>...</svg></button>
   ✅ <button class="text-blue-600" title="Visualizar"><svg>...</svg></button>
   ```

4. **Misturar cores inconsistentes**:
   ```vue
   ❌ <button class="text-yellow-600 hover:text-blue-900">
   ✅ <button class="text-yellow-600 hover:text-yellow-900">
   ```

5. **Não usar transições**:
   ```vue
   ❌ <button class="bg-blue-600 hover:bg-blue-700">
   ✅ <button class="btn btn-primary">  /* transition já incluída */
   ```

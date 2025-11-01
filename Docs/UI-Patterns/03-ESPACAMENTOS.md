# 📏 Sistema de Espaçamentos

## Escala de Espaçamento Tailwind

Tailwind usa uma escala numérica baseada em múltiplos de `0.25rem` (4px):

| Classe | Valor | Pixels (base 16px) |
|--------|-------|--------------------|
| `0` | 0 | 0px |
| `1` | 0.25rem | 4px |
| `2` | 0.5rem | 8px |
| `3` | 0.75rem | 12px |
| `4` | 1rem | 16px |
| `5` | 1.25rem | 20px |
| `6` | 1.5rem | 24px |
| `7` | 1.75rem | 28px |
| `8` | 2rem | 32px |
| `10` | 2.5rem | 40px |
| `12` | 3rem | 48px |

---

## Margin (m)

### Margin Bottom - Entre Seções

```vue
<!-- Espaçamento entre título e conteúdo -->
<h1 class="text-3xl font-bold text-gray-900 mb-8">Título</h1>

<!-- Espaçamento entre seções de formulário -->
<div class="mb-6">...</div>

<!-- Espaçamento entre cards -->
<div class="mb-4">...</div>
```

**Padrões Comuns**:
- `mb-8` (32px): Entre título principal e conteúdo
- `mb-6` (24px): Entre cards principais
- `mb-4` (16px): Entre elementos de formulário/cards secundários
- `mb-3` (12px): Entre elementos relacionados
- `mb-2` (8px): Entre label e input
- `mb-1` (4px): Entre elementos muito próximos

---

### Margin Top

```vue
<!-- Espaçamento acima de texto secundário -->
<p class="text-gray-600 mt-1">Subtítulo</p>

<!-- Espaçamento acima de hint -->
<p class="text-xs text-gray-500 mt-1">Informação auxiliar</p>

<!-- Espaçamento entre número e label em estatística -->
<p class="text-sm text-gray-600">Total</p>
<p class="text-2xl font-bold text-gray-900 mt-2">{{ stats.total }}</p>
```

**Padrões Comuns**:
- `mt-1` (4px): Entre label e número/texto relacionado
- `mt-2` (8px): Entre elementos relacionados
- `mt-4` (16px): Espaçamento moderado
- `mt-6` (24px): Entre seções

---

### Margin Horizontal

```vue
<!-- Espaçamento entre ícone e texto -->
<div class="flex items-center">
  <svg class="h-6 w-6" />
  <div class="ml-4">Texto</div>
</div>

<!-- Espaçamento entre avatar e nome -->
<div class="flex items-center">
  <div class="h-10 w-10">...</div>
  <div class="ml-4">
    <p>Nome</p>
  </div>
</div>
```

**Padrões Comuns**:
- `ml-4` / `mr-4` (16px): Entre ícone/avatar e texto
- `ml-3` / `mr-3` (12px): Entre elementos menores
- `ml-2` / `mr-2` (8px): Espaçamento pequeno
- `mx-auto`: Centralização horizontal

---

## Padding (p)

### Padding em Cards

```vue
<!-- Card padrão -->
<div class="card">
  <!-- A classe .card já tem p-6 definida -->
</div>

<!-- Card personalizado -->
<div class="bg-white rounded-lg shadow-md p-6">
  Conteúdo
</div>
```

**Classe `.card` definida em `style.css`**:
```css
.card {
  @apply bg-white rounded-lg shadow-md p-6;
}
```

**Padrão**: `p-6` (24px) em todos os lados

---

### Padding em Modais

```vue
<!-- Header do modal -->
<div class="px-6 py-4">...</div>

<!-- Conteúdo do modal -->
<div class="p-6">...</div>

<!-- Footer do modal -->
<div class="px-4 py-2">...</div>
```

**Padrões**:
- Header: `px-6 py-4` (horizontal 24px, vertical 16px)
- Corpo: `p-6` (24px todos os lados)
- Footer: `px-4 py-2` ou `px-4 py-3`

---

### Padding em Células de Tabela

```vue
<!-- Header -->
<th class="px-6 py-3">Título</th>

<!-- Célula de dados -->
<td class="px-6 py-2">Conteúdo</td>
```

**Padrões**:
- Header: `px-6 py-3` (horizontal 24px, vertical 12px)
- Célula: `px-6 py-2` (horizontal 24px, vertical 8px)

---

### Padding em Botões

```vue
<!-- Botão padrão -->
<button class="btn">
  <!-- A classe .btn já tem px-4 py-2 -->
</button>
```

**Classe `.btn` definida em `style.css`**:
```css
.btn {
  @apply px-4 py-2 rounded-lg font-medium transition-colors duration-200;
}
```

**Padrão**: `px-4 py-2` (horizontal 16px, vertical 8px)

---

### Padding em Inputs

```vue
<input class="input" />
```

**Classe `.input` definida em `style.css`**:
```css
.input {
  @apply w-full px-3 py-2 border border-gray-300 rounded-lg 
         focus:ring-2 focus:ring-primary-500 focus:border-transparent 
         text-gray-900 bg-white;
}
```

**Padrão**: `px-3 py-2` (horizontal 12px, vertical 8px)

---

### Padding em Badges

```vue
<!-- Badge pequeno -->
<span class="px-2 py-0.5">Badge</span>

<!-- Badge médio -->
<span class="px-2.5 py-0.5">Badge</span>

<!-- Badge maior -->
<span class="px-3 py-1">Badge</span>
```

**Padrões**:
- Pequeno: `px-2 py-0.5` (horizontal 8px, vertical 2px)
- Médio: `px-2.5 py-0.5` (horizontal 10px, vertical 2px)
- Grande: `px-3 py-1` (horizontal 12px, vertical 4px)

---

### Padding em Containers

```vue
<!-- Container de página -->
<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
  Conteúdo
</div>
```

**Padrão responsivo**:
- Mobile: `px-4` (16px)
- Small: `sm:px-6` (24px)
- Large: `lg:px-8` (32px)

---

### Padding em Alertas/Notificações

```vue
<div class="bg-yellow-50 border border-yellow-400 p-4">
  Conteúdo do alerta
</div>
```

**Padrão**: `p-4` (16px todos os lados)

---

## Gap (Flexbox/Grid)

### Gap em Flexbox

```vue
<!-- Gap entre botões -->
<div class="flex gap-3">
  <button>Botão 1</button>
  <button>Botão 2</button>
</div>

<!-- Gap entre elementos de navegação -->
<div class="flex space-x-8">
  <a>Link 1</a>
  <a>Link 2</a>
</div>
```

**Padrões**:
- `gap-2` (8px): Elementos muito próximos
- `gap-3` (12px): Botões de ação
- `gap-4` (16px): Elementos de formulário
- `gap-6` (24px): Cards em grid
- `space-x-8` (32px): Itens de navegação

---

### Gap em Grid

```vue
<!-- Grid de cards -->
<div class="grid grid-cols-1 md:grid-cols-3 gap-4">
  <div class="card">Card 1</div>
  <div class="card">Card 2</div>
  <div class="card">Card 3</div>
</div>

<!-- Grid de estatísticas -->
<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
  <div class="card">Stat 1</div>
  <div class="card">Stat 2</div>
</div>
```

**Padrões**:
- `gap-4` (16px): Grid de formulários
- `gap-6` (24px): Grid de estatísticas/cards principais

---

### Space Between (Flexbox alternativo)

```vue
<!-- Espaçamento horizontal entre elementos -->
<div class="flex space-x-4">
  <div>Item 1</div>
  <div>Item 2</div>
</div>

<!-- Espaçamento vertical entre elementos -->
<div class="space-y-3">
  <div>Item 1</div>
  <div>Item 2</div>
</div>

<!-- Espaçamento vertical em lista -->
<ul class="space-y-1">
  <li>Item 1</li>
  <li>Item 2</li>
</ul>
```

**Padrões**:
- `space-y-1` (4px): Itens de lista compactos
- `space-y-3` (12px): Ações rápidas, botões empilhados
- `space-y-4` (16px): Campos de formulário
- `space-y-6` (24px): Seções de formulário
- `space-x-4` (16px): Elementos horizontais

---

## Padrões por Componente

### Header de Página
```vue
<div class="flex items-center justify-between mb-8">
  <h1 class="text-3xl font-bold text-gray-900">Título</h1>
  <div class="flex gap-3">
    <button class="btn btn-secondary">Voltar</button>
    <button class="btn btn-primary">Novo</button>
  </div>
</div>
```

**Espaçamentos**:
- `mb-8`: Abaixo do header
- `gap-3`: Entre botões de ação

---

### Card de Filtros
```vue
<div class="card mb-6">
  <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-2">Campo</label>
      <input class="input" />
    </div>
  </div>
</div>
```

**Espaçamentos**:
- `mb-6`: Card de filtros abaixo do header
- `gap-4`: Entre campos do filtro
- `mb-2`: Entre label e input

---

### Grid de Estatísticas
```vue
<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
  <div class="card">
    <div class="flex items-center">
      <div class="flex-shrink-0 bg-primary-100 rounded-lg p-3">
        <svg class="h-6 w-6 text-primary-600">...</svg>
      </div>
      <div class="ml-4">
        <p class="text-sm text-gray-600">Label</p>
        <p class="text-2xl font-bold text-gray-900 mt-2">100</p>
      </div>
    </div>
  </div>
</div>
```

**Espaçamentos**:
- `gap-6`: Entre cards de estatística
- `mb-6`: Grid de estatísticas abaixo dos filtros
- `ml-4`: Entre ícone e texto
- `mt-2`: Entre label e número
- `p-3`: Padding do container do ícone

---

### Tabela
```vue
<div class="card overflow-hidden p-0">
  <div class="overflow-x-auto">
    <table class="min-w-full divide-y divide-gray-200">
      <thead class="bg-gray-50">
        <tr>
          <th class="px-6 py-3">...</th>
        </tr>
      </thead>
      <tbody class="bg-white divide-y divide-gray-200">
        <tr>
          <td class="px-6 py-2">...</td>
        </tr>
      </tbody>
    </table>
  </div>
</div>
```

**Espaçamentos**:
- `p-0`: Remove padding padrão do card para tabela
- `px-6 py-3`: Headers
- `px-6 py-2`: Células

---

### Modal
```vue
<div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
  <div class="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh]">
    <!-- Header -->
    <div class="px-6 py-4 border-b">...</div>
    
    <!-- Body -->
    <form class="p-6 space-y-4">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">Campo</label>
        <input class="input" />
      </div>
    </form>
    
    <!-- Footer -->
    <div class="flex justify-end gap-3 pt-4 border-t px-6 pb-6">
      <button class="btn btn-secondary">Cancelar</button>
      <button class="btn btn-primary">Salvar</button>
    </div>
  </div>
</div>
```

**Espaçamentos**:
- `p-4`: Padding externo do modal overlay
- `px-6 py-4`: Header do modal
- `p-6`: Body do modal
- `space-y-4`: Entre campos do formulário
- `mb-2`: Entre label e input
- `pt-4`: Acima do footer
- `px-6 pb-6`: Footer do modal
- `gap-3`: Entre botões do footer

---

### Formulário
```vue
<form class="space-y-6">
  <div>
    <label class="block text-sm font-medium text-gray-700 mb-2">
      Nome *
    </label>
    <input class="input" />
    <p class="text-xs text-gray-500 mt-1">Informação auxiliar</p>
  </div>
</form>
```

**Espaçamentos**:
- `space-y-6`: Entre campos do formulário (24px)
- `mb-2`: Entre label e input (8px)
- `mt-1`: Entre input e hint (4px)

---

### Paginação
```vue
<div class="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
  <div class="flex items-center justify-between">
    <div>
      <p class="text-sm text-gray-700">...</p>
    </div>
    <div>
      <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
        <button class="px-2 py-2">Anterior</button>
        <button class="px-2 py-2">Próxima</button>
      </nav>
    </div>
  </div>
</div>
```

**Espaçamentos**:
- `px-4 py-3` / `sm:px-6`: Padding responsivo do container
- `px-2 py-2`: Padding dos botões de paginação
- `-space-x-px`: Remove espaço entre botões (border compartilhada)

---

## Divisores e Borders

```vue
<!-- Divisor em tabela -->
<tbody class="divide-y divide-gray-200">
  <tr>...</tr>
</tbody>

<!-- Border em card -->
<div class="border border-gray-300 rounded-lg">...</div>

<!-- Border apenas em um lado -->
<div class="border-t border-gray-200">...</div>
<div class="border-b border-gray-200">...</div>
<div class="border-l-4 border-yellow-400">...</div>
```

---

## ❌ Erros Comuns a Evitar

1. **Não usar espaçamentos inconsistentes**:
   ```vue
   ❌ <div class="mb-5">  <!-- Não é padrão -->
   ✅ <div class="mb-6">  <!-- Use múltiplos de escala -->
   ```

2. **Não esquecer de remover padding em tabelas**:
   ```vue
   ❌ <div class="card">
   ✅ <div class="card p-0">  <!-- Para tabelas -->
   ```

3. **Não usar margin em todas as direções quando não necessário**:
   ```vue
   ❌ <div class="m-4">
   ✅ <div class="mb-4">  <!-- Específico -->
   ```

4. **Não misturar space-x/y com gap**:
   ```vue
   ❌ <div class="flex gap-4 space-x-4">
   ✅ <div class="flex gap-4">  <!-- Use apenas um -->
   ```

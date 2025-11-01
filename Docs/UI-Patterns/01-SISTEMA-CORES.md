# 🎨 Sistema de Cores

## Paleta de Cores Principal

### Primary (Azul)

A cor principal do sistema é baseada em tons de azul, usada para:
- Botões primários
- Links e elementos interativos
- Destaques e chamadas de ação
- Estados ativos em navegação

```css
primary-50:  #eff6ff  /* Fundo muito claro */
primary-100: #dbeafe  /* Fundo claro, badges */
primary-200: #bfdbfe  /* Bordas suaves */
primary-300: #93c5fd  /* Elementos secundários */
primary-400: #60a5fa  /* Hover states */
primary-500: #3b82f6  /* Base principal */
primary-600: #2563eb  /* Botões primários, textos importantes */
primary-700: #1d4ed8  /* Hover em botões primários */
primary-800: #1e40af  /* Textos escuros */
primary-900: #1e3a8a  /* Textos muito escuros */
```

**Exemplos de Uso**:
```vue
<!-- Botão primário -->
<button class="btn btn-primary">Salvar</button>

<!-- Avatar com fundo primary -->
<div class="bg-primary-100 text-primary-600">GP</div>

<!-- Badge ativo -->
<span class="bg-primary-100 text-primary-800">Ativo</span>
```

---

## Cores Semânticas

### Success (Verde)

Usado para feedback positivo, status de sucesso e confirmações.

```css
green-50:  #f0fdf4
green-100: #dcfce7
green-600: #16a34a
green-700: #15803d
green-800: #166534
```

**Uso**:
- Status "Ativo"
- Mensagens de sucesso (toasts)
- Indicadores de frequência alta
- Métricas positivas

```vue
<!-- Badge de status ativo -->
<span class="bg-green-100 text-green-800">Ativo</span>

<!-- Ícone de sucesso -->
<svg class="text-green-600">...</svg>
```

---

### Danger (Vermelho)

Usado para ações destrutivas, erros e alertas críticos.

```css
red-50:  #fef2f2
red-100: #fee2e2
red-600: #dc2626
red-700: #b91c1c
red-800: #991b1b
```

**Uso**:
- Botões de exclusão
- Status "Inativo"
- Mensagens de erro
- Alertas críticos
- Métricas negativas

```vue
<!-- Botão de exclusão -->
<button class="btn btn-danger">Excluir</button>

<!-- Badge inativo -->
<span class="bg-red-100 text-red-800">Inativo</span>
```

---

### Warning (Amarelo)

Usado para avisos e situações que requerem atenção.

```css
yellow-50:  #fefce8
yellow-100: #fef3c7
yellow-400: #facc15
yellow-700: #a16207
yellow-800: #854d0e
```

**Uso**:
- Alertas de atenção
- Status pendentes
- Notificações importantes
- Ícones de edição

```vue
<!-- Ícone de editar -->
<svg class="text-yellow-600 hover:text-yellow-900">...</svg>

<!-- Alerta de atenção -->
<div class="bg-yellow-50 border-yellow-400">...</div>
```

---

### Info (Azul claro/Indigo)

Usado para informações neutras e contextuais.

```css
blue-50:  #eff6ff
blue-100: #dbeafe
blue-600: #2563eb
blue-700: #1d4ed8
blue-800: #1e40af

indigo-100: #e0e7ff
indigo-800: #3730a6
```

**Uso**:
- Badges informativos
- Links informativos
- Ícones de visualização

```vue
<!-- Link de visualizar -->
<a class="text-blue-600 hover:text-blue-900">Ver detalhes</a>
```

---

## Cores Neutras (Grays)

### Escala de Cinza

Sistema completo de tons de cinza para textos, fundos e bordas.

```css
gray-50:  #f9fafb   /* Fundos de tabelas/headers */
gray-100: #f3f4f6   /* Fundo principal da aplicação */
gray-200: #e5e7eb   /* Botões secundários */
gray-300: #d1d5db   /* Bordas padrão */
gray-400: #9ca3af   /* Ícones secundários */
gray-500: #6b7280   /* Texto secundário */
gray-600: #4b5563   /* Texto principal claro */
gray-700: #374151   /* Labels, texto médio */
gray-800: #1f2937   /* Botões secundários (texto) */
gray-900: #111827   /* Títulos, texto principal */
```

**Hierarquia de Texto**:
```vue
<!-- Título principal -->
<h1 class="text-3xl font-bold text-gray-900">Título</h1>

<!-- Texto secundário -->
<p class="text-sm text-gray-600">Subtítulo</p>

<!-- Texto auxiliar -->
<span class="text-xs text-gray-500">Informação adicional</span>
```

---

## Cores por Contexto de Perfil

### Administrador
```css
Fundo: bg-indigo-100
Texto: text-indigo-800 / text-indigo-700
```

### Coordenador
```css
Fundo: bg-green-100
Texto: text-green-800 / text-green-700
```

### Professor
```css
Fundo: bg-yellow-100
Texto: text-yellow-800 / text-yellow-700
```

### Responsável
```css
Fundo: bg-purple-100
Texto: text-purple-800 / text-purple-700
```

**Exemplo**:
```vue
<!-- Avatar colorido por perfil -->
<div class="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
  <span class="text-indigo-700 font-medium text-sm">AD</span>
</div>
```

---

## Backgrounds

### Página Principal
```css
background: bg-gray-100
```

### Cards e Containers
```css
background: bg-white
```

### Headers de Tabela
```css
background: bg-gray-50
```

### Modais
```css
background: bg-white
overlay: bg-black bg-opacity-50
```

---

## Bordas

### Padrão
```css
border: border-gray-300
```

### Hover em Inputs
```css
focus: focus:ring-2 focus:ring-primary-500 focus:border-transparent
```

### Divisores
```css
divide: divide-gray-200
```

---

## Contraste e Acessibilidade

### Ratios Mínimos (WCAG 2.1)

- **Texto normal**: Contraste mínimo 4.5:1
- **Texto grande** (≥18pt ou ≥14pt bold): Contraste mínimo 3:1
- **Elementos UI**: Contraste mínimo 3:1

### Combinações Aprovadas

✅ **Texto escuro em fundo claro**:
- `text-gray-900` em `bg-white` ✓ (Contraste: ~15:1)
- `text-gray-700` em `bg-gray-50` ✓ (Contraste: ~9:1)

✅ **Texto claro em fundo escuro**:
- `text-white` em `bg-primary-600` ✓ (Contraste: ~5:1)
- `text-white` em `bg-red-600` ✓ (Contraste: ~5.5:1)

❌ **Evitar**:
- `text-gray-400` em `bg-white` (baixo contraste)
- `text-yellow-400` em `bg-white` (baixo contraste)

---

## Guia Rápido de Aplicação

| Elemento | Cor Principal | Hover | Texto |
|----------|---------------|-------|-------|
| Botão Primário | `bg-primary-600` | `hover:bg-primary-700` | `text-white` |
| Botão Secundário | `bg-gray-200` | `hover:bg-gray-300` | `text-gray-800` |
| Botão Danger | `bg-red-600` | `hover:bg-red-700` | `text-white` |
| Link | `text-blue-600` | `hover:text-blue-900` | - |
| Badge Ativo | `bg-green-100` | - | `text-green-800` |
| Badge Inativo | `bg-red-100` | - | `text-red-800` |
| Input | `bg-white` | `focus:ring-primary-500` | `text-gray-900` |
| Card | `bg-white` | - | `text-gray-900` |

---

## Transições de Cor

Todas as mudanças de cor devem ter transição suave:

```css
transition-colors duration-200
```

**Exemplo**:
```vue
<button class="bg-primary-600 hover:bg-primary-700 transition-colors duration-200">
  Botão
</button>
```

---

## ❌ Erros Comuns a Evitar

1. **Não usar cores diretas**: Sempre use a paleta definida
   ```vue
   ❌ <button class="bg-[#3b82f6]">
   ✅ <button class="bg-primary-500">
   ```

2. **Não misturar tons aleatórios**: Mantenha consistência
   ```vue
   ❌ <span class="bg-green-200 text-green-900">
   ✅ <span class="bg-green-100 text-green-800">
   ```

3. **Não esquecer estados hover/focus**:
   ```vue
   ❌ <button class="text-blue-600">
   ✅ <button class="text-blue-600 hover:text-blue-900">
   ```

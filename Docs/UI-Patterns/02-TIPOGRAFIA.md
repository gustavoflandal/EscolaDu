# 📝 Tipografia

## Família de Fontes

### Fonte Principal
```css
font-family: Inter, system-ui, Avenir, Helvetica, Arial, sans-serif
```

Definida no arquivo `frontend/src/style.css`:
```css
:root {
  font-family: Inter, system-ui, Avenir, Helvetica, Arial, sans-serif;
  line-height: 1.5;
  font-weight: 400;
}
```

---

## Hierarquia de Títulos

### H1 - Título Principal de Página
```vue
<h1 class="text-3xl font-bold text-gray-900">Título da Página</h1>
```

**Uso**: Título principal de cada view/página
- **Tamanho**: `text-3xl` (1.875rem / 30px)
- **Peso**: `font-bold` (700)
- **Cor**: `text-gray-900`

**Exemplos no sistema**:
- "Professores" (lista)
- "Alunos" (lista)
- "Usuários" (lista)
- "Dashboard" (página inicial)

---

### H2 - Título de Seção
```vue
<h2 class="text-xl font-bold text-gray-900">Seção Importante</h2>
```

**Uso**: Subtítulos de seções dentro de uma página
- **Tamanho**: `text-xl` (1.25rem / 20px)
- **Peso**: `font-bold` (700)
- **Cor**: `text-gray-900`

**Exemplos no sistema**:
- "Detalhes do Programa de Ensino" (modal)
- "Dados Pessoais" (detail view)
- "Permissões" (detail view)

---

### H3 - Subtítulo de Componente
```vue
<h3 class="text-lg font-semibold text-gray-900">Subtítulo</h3>
```

**Uso**: Títulos dentro de cards ou componentes
- **Tamanho**: `text-lg` (1.125rem / 18px)
- **Peso**: `font-semibold` (600)
- **Cor**: `text-gray-900`

**Exemplos no sistema**:
- "Objetivos de Aprendizagem" (em modais)
- "Bem-vindo!" (cards de dashboard)

---

## Tamanhos de Texto

### Extra Small (XS)
```vue
<p class="text-xs text-gray-500">Texto muito pequeno</p>
```
- **Tamanho**: `text-xs` (0.75rem / 12px)
- **Uso**: Hints, contadores de caracteres, metainformações
- **Cor típica**: `text-gray-500` ou `text-gray-600`

**Exemplos**:
```vue
<!-- Contador de caracteres -->
<p class="text-xs text-gray-500 mt-1">
  {{ formData.descricao.length }} caracteres (mínimo 10)
</p>

<!-- Hint de input -->
<p class="text-xs text-gray-500 mt-1">
  Use apenas letras maiúsculas, números e hífens
</p>
```

---

### Small (SM)
```vue
<p class="text-sm text-gray-700">Texto pequeno</p>
```
- **Tamanho**: `text-sm` (0.875rem / 14px)
- **Uso**: Texto secundário, labels, descrições, conteúdo de tabela
- **Cor típica**: `text-gray-600`, `text-gray-700` ou `text-gray-900`

**Exemplos**:
```vue
<!-- Label de formulário -->
<label class="block text-sm font-medium text-gray-700 mb-2">
  Nome Completo
</label>

<!-- Texto de card -->
<p class="text-sm text-gray-600">
  Use o menu acima para navegar pelos diferentes módulos do sistema.
</p>

<!-- Conteúdo de célula de tabela -->
<td class="px-6 py-2 whitespace-nowrap text-sm text-gray-900">
  {{ professor.registroProfissional }}
</td>
```

---

### Base (MD)
```vue
<p class="text-base text-gray-900">Texto padrão</p>
```
- **Tamanho**: `text-base` (1rem / 16px)
- **Uso**: Texto de corpo padrão (raramente especificado explicitamente)
- **Cor típica**: `text-gray-900`

---

### Large (LG)
```vue
<p class="text-lg font-medium text-gray-900">Texto grande</p>
```
- **Tamanho**: `text-lg` (1.125rem / 18px)
- **Uso**: Destaque moderado, subtítulos
- **Peso típico**: `font-medium` (500) ou `font-semibold` (600)

---

### Extra Large (XL) e Maiores
```vue
<p class="text-xl text-gray-900">Texto extra grande</p>
<p class="text-2xl text-gray-900">Texto 2XL</p>
<p class="text-3xl text-gray-900">Texto 3XL</p>
```
- **Uso**: Títulos e números grandes em estatísticas

**Exemplo de estatística**:
```vue
<div class="ml-4">
  <p class="text-sm text-gray-600">Total</p>
  <p class="text-2xl font-bold text-gray-900">{{ stats.total }}</p>
</div>
```

---

## Pesos de Fonte

### Normal (400)
```css
font-weight: 400  /* Padrão do sistema */
```
**Uso**: Texto de corpo normal

---

### Medium (500)
```vue
<span class="font-medium">Texto médio</span>
```
**Uso**: Destaque leve, nomes em tabelas

**Exemplo**:
```vue
<div class="text-sm font-medium text-gray-900">
  {{ professor.user?.name }}
</div>
```

---

### Semibold (600)
```vue
<span class="font-semibold">Texto semi-negrito</span>
```
**Uso**: Headers de tabela, labels importantes, subtítulos

**Exemplo**:
```vue
<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
  Nome
</th>
```

---

### Bold (700)
```vue
<span class="font-bold">Texto negrito</span>
```
**Uso**: Títulos principais, números de estatísticas, ênfase forte

**Exemplos**:
```vue
<!-- Título -->
<h1 class="text-3xl font-bold text-gray-900">Professores</h1>

<!-- Número de estatística -->
<p class="text-2xl font-bold text-gray-900">{{ stats.total }}</p>

<!-- Valor em destaque -->
<span class="font-medium">{{ pagination.total }}</span>
```

---

## Line Height

### Padrão
```css
line-height: 1.5  /* Definido globalmente */
```

### Leading Classes
```vue
<p class="leading-4">Line height 1rem</p>
<p class="leading-5">Line height 1.25rem</p>
<p class="leading-6">Line height 1.5rem</p>
<p class="leading-relaxed">Line height 1.625</p>
```

**Uso comum**: Geralmente não especificado, usa o padrão do sistema.

---

## Espaçamento de Letras

### Uppercase + Tracking
```vue
<th class="text-xs font-medium text-gray-500 uppercase tracking-wider">
  TÍTULO
</th>
```

**Uso**: Headers de tabela em maiúsculas
- `uppercase`: Transforma texto em maiúsculas
- `tracking-wider`: Aumenta espaçamento entre letras (0.05em)

---

## Cores de Texto

### Hierarquia de Cor

```vue
<!-- Texto principal - mais escuro -->
<p class="text-gray-900">Texto muito importante</p>

<!-- Texto secundário - tom médio -->
<p class="text-gray-700">Texto importante</p>

<!-- Texto terciário - mais claro -->
<p class="text-gray-600">Texto secundário</p>

<!-- Texto auxiliar - bem claro -->
<p class="text-gray-500">Informação auxiliar</p>

<!-- Texto desabilitado -->
<p class="text-gray-400">Texto desabilitado</p>
```

### Cores Semânticas

```vue
<!-- Texto de sucesso -->
<p class="text-green-600">Ativo / Sucesso</p>

<!-- Texto de erro -->
<p class="text-red-600">Erro / Inativo</p>

<!-- Texto de aviso -->
<p class="text-yellow-600">Atenção / Editar</p>

<!-- Texto informativo -->
<p class="text-blue-600">Informação / Link</p>
```

---

## Transformações de Texto

### Uppercase
```vue
<span class="uppercase">texto em maiúsculas</span>
```
**Uso**: Headers de tabela, badges de status

---

### Capitalize
```vue
<span class="capitalize">primeira letra maiúscula</span>
```
**Uso**: Raramente usado no sistema

---

### Lowercase
```vue
<span class="lowercase">TEXTO EM MINÚSCULAS</span>
```
**Uso**: Raramente usado no sistema

---

## Truncamento de Texto

### Truncate (linha única)
```vue
<p class="truncate">Texto muito longo que será cortado com...</p>
```

### Line Clamp (múltiplas linhas)
```vue
<p class="line-clamp-2">
  Texto que será limitado a 2 linhas e depois cortado com reticências...
</p>
```

**Uso no sistema**:
```vue
<p class="text-sm text-gray-700 line-clamp-2">{{ programa.descricao }}</p>
```

---

## Espaçamento de Texto

### Whitespace
```vue
<td class="whitespace-nowrap">Não quebra linha</td>
```

**Uso**: Comum em células de tabela para evitar quebra de linha

---

## Padrões por Contexto

### Labels de Formulário
```vue
<label class="block text-sm font-medium text-gray-700 mb-2">
  Nome do Campo
</label>
```

### Texto de Hint/Helper
```vue
<p class="text-xs text-gray-500 mt-1">
  Informação auxiliar sobre o campo
</p>
```

### Texto de Card/Descrição
```vue
<p class="text-gray-600 mt-2">
  Descrição ou conteúdo do card
</p>
```

### Headers de Tabela
```vue
<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
  Nome da Coluna
</th>
```

### Conteúdo de Tabela
```vue
<td class="px-6 py-2 whitespace-nowrap text-sm text-gray-900">
  Conteúdo
</td>
```

### Títulos em Modais
```vue
<h2 class="text-xl font-bold text-gray-900">
  Título do Modal
</h2>
```

### Subtexto em Modal
```vue
<p class="text-sm text-gray-500">Código ou informação adicional</p>
```

---

## Estatísticas e Números

### Número Grande (Métrica)
```vue
<p class="text-2xl font-bold text-gray-900">150</p>
```

### Label de Métrica
```vue
<p class="text-sm text-gray-600">Total de Alunos</p>
```

### Número com Cor Semântica
```vue
<!-- Positivo -->
<p class="text-2xl font-bold text-green-600">95%</p>

<!-- Negativo -->
<p class="text-2xl font-bold text-red-600">45%</p>
```

---

## ❌ Erros Comuns a Evitar

1. **Não misturar pesos inconsistentes**:
   ```vue
   ❌ <h1 class="text-3xl font-medium">
   ✅ <h1 class="text-3xl font-bold">
   ```

2. **Não usar cores inadequadas para texto**:
   ```vue
   ❌ <p class="text-gray-400">Texto principal
   ✅ <p class="text-gray-900">Texto principal
   ```

3. **Não esquecer uppercase em headers de tabela**:
   ```vue
   ❌ <th class="text-xs font-medium text-gray-500">
   ✅ <th class="text-xs font-medium text-gray-500 uppercase">
   ```

4. **Não usar tamanhos aleatórios**:
   ```vue
   ❌ <label class="text-base">
   ✅ <label class="text-sm font-medium text-gray-700">
   ```

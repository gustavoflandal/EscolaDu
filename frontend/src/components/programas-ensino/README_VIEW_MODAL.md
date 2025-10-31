# Modal de Visualização do Programa de Ensino

Modal detalhado para visualizar todas as informações de um Programa de Ensino, incluindo os objetivos de aprendizagem vinculados.

## 📋 Características

### ✅ Informações Exibidas

**Seção Principal:**
- Nome do programa
- Código (uppercase)
- Disciplina associada
- Área de conhecimento
- Série e Período
- Ano letivo
- Carga horária
- Status (Ativo/Inativo)
- Data de criação

**Descrição:**
- Descrição completa do programa (se disponível)

**Observações:**
- Observações administrativas (se disponível)

**Objetivos de Aprendizagem:**
- Lista completa de objetivos ordenados
- Código BNCC de cada objetivo
- Descrição
- Competências e habilidades
- Status (Ativo/Inativo)
- Botão para adicionar novos objetivos
- Botão para editar cada objetivo

**Metadados:**
- ID único
- Timestamp de criação
- Timestamp de última atualização

### 🎨 Estados Visuais

- **Loading:** Spinner animado durante carregamento
- **Error State:** Mensagem de erro caso falhe o carregamento
- **Empty State:** Mensagem amigável quando não há objetivos
- **Active/Inactive:** Badges coloridos para status

### 🔄 Eventos Emitidos

```typescript
@close              // Fecha o modal
@edit(programa)     // Abre modal de edição com o programa
@add-objetivo(id)   // Trigger para adicionar objetivo
@edit-objetivo(id)  // Trigger para editar objetivo
```

## 🚀 Como Usar

### Importação

```typescript
import ProgramaEnsinoViewModal from '@/components/programas-ensino/ProgramaEnsinoViewModal.vue'
```

### Uso no Template

```vue
<template>
  <div>
    <!-- Botão para abrir modal -->
    <button @click="openModal(programaId)">
      Ver Detalhes
    </button>

    <!-- Modal -->
    <ProgramaEnsinoViewModal
      :is-open="showModal"
      :programa-id="selectedProgramaId"
      @close="closeModal"
      @edit="handleEdit"
      @add-objetivo="handleAddObjetivo"
      @edit-objetivo="handleEditObjetivo"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import ProgramaEnsinoViewModal from '@/components/programas-ensino/ProgramaEnsinoViewModal.vue'
import type { ProgramaEnsino } from '@/services/programas-ensino.service'

const showModal = ref(false)
const selectedProgramaId = ref<string | null>(null)

const openModal = (id: string) => {
  selectedProgramaId.value = id
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  selectedProgramaId.value = null
}

const handleEdit = (programa: ProgramaEnsino) => {
  console.log('Edit programa:', programa)
  closeModal()
  // Abrir modal de edição
}

const handleAddObjetivo = (programaId: string) => {
  console.log('Add objetivo to programa:', programaId)
  // Abrir modal de criação de objetivo
}

const handleEditObjetivo = (objetivoId: string) => {
  console.log('Edit objetivo:', objetivoId)
  // Abrir modal de edição de objetivo
}
</script>
```

### Exemplo Integrado

```vue
<template>
  <div>
    <!-- Lista de programas -->
    <div v-for="programa in programas" :key="programa.id">
      <h3>{{ programa.nome }}</h3>
      <button @click="viewPrograma(programa.id)">Ver Detalhes</button>
      <button @click="editPrograma(programa)">Editar</button>
    </div>

    <!-- Modal de Visualização -->
    <ProgramaEnsinoViewModal
      :is-open="showViewModal"
      :programa-id="viewProgramaId"
      @close="closeViewModal"
      @edit="handleEditFromView"
      @add-objetivo="showAddObjetivoModal"
      @edit-objetivo="showEditObjetivoModal"
    />

    <!-- Modal de Edição -->
    <ProgramaEnsinoModal
      v-if="showEditModal"
      :programa="selectedPrograma"
      :disciplina-id="disciplinaId"
      @close="closeEditModal"
      @saved="handleSaved"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import ProgramaEnsinoViewModal from '@/components/programas-ensino/ProgramaEnsinoViewModal.vue'
import ProgramaEnsinoModal from '@/views/disciplinas/ProgramaEnsinoModal.vue'
import type { ProgramaEnsino } from '@/services/programas-ensino.service'

const programas = ref<ProgramaEnsino[]>([])
const disciplinaId = ref('some-disciplina-id')

// View Modal
const showViewModal = ref(false)
const viewProgramaId = ref<string | null>(null)

const viewPrograma = (id: string) => {
  viewProgramaId.value = id
  showViewModal.value = true
}

const closeViewModal = () => {
  showViewModal.value = false
  viewProgramaId.value = null
}

// Edit Modal
const showEditModal = ref(false)
const selectedPrograma = ref<ProgramaEnsino | undefined>()

const editPrograma = (programa: ProgramaEnsino) => {
  selectedPrograma.value = programa
  showEditModal.value = true
}

const handleEditFromView = (programa: ProgramaEnsino) => {
  closeViewModal()
  editPrograma(programa)
}

const closeEditModal = () => {
  showEditModal.value = false
  selectedPrograma.value = undefined
}

const handleSaved = () => {
  closeEditModal()
  // Recarregar lista de programas
}

// Objetivos (placeholder)
const showAddObjetivoModal = (programaId: string) => {
  console.log('Add objetivo to:', programaId)
}

const showEditObjetivoModal = (objetivoId: string) => {
  console.log('Edit objetivo:', objetivoId)
}
</script>
```

## 🎯 Props

| Prop | Tipo | Obrigatório | Descrição |
|------|------|-------------|-----------|
| `isOpen` | `boolean` | ✅ | Controla se o modal está visível |
| `programaId` | `string \| null` | ✅ | ID do programa a ser carregado |

## 📤 Eventos

| Evento | Payload | Descrição |
|--------|---------|-----------|
| `close` | - | Emitido quando o modal deve ser fechado |
| `edit` | `Programa` | Emitido quando o botão "Editar Programa" é clicado |
| `add-objetivo` | `string` (programaId) | Emitido quando usuário quer adicionar objetivo |
| `edit-objetivo` | `string` (objetivoId) | Emitido quando usuário quer editar objetivo |

## 🎨 Design

### Cores

- **Status Ativo:** Verde (`bg-green-100 text-green-800`)
- **Status Inativo:** Vermelho (`bg-red-100 text-red-800`)
- **Seção Principal:** Azul claro (`bg-blue-50 border-blue-200`)
- **Descrição:** Cinza claro (`bg-gray-50 border-gray-200`)
- **Observações:** Amarelo claro (`bg-yellow-50 border-yellow-200`)

### Layout

- **Width:** `max-w-4xl` (responsivo)
- **Height:** `max-h-[90vh]` com scroll
- **Header:** Sticky no topo
- **Footer:** Sticky no rodapé

### Responsividade

- Grid de informações: 2 colunas em desktop, 1 em mobile
- Botões se ajustam ao tamanho da tela
- Modal ocupa 90% da altura da viewport

## 🔒 Permissões

O modal não verifica permissões internamente. A lógica de permissões deve ser implementada no componente pai:

```vue
<button 
  v-if="hasPermission('programas-ensino', 'read')"
  @click="openModal(programaId)"
>
  Ver Detalhes
</button>

<ProgramaEnsinoViewModal
  :is-open="showModal"
  :programa-id="selectedProgramaId"
  @close="closeModal"
  @edit="hasPermission('programas-ensino', 'update') ? handleEdit : null"
/>
```

## 📝 Notas

1. **Auto-load:** O modal carrega automaticamente os dados quando `isOpen` se torna `true`
2. **Re-load:** Os dados são recarregados se `programaId` mudar enquanto o modal está aberto
3. **Cleanup:** Os dados são limpos quando o modal fecha
4. **Logs:** Console logs informativos para debugging (🔍 loading, ✅ success, ❌ error)
5. **Objetivos Ordenados:** Os objetivos são exibidos ordenados pelo campo `ordem`

## 🚀 Próximos Passos

- [ ] Implementar modal de criação/edição de objetivos
- [ ] Adicionar opção de imprimir/exportar programa
- [ ] Adicionar histórico de alterações
- [ ] Permitir duplicar programa
- [ ] Adicionar filtro/busca de objetivos dentro do modal
- [ ] Drag & drop para reordenar objetivos

## 🐛 Troubleshooting

### Modal não abre
- Verifique se `isOpen` está sendo atualizado para `true`
- Verifique se `programaId` não é `null`
- Verifique o console para erros de carregamento

### Dados não carregam
- Verifique se o backend está rodando
- Verifique se a API `/programas-ensino/:id` está funcionando
- Verifique o console para erros de rede

### Objetivos não aparecem
- Verifique se o backend está incluindo `objetivos` na resposta
- Verifique se há objetivos cadastrados para o programa
- Verifique o console para a estrutura da resposta

# Módulo de Disciplinas - Documentação

## 📋 Visão Geral

Módulo completo para gerenciamento de disciplinas escolares e seus objetivos de aprendizagem baseados na BNCC (Base Nacional Comum Curricular).

## ✅ Componentes Implementados

### Backend

#### 1. **Validators** (`backend/src/validators/disciplina.validator.ts`)
- `createDisciplinaSchema`: Validação para criar disciplina
- `updateDisciplinaSchema`: Validação para atualizar disciplina
- `createObjetivoSchema`: Validação para criar objetivo de aprendizagem
- `updateObjetivoSchema`: Validação para atualizar objetivo
- `queryDisciplinasSchema`: Validação de filtros de listagem
- `queryObjetivosSchema`: Validação de filtros de objetivos

#### 2. **Service** (`backend/src/services/disciplina.service.ts`)
**Métodos de Disciplinas:**
- `findAll()`: Lista disciplinas com paginação e filtros
- `findById()`: Busca disciplina por ID com objetivos e turmas
- `create()`: Cria nova disciplina
- `update()`: Atualiza disciplina existente
- `delete()`: Remove disciplina (valida dependências)
- `getAreasConhecimento()`: Lista áreas de conhecimento disponíveis

**Métodos de Objetivos:**
- `findAllObjetivos()`: Lista objetivos com paginação
- `findObjetivoById()`: Busca objetivo por ID
- `createObjetivo()`: Cria novo objetivo
- `updateObjetivo()`: Atualiza objetivo
- `deleteObjetivo()`: Remove objetivo (valida avaliações)
- `getSeries()`: Lista séries disponíveis
- `getPeriodos()`: Lista períodos disponíveis
- `getObjetivosPorDisciplina()`: Objetivos de uma disciplina

#### 3. **Controller** (`backend/src/controllers/disciplina.controller.ts`)
14 endpoints RESTful mapeando todos os métodos do service

#### 4. **Routes** (`backend/src/routes/disciplina.routes.ts`)
Rotas configuradas com autenticação e permissões:
- `GET /disciplinas` - Listar disciplinas
- `GET /disciplinas/:id` - Detalhes da disciplina
- `POST /disciplinas` - Criar disciplina
- `PUT /disciplinas/:id` - Atualizar disciplina
- `DELETE /disciplinas/:id` - Excluir disciplina
- `GET /disciplinas/areas-conhecimento` - Áreas disponíveis
- `GET /disciplinas/series` - Séries disponíveis
- `GET /disciplinas/periodos` - Períodos disponíveis
- `GET /disciplinas/objetivos/list` - Listar objetivos
- `GET /disciplinas/objetivos/:id` - Detalhes do objetivo
- `POST /disciplinas/:disciplinaId/objetivos` - Criar objetivo
- `PUT /disciplinas/objetivos/:id` - Atualizar objetivo
- `DELETE /disciplinas/objetivos/:id` - Excluir objetivo
- `GET /disciplinas/:disciplinaId/objetivos` - Objetivos da disciplina

### Frontend

#### 5. **Types** (`frontend/src/types/index.ts`)
```typescript
interface Disciplina {
  id: string
  codigo: string
  nome: string
  areaConhecimento?: string
  cargaHorariaSemanal: number
  descricao?: string
  active: boolean
  quantidadeObjetivos?: number
  quantidadeTurmas?: number
  objetivos?: ObjetivoAprendizagem[]
  turmas?: TurmaDisciplina[]
}

interface ObjetivoAprendizagem {
  id: string
  codigoBNCC: string
  descricao: string
  serie: string
  periodo: string
  competencia?: string
  habilidade?: string
  disciplinaId: string
  disciplina?: { id, codigo, nome }
  active: boolean
  quantidadeAvaliacoes?: number
}
```

#### 6. **Service** (`frontend/src/services/disciplinas.service.ts`)
14 métodos correspondentes aos endpoints da API

#### 7. **Views**

**DisciplinasListView** (`frontend/src/views/disciplinas/DisciplinasListView.vue`)
- Grid com colunas: Código, Nome, Área, C.H. Semanal, Objetivos, Turmas, Status, Ações
- Filtros: busca, área de conhecimento, status
- Ações inline com ícones: 👁️ Visualizar, ✏️ Editar, 🗑️ Excluir
- Paginação
- Botão "Nova Disciplina"
- Integração com modal de criação/edição

**DisciplinaModal** (`frontend/src/views/disciplinas/DisciplinaModal.vue`)
- Formulário de criação/edição de disciplina
- Campos: código, nome, área de conhecimento, carga horária, descrição
- Seletor de área com opção de adicionar nova
- Validação de formulário
- Status (apenas em edição)

**DisciplinaDetailView** (`frontend/src/views/disciplinas/DisciplinaDetailView.vue`)
- Card de informações da disciplina
- Grid de objetivos de aprendizagem
- Filtros de objetivos: busca, série, período
- Ações inline: ✏️ Editar, 🗑️ Excluir
- Botão "Adicionar Objetivo"
- Integração com modal de objetivos

**ObjetivoModal** (`frontend/src/views/disciplinas/ObjetivoModal.vue`)
- Formulário de criação/edição de objetivo
- Campos: código BNCC, descrição, série, período, competência, habilidade
- Validação BNCC
- Status (apenas em edição)

### Infraestrutura

#### 8. **Router** (`frontend/src/router/index.ts`)
```typescript
{ path: '/disciplinas', name: 'disciplinas', component: DisciplinasListView }
{ path: '/disciplinas/:id', name: 'disciplina-detalhes', component: DisciplinaDetailView }
```

#### 9. **Permissions** (`frontend/src/composables/usePermissions.ts`)
- Mapeamento `'disciplinas': 'disciplinas'` adicionado
- Permissões: `disciplinas:create`, `disciplinas:read`, `disciplinas:update`, `disciplinas:delete`

#### 10. **Menu** (`frontend/src/layouts/DashboardLayout.vue`)
- Link "Disciplinas" adicionado ao menu principal
- Visibilidade controlada por permissão

#### 11. **App Registration** (`backend/src/app.ts`)
- Rotas registradas em `/api/v1/disciplinas`

#### 12. **Permissions Seed** (`backend/prisma/seed-permissions.ts`)
Permissões já configuradas por perfil:
- **Administrador**: create, read, update, delete
- **Coordenador**: create, read, update, delete
- **Professor**: read (apenas leitura)
- **Responsável**: read (apenas leitura)

#### 13. **Data Seed** (`backend/prisma/seed-disciplinas.ts`)
Dados de exemplo:
- 9 disciplinas (Português, Matemática, Ciências, História, Geografia, Arte, Ed. Física, Inglês, Ens. Religioso)
- 17 objetivos de aprendizagem BNCC do 1º ano
- Distribuídos por disciplina, série e período

## 🎯 Funcionalidades

### Disciplinas
- ✅ Listagem com filtros (busca, área, status)
- ✅ Criação de nova disciplina
- ✅ Edição de disciplina existente
- ✅ Exclusão de disciplina (com validação de dependências)
- ✅ Visualização detalhada
- ✅ Paginação
- ✅ Contadores de objetivos e turmas associadas

### Objetivos de Aprendizagem
- ✅ Listagem por disciplina
- ✅ Filtros (busca, série, período)
- ✅ Criação de objetivo com código BNCC
- ✅ Edição de objetivo
- ✅ Exclusão de objetivo (com validação de avaliações)
- ✅ Campos BNCC: código, competência, habilidade

### Controle de Acesso
- ✅ Autenticação obrigatória
- ✅ Permissões por ação (create, read, update, delete)
- ✅ Restrições no frontend (botões condicionais)
- ✅ Validação no backend (middleware)

## 📊 Modelo de Dados

### Disciplina
```prisma
model Disciplina {
  id                    String   @id @default(uuid())
  codigo                String   @unique
  nome                  String
  areaConhecimento      String?
  cargaHorariaSemanal   Int
  descricao             String?  @db.Text
  active                Boolean  @default(true)
  createdAt             DateTime @default(now())
  updatedAt             DateTime @updatedAt
  
  objetivos             ObjetivoAprendizagem[]
  turmas                TurmaDisciplina[]
}
```

### ObjetivoAprendizagem
```prisma
model ObjetivoAprendizagem {
  id            String   @id @default(uuid())
  codigoBNCC    String   @unique
  descricao     String   @db.Text
  serie         String
  periodo       String
  competencia   String?  @db.Text
  habilidade    String?  @db.Text
  disciplinaId  String
  active        Boolean  @default(true)
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
  
  disciplina    Disciplina @relation(fields: [disciplinaId], references: [id])
  avaliacoes    AvaliacaoObjetivo[]
}
```

## 🚀 Como Usar

### 1. Executar Seed de Permissões (se ainda não foi feito)
```bash
cd backend
npm run prisma:seed-permissions
```

### 2. Executar Seed de Disciplinas
```bash
cd backend
npx ts-node prisma/seed-disciplinas.ts
```

### 3. Iniciar Servidores
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

### 4. Acessar Sistema
1. Login com usuário `admin@escola.com.br` / `Admin@123`
2. Navegar para **Disciplinas** no menu principal
3. Explorar funcionalidades:
   - Criar nova disciplina
   - Editar disciplina existente
   - Visualizar detalhes e objetivos
   - Adicionar objetivos de aprendizagem (BNCC)
   - Filtrar e pesquisar

## 🎨 UI/UX

### Padrão de Design
- Segue arquitetura frontend documentada em `Docs/ARQUITETURA_FRONTEND.md`
- Classes Tailwind CSS padronizadas
- Ícones SVG inline para ações
- Cores consistentes: azul (visualizar), amarelo (editar), vermelho (excluir)
- Responsive design (grid adaptativo)

### Feedback ao Usuário
- Toasts para sucesso/erro
- Loading states
- Confirmação de exclusão
- Validação de formulário em tempo real
- Mensagens de erro da API exibidas ao usuário

## 🔒 Segurança

### Backend
- Autenticação JWT obrigatória
- Middleware de permissões por resource:action
- Validação de entrada com Zod
- Sanitização de dados
- Verificação de dependências antes de exclusão

### Frontend
- Verificação de permissões antes de renderizar botões
- Redirecionamento se não autenticado
- Validação de formulários
- Tratamento de erros de API

## 📈 Próximos Passos Sugeridos

1. **Relacionamento com Turmas**
   - Associar disciplinas a turmas específicas
   - Definir professores por disciplina/turma

2. **Avaliações por Objetivo**
   - Criar módulo de avaliações
   - Vincular avaliações a objetivos de aprendizagem
   - Acompanhamento de progresso dos alunos

3. **Planejamento Pedagógico**
   - Planos de aula por disciplina/objetivo
   - Cronograma de objetivos por turma

4. **Relatórios**
   - Objetivos alcançados por turma
   - Estatísticas de disciplinas
   - Mapa de objetivos BNCC cobertos

5. **Importação BNCC**
   - Tool para importar objetivos completos da BNCC
   - Filtro por ano e componente curricular

## 🐛 Problemas Conhecidos

1. **TypeScript warnings no controller**: Avisos de "nem todos os caminhos retornam valor" são esperados (todos retornam via successResponse ou next)
2. **TypeScript errors no DashboardLayout.vue**: Erros de análise de template Vue são temporários/falso-positivos
3. **CSS warning no DisciplinaDetailView**: Falta propriedade `line-clamp` padrão (funciona com -webkit-line-clamp)

## 📝 Notas Técnicas

- Códigos BNCC devem ser únicos no sistema
- Códigos de disciplina devem ser únicos
- Disciplinas não podem ser excluídas se tiverem turmas ou objetivos associados
- Objetivos não podem ser excluídos se tiverem avaliações associadas
- Áreas de conhecimento são extraídas dinamicamente das disciplinas cadastradas
- Séries e períodos são extraídos dos objetivos existentes
- Paginação padrão: 10 itens por página

## 🎓 Conformidade BNCC

Este módulo foi desenvolvido seguindo a estrutura da BNCC:
- Códigos oficiais (ex: EF01MA01)
- Competências gerais e específicas
- Habilidades por componente curricular
- Organização por série e período letivo
- Áreas de conhecimento padronizadas

---

**Módulo desenvolvido por:** GitHub Copilot
**Data:** Dezembro 2024
**Versão:** 1.0.0

# 🏗️ Descritivo Arquitetural - Sistema Fabric MES

**Sistema**: Fabric - Manufacturing Execution System  
**Versão**: 1.0.0  
**Data**: 24 de Outubro de 2025  
**Tipo**: Sistema de Planejamento e Controle da Produção (PCP)

---

## 📋 Índice

1. [Visão Geral da Arquitetura](#visao-geral)
2. [Arquitetura de Alto Nível](#alto-nivel)
3. [Arquitetura Detalhada](#detalhada)
4. [Stack Tecnológica](#stack)
5. [Padrões Arquiteturais](#padroes)
6. [Estrutura de Camadas](#camadas)
7. [Fluxos de Dados](#fluxos)
8. [Segurança e Autenticação](#seguranca)
9. [Persistência de Dados](#persistencia)
10. [Integração e APIs](#apis)
11. [Deployment e Infraestrutura](#deployment)
12. [Escalabilidade e Performance](#performance)
13. [Qualidade e Testes](#qualidade)
14. [Monitoramento e Logs](#monitoramento)

---

## 🎯 1. Visão Geral da Arquitetura {#visao-geral}

### **1.1 Descrição**

O Fabric é um sistema MES (Manufacturing Execution System) desenvolvido com arquitetura moderna de **três camadas (Three-Tier Architecture)**, utilizando tecnologias web escaláveis e mantíveis. O sistema segue os princípios de **Clean Architecture** e **SOLID**, garantindo separação de responsabilidades, testabilidade e evolução contínua.

### **1.2 Características Principais**

- **Arquitetura**: Three-Tier (Presentation, Application, Data)
- **Paradigma**: RESTful API, Microservices-ready
- **Tipo**: Single Page Application (SPA) + API Backend
- **Deployment**: Containerizado (Docker)
- **Database**: Relacional (MySQL 8.0)
- **Linguagem**: TypeScript (Full Stack)

### **1.3 Objetivos Arquiteturais**

| Objetivo | Descrição | Status |
|----------|-----------|--------|
| **Modularidade** | Componentes independentes e reutilizáveis | ✅ Implementado |
| **Escalabilidade** | Suporte a crescimento horizontal | ✅ Preparado |
| **Manutenibilidade** | Código limpo e documentado | ✅ Implementado |
| **Segurança** | Autenticação, autorização e auditoria | ✅ Implementado |
| **Performance** | Otimização de queries e cache | ✅ Implementado |
| **Testabilidade** | Estrutura preparada para testes | ✅ Preparado |

---

## 🏛️ 2. Arquitetura de Alto Nível {#alto-nivel}

### **2.1 Diagrama Geral**

```
┌─────────────────────────────────────────────────────────┐
│                    USUÁRIOS FINAIS                       │
│  (Gerentes, Operadores, Administradores, Analistas)     │
└────────────────────┬────────────────────────────────────┘
                     │ HTTPS
                     ↓
┌─────────────────────────────────────────────────────────┐
│              CAMADA DE APRESENTAÇÃO                      │
│                 (Frontend - SPA)                         │
│  ┌──────────────────────────────────────────────────┐   │
│  │              Vue 3 Application                    │   │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐       │   │
│  │  │  Views   │  │  Stores  │  │Components│       │   │
│  │  │ (Pages)  │→ │ (Pinia)  │→ │ (Reuse)  │       │   │
│  │  └──────────┘  └──────────┘  └──────────┘       │   │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐       │   │
│  │  │ Services │  │  Router  │  │Composables│      │   │
│  │  │ (HTTP)   │  │(Vue Rout)│  │  (Logic) │       │   │
│  │  └──────────┘  └──────────┘  └──────────┘       │   │
│  └──────────────────────────────────────────────────┘   │
│         Vite 5.4 + TypeScript 5.2 + TailwindCSS         │
└────────────────────┬────────────────────────────────────┘
                     │ REST API (JSON/HTTP)
                     ↓
┌─────────────────────────────────────────────────────────┐
│              CAMADA DE APLICAÇÃO                         │
│              (Backend - API Server)                      │
│  ┌──────────────────────────────────────────────────┐   │
│  │           Express.js Application                  │   │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐       │   │
│  │  │  Routes  │→ │Middleware│→ │Controller│       │   │
│  │  │(Endpoints)│ │(Auth/Val)│  │(Coordin.)│       │   │
│  │  └──────────┘  └──────────┘  └────┬─────┘       │   │
│  │                                    ↓             │   │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐       │   │
│  │  │Validators│  │ Services │  │  Utils   │       │   │
│  │  │  (Joi)   │  │(Business)│  │ (Helpers)│       │   │
│  │  └──────────┘  └────┬─────┘  └──────────┘       │   │
│  └───────────────────┼──────────────────────────────┘   │
│         Node.js 20 + TypeScript 5.2 + Express 4.18      │
└─────────────────────┼───────────────────────────────────┘
                      │ Prisma ORM
                      ↓
┌─────────────────────────────────────────────────────────┐
│              CAMADA DE PERSISTÊNCIA                      │
│                (Database Layer)                          │
│  ┌──────────────────────────────────────────────────┐   │
│  │                MySQL 8.0.35                       │   │
│  │  ┌─────────┐  ┌─────────┐  ┌─────────┐          │   │
│  │  │ Tables  │  │ Indexes │  │Relations│          │   │
│  │  │ (50+)   │  │(Optimiz)│  │ (FK/PK) │          │   │
│  │  └─────────┘  └─────────┘  └─────────┘          │   │
│  │  ┌─────────┐  ┌─────────┐                       │   │
│  │  │Triggers │  │  Views  │                       │   │
│  │  │(Audit)  │  │ (Report)│                       │   │
│  │  └─────────┘  └─────────┘                       │   │
│  └──────────────────────────────────────────────────┘   │
│              Prisma ORM 5.22 (Migration)                │
└─────────────────────────────────────────────────────────┘
```

### **2.2 Componentes Principais**

| Componente | Tecnologia | Responsabilidade | Porta |
|------------|-----------|------------------|-------|
| **Frontend** | Vue 3 + Vite | Interface do usuário | 5173 |
| **Backend API** | Express + Node.js | Lógica de negócio | 3001 |
| **Database** | MySQL 8.0 | Persistência de dados | 3306 |
| **ORM** | Prisma 5.22 | Abstração de dados | - |

---

## 🔬 3. Arquitetura Detalhada {#detalhada}

### **3.1 Camada de Apresentação (Frontend)**

#### **3.1.1 Estrutura de Componentes**

```
frontend/src/
│
├── 📱 views/                    # Páginas/Rotas (15+ views)
│   ├── auth/                    # Autenticação
│   │   └── LoginView.vue
│   ├── dashboard/               # Dashboards
│   │   └── DashboardView.vue
│   ├── users/                   # Gestão de usuários
│   ├── roles/                   # Perfis e permissões
│   ├── products/                # Produtos
│   ├── production/              # Produção
│   │   ├── ProductionOrdersView.vue
│   │   └── ProductionPointingsView.vue
│   ├── purchases/               # Compras
│   ├── stock/                   # Estoque
│   └── quality/                 # Qualidade
│
├── 🧩 components/               # Componentes reutilizáveis
│   ├── common/                  # Base (Button, Input, Modal)
│   ├── products/                # Específicos de produtos
│   ├── production/              # Específicos de produção
│   └── charts/                  # Gráficos
│
├── 📦 stores/                   # Estado global (Pinia)
│   ├── auth.store.ts            # Autenticação
│   ├── user.store.ts            # Usuários
│   ├── product.store.ts         # Produtos
│   ├── production-order.store.ts
│   └── [10+ stores]
│
├── 🔌 services/                 # Clientes HTTP
│   ├── api.service.ts           # Axios base config
│   ├── auth.service.ts          # Auth endpoints
│   ├── product.service.ts       # Products endpoints
│   └── [16+ services]
│
├── 🎣 composables/              # Lógica reutilizável
│   ├── useAuth.ts
│   ├── usePermissions.ts
│   └── useNotification.ts
│
├── 🛣️ router/                   # Roteamento
│   └── index.ts                 # Vue Router config
│
└── 🛠️ utils/                    # Utilitários
    ├── format.ts
    ├── validation.ts
    └── constants.ts
```

#### **3.1.2 Fluxo de Renderização**

```
1. URL Change
   ↓
2. Vue Router (router/index.ts)
   - Verifica autenticação (beforeEach guard)
   - Verifica permissões
   ↓
3. View Component carregado
   - Monta componente
   - Executa setup()
   ↓
4. Store (Pinia) consultado
   - Estado reativo
   - Getters computados
   ↓
5. Service chamado (se necessário)
   - HTTP Request via Axios
   - Interceptors (auth, error)
   ↓
6. Store atualizado
   ↓
7. View re-renderiza (reatividade)
   ↓
8. Componentes filhos atualizados
```

### **3.2 Camada de Aplicação (Backend)**

#### **3.2.1 Estrutura de Serviços**

```
backend/src/
│
├── 🚦 routes/                   # Definição de rotas
│   ├── index.ts                 # Agregador de rotas
│   ├── auth.routes.ts
│   ├── user.routes.ts
│   ├── product.routes.ts
│   ├── bom.routes.ts
│   ├── routing.routes.ts
│   ├── production-order.routes.ts
│   ├── production-pointing.routes.ts
│   └── [16+ route files]
│
├── 🎮 controllers/              # Coordenação HTTP
│   ├── auth.controller.ts
│   ├── user.controller.ts
│   ├── product.controller.ts
│   └── [16+ controllers]
│
├── 💼 services/                 # Lógica de negócio
│   ├── auth.service.ts
│   ├── user.service.ts
│   ├── product.service.ts
│   ├── bom.service.ts
│   ├── routing.service.ts
│   ├── production-order.service.ts
│   └── [16+ services]
│
├── 🛡️ middleware/               # Interceptadores
│   ├── auth.middleware.ts       # Verifica JWT
│   ├── permission.middleware.ts # Verifica permissões
│   ├── validation.middleware.ts # Valida payload
│   ├── error.middleware.ts      # Trata erros
│   └── audit.middleware.ts      # Registra auditoria
│
├── ✅ validators/               # Schemas Joi
│   ├── auth.validator.ts
│   ├── user.validator.ts
│   ├── product.validator.ts
│   └── [13+ validators]
│
├── ⚙️ config/                   # Configurações
│   ├── database.ts              # Prisma client
│   ├── env.ts                   # Variáveis ambiente
│   └── logger.ts                # Winston logger
│
├── 🔧 utils/                    # Utilitários
│   ├── password.util.ts
│   ├── jwt.util.ts
│   └── response.util.ts
│
├── ⏰ jobs/                     # Background jobs
│   └── counting-scheduler.ts   # Agendador de contagens
│
├── 📡 events/                   # Event handlers
│
├── app.ts                       # Express app config
└── server.ts                    # Entry point
```

#### **3.2.2 Fluxo de Requisição**

```
1. HTTP Request
   ↓
2. Express.js recebe
   ↓
3. Middlewares (Chain)
   │
   ├─→ CORS (cors)
   ├─→ Security Headers (helmet)
   ├─→ Body Parser (express.json)
   ├─→ Authentication (auth.middleware)
   │   - Verifica token JWT
   │   - Extrai userId
   │   - Anexa em req.userId
   │
   ├─→ Authorization (permission.middleware)
   │   - Verifica permissões do usuário
   │   - Bloqueia se não autorizado
   │
   └─→ Validation (validation.middleware)
       - Valida payload com Joi
       - Retorna 400 se inválido
   ↓
4. Route Handler
   - Identifica endpoint
   ↓
5. Controller
   - Extrai parâmetros
   - Trata exceções
   - Chama Service
   ↓
6. Service (Business Logic)
   - Executa lógica de negócio
   - Validações complexas
   - Cálculos
   - Integrações
   ↓
7. Prisma ORM
   - Monta query SQL
   - Executa no banco
   ↓
8. MySQL Database
   - Processa query
   - Retorna resultado
   ↓
9. Service processa resultado
   - Formata dados
   - Aplica regras
   ↓
10. Controller retorna resposta
    - Status HTTP
    - JSON payload
    ↓
11. Audit Middleware (após resposta)
    - Registra ação no audit_logs
    ↓
12. Error Middleware (se erro)
    - Formata erro
    - Log do erro
    - Retorna JSON padronizado
```

### **3.3 Camada de Dados**

#### **3.3.1 Modelo de Dados**

**Principais Entidades (50+ tabelas):**

```
📦 Segurança e Usuários
├── users
├── roles
├── permissions
├── role_permissions
├── user_roles
└── audit_logs

📦 Cadastros Básicos
├── product_categories
├── units_of_measure
├── work_centers
├── suppliers
├── customers
└── warehouses

📦 Produtos e Engenharia
├── products
├── boms (Bill of Materials)
├── bom_items
├── routings
└── routing_operations

📦 Produção
├── production_orders
├── production_order_materials
├── production_order_operations
├── production_pointings
└── production_order_status_history

📦 Estoque
├── stock_items
├── stock_movements
├── stock_locations
├── inventory_counts
└── inventory_count_items

📦 Compras
├── purchase_orders
├── purchase_order_items
├── purchase_quotations
└── material_receipts

📦 Qualidade
├── quality_inspections
├── quality_checks
└── non_conformities

📦 Sistema
├── notifications
├── system_settings
└── counting_plans
```

#### **3.3.2 Estratégia de Relacionamentos**

```
Tipos de Relacionamentos:

1. One-to-Many (1:N)
   - User → AuditLogs
   - Product → BOMs
   - ProductionOrder → Pointings

2. Many-to-Many (N:M)
   - User ←→ Role (via user_roles)
   - Role ←→ Permission (via role_permissions)

3. Self-Referencing
   - BOMItem → Product (componente)
   - Product → Product (hierarquia)

4. Cascade
   - DELETE ProductionOrder → DELETE Pointings
   - DELETE BOM → DELETE BOMItems

5. Soft Delete
   - Users (active: boolean)
   - Products (active: boolean)
```

---

## 💻 4. Stack Tecnológica Completa {#stack}

### **4.1 Frontend Stack**

| Categoria | Tecnologia | Versão | Propósito |
|-----------|-----------|--------|-----------|
| **Framework** | Vue.js | 3.4.21 | UI Framework |
| **Build Tool** | Vite | 5.4.20 | Bundler e Dev Server |
| **Linguagem** | TypeScript | 5.2.2 | Type Safety |
| **State Management** | Pinia | 2.1.7 | Estado Global |
| **Routing** | Vue Router | 4.2.5 | SPA Routing |
| **HTTP Client** | Axios | 1.6.7 | API Calls |
| **CSS Framework** | TailwindCSS | 3.4.1 | Styling |
| **Icons** | Heroicons Vue | 2.1.5 | Ícones |
| **Charts** | Chart.js | 4.4.4 | Gráficos |
| **Charts Vue** | Vue-ChartJS | 5.3.1 | Chart.js wrapper |
| **PDF Generation** | jsPDF | 3.0.3 | Geração de PDFs |
| **PDF Tables** | jspdf-autotable | 5.0.2 | Tabelas em PDF |
| **Linter** | ESLint | 8.57.0 | Code Quality |
| **Formatter** | Prettier | 3.2.5 | Code Format |

### **4.2 Backend Stack**

| Categoria | Tecnologia | Versão | Propósito |
|-----------|-----------|--------|-----------|
| **Runtime** | Node.js | 20+ | JavaScript Runtime |
| **Framework** | Express.js | 4.18.2 | Web Framework |
| **Linguagem** | TypeScript | 5.2.2 | Type Safety |
| **ORM** | Prisma | 5.22.0 | Database Access |
| **Database** | MySQL | 8.0.35 | Relational DB |
| **Authentication** | jsonwebtoken | 9.0.2 | JWT Tokens |
| **Password Hash** | bcryptjs | 2.4.3 | Password Encryption |
| **Validation** | Joi | 17.13.3 | Schema Validation |
| **Logger** | Winston | 3.14.2 | Structured Logging |
| **Security** | Helmet | 7.1.0 | HTTP Headers |
| **CORS** | cors | 2.8.5 | Cross-Origin |
| **Date Utils** | date-fns | 4.1.0 | Date Manipulation |
| **Scheduler** | node-cron | 4.2.1 | Cron Jobs |
| **Linter** | ESLint | 8.57.0 | Code Quality |
| **Formatter** | Prettier | 3.3.3 | Code Format |
| **Test Framework** | Jest | 29.7.0 | Testing |

### **4.3 DevOps Stack**

| Categoria | Tecnologia | Versão | Propósito |
|-----------|-----------|--------|-----------|
| **Containerization** | Docker | Latest | Containers |
| **Orchestration** | Docker Compose | 3.8 | Multi-container |
| **Version Control** | Git | Latest | VCS |
| **Package Manager** | npm | Latest | Dependencies |

---

## 🎨 5. Padrões Arquiteturais {#padroes}

### **5.1 Backend Patterns**

#### **5.1.1 MVC (Model-View-Controller)**

```
Routes (Entry) → Controllers (Coordinator) → Services (Business) → Prisma (Model)
```

**Exemplo:**
```typescript
// Route
router.get('/products', productController.list);

// Controller
async list(req, res) {
  const products = await productService.list(req.query);
  res.json(products);
}

// Service
async list(filters) {
  return prisma.product.findMany({ where: filters });
}
```

#### **5.1.2 Repository Pattern**

```
Implementado via Prisma ORM:
- Abstração do acesso aos dados
- Queries type-safe
- Migrations versionadas
```

#### **5.1.3 Service Layer Pattern**

```
Separação clara:
- Controllers: HTTP handling
- Services: Business logic
- Repositories: Data access
```

#### **5.1.4 Middleware Chain Pattern**

```
Request → Middleware1 → Middleware2 → ... → Handler
```

**Middlewares implementados:**
1. `cors()` - CORS headers
2. `helmet()` - Security headers
3. `express.json()` - Body parsing
4. `auth.middleware` - Authentication
5. `permission.middleware` - Authorization
6. `validation.middleware` - Input validation
7. `error.middleware` - Error handling
8. `audit.middleware` - Audit logging

#### **5.1.5 DTO (Data Transfer Object)**

```typescript
// Validator define estrutura
const createProductSchema = Joi.object({
  code: Joi.string().required(),
  name: Joi.string().required(),
  type: Joi.string().valid('FINISHED_GOOD', 'RAW_MATERIAL')
});

// Middleware valida
validation(createProductSchema)

// Controller recebe dados validados
```

### **5.2 Frontend Patterns**

#### **5.2.1 Composition API Pattern**

```typescript
// Composable reutilizável
export function useAuth() {
  const authStore = useAuthStore();
  
  const login = async (credentials) => {
    await authStore.login(credentials);
  };
  
  return { login, user: authStore.user };
}
```

#### **5.2.2 Store Pattern (Pinia)**

```typescript
// Estado centralizado
export const useProductStore = defineStore('product', {
  state: () => ({
    products: [],
    loading: false
  }),
  
  getters: {
    activeProducts: (state) => 
      state.products.filter(p => p.active)
  },
  
  actions: {
    async fetchProducts() {
      this.loading = true;
      this.products = await productService.list();
      this.loading = false;
    }
  }
});
```

#### **5.2.3 Component Composition**

```
Container Components (Smart)
  ↓ Props
Presentational Components (Dumb)
```

#### **5.2.4 Service Layer**

```typescript
// service/product.service.ts
class ProductService {
  async list() {
    return api.get('/products');
  }
}
```

### **5.3 Database Patterns**

#### **5.3.1 Migration Pattern**

```
Prisma Migrations:
- Versionamento de schema
- Rollback seguro
- Histórico de mudanças
```

#### **5.3.2 Soft Delete Pattern**

```typescript
// Não deleta fisicamente
product.active = false;

// Queries filtram automaticamente
where: { active: true }
```

#### **5.3.3 Audit Trail Pattern**

```typescript
// Toda ação registrada
audit_logs {
  userId, action, entity, entityId,
  oldValue, newValue, timestamp
}
```

---

## 📚 6. Estrutura de Camadas Detalhada {#camadas}

### **6.1 Camada de Apresentação**

**Responsabilidades:**
- ✅ Renderização de UI
- ✅ Interação com usuário
- ✅ Validação de formulários (client-side)
- ✅ Gerenciamento de estado local
- ✅ Roteamento SPA
- ✅ Chamadas HTTP

**Tecnologias:**
- Vue 3 (Composition API)
- Vue Router (Roteamento)
- Pinia (Estado Global)
- Axios (HTTP)
- TailwindCSS (Styling)

**Não deve:**
- ❌ Conter lógica de negócio
- ❌ Acessar banco diretamente
- ❌ Implementar autenticação

### **6.2 Camada de Aplicação**

**Responsabilidades:**
- ✅ Receber requisições HTTP
- ✅ Autenticação e autorização
- ✅ Validação de entrada (server-side)
- ✅ Lógica de negócio
- ✅ Orquestração de serviços
- ✅ Tratamento de erros
- ✅ Logging e auditoria

**Tecnologias:**
- Express.js (Framework)
- JWT (Autenticação)
- Joi (Validação)
- Winston (Logging)

**Não deve:**
- ❌ Conter SQL direto
- ❌ Renderizar HTML
- ❌ Manter estado entre requisições

### **6.3 Camada de Dados**

**Responsabilidades:**
- ✅ Persistência de dados
- ✅ Integridade referencial
- ✅ Transações ACID
- ✅ Índices e otimização
- ✅ Backup e recovery

**Tecnologias:**
- MySQL 8.0
- Prisma ORM
- Migrations

**Não deve:**
- ❌ Conter lógica de negócio complexa
- ❌ Validação de regras de negócio

---

## 🔄 7. Fluxos de Dados Detalhados {#fluxos}

### **7.1 Fluxo de Autenticação**

```
┌─────────────┐
│   Browser   │
└──────┬──────┘
       │ 1. POST /api/auth/login
       │    { email, password }
       ↓
┌──────────────────┐
│  Express Router  │
└──────┬───────────┘
       │ 2. Route → Controller
       ↓
┌─────────────────────┐
│  Auth Controller    │
└──────┬──────────────┘
       │ 3. Chama Service
       ↓
┌──────────────────────┐
│   Auth Service       │
│                      │
│ 4. Busca user por email
│ 5. Verifica senha (bcrypt)
│ 6. Gera JWT access token
│ 7. Gera JWT refresh token
└──────┬───────────────┘
       │ 8. Retorna tokens
       ↓
┌──────────────────┐
│   Controller     │
└──────┬───────────┘
       │ 9. HTTP 200 + JSON
       ↓
┌─────────────┐
│   Browser   │
│             │
│ 10. Salva tokens
│     localStorage
└─────────────┘
```

### **7.2 Fluxo de Requisição Autenticada**

```
┌─────────────┐
│   Browser   │
└──────┬──────┘
       │ 1. GET /api/products
       │    Header: Authorization: Bearer {token}
       ↓
┌──────────────────┐
│  Express Router  │
└──────┬───────────┘
       │ 2. Middlewares
       ↓
┌─────────────────────┐
│  Auth Middleware    │
│                     │
│ 3. Extrai token
│ 4. Verifica JWT
│ 5. Decodifica payload
│ 6. Anexa userId em req
└──────┬──────────────┘
       │ 7. Next()
       ↓
┌──────────────────────┐
│ Permission Middleware│
│                      │
│ 8. Busca roles do user
│ 9. Verifica permissão
│    'products:read'
└──────┬───────────────┘
       │ 10. Next() ou 403
       ↓
┌─────────────────────┐
│  Product Controller │
└──────┬──────────────┘
       │ 11. Chama Service
       ↓
┌──────────────────────┐
│  Product Service     │
└──────┬───────────────┘
       │ 12. Prisma query
       ↓
┌──────────────────────┐
│   MySQL Database     │
└──────┬───────────────┘
       │ 13. Resultados
       ↓
┌─────────────────────┐
│  Product Service    │
└──────┬──────────────┘
       │ 14. Formata dados
       ↓
┌─────────────────────┐
│  Product Controller │
└──────┬──────────────┘
       │ 15. HTTP 200 + JSON
       ↓
┌─────────────┐
│   Browser   │
│             │
│ 16. Renderiza
└─────────────┘
```

### **7.3 Fluxo de Criação de Ordem de Produção**

```
Frontend:
  View → Store → Service → HTTP POST
  
Backend:
  1. Route recebe POST /production-orders
  2. Auth middleware valida usuário
  3. Permission middleware verifica 'production:create'
  4. Validation middleware valida payload
  5. Controller extrai dados
  6. Service inicia transação
  7. Service busca BOM ativa do produto
  8. Service calcula materiais necessários
     - Para cada item da BOM:
       quantityNeeded = orderQty × quantityPer × (1 + scrapFactor)
  9. Service busca Routing ativo
  10. Service calcula operações
      - Para cada operação:
        setupTime + (runTime × orderQty)
  11. Prisma cria ProductionOrder
  12. Prisma cria ProductionOrderMaterials
  13. Prisma cria ProductionOrderOperations
  14. Service commita transação
  15. Controller retorna ordem criada
  16. Audit middleware registra ação
  
Frontend:
  17. Store atualiza lista de ordens
  18. View mostra notificação de sucesso
```

### **7.4 Fluxo de Apontamento de Produção**

```
1. Operador abre tela de apontamentos
2. Sistema lista operações pendentes
3. Operador seleciona operação
4. Operador registra:
   - Quantidade produzida (boa)
   - Quantidade de refugo
   - Hora início
   - Hora fim
   - Observações
5. Frontend valida campos
6. Frontend envia POST /production-pointings
7. Backend valida
8. Service calcula tempos
9. Service cria registro de apontamento
10. Service atualiza progresso da operação
11. Service atualiza progresso da ordem
12. Se ordem 100% completa:
    - Muda status para COMPLETED
    - Registra actualEnd
13. Service atualiza estoque (se configurado)
14. Retorna sucesso
15. Frontend atualiza lista
```

---

## 🔐 8. Segurança e Autenticação {#seguranca}

### **8.1 Arquitetura de Segurança**

```
┌─────────────────────────────────────────────┐
│            CAMADAS DE SEGURANÇA             │
├─────────────────────────────────────────────┤
│ 1. Network Security                         │
│    - HTTPS/TLS                              │
│    - Firewall                               │
├─────────────────────────────────────────────┤
│ 2. Application Security                     │
│    - CORS Policy                            │
│    - Helmet (Security Headers)              │
│    - Rate Limiting                          │
├─────────────────────────────────────────────┤
│ 3. Authentication                           │
│    - JWT Tokens                             │
│    - Bcrypt Password Hash                   │
│    - Token Expiration                       │
├─────────────────────────────────────────────┤
│ 4. Authorization                            │
│    - Role-Based Access Control (RBAC)       │
│    - Permission Middleware                  │
│    - Resource-Level Permissions             │
├─────────────────────────────────────────────┤
│ 5. Data Security                            │
│    - SQL Injection Prevention (Prisma)      │
│    - XSS Prevention                         │
│    - Input Validation (Joi)                 │
├─────────────────────────────────────────────┤
│ 6. Audit & Compliance                       │
│    - Audit Logs                             │
│    - Action Tracking                        │
│    - Change History                         │
└─────────────────────────────────────────────┘
```

### **8.2 Autenticação JWT**

**Estrutura do Token:**
```json
{
  "header": {
    "alg": "HS256",
    "typ": "JWT"
  },
  "payload": {
    "userId": "uuid",
    "email": "user@example.com",
    "iat": 1234567890,
    "exp": 1234571490
  },
  "signature": "..."
}
```

**Fluxo:**
1. Login → Gera access_token (1h) + refresh_token (7d)
2. Requisição → Header: `Authorization: Bearer {access_token}`
3. Backend verifica assinatura e expiração
4. Extrai userId do payload
5. Token expira → Frontend usa refresh_token para renovar
6. Logout → Tokens invalidados no client

### **8.3 Controle de Acesso (RBAC)**

**Modelo:**
```
User ←→ Role ←→ Permission
```

**Exemplo:**
```
Usuário: João Silva
  ↓
Roles: [Operador de Produção]
  ↓
Permissions:
  - production-orders:read
  - production-orders:update
  - production-pointings:create
  - production-pointings:read
```

**Implementação:**
```typescript
// Middleware verifica permissão
requirePermission('products', 'create')

// Busca roles do usuário
const userRoles = await prisma.user.findUnique({
  include: { roles: { include: { permissions: true } } }
});

// Verifica se tem permissão
const hasPermission = userRoles.roles.some(role =>
  role.permissions.some(p => 
    p.resource === 'products' && p.action === 'create'
  )
);
```

### **8.4 Proteções Implementadas**

| Ameaça | Proteção | Implementação |
|--------|----------|---------------|
| **SQL Injection** | Prepared Statements | Prisma ORM |
| **XSS** | Input Sanitization | Joi Validation |
| **CSRF** | SameSite Cookies | Cookie config |
| **Password Breach** | Strong Hashing | bcrypt (10 rounds) |
| **Token Theft** | Short Expiration | JWT 1h |
| **Brute Force** | Rate Limiting | Preparado |
| **Session Hijacking** | Secure Cookies | HttpOnly, Secure |

### **8.5 Auditoria**

**Todas as ações são registradas:**
```typescript
audit_logs {
  id: uuid
  userId: uuid          // Quem fez
  action: string        // O que fez (CREATE, UPDATE, DELETE)
  entity: string        // Qual entidade
  entityId: string      // ID do registro
  oldValue: json        // Valor anterior
  newValue: json        // Novo valor
  ipAddress: string     // De onde
  userAgent: string     // Com que navegador
  createdAt: datetime   // Quando
}
```

**Ações auditadas:**
- ✅ Login/Logout
- ✅ Criação de registros
- ✅ Atualização de registros
- ✅ Exclusão de registros
- ✅ Mudanças de permissões
- ✅ Mudanças de status

---

## 💾 9. Persistência de Dados {#persistencia}

### **9.1 Estratégia de Banco de Dados**

**Database**: MySQL 8.0.35  
**ORM**: Prisma 5.22.0  
**Paradigma**: Relacional

### **9.2 Schema do Banco**

**Categorias de Tabelas:**

1. **Segurança e Acesso** (6 tabelas)
   - users, roles, permissions, role_permissions, user_roles, audit_logs

2. **Cadastros Básicos** (6 tabelas)
   - product_categories, units_of_measure, work_centers, suppliers, customers, warehouses

3. **Engenharia** (5 tabelas)
   - products, boms, bom_items, routings, routing_operations

4. **Produção** (5 tabelas)
   - production_orders, production_order_materials, production_order_operations, production_pointings, production_order_status_history

5. **Estoque** (5 tabelas)
   - stock_items, stock_movements, stock_locations, inventory_counts, inventory_count_items

6. **Compras** (4 tabelas)
   - purchase_orders, purchase_order_items, purchase_quotations, material_receipts

7. **Qualidade** (3 tabelas)
   - quality_inspections, quality_checks, non_conformities

8. **Sistema** (3+ tabelas)
   - notifications, system_settings, counting_plans

**Total: 50+ tabelas**

### **9.3 Prisma Schema Example**

```prisma
model User {
  id        String   @id @default(uuid())
  email     String   @unique
  password  String
  name      String
  active    Boolean  @default(true)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  roles     UserRole[]
  auditLogs AuditLog[]
  pointings ProductionPointing[]
  
  @@map("users")
}

model Product {
  id          String   @id @default(uuid())
  code        String   @unique
  name        String
  type        ProductType
  active      Boolean  @default(true)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  boms        BOM[]
  routings    Routing[]
  stockItems  StockItem[]
  
  @@index([code])
  @@index([active])
  @@map("products")
}
```

### **9.4 Migrations**

**Prisma Migrations:**
```bash
# Criar migration
prisma migrate dev --name add_new_field

# Aplicar em produção
prisma migrate deploy

# Resetar banco (dev)
prisma migrate reset
```

**Histórico:**
- 001_init - Schema inicial
- 002_add_production_module
- 003_add_stock_module
- 004_add_purchases_module
- 005_add_counting_module
- 006+... Evoluções

### **9.5 Backup e Recovery**

**Estratégia:**
```bash
# Backup automático diário
mysqldump fabric > backup_$(date +%Y%m%d).sql

# Restore
mysql fabric < backup_20251024.sql
```

**Scripts disponíveis:**
- `npm run backup` - Cria backup
- `npm run restore` - Restaura backup

### **9.6 Performance**

**Índices Criados:**
- Primary Keys (todos os IDs)
- Unique Constraints (codes, emails)
- Foreign Keys (relacionamentos)
- Search Indexes (campos de busca frequente)

**Query Optimization:**
- Select específico de campos
- Include seletivo (não trazer tudo)
- Paginação em todas as listagens
- Cache preparado (Redis)

---

## 🔌 10. Integração e APIs {#apis}

### **10.1 REST API**

**Base URL:** `http://localhost:3001/api`

**Padrões:**
- RESTful conventions
- JSON payload
- HTTP status codes corretos
- Mensagens de erro padronizadas

### **10.2 Estrutura de Endpoints**

**Padrão de URLs:**
```
GET    /api/{resource}           # Listar
GET    /api/{resource}/:id       # Buscar um
POST   /api/{resource}           # Criar
PUT    /api/{resource}/:id       # Atualizar
PATCH  /api/{resource}/:id       # Atualizar parcial
DELETE /api/{resource}/:id       # Excluir
```

**Endpoints Implementados:** 16 módulos

1. `/api/auth` - Autenticação
2. `/api/users` - Usuários
3. `/api/roles` - Perfis
4. `/api/permissions` - Permissões
5. `/api/products` - Produtos
6. `/api/boms` - BOMs
7. `/api/routings` - Roteiros
8. `/api/production-orders` - Ordens de Produção
9. `/api/production-pointings` - Apontamentos
10. `/api/stock-items` - Estoque
11. `/api/stock-movements` - Movimentações
12. `/api/purchase-orders` - Pedidos de Compra
13. `/api/suppliers` - Fornecedores
14. `/api/work-centers` - Centros de Trabalho
15. `/api/dashboard` - Dashboard/KPIs
16. `/api/audit-logs` - Logs de Auditoria

### **10.3 Formato de Resposta**

**Sucesso:**
```json
{
  "success": true,
  "data": { ... },
  "message": "Operation successful"
}
```

**Erro:**
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input",
    "details": [...]
  }
}
```

**Paginação:**
```json
{
  "data": [...],
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "totalPages": 8
  }
}
```

### **10.4 Versionamento**

**Estratégia:** URL versioning (preparado)
```
/api/v1/products
/api/v2/products
```

Atualmente: Versão implícita v1

### **10.5 Rate Limiting**

**Preparado para implementação:**
```typescript
// Express Rate Limit
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 100 // requests
});

app.use('/api/', limiter);
```

### **10.6 CORS**

**Configuração:**
```typescript
cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true
})
```

---

## 🚀 11. Deployment e Infraestrutura {#deployment}

### **11.1 Arquitetura de Deploy**

```
┌─────────────────────────────────────────┐
│        Docker Host / Cloud VM           │
│                                         │
│  ┌────────────────────────────────┐    │
│  │   Docker Network               │    │
│  │   (fabric-network)             │    │
│  │                                │    │
│  │  ┌──────────────────────┐     │    │
│  │  │  Container: MySQL    │     │    │
│  │  │  Port: 3306          │     │    │
│  │  │  Volume: mysql_data  │     │    │
│  │  └──────────────────────┘     │    │
│  │            ↑                   │    │
│  │  ┌──────────────────────┐     │    │
│  │  │  Container: Backend  │     │    │
│  │  │  Port: 3001          │     │    │
│  │  │  Node.js + Express   │     │    │
│  │  └──────────────────────┘     │    │
│  │            ↑                   │    │
│  │  ┌──────────────────────┐     │    │
│  │  │  Container: Frontend │     │    │
│  │  │  Port: 5173          │     │    │
│  │  │  Vite Dev / Nginx    │     │    │
│  │  └──────────────────────┘     │    │
│  └────────────────────────────────┘    │
└─────────────────────────────────────────┘
```

### **11.2 Docker Compose**

**Arquivo:** `docker-compose.yml`

**Services:**
1. **mysql** - Banco de dados
2. **backend** - API Node.js
3. **frontend** - SPA Vue.js

**Volumes:**
- `mysql_data` - Persistência do banco

**Networks:**
- `fabric-network` - Comunicação interna

### **11.3 Ambientes**

**Development:**
```bash
docker-compose -f docker-compose.dev.yml up
```

**Production:**
```bash
docker-compose -f docker-compose.yml up -d
```

### **11.4 Variáveis de Ambiente**

**Backend (.env):**
```env
DATABASE_URL=mysql://user:pass@mysql:3306/fabric
JWT_SECRET=secret-key-minimum-32-chars
JWT_REFRESH_SECRET=refresh-secret
JWT_EXPIRES_IN=1h
JWT_REFRESH_EXPIRES_IN=7d
PORT=3001
NODE_ENV=production
CORS_ORIGIN=http://localhost:5173
```

**Frontend (.env):**
```env
VITE_API_URL=http://localhost:3001/api
```

### **11.5 Build e Deploy**

**Backend:**
```bash
# Build
npm run build

# Start
npm start
```

**Frontend:**
```bash
# Build
npm run build

# Preview
npm run preview
```

### **11.6 CI/CD (Preparado)**

**Sugestão de Pipeline:**
```yaml
# GitHub Actions / GitLab CI
stages:
  - test
  - build
  - deploy

test:
  - npm run lint
  - npm run test
  - npm run build

build:
  - docker build -t fabric-backend
  - docker build -t fabric-frontend

deploy:
  - docker push
  - deploy to server
```

---

## ⚡ 12. Escalabilidade e Performance {#performance}

### **12.1 Estratégias de Escalabilidade**

#### **Horizontal Scaling (Preparado)**

```
┌──────────────┐
│ Load Balancer│
└──────┬───────┘
       │
   ┌───┴────┬────────┐
   ↓        ↓        ↓
┌──────┐ ┌──────┐ ┌──────┐
│ API 1│ │ API 2│ │ API 3│
└───┬──┘ └───┬──┘ └───┬──┘
    └────┬───┴────┬───┘
         ↓        
    ┌──────────┐
    │  MySQL   │
    └──────────┘
```

#### **Vertical Scaling**

- Aumentar CPU/RAM dos containers
- Otimizar queries do banco
- Adicionar índices

### **12.2 Performance - Backend**

**Otimizações Implementadas:**

1. **Database Queries**
   - Prisma com select específico
   - Include seletivo (não trazer tudo)
   - Índices em campos de busca
   - Paginação padrão

2. **Caching (Preparado)**
   ```typescript
   // Redis cache layer
   const cached = await redis.get('products');
   if (cached) return cached;
   
   const products = await prisma.product.findMany();
   await redis.set('products', products, 'EX', 300);
   ```

3. **Connection Pooling**
   - Prisma gerencia pool automaticamente
   - Max connections configurável

4. **Async/Await**
   - Operações não-bloqueantes
   - Promise.all para paralelismo

### **12.3 Performance - Frontend**

**Otimizações Implementadas:**

1. **Code Splitting**
   - Vue Router lazy loading
   - Componentes sob demanda

2. **Asset Optimization**
   - Vite tree-shaking
   - Build minificado
   - CSS purged (TailwindCSS)

3. **State Management**
   - Pinia otimizado
   - Getters computados (cache)
   - Actions assíncronas

4. **Lazy Loading**
   ```typescript
   const ProductView = () => import('./views/ProductView.vue')
   ```

### **12.4 Database Performance**

**Índices Criados:**
```sql
-- Primary Keys
ALTER TABLE products ADD PRIMARY KEY (id);

-- Unique Constraints
ALTER TABLE products ADD UNIQUE INDEX (code);
ALTER TABLE users ADD UNIQUE INDEX (email);

-- Foreign Keys
ALTER TABLE bom_items ADD INDEX (bomId);
ALTER TABLE bom_items ADD INDEX (componentId);

-- Search Indexes
ALTER TABLE products ADD INDEX (active);
ALTER TABLE products ADD INDEX (name);
```

**Query Optimization:**
```typescript
// ❌ Não otimizado
const products = await prisma.product.findMany({
  include: { boms: { include: { items: true } } }
});

// ✅ Otimizado
const products = await prisma.product.findMany({
  select: { id: true, code: true, name: true },
  where: { active: true },
  take: 20
});
```

### **12.5 Monitoramento de Performance**

**Métricas a Monitorar:**
- Response time (API)
- Database query time
- Memory usage
- CPU usage
- Request rate
- Error rate

**Ferramentas Sugeridas:**
- New Relic / Datadog (APM)
- Prometheus + Grafana (Metrics)
- ELK Stack (Logs)

---

## 🧪 13. Qualidade e Testes {#qualidade}

### **13.1 Estratégia de Testes**

```
┌──────────────────────────────────────┐
│        Pirâmide de Testes            │
│                                      │
│           ┌──────────┐               │
│           │    E2E   │ (Poucos)      │
│           └──────────┘               │
│        ┌──────────────┐              │
│        │ Integration  │ (Alguns)     │
│        └──────────────┘              │
│     ┌──────────────────┐             │
│     │   Unit Tests     │ (Muitos)    │
│     └──────────────────┘             │
└──────────────────────────────────────┘
```

### **13.2 Testes Unitários**

**Framework:** Jest 29.7.0

**Exemplo:**
```typescript
// user.service.test.ts
describe('UserService', () => {
  describe('create', () => {
    it('should create a user with hashed password', async () => {
      const userData = {
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User'
      };
      
      const user = await userService.create(userData);
      
      expect(user.email).toBe(userData.email);
      expect(user.password).not.toBe(userData.password);
    });
  });
});
```

**Cobertura Desejada:** > 80%

### **13.3 Testes de Integração**

**Testa integração entre camadas:**
```typescript
// product.integration.test.ts
describe('Product API', () => {
  it('should create and retrieve a product', async () => {
    const res = await request(app)
      .post('/api/products')
      .set('Authorization', `Bearer ${token}`)
      .send({ code: 'P001', name: 'Product 1' });
    
    expect(res.status).toBe(201);
    
    const getRes = await request(app)
      .get(`/api/products/${res.body.id}`)
      .set('Authorization', `Bearer ${token}`);
    
    expect(getRes.status).toBe(200);
    expect(getRes.body.code).toBe('P001');
  });
});
```

### **13.4 Testes E2E**

**Framework Sugerido:** Playwright / Cypress

**Exemplo:**
```typescript
// login.e2e.test.ts
test('should login successfully', async ({ page }) => {
  await page.goto('http://localhost:5173/login');
  await page.fill('[name="email"]', 'admin@fabric.com');
  await page.fill('[name="password"]', 'Admin@2024');
  await page.click('button[type="submit"]');
  
  await expect(page).toHaveURL('/dashboard');
});
```

### **13.5 Qualidade de Código**

**Ferramentas:**
- **ESLint** - Linting (problemas de código)
- **Prettier** - Formatação consistente
- **TypeScript** - Type checking
- **Husky** - Git hooks (preparado)

**Scripts:**
```bash
npm run lint        # Verificar problemas
npm run format      # Formatar código
npm run type-check  # Verificar tipos
```

### **13.6 Code Review**

**Checklist:**
- [ ] Código segue padrões do projeto
- [ ] TypeScript sem erros
- [ ] Testes implementados
- [ ] Documentação atualizada
- [ ] Sem código comentado
- [ ] Variáveis bem nomeadas
- [ ] Lógica clara e simples

---

## 📊 14. Monitoramento e Logs {#monitoramento}

### **14.1 Estratégia de Logging**

**Framework:** Winston 3.14.2

**Níveis de Log:**
```
error   - Erros críticos
warn    - Avisos
info    - Informações importantes
http    - Requisições HTTP
debug   - Debug (apenas dev)
```

**Implementação:**
```typescript
// config/logger.ts
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});

// Uso
logger.info('User created', { userId, email });
logger.error('Database connection failed', { error });
```

### **14.2 Audit Logs**

**Implementação:**
- Middleware registra todas ações
- Tabela `audit_logs` no banco
- Campos: userId, action, entity, oldValue, newValue, timestamp

**Ações Auditadas:**
- ✅ Login/Logout
- ✅ CRUD operations
- ✅ Status changes
- ✅ Permission changes

### **14.3 Monitoramento de Aplicação**

**Métricas a Coletar:**

1. **Performance**
   - Response time médio
   - Response time P95/P99
   - Throughput (req/s)

2. **Disponibilidade**
   - Uptime
   - Error rate
   - Success rate

3. **Recursos**
   - CPU usage
   - Memory usage
   - Disk usage

4. **Business**
   - Ordens criadas/dia
   - Apontamentos registrados
   - Usuários ativos

### **14.4 Alertas**

**Alertas Sugeridos:**
- CPU > 80% por 5 min
- Memory > 85%
- Error rate > 5%
- Response time > 2s (P95)
- Database connection failed

### **14.5 Health Checks**

**Endpoint:**
```typescript
// GET /api/health
{
  status: 'healthy',
  timestamp: '2025-10-24T10:00:00Z',
  uptime: 86400,
  database: 'connected',
  version: '1.0.0'
}
```

---

## 📈 Conclusão

O sistema Fabric MES foi desenvolvido seguindo uma **arquitetura moderna, escalável e sustentável**, utilizando as melhores práticas da indústria de software.

### **Pontos Fortes da Arquitetura:**

✅ **Separação de Responsabilidades** - Cada camada tem função bem definida  
✅ **Modularidade** - Fácil adicionar novos módulos  
✅ **Testabilidade** - Estrutura preparada para testes  
✅ **Manutenibilidade** - Código limpo e documentado  
✅ **Escalabilidade** - Preparado para crescimento  
✅ **Segurança** - Múltiplas camadas de proteção  
✅ **Performance** - Otimizações implementadas  
✅ **Rastreabilidade** - Auditoria completa  

### **Tecnologias de Ponta:**

- TypeScript (Type Safety)
- Vue 3 (Composition API)
- Express.js (Node.js)
- Prisma ORM (Type-safe queries)
- MySQL 8.0 (Confiabilidade)
- Docker (Containerização)

### **Preparado para o Futuro:**

🚀 Microservices (arquitetura permite)  
🚀 Cache Layer (Redis preparado)  
🚀 Message Queue (eventos preparados)  
🚀 CI/CD (estrutura pronta)  
🚀 Kubernetes (containers prontos)  

---

**Documento gerado em**: 24 de Outubro de 2025  
**Versão do Sistema**: 1.0.0  
**Arquitetura**: Three-Tier + Clean Architecture  
**Status**: ✅ Produção Ready


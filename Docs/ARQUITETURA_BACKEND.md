# 🏗️ Arquitetura Backend - SGE API

## 📑 Índice

1. [Visão Geral](#visão-geral)
2. [Stack Tecnológica](#stack-tecnológica)
3. [Arquitetura de Pastas](#arquitetura-de-pastas)
4. [Arquitetura de Camadas](#arquitetura-de-camadas)
5. [Banco de Dados](#banco-de-dados)
6. [Autenticação e Autorização](#autenticação-e-autorização)
7. [API REST](#api-rest)
8. [Padrões de Código](#padrões-de-código)
9. [Segurança](#segurança)
10. [Logging e Monitoramento](#logging-e-monitoramento)
11. [Tratamento de Erros](#tratamento-de-erros)
12. [Validação de Dados](#validação-de-dados)
13. [Configuração de Ambiente](#configuração-de-ambiente)
14. [Deploy e Produção](#deploy-e-produção)
15. [Boas Práticas](#boas-práticas)

---

## 🎯 Visão Geral

O backend do SGE é uma **API REST** construída com **Node.js**, **Express** e **TypeScript**, seguindo princípios de **Clean Architecture** e **SOLID**. A aplicação utiliza **Prisma ORM** para acesso ao banco de dados **MySQL** e implementa autenticação via **JWT**.

### Características Principais

- ✅ **Node.js 20+** com TypeScript 5.4
- ✅ **Express 4.18** como framework web
- ✅ **Prisma ORM 5.22** para acesso ao banco
- ✅ **MySQL 8.0+** como banco de dados
- ✅ **JWT** para autenticação stateless
- ✅ **Bcrypt** para hash de senhas
- ✅ **Winston** para logging estruturado
- ✅ **Joi** para validação de dados
- ✅ **Helmet** para segurança HTTP
- ✅ **CORS** configurável
- ✅ **Arquitetura em camadas** (Controller → Service → Repository)

---

## 🛠️ Stack Tecnológica

### Runtime e Linguagem
- **Node.js 20+** - Runtime JavaScript
- **TypeScript 5.4.5** - Superset tipado do JavaScript
- **TSX 4.15** - TypeScript executor para desenvolvimento

### Framework Web
```json
{
  "express": "^4.18.2",           // Framework web minimalista
  "helmet": "^7.1.0",             // Middleware de segurança HTTP
  "cors": "^2.8.5",               // Cross-Origin Resource Sharing
  "dotenv": "^16.4.5"             // Carregamento de variáveis de ambiente
}
```

### Banco de Dados
```json
{
  "@prisma/client": "^5.22.0",    // Prisma Client (ORM)
  "prisma": "^5.22.0"             // Prisma CLI (dev)
}
```

### Autenticação e Segurança
```json
{
  "bcryptjs": "^2.4.3",           // Hash de senhas
  "jsonwebtoken": "^9.0.2",       // JWT tokens
  "joi": "^17.13.3"               // Validação de schemas
}
```

### Utilitários
```json
{
  "date-fns": "^4.1.0",           // Manipulação de datas
  "winston": "^3.14.2",           // Logging estruturado
  "multer": "^1.4.5-lts.1",       // Upload de arquivos
  "node-cron": "^3.0.3"           // Agendamento de tarefas
}
```

### Ferramentas de Desenvolvimento
```json
{
  "typescript": "^5.4.5",
  "@typescript-eslint/eslint-plugin": "^7.13.0",
  "@typescript-eslint/parser": "^7.13.0",
  "eslint": "^8.57.0",
  "prettier": "^3.3.0"
}
```

---

## 📁 Arquitetura de Pastas

```
backend/
├── prisma/
│   ├── schema.prisma          # Schema do Prisma (modelos de dados)
│   ├── migrations/            # Histórico de migrations
│   ├── seed.ts                # Seed de dados iniciais
│   └── seed-full.ts           # Seed completo para testes
├── src/
│   ├── config/                # Configurações da aplicação
│   │   ├── database.ts        # Instância do Prisma Client
│   │   ├── env.ts             # Variáveis de ambiente tipadas
│   │   └── logger.ts          # Configuração do Winston
│   ├── controllers/           # Controladores (HTTP handlers)
│   │   ├── auth.controller.ts
│   │   ├── aluno.controller.ts
│   │   └── dashboard.controller.ts
│   ├── services/              # Lógica de negócio
│   │   ├── auth.service.ts
│   │   ├── aluno.service.ts
│   │   └── dashboard.service.ts
│   ├── middleware/            # Middlewares Express
│   │   ├── auth.middleware.ts
│   │   ├── error.middleware.ts
│   │   ├── permission.middleware.ts
│   │   └── validation.middleware.ts
│   ├── validators/            # Schemas de validação Joi
│   │   ├── auth.validator.ts
│   │   └── aluno.validator.ts
│   ├── routes/                # Definição de rotas
│   │   ├── auth.routes.ts
│   │   ├── aluno.routes.ts
│   │   └── dashboard.routes.ts
│   ├── utils/                 # Funções utilitárias
│   │   ├── jwt.util.ts        # Geração e validação de JWT
│   │   ├── password.util.ts   # Hash e comparação de senhas
│   │   └── response.util.ts   # Padronização de respostas
│   ├── types/                 # Definições TypeScript
│   │   └── index.ts
│   ├── app.ts                 # Configuração do Express
│   └── server.ts              # Entry point (inicia servidor)
├── logs/                      # Arquivos de log
│   ├── error.log              # Logs de erro
│   └── combined.log           # Todos os logs
├── uploads/                   # Arquivos enviados
├── .env                       # Variáveis de ambiente (não versionado)
├── .env.example               # Template de variáveis
├── tsconfig.json              # Configuração TypeScript
├── package.json               # Dependências e scripts
└── README.md                  # Documentação
```

### Convenções de Nomenclatura

#### Arquivos
- **camelCase** para arquivos TypeScript: `auth.service.ts`, `aluno.controller.ts`
- **kebab-case** para arquivos de configuração: `.env.example`, `tsconfig.json`
- **Sufixos descritivos**: `.controller.ts`, `.service.ts`, `.middleware.ts`, `.routes.ts`

#### Classes e Interfaces
- **PascalCase** para classes: `AuthService`, `AlunoController`
- **PascalCase** para interfaces: `LoginCredentials`, `AuthTokens`, `AuthRequest`
- **Prefixo I** opcional para interfaces: `IUserRepository` (se preferir)

#### Métodos e Funções
- **camelCase**: `login()`, `findUserById()`, `generateAccessToken()`
- **Verbos descritivos**: `get`, `create`, `update`, `delete`, `find`, `verify`

#### Constantes
- **UPPER_SNAKE_CASE** para constantes verdadeiras: `MAX_FILE_SIZE`, `JWT_ALGORITHM`
- **camelCase** para objetos de configuração: `env`, `logger`

---

## 🏛️ Arquitetura de Camadas

O backend segue uma **arquitetura em 4 camadas** com separação clara de responsabilidades:

```
┌─────────────────────────────────────────────┐
│           ROUTES (Roteamento)               │
│  Define endpoints e aplica middlewares      │
└─────────────────┬───────────────────────────┘
                  │
┌─────────────────▼───────────────────────────┐
│        CONTROLLERS (Camada HTTP)            │
│  Recebe requisições, valida entrada,        │
│  chama services, formata resposta           │
└─────────────────┬───────────────────────────┘
                  │
┌─────────────────▼───────────────────────────┐
│       SERVICES (Lógica de Negócio)          │
│  Regras de negócio, orquestração,           │
│  transformações, validações complexas       │
└─────────────────┬───────────────────────────┘
                  │
┌─────────────────▼───────────────────────────┐
│     REPOSITORIES (Acesso a Dados)           │
│  Prisma Client, queries ao banco,           │
│  abstrações de persistência                 │
└─────────────────────────────────────────────┘
```

### 1. Routes (Camada de Roteamento)

**Responsabilidades:**
- Definir endpoints HTTP (GET, POST, PUT, DELETE)
- Aplicar middlewares (auth, validation)
- Vincular rotas aos controllers

**Exemplo:**
```typescript
// routes/auth.routes.ts
import { Router } from 'express';
import { authController } from '../controllers/auth.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { validate } from '../middleware/validation.middleware';
import { loginSchema, changePasswordSchema } from '../validators/auth.validator';

const router = Router();

// Rotas públicas
router.post('/login', validate(loginSchema), authController.login.bind(authController));
router.post('/refresh', authController.refreshToken.bind(authController));

// Rotas protegidas (requerem autenticação)
router.get('/me', authMiddleware, authController.me.bind(authController));
router.post('/change-password', authMiddleware, validate(changePasswordSchema), 
  authController.changePassword.bind(authController));
router.post('/logout', authMiddleware, authController.logout.bind(authController));

export default router;
```

### 2. Controllers (Camada HTTP)

**Responsabilidades:**
- Receber requisições HTTP (Request)
- Extrair parâmetros, query strings, body
- Chamar services apropriados
- Formatar e retornar respostas (Response)
- Tratar erros HTTP

**Estrutura:**
```typescript
// controllers/auth.controller.ts
import { Request, Response } from 'express';
import { authService } from '../services/auth.service';
import { successResponse, errorResponse } from '../utils/response.util';
import { AuthRequest } from '../middleware/auth.middleware';
import { logger } from '../config/logger';

export class AuthController {
  /**
   * POST /api/v1/auth/login
   * Login do usuário
   */
  async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, senha, password } = req.body;

      // Chama service
      const result = await authService.login({ 
        email, 
        senha: senha || password 
      });

      // Retorna sucesso
      successResponse(res, result, 'Login realizado com sucesso');
    } catch (error: any) {
      logger.error('Erro no login:', error);
      errorResponse(res, 'LOGIN_ERROR', error.message, 401);
    }
  }

  /**
   * GET /api/v1/auth/me
   * Busca dados do usuário autenticado
   */
  async me(req: AuthRequest, res: Response): Promise<void> {
    try {
      const userId = req.userId!;
      const user = await authService.me(userId);
      successResponse(res, user);
    } catch (error: any) {
      logger.error('Erro ao buscar usuário:', error);
      errorResponse(res, 'ME_ERROR', error.message, 400);
    }
  }
}

export const authController = new AuthController();
```

**Padrões:**
- Métodos `async` sempre
- Try-catch em todos os métodos
- Logging de erros
- Respostas padronizadas via `utils/response.util.ts`
- Nunca retornar dados sensíveis (senhas, tokens de terceiros)

### 3. Services (Camada de Negócio)

**Responsabilidades:**
- Implementar regras de negócio
- Orquestrar operações complexas
- Validações de domínio
- Transformações de dados
- Chamadas a APIs externas
- Transações de banco

**Estrutura:**
```typescript
// services/auth.service.ts
import { prisma } from '../config/database';
import { hashPassword, comparePassword } from '../utils/password.util';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../utils/jwt.util';
import { logger } from '../config/logger';

export interface LoginCredentials {
  email: string;
  senha: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    email: string;
    name: string;
  };
}

export class AuthService {
  /**
   * Realiza login do usuário
   */
  async login(credentials: LoginCredentials): Promise<AuthTokens> {
    const { email, senha } = credentials;

    // Busca usuário
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        password: true,
        name: true,
        active: true,
      },
    });

    // Validações de negócio
    if (!user) {
      throw new Error('Email ou senha incorretos');
    }

    if (!user.active) {
      throw new Error('Usuário inativo');
    }

    // Verifica senha
    const passwordMatch = await comparePassword(senha, user.password);
    if (!passwordMatch) {
      throw new Error('Email ou senha incorretos');
    }

    // Gera tokens
    const accessToken = generateAccessToken({
      userId: user.id,
      email: user.email,
    });

    const refreshToken = generateRefreshToken({
      userId: user.id,
      email: user.email,
    });

    logger.info(`Login bem-sucedido: ${user.email}`);

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    };
  }

  /**
   * Busca dados do usuário autenticado
   */
  async me(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        cpf: true,
        phone: true,
        avatar: true,
        active: true,
        createdAt: true,
        roles: {
          include: {
            role: {
              select: {
                id: true,
                name: true,
                description: true,
              },
            },
          },
        },
      },
    });

    if (!user) {
      throw new Error('Usuário não encontrado');
    }

    return {
      ...user,
      roles: user.roles.map((ur) => ur.role),
    };
  }
}

export const authService = new AuthService();
```

**Padrões:**
- Uma classe por service
- Métodos públicos são async
- Lançar erros com mensagens descritivas
- Não usar Request/Response (independente de HTTP)
- Logging de operações importantes
- Validações de negócio (não apenas técnicas)

### 4. Repositories (Camada de Dados)

**Responsabilidades:**
- Acesso direto ao banco (Prisma)
- Queries e mutations
- Joins e relacionamentos
- Paginação
- Filtros e ordenação

**Nota:** No SGE, usamos **Prisma Client** diretamente nos services sem camada de repository extra, pois o Prisma já fornece uma excelente abstração. Para projetos maiores, considere criar repositories separados.

**Exemplo de uso direto do Prisma:**
```typescript
// Dentro de um service
const alunos = await prisma.aluno.findMany({
  where: {
    active: true,
    status: 'ATIVO',
    nome: {
      contains: search,
      mode: 'insensitive'
    }
  },
  include: {
    responsavelPrincipal: {
      select: {
        name: true,
        email: true,
        phone: true
      }
    }
  },
  orderBy: {
    nome: 'asc'
  },
  skip: (page - 1) * limit,
  take: limit
});
```

---

## 🗄️ Banco de Dados

### Prisma ORM

O SGE utiliza **Prisma** como ORM (Object-Relational Mapping), que oferece:

- ✅ **Type-safety** completo com TypeScript
- ✅ **Migrations** versionadas
- ✅ **Query builder** intuitivo
- ✅ **Relations** automáticas
- ✅ **Prisma Studio** (GUI para visualizar dados)

### Schema do Banco

O schema está definido em `prisma/schema.prisma` com **28 tabelas** organizadas em módulos:

#### Módulos do Sistema

1. **Segurança e Usuários**
   - `users` - Usuários do sistema
   - `roles` - Perfis de acesso
   - `permissions` - Permissões
   - `user_roles` - Vínculo usuário-perfil
   - `role_permissions` - Vínculo perfil-permissão
   - `audit_logs` - Logs de auditoria

2. **Cadastros Base**
   - `alunos` - Dados dos alunos
   - `responsaveis` - Responsáveis pelos alunos
   - `vinculo_responsabilidade` - Vínculo aluno-responsável
   - `professores` - Dados dos professores
   - `ano_letivo` - Anos letivos
   - `periodo_letivo` - Trimestres/Bimestres
   - `turmas` - Turmas escolares
   - `matriculas` - Matrículas aluno-turma
   - `disciplinas` - Disciplinas
   - `turma_disciplina` - Vínculo turma-disciplina-professor

3. **Frequência**
   - `aulas` - Registro de aulas
   - `registro_frequencia` - Presença/Falta/Justificada
   - `justificativa_falta` - Justificativas de faltas

4. **Objetivos de Aprendizagem**
   - `objetivo_aprendizagem` - Objetivos da BNCC
   - `avaliacao_objetivo` - Avaliações (A/D/N)
   - `evidencia_aprendizagem` - Evidências (fotos, vídeos)

5. **Recuperação e Reforço**
   - `plano_recuperacao` - Planos de recuperação
   - `recuperacao_acompanhamento` - Acompanhamento

6. **Comunicação**
   - `comunicados` - Comunicados escolares
   - `comunicado_leitura` - Confirmação de leitura

7. **Sistema**
   - `notificacoes` - Notificações do sistema
   - `configuracao_escola` - Configurações
   - `termo_consentimento` - LGPD

### Exemplo de Model Prisma

```prisma
model Aluno {
  id                    String    @id @default(uuid())
  matricula             String    @unique
  nome                  String
  cpf                   String?   @unique
  rg                    String?
  dataNascimento        DateTime
  genero                String?
  foto                  String?
  endereco              String?
  telefone              String?
  email                 String?
  necessidadesEspeciais String?
  restricoesMedicas     String?
  status                String    @default("ATIVO")
  active                Boolean   @default(true)
  createdAt             DateTime  @default(now())
  updatedAt             DateTime  @updatedAt
  
  // Relacionamentos
  responsavelPrincipalId String?
  responsavelPrincipal   User?                  @relation("ResponsavelPrincipal", fields: [responsavelPrincipalId], references: [id], onDelete: SetNull)
  responsaveis           VinculoResponsabilidade[]
  matriculas             Matricula[]
  frequencias            RegistroFrequencia[]
  avaliacoes             AvaliacaoObjetivo[]
  planosRecuperacao      PlanoRecuperacao[]
  evidencias             EvidenciaAprendizagem[]
  comunicadosLeitura     ComunicadoLeitura[]
  notificacoes           Notificacao[]

  @@index([matricula])
  @@index([status])
  @@index([active])
  @@fulltext([nome])
  @@map("alunos")
}
```

### Migrations

**Criar nova migration:**
```bash
npx prisma migrate dev --name descricao_da_mudanca
```

**Aplicar migrations em produção:**
```bash
npx prisma migrate deploy
```

**Resetar banco (DEV only):**
```bash
npx prisma migrate reset
```

### Prisma Client

**Gerado automaticamente** a partir do schema:
```typescript
// config/database.ts
import { PrismaClient } from '@prisma/client';

export const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' 
    ? ['query', 'error', 'warn'] 
    : ['error']
});
```

**Queries comuns:**

```typescript
// Buscar por ID
const aluno = await prisma.aluno.findUnique({
  where: { id: alunoId }
});

// Buscar com filtros
const alunos = await prisma.aluno.findMany({
  where: {
    active: true,
    status: 'ATIVO',
    nome: { contains: 'João' }
  },
  include: {
    responsavelPrincipal: true,
    matriculas: {
      include: { turma: true }
    }
  },
  orderBy: { nome: 'asc' },
  take: 10,
  skip: 0
});

// Criar registro
const novoAluno = await prisma.aluno.create({
  data: {
    matricula: '2025001',
    nome: 'João Silva',
    dataNascimento: new Date('2010-03-15'),
    status: 'ATIVO'
  }
});

// Atualizar
await prisma.aluno.update({
  where: { id: alunoId },
  data: { status: 'TRANSFERIDO' }
});

// Deletar (soft delete recomendado)
await prisma.aluno.update({
  where: { id: alunoId },
  data: { active: false }
});

// Transações
await prisma.$transaction([
  prisma.aluno.create({ data: { ... } }),
  prisma.matricula.create({ data: { ... } })
]);

// Agregações
const stats = await prisma.registroFrequencia.groupBy({
  by: ['status'],
  _count: true
});

// Count
const total = await prisma.aluno.count({
  where: { active: true }
});
```

---

## 🔐 Autenticação e Autorização

### JWT (JSON Web Tokens)

O sistema usa **autenticação stateless** com JWT:

- **Access Token**: Curta duração (1h), usado em cada requisição
- **Refresh Token**: Longa duração (7d), usado para renovar access token

#### Estrutura do Token

```json
{
  "userId": "uuid-do-usuario",
  "email": "usuario@exemplo.com",
  "iat": 1698765432,
  "exp": 1698769032
}
```

#### Geração de Tokens

```typescript
// utils/jwt.util.ts
import jwt from 'jsonwebtoken';
import { env } from '../config/env';

export interface JwtPayload {
  userId: string;
  email: string;
}

export function generateAccessToken(payload: JwtPayload): string {
  return jwt.sign(payload, env.jwtSecret, {
    expiresIn: env.jwtExpiresIn, // '1h'
  });
}

export function generateRefreshToken(payload: JwtPayload): string {
  return jwt.sign(payload, env.jwtRefreshSecret, {
    expiresIn: env.jwtRefreshExpiresIn, // '7d'
  });
}

export function verifyAccessToken(token: string): JwtPayload {
  return jwt.verify(token, env.jwtSecret) as JwtPayload;
}

export function verifyRefreshToken(token: string): JwtPayload {
  return jwt.verify(token, env.jwtRefreshSecret) as JwtPayload;
}
```

### Hash de Senhas

Senhas são **sempre** armazenadas com hash usando **bcrypt**:

```typescript
// utils/password.util.ts
import bcrypt from 'bcryptjs';

const SALT_ROUNDS = 10;

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

export async function comparePassword(
  password: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}
```

### Middleware de Autenticação

```typescript
// middleware/auth.middleware.ts
import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '../utils/jwt.util';
import { unauthorizedResponse } from '../utils/response.util';

export interface AuthRequest extends Request {
  userId?: string;
  userEmail?: string;
}

export function authMiddleware(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      unauthorizedResponse(res, 'Token não fornecido');
      return;
    }

    const [bearer, token] = authHeader.split(' ');

    if (bearer !== 'Bearer' || !token) {
      unauthorizedResponse(res, 'Formato de token inválido');
      return;
    }

    const payload = verifyAccessToken(token);
    
    req.userId = payload.userId;
    req.userEmail = payload.email;

    next();
  } catch (error: any) {
    if (error.name === 'TokenExpiredError') {
      unauthorizedResponse(res, 'Token expirado');
      return;
    }
    unauthorizedResponse(res, 'Token inválido');
  }
}
```

### RBAC (Role-Based Access Control)

Sistema de **permissões baseado em perfis**:

**Estrutura:**
- **User** → **UserRole** → **Role** → **RolePermission** → **Permission**

**Perfis padrão:**
1. **Administrador** - Acesso total
2. **Coordenador** - Todas permissões exceto delete
3. **Professor** - Read/Create/Update em alunos, turmas, frequência, objetivos
4. **Responsável** - Read em dados do próprio filho

**Permissões:**
```typescript
{
  resource: 'alunos',      // Recurso
  action: 'create',        // Ação: create, read, update, delete
  description: 'Criar alunos'
}
```

**Middleware de Permissão:**
```typescript
// middleware/permission.middleware.ts
export function hasPermission(resource: string, action: string) {
  return async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const userId = req.userId!;

      // Busca permissões do usuário
      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: {
          roles: {
            include: {
              role: {
                include: {
                  permissions: {
                    include: { permission: true }
                  }
                }
              }
            }
          }
        }
      });

      // Verifica se tem permissão
      const hasPermission = user?.roles.some(ur =>
        ur.role.permissions.some(rp =>
          rp.permission.resource === resource &&
          rp.permission.action === action
        )
      );

      if (!hasPermission) {
        forbiddenResponse(res, 'Sem permissão para esta ação');
        return;
      }

      next();
    } catch (error) {
      errorResponse(res, 'PERMISSION_ERROR', 'Erro ao verificar permissões', 500);
    }
  };
}

// Uso
router.post('/alunos', 
  authMiddleware, 
  hasPermission('alunos', 'create'), 
  alunoController.create
);
```

---

## 🌐 API REST

### Padrões de URL

```
/api/v1/{resource}/{id?}/{action?}
```

**Exemplos:**
```
GET    /api/v1/alunos              # Lista alunos
GET    /api/v1/alunos/:id          # Busca aluno por ID
POST   /api/v1/alunos              # Cria aluno
PUT    /api/v1/alunos/:id          # Atualiza aluno
DELETE /api/v1/alunos/:id          # Deleta aluno
GET    /api/v1/alunos/:id/stats    # Estatísticas do aluno (action)
```

### Versionamento

API versionada no path: `/api/v1/`, `/api/v2/`

**Motivo:** Permite manter versões antigas funcionando durante migração.

### Verbos HTTP

- **GET** - Leitura (idempotente, sem side effects)
- **POST** - Criação (não idempotente)
- **PUT** - Atualização completa (idempotente)
- **PATCH** - Atualização parcial (idempotente)
- **DELETE** - Remoção (idempotente)

### Status Codes

**Sucesso:**
- `200 OK` - Requisição bem-sucedida (GET, PUT, PATCH, DELETE)
- `201 Created` - Recurso criado (POST)
- `204 No Content` - Sucesso sem corpo de resposta

**Erro do Cliente:**
- `400 Bad Request` - Dados inválidos
- `401 Unauthorized` - Não autenticado
- `403 Forbidden` - Sem permissão
- `404 Not Found` - Recurso não encontrado
- `409 Conflict` - Conflito (ex: email duplicado)
- `422 Unprocessable Entity` - Validação falhou

**Erro do Servidor:**
- `500 Internal Server Error` - Erro interno
- `503 Service Unavailable` - Serviço indisponível

### Formato de Resposta

**Padrão de sucesso:**
```json
{
  "success": true,
  "data": {
    "id": "123",
    "nome": "João Silva"
  },
  "message": "Operação realizada com sucesso",
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "totalPages": 10
  }
}
```

**Padrão de erro:**
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Dados inválidos",
    "details": {
      "email": "Email inválido",
      "senha": "Senha deve ter no mínimo 8 caracteres"
    }
  }
}
```

### Paginação

**Query params:**
```
GET /api/v1/alunos?page=1&limit=10&search=João&active=true
```

**Resposta:**
```json
{
  "success": true,
  "data": [...],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 150,
    "totalPages": 15
  }
}
```

### Filtros e Ordenação

**Filtros:**
```
GET /api/v1/alunos?status=ATIVO&serie=5º%20Ano
```

**Ordenação:**
```
GET /api/v1/alunos?orderBy=nome&order=asc
```

### Headers

**Request:**
```
Authorization: Bearer {token}
Content-Type: application/json
Accept: application/json
```

**Response:**
```
Content-Type: application/json
X-Request-Id: uuid
X-Response-Time: 123ms
```

---

## 💻 Padrões de Código TypeScript

### Configuração TypeScript

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "lib": ["ES2020"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "moduleResolution": "node",
    "noImplicitAny": true,
    "strictNullChecks": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true
  }
}
```

### Interfaces e Types

**Sempre tipar:**
```typescript
// ❌ Evitar
const user = await getUser();

// ✅ Correto
interface User {
  id: string;
  email: string;
  name: string;
}

const user: User = await getUser();
```

**Preferir interfaces para objetos:**
```typescript
// ✅ Interfaces (extensíveis)
interface LoginRequest {
  email: string;
  senha: string;
}

interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: UserData;
}

// ✅ Types para unions, intersections
type Status = 'ATIVO' | 'INATIVO' | 'TRANSFERIDO';
type UserWithRoles = User & { roles: Role[] };
```

### Async/Await

**Sempre usar async/await**, nunca `.then()/.catch()`:

```typescript
// ❌ Evitar
function getUser() {
  return prisma.user.findUnique({ where: { id } })
    .then(user => user)
    .catch(error => {
      console.error(error);
      throw error;
    });
}

// ✅ Correto
async function getUser(id: string): Promise<User | null> {
  try {
    const user = await prisma.user.findUnique({
      where: { id }
    });
    return user;
  } catch (error) {
    logger.error('Erro ao buscar usuário:', error);
    throw error;
  }
}
```

### Error Handling

**Lançar erros descritivos:**
```typescript
// ❌ Evitar
throw new Error('Erro');

// ✅ Correto
throw new Error('Usuário não encontrado');
throw new Error('Email já cadastrado');
throw new Error('Senha incorreta');
```

**Criar classes de erro personalizadas:**
```typescript
export class ValidationError extends Error {
  constructor(message: string, public details?: any) {
    super(message);
    this.name = 'ValidationError';
  }
}

export class NotFoundError extends Error {
  constructor(resource: string) {
    super(`${resource} não encontrado`);
    this.name = 'NotFoundError';
  }
}

// Uso
if (!user) {
  throw new NotFoundError('Usuário');
}
```

### Imports

**Ordem recomendada:**
```typescript
// 1. Bibliotecas externas
import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';

// 2. Módulos internos (config, utils)
import { logger } from '../config/logger';
import { prisma } from '../config/database';

// 3. Services
import { authService } from '../services/auth.service';

// 4. Types e interfaces
import type { User, LoginRequest } from '../types';
```

---

## 🔒 Segurança

### Helmet (Segurança HTTP)

Protege contra vulnerabilidades comuns:

```typescript
import helmet from 'helmet';

app.use(helmet());
```

**Protege contra:**
- XSS (Cross-Site Scripting)
- Clickjacking
- MIME sniffing
- DNS prefetching
- Exposição de tecnologias

### CORS (Cross-Origin Resource Sharing)

```typescript
import cors from 'cors';

app.use(cors({
  origin: env.corsOrigin,        // URL permitida
  credentials: true,              // Permite cookies
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
```

### Rate Limiting

**Recomendado:** Implementar rate limiting para prevenir abuse.

```typescript
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100,                  // 100 requisições
  message: 'Muitas requisições deste IP'
});

app.use('/api/', limiter);
```

### Validação de Entrada

**Sempre validar** dados do usuário com Joi:

```typescript
import Joi from 'joi';

export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  senha: Joi.string().min(8).required()
});

// Middleware de validação
export function validate(schema: Joi.ObjectSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true
    });

    if (error) {
      const errors = error.details.map(d => ({
        field: d.path.join('.'),
        message: d.message
      }));
      
      return validationErrorResponse(res, errors);
    }

    next();
  };
}
```

### SQL Injection

**Protegido automaticamente** pelo Prisma (usa prepared statements).

### Sanitização de HTML

```typescript
import sanitizeHtml from 'sanitize-html';

const cleanHtml = sanitizeHtml(userInput, {
  allowedTags: [],
  allowedAttributes: {}
});
```

### HTTPS

**Produção:** Sempre usar HTTPS (TLS/SSL).

**Desenvolvimento:** HTTP ok (localhost).

---

## 📊 Logging e Monitoramento

### Winston (Structured Logging)

```typescript
// config/logger.ts
import winston from 'winston';

export const logger = winston.createLogger({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  format: winston.format.combine(
    winston.format.errors({ stack: true }),
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      )
    }),
    new winston.transports.File({
      filename: 'logs/error.log',
      level: 'error'
    }),
    new winston.transports.File({
      filename: 'logs/combined.log'
    })
  ]
});
```

**Níveis de log:**
- `error` - Erros que precisam atenção
- `warn` - Avisos
- `info` - Informações gerais
- `http` - Requisições HTTP
- `debug` - Debugging (dev only)

**Uso:**
```typescript
logger.info('Usuário logado', { userId, email });
logger.error('Erro ao processar pagamento', { error, orderId });
logger.warn('Taxa de falha alta', { rate: '15%' });
logger.debug('Query executada', { sql, duration });
```

### Audit Logs

Registrar ações importantes:

```typescript
await prisma.auditLog.create({
  data: {
    userId: req.userId,
    action: 'CREATE',
    entity: 'Aluno',
    entityId: aluno.id,
    oldValue: null,
    newValue: aluno,
    ipAddress: req.ip,
    userAgent: req.get('user-agent')
  }
});
```

---

## ⚠️ Tratamento de Erros

### Middleware de Erro Global

```typescript
// middleware/error.middleware.ts
import { Request, Response, NextFunction } from 'express';
import { logger } from '../config/logger';
import { errorResponse } from '../utils/response.util';

export function errorMiddleware(
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  logger.error('Erro não tratado:', {
    error: error.message,
    stack: error.stack,
    url: req.url,
    method: req.method
  });

  // Erro de validação
  if (error.name === 'ValidationError') {
    return errorResponse(res, 'VALIDATION_ERROR', error.message, 400, error.details);
  }

  // Erro do Prisma
  if (error.code === 'P2002') {
    return errorResponse(res, 'DUPLICATE_ERROR', 'Registro duplicado', 409);
  }

  // Erro genérico
  return errorResponse(
    res,
    'INTERNAL_ERROR',
    process.env.NODE_ENV === 'production' 
      ? 'Erro interno do servidor' 
      : error.message,
    500,
    process.env.NODE_ENV === 'production' ? undefined : error.stack
  );
}
```

### Try-Catch em Controllers

**Sempre** envolver código em try-catch:

```typescript
async create(req: Request, res: Response): Promise<void> {
  try {
    const aluno = await alunoService.create(req.body);
    successResponse(res, aluno, 'Aluno criado com sucesso', 201);
  } catch (error: any) {
    logger.error('Erro ao criar aluno:', error);
    errorResponse(res, 'CREATE_ERROR', error.message, 400);
  }
}
```

---

## ✅ Validação de Dados

### Joi Schemas

```typescript
// validators/aluno.validator.ts
import Joi from 'joi';

export const createAlunoSchema = Joi.object({
  matricula: Joi.string().required().messages({
    'any.required': 'Matrícula é obrigatória',
    'string.empty': 'Matrícula não pode estar vazia'
  }),
  
  nome: Joi.string().min(3).max(100).required().messages({
    'any.required': 'Nome é obrigatório',
    'string.min': 'Nome deve ter no mínimo 3 caracteres',
    'string.max': 'Nome deve ter no máximo 100 caracteres'
  }),
  
  cpf: Joi.string().pattern(/^\d{11}$/).optional().messages({
    'string.pattern.base': 'CPF deve conter 11 dígitos'
  }),
  
  dataNascimento: Joi.date().max('now').required().messages({
    'any.required': 'Data de nascimento é obrigatória',
    'date.max': 'Data de nascimento não pode ser futura'
  }),
  
  email: Joi.string().email().optional().messages({
    'string.email': 'Email inválido'
  }),
  
  genero: Joi.string().valid('M', 'F', 'Outro').optional(),
  
  status: Joi.string().valid('ATIVO', 'INATIVO', 'TRANSFERIDO', 'EVADIDO').default('ATIVO')
});

export const updateAlunoSchema = createAlunoSchema.fork(
  ['matricula', 'nome', 'dataNascimento'],
  (schema) => schema.optional()
);
```

---

## ⚙️ Configuração de Ambiente

### Variáveis de Ambiente (.env)

```bash
# Server
PORT=3001
NODE_ENV=development

# Database
DATABASE_URL="mysql://root:password@localhost:3306/escoladu"

# JWT (mínimo 32 caracteres)
JWT_SECRET="sua-chave-super-secreta-com-32-ou-mais-caracteres"
JWT_REFRESH_SECRET="sua-chave-refresh-super-secreta-com-32-ou-mais-caracteres"
JWT_EXPIRES_IN="1h"
JWT_REFRESH_EXPIRES_IN="7d"

# CORS
CORS_ORIGIN="http://localhost:5173"

# Upload
UPLOAD_DIR="./uploads"
MAX_FILE_SIZE=5242880

# Email (opcional)
SMTP_HOST=""
SMTP_PORT=587
SMTP_USER=""
SMTP_PASS=""
SMTP_FROM="noreply@sge.com"

# SMS (opcional)
SMS_API_KEY=""
SMS_API_URL=""
```

### Validação de ENV

```typescript
// config/env.ts
if (!env.jwtSecret || env.jwtSecret.length < 32) {
  throw new Error('JWT_SECRET deve ter no mínimo 32 caracteres');
}

if (!env.databaseUrl) {
  throw new Error('DATABASE_URL não configurada');
}
```

---

## 🚀 Deploy e Produção

### Build

```bash
# Compilar TypeScript
npm run build

# Gera pasta dist/ com JavaScript
```

### Scripts NPM

```json
{
  "scripts": {
    "dev": "tsx watch src/server.ts",
    "build": "tsc",
    "start": "node dist/server.js",
    "prisma:generate": "prisma generate",
    "prisma:migrate": "prisma migrate dev",
    "prisma:deploy": "prisma migrate deploy",
    "prisma:studio": "prisma studio",
    "prisma:seed": "tsx prisma/seed.ts"
  }
}
```

### Produção

**Checklist:**
1. ✅ Variáveis de ambiente configuradas
2. ✅ JWT_SECRET forte (64+ caracteres)
3. ✅ HTTPS habilitado
4. ✅ Rate limiting ativo
5. ✅ CORS restrito
6. ✅ Logs configurados
7. ✅ Banco de dados otimizado
8. ✅ Migrations aplicadas
9. ✅ Monitoramento ativo
10. ✅ Backups automáticos

### Docker (Opcional)

```dockerfile
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build
RUN npx prisma generate

EXPOSE 3001

CMD ["npm", "start"]
```

---

## ✅ Boas Práticas

### Código Limpo

1. **Nomes descritivos**
```typescript
// ❌ Evitar
const u = await getU(id);

// ✅ Correto
const user = await getUserById(id);
```

2. **Funções pequenas** (uma responsabilidade)
```typescript
// ❌ Evitar: função faz muitas coisas
async function processUser(data) {
  // valida dados
  // cria usuário
  // envia email
  // registra log
  // atualiza cache
}

// ✅ Correto: separar responsabilidades
async function createUser(data: CreateUserDto) {
  const validatedData = validateUserData(data);
  const user = await saveUser(validatedData);
  await sendWelcomeEmail(user.email);
  await logUserCreation(user.id);
  return user;
}
```

3. **DRY (Don't Repeat Yourself)**
```typescript
// ❌ Repetição
if (!req.userId) {
  return unauthorizedResponse(res);
}

// ✅ Middleware reutilizável
router.use(authMiddleware);
```

### Performance

1. **Índices no banco**
```prisma
@@index([email])
@@index([status, active])
```

2. **Select apenas campos necessários**
```typescript
// ❌ Busca tudo
const user = await prisma.user.findUnique({ where: { id } });

// ✅ Select específico
const user = await prisma.user.findUnique({
  where: { id },
  select: { id: true, name: true, email: true }
});
```

3. **Paginação sempre**
```typescript
const alunos = await prisma.aluno.findMany({
  take: limit,
  skip: (page - 1) * limit
});
```

### Segurança

1. **Nunca expor dados sensíveis**
```typescript
// ❌ Evitar
return { user, password: user.password };

// ✅ Correto
return { 
  id: user.id, 
  name: user.name, 
  email: user.email 
};
```

2. **Validar TUDO do cliente**
3. **Sanitizar HTML do usuário**
4. **Rate limiting em produção**
5. **Logs sem dados sensíveis**

### Testes

1. **Unit tests** para services
2. **Integration tests** para rotas
3. **Cobertura >80%**

```typescript
// Exemplo de teste
describe('AuthService', () => {
  it('deve fazer login com credenciais válidas', async () => {
    const result = await authService.login({
      email: 'teste@exemplo.com',
      senha: 'senha123'
    });
    
    expect(result).toHaveProperty('accessToken');
    expect(result).toHaveProperty('user');
  });
});
```

---

## 📚 Recursos e Referências

- [Node.js Documentation](https://nodejs.org/docs/)
- [Express.js Documentation](https://expressjs.com/)
- [TypeScript Documentation](https://www.typescriptlang.org/)
- [Prisma Documentation](https://www.prisma.io/docs/)
- [JWT.io](https://jwt.io/)
- [Joi Validation](https://joi.dev/)
- [Winston Logging](https://github.com/winstonjs/winston)

---

## 🎯 Checklist de Desenvolvimento

Ao criar uma nova feature:

- [ ] Criar migration do Prisma (se necessário)
- [ ] Criar/atualizar models no schema.prisma
- [ ] Criar interfaces TypeScript
- [ ] Criar validator Joi
- [ ] Criar service com lógica de negócio
- [ ] Criar controller
- [ ] Criar rotas com middlewares
- [ ] Adicionar logging apropriado
- [ ] Adicionar tratamento de erros
- [ ] Testar com Prisma Studio
- [ ] Testar endpoints (Postman/Thunder Client)
- [ ] Documentar no README (se público)
- [ ] Criar testes unitários
- [ ] Criar testes de integração

---

**Última atualização:** 29 de outubro de 2025  
**Versão do documento:** 1.0.0  
**Mantido por:** Equipe EscolaDu

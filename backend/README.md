# SGE - Backend API

Sistema de Gerenciamento Escolar - API REST em Node.js + Express + Prisma + MySQL

## 📋 Pré-requisitos

- Node.js 20+ 
- MySQL 8.0+
- npm ou yarn

## 🚀 Instalação

### 1. Instalar dependências

```bash
npm install
```

### 2. Configurar variáveis de ambiente

Copie o arquivo `.env.example` para `.env`:

```bash
cp .env.example .env
```

Edite o arquivo `.env` com suas configurações:

```env
DATABASE_URL="mysql://root:sua_senha@localhost:3306/sge"
JWT_SECRET="sua-chave-secreta-minimo-32-caracteres"
JWT_REFRESH_SECRET="sua-chave-refresh-minimo-32-caracteres"
PORT=3001
CORS_ORIGIN="http://localhost:5173"
```

### 3. Configurar banco de dados

```bash
# Gerar Prisma Client
npm run prisma:generate

# Executar migrations
npm run prisma:migrate

# (Opcional) Popular banco com dados iniciais
npm run prisma:seed
```

### 4. Iniciar servidor

```bash
# Desenvolvimento (com hot reload)
npm run dev

# Produção
npm run build
npm start
```

## 📁 Estrutura do Projeto

```
backend/
├── src/
│   ├── config/           # Configurações (env, database, logger)
│   ├── controllers/      # Controllers (coordenação HTTP)
│   ├── services/         # Services (lógica de negócio)
│   ├── middleware/       # Middlewares (auth, validation, etc)
│   ├── validators/       # Schemas de validação (Joi)
│   ├── routes/           # Definição de rotas
│   ├── utils/            # Utilitários
│   ├── app.ts            # Configuração do Express
│   └── server.ts         # Entry point
├── prisma/
│   ├── schema.prisma     # Schema do banco
│   ├── migrations/       # Migrations
│   └── seed.ts           # Seed data
├── logs/                 # Logs da aplicação
├── uploads/              # Arquivos enviados
├── package.json
└── tsconfig.json
```

## 🛠️ Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev              # Inicia servidor com hot reload

# Build
npm run build            # Compila TypeScript para JavaScript

# Produção
npm start                # Inicia servidor compilado

# Prisma
npm run prisma:generate  # Gera Prisma Client
npm run prisma:migrate   # Executa migrations
npm run prisma:deploy    # Deploy migrations (produção)
npm run prisma:studio    # Abre Prisma Studio (GUI)
npm run prisma:seed      # Popula banco com dados

# Code Quality
npm run lint             # Verifica problemas de código
npm run format           # Formata código

# Testes
npm test                 # Executa testes
npm run test:watch       # Testes em modo watch
npm run test:coverage    # Gera relatório de cobertura
```

## 📡 API Endpoints

### Autenticação

| Método | Endpoint | Descrição | Auth |
|--------|----------|-----------|------|
| POST | `/api/auth/login` | Login do usuário | Não |
| POST | `/api/auth/refresh` | Atualiza tokens | Não |
| GET | `/api/auth/me` | Dados do usuário autenticado | Sim |
| POST | `/api/auth/change-password` | Altera senha | Sim |
| POST | `/api/auth/logout` | Logout | Sim |

### Alunos

| Método | Endpoint | Descrição | Auth |
|--------|----------|-----------|------|
| GET | `/api/alunos` | Lista alunos | Sim |
| GET | `/api/alunos/:id` | Busca aluno por ID | Sim |
| POST | `/api/alunos` | Cria novo aluno | Sim |
| PUT | `/api/alunos/:id` | Atualiza aluno | Sim |
| DELETE | `/api/alunos/:id` | Deleta aluno (soft) | Sim |
| GET | `/api/alunos/:id/stats` | Estatísticas do aluno | Sim |

### Turmas

| Método | Endpoint | Descrição | Auth |
|--------|----------|-----------|------|
| GET | `/api/turmas` | Lista turmas | Sim |
| GET | `/api/turmas/:id` | Busca turma por ID | Sim |
| POST | `/api/turmas` | Cria nova turma | Sim |
| PUT | `/api/turmas/:id` | Atualiza turma | Sim |
| DELETE | `/api/turmas/:id` | Deleta turma | Sim |

### Frequência

| Método | Endpoint | Descrição | Auth |
|--------|----------|-----------|------|
| POST | `/api/frequencia/chamada` | Registra chamada | Sim |
| GET | `/api/frequencia/aluno/:id` | Frequência do aluno | Sim |
| GET | `/api/frequencia/turma/:id` | Frequência da turma | Sim |
| POST | `/api/frequencia/justificativa` | Justifica falta | Sim |

### Objetivos

| Método | Endpoint | Descrição | Auth |
|--------|----------|-----------|------|
| GET | `/api/objetivos` | Lista objetivos | Sim |
| POST | `/api/objetivos/avaliar` | Avalia objetivos | Sim |
| GET | `/api/objetivos/aluno/:id` | Objetivos do aluno | Sim |
| GET | `/api/objetivos/turma/:id` | Objetivos da turma | Sim |

## 🔐 Autenticação

A API usa JWT (JSON Web Tokens) para autenticação:

1. **Login**: POST `/api/auth/login` retorna `accessToken` e `refreshToken`
2. **Requisições autenticadas**: Enviar header `Authorization: Bearer {accessToken}`
3. **Refresh token**: Quando `accessToken` expirar, usar POST `/api/auth/refresh`

### Exemplo de uso:

```javascript
// Login
const response = await fetch('http://localhost:3001/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'admin@sge.com',
    password: 'Admin@2024'
  })
});

const { accessToken, refreshToken } = await response.json();

// Requisição autenticada
const alunos = await fetch('http://localhost:3001/api/alunos', {
  headers: {
    'Authorization': `Bearer ${accessToken}`
  }
});
```

## 🔧 Configurações

### Percentuais Padrão

- **Frequência mínima**: 75%
- **Alerta de frequência**: 80%
- **Objetivos mínimos**: 70%
- **Limite de objetivos críticos**: 3

Estes valores podem ser configurados através da tabela `configuracao_escola`.

## 📊 Banco de Dados

### Principais Tabelas

- **users**: Usuários do sistema
- **roles**: Perfis de acesso
- **permissions**: Permissões
- **alunos**: Dados dos alunos
- **turmas**: Turmas escolares
- **registro_frequencia**: Frequência dos alunos
- **objetivo_aprendizagem**: Objetivos da BNCC
- **avaliacao_objetivo**: Avaliações dos objetivos
- **plano_recuperacao**: Planos de recuperação

### Migrations

As migrations são versionadas e podem ser executadas com:

```bash
# Criar nova migration
npx prisma migrate dev --name descricao_da_mudanca

# Aplicar migrations em produção
npx prisma migrate deploy

# Resetar banco (cuidado!)
npx prisma migrate reset
```

## 🧪 Testes

```bash
# Executar todos os testes
npm test

# Testes em modo watch
npm run test:watch

# Cobertura de testes
npm run test:coverage
```

## 📝 Logs

Os logs são salvos em `logs/`:

- `error.log`: Apenas erros
- `combined.log`: Todos os logs

## 🐛 Troubleshooting

### Erro: "Não é possível conectar ao banco"

Verifique se o MySQL está rodando e as credenciais no `.env` estão corretas.

```bash
# Testar conexão MySQL
mysql -u root -p -h localhost

# Verificar se o banco existe
SHOW DATABASES;
```

### Erro: "Prisma Client não foi gerado"

Execute:

```bash
npm run prisma:generate
```

### Erro: "Porta já em uso"

Altere a porta no `.env` ou mate o processo:

```bash
# Windows
netstat -ano | findstr :3001
taskkill /PID <PID> /F

# Linux/Mac
lsof -i :3001
kill -9 <PID>
```

## 🚢 Deploy

### Docker

```bash
# Build da imagem
docker build -t sge-backend .

# Executar container
docker run -p 3001:3001 --env-file .env sge-backend
```

### Docker Compose

```bash
docker-compose up -d
```

## 📄 Licença

MIT

## 👥 Equipe

Desenvolvido por EscolaDu

## 🔗 Links Úteis

- [Documentação do Prisma](https://www.prisma.io/docs/)
- [Express.js](https://expressjs.com/)
- [TypeScript](https://www.typescriptlang.org/)
- [Joi Validation](https://joi.dev/)


## 🔗 Comandos Úteis
## 🔗 Backup do banco de dados no Docker
$env:MYSQL_PWD="root123" ; docker exec 3080828256ed0215942b17fb379c03327f072503b661043601700180416273d1 /usr/bin/mysqldump -u root --all-databases > e:/escoladu/backups/backup_completo_mysql.sql

## 🔗 Restaurar o banco de dados
$env:MYSQL_PWD="root123" ; cat e:/escoladu/backups/backup_completo_mysql.sql | docker exec -i 3080828256ed0215942b17fb379c03327f072503b661043601700180416273d1 /usr/bin/mysql -u root
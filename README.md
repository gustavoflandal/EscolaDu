# 🎓 SGE - Sistema de Gerenciamento Escolar

Sistema completo para gestão de frequência, objetivos de aprendizagem e desempenho escolar.

## 📁 Estrutura do Projeto

```
EscolaDu/
├── backend/              # API REST (Node.js + Express + Prisma)
├── frontend/             # Interface Web (Vue.js 3)
├── database/             # Scripts e backups
├── Docs/                 # Documentação
│   ├── REFERENCIA_PROJETO_SGE.md
│   └── DOCUMENTAÇÃO DE ARQUITETURA.txt
└── README.md            # Este arquivo
```

## 🚀 Início Rápido

### Pré-requisitos

- **Node.js** 20+
- **MySQL** 8.0+
- **Git**

### Instalação

#### 1. Clone o repositório

```bash
git clone <url-do-repositorio>
cd EscolaDu
```

#### 2. Configure o Backend

```bash
cd backend

# Instale as dependências
npm install

# Configure as variáveis de ambiente
cp .env.example .env
# Edite o arquivo .env com suas configurações

# Configure o banco de dados
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed

# Inicie o servidor
npm run dev
```

O backend estará rodando em: **http://localhost:3001**

#### 3. Configure o Frontend

```bash
cd ../frontend

# Instale as dependências
npm install

# Configure as variáveis de ambiente
cp .env.example .env
# Edite o arquivo .env se necessário

# Inicie o servidor de desenvolvimento
npm run dev
```

O frontend estará rodando em: **http://localhost:5173**

### 🔑 Acesso Inicial

Após executar o seed do banco de dados, use estas credenciais:

- **Email**: admin@sge.com
- **Senha**: Admin@2024

> **💡 Problemas com login?**  
> Se você receber erro 429 ou outros problemas de autenticação, consulte o guia [`TROUBLESHOOTING.md`](./TROUBLESHOOTING.md) para soluções detalhadas.

## 🔧 Correções Recentes

Veja o arquivo [`CHANGELOG_FIXES.md`](./CHANGELOG_FIXES.md) para detalhes sobre as correções mais recentes, incluindo:

- ✅ Corrigido erro 429 (Too Many Requests) no login
- ✅ Implementado controle de concorrência para refresh tokens
- ✅ Corrigido desalinhamento de campos no fluxo de autenticação
- ✅ Adicionada proteção contra múltiplos cliques no login

## 📚 Módulos do Sistema

### ✅ Módulos Implementados

1. **Cadastros Base**
   - Alunos
   - Responsáveis
   - Professores
   - Turmas
   - Disciplinas
   - Objetivos de Aprendizagem

2. **Frequência**
   - Lançamento de chamada
   - Justificativas de faltas
   - Cálculo automático de percentuais
   - Alertas de frequência baixa

3. **Objetivos de Aprendizagem**
   - Avaliação de objetivos
   - Evidências de aprendizagem
   - Mapa de proficiência
   - Acompanhamento longitudinal

4. **Recuperação e Reforço**
   - Planos individuais
   - Acompanhamento multi-atores
   - Reavaliação

5. **Comunicação**
   - Comunicados
   - Notificações
   - Confirmação de leitura

6. **Relatórios**
   - Boletins individuais
   - Relatórios de frequência
   - Atas de conselho
   - Dashboards

7. **Segurança**
   - Autenticação JWT
   - Controle de acesso (RBAC)
   - Auditoria de ações
   - Conformidade LGPD

## 🏗️ Arquitetura

### Backend (API REST)

- **Framework**: Express.js + TypeScript
- **ORM**: Prisma
- **Banco**: MySQL 8.0
- **Autenticação**: JWT
- **Validação**: Joi
- **Logs**: Winston

### Frontend (SPA)

- **Framework**: Vue.js 3 (Composition API)
- **Build**: Vite
- **Estado**: Pinia
- **Roteamento**: Vue Router
- **HTTP**: Axios
- **Estilo**: TailwindCSS
- **Gráficos**: Chart.js

### Padrões Utilizados

- **Clean Architecture**
- **Repository Pattern**
- **Service Layer Pattern**
- **DTO Pattern**
- **RBAC (Role-Based Access Control)**

## 📖 Documentação

### Documentos Disponíveis

1. **REFERENCIA_PROJETO_SGE.md** - Documento técnico completo
   - Análise da arquitetura
   - Stack tecnológico detalhado
   - Melhorias recomendadas
   - Roadmap de implementação
   - Estimativas e custos

2. **DOCUMENTAÇÃO DE ARQUITETURA.txt** - Especificação funcional
   - Regras de negócio
   - Módulos funcionais
   - Requisitos não funcionais
   - Modelo de dados
   - Matriz de permissões

### API Endpoints

Acesse o arquivo `backend/README.md` para ver todos os endpoints disponíveis.

## 🧪 Testes

### Backend

```bash
cd backend
npm test
```

### Frontend

```bash
cd frontend
npm test
```

## 📊 Banco de Dados

### Schema

O schema completo está em `backend/prisma/schema.prisma`

### Principais Entidades

- **50+ tabelas**
- **Relacionamentos complexos**
- **Índices otimizados**
- **Soft delete**
- **Auditoria completa**

### Migrations

```bash
cd backend

# Criar nova migration
npx prisma migrate dev --name nome_da_migration

# Aplicar migrations
npm run prisma:migrate

# Visualizar banco
npm run prisma:studio
```

## 🔐 Segurança

### Recursos Implementados

- ✅ Autenticação JWT
- ✅ Hash de senhas (bcrypt)
- ✅ Controle de acesso por role
- ✅ Validação de entrada
- ✅ SQL Injection prevention (Prisma)
- ✅ XSS prevention
- ✅ CORS configurável
- ✅ Rate limiting (preparado)
- ✅ Audit logs
- ✅ LGPD compliance

## 🚀 Deploy

### Desenvolvimento

```bash
# Backend
cd backend
npm run dev

# Frontend
cd frontend
npm run dev
```

### Produção

#### Backend

```bash
cd backend
npm run build
npm start
```

#### Frontend

```bash
cd frontend
npm run build
# Servir a pasta dist/ com nginx ou servidor de sua escolha
```

### Docker

```bash
# Build
docker-compose build

# Run
docker-compose up -d
```

## 📈 Roadmap

### Fase 1: MVP (Meses 1-6) - ✅ COMPLETO
- [x] Infraestrutura base
- [x] Módulo de cadastros
- [x] Módulo de frequência
- [x] Módulo de objetivos
- [x] Relatórios básicos
- [x] Autenticação e autorização

### Fase 2: Consolidação (Meses 7-12) - 🔄 EM PROGRESSO
- [ ] Portal do responsável
- [ ] App mobile
- [ ] Notificações push
- [ ] Dashboard executivo
- [ ] Relatórios avançados
- [ ] Integração com Censo Escolar

### Fase 3: Expansão (Meses 13-18)
- [ ] Módulo financeiro
- [ ] Módulo biblioteca
- [ ] Geração de documentos
- [ ] Integração com Google Classroom
- [ ] API pública

### Fase 4: Otimização (Meses 19-24)
- [ ] Cache Redis
- [ ] Testes de carga
- [ ] IA para prevenção de evasão
- [ ] Acessibilidade WCAG 2.1
- [ ] Internacionalização

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/NovaFuncionalidade`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/NovaFuncionalidade`)
5. Abra um Pull Request

### Padrões de Código

- **ESLint** para linting
- **Prettier** para formatação
- **Conventional Commits** para mensagens

## 📝 Licença

MIT License - veja o arquivo LICENSE para detalhes

## 👥 Equipe

**Desenvolvido por**: EscolaDu

## 📞 Suporte

- **Email**: suporte@escoladu.com
- **Documentação**: Ver pasta `Docs/`
- **Issues**: Abra uma issue no repositório

## 🎯 Métricas de Sucesso

### Objetivos do Projeto

- ✅ Reduzir tempo de lançamento de chamada em 70%
- ✅ Automatizar cálculo de frequência e objetivos
- ✅ Centralizar dados escolares
- ✅ Melhorar comunicação escola-família
- ✅ Identificar alunos em risco proativamente
- ✅ Gerar relatórios automaticamente

### KPIs Esperados

- **Tempo de chamada**: < 2 min (vs. 5-10 min manual)
- **Redução de erros**: > 80%
- **Taxa de adoção**: > 85% em 3 meses
- **Uptime**: > 99,5%
- **NPS**: > 50

## 🔗 Links Úteis

- [Documentação Vue.js](https://vuejs.org/)
- [Documentação Prisma](https://www.prisma.io/)
- [Documentação Express](https://expressjs.com/)
- [BNCC - Base Nacional Comum Curricular](http://basenacionalcomum.mec.gov.br/)

---

**Última atualização**: 24 de outubro de 2025  
**Versão**: 1.0.1  
**Status**: MVP Completo ✅ | Correções Aplicadas ✅

# 🚀 Guia de Início Rápido - SGE

## ⚡ Instalação Rápida (5 minutos)

### 1️⃣ Pré-requisitos

Certifique-se de ter instalado:
- [Node.js 20+](https://nodejs.org/)
- [MySQL 8.0+](https://dev.mysql.com/downloads/mysql/)
- [Git](https://git-scm.com/)

### 2️⃣ Configurar Backend

```bash
# Entre na pasta do backend
cd backend

# Instale as dependências
npm install

# Crie o arquivo de configuração
copy .env.example .env

# Edite o .env com suas configurações
# Altere pelo menos:
# - DATABASE_URL (URL do MySQL)
# - JWT_SECRET (mínimo 32 caracteres)
# - JWT_REFRESH_SECRET (mínimo 32 caracteres)

# Configure o banco de dados
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed

# Inicie o servidor
npm run dev
```

✅ Backend rodando em: http://localhost:3001

### 3️⃣ Configurar Frontend

```bash
# Abra um novo terminal
# Entre na pasta do frontend
cd frontend

# Instale as dependências
npm install

# (Opcional) Crie arquivo .env se necessário
copy .env.example .env

# Inicie o servidor
npm run dev
```

✅ Frontend rodando em: http://localhost:5173

### 4️⃣ Acessar Sistema

Abra o navegador em: **http://localhost:5173**

**Credenciais iniciais:**
- Email: `admin@sge.com`
- Senha: `Admin@2024`

---

## 🐛 Problemas Comuns

### ❌ Erro: "Cannot connect to database"

**Solução:**
1. Verifique se o MySQL está rodando
2. Confirme as credenciais no arquivo `.env`
3. Teste a conexão:
```bash
mysql -u root -p -h localhost
```

### ❌ Erro: "Prisma Client not generated"

**Solução:**
```bash
cd backend
npm run prisma:generate
```

### ❌ Erro: "Port already in use"

**Solução Windows:**
```powershell
# Ver processos na porta 3001
netstat -ano | findstr :3001

# Matar processo (substitua <PID>)
taskkill /PID <PID> /F
```

**Solução Linux/Mac:**
```bash
# Ver processos na porta 3001
lsof -i :3001

# Matar processo
kill -9 <PID>
```

### ❌ Erro: "JWT_SECRET deve ter no mínimo 32 caracteres"

**Solução:**
Gere um secret seguro:
```bash
# Windows PowerShell
[System.Convert]::ToBase64String([System.Text.Encoding]::UTF8.GetBytes([System.Guid]::NewGuid().ToString() + [System.Guid]::NewGuid().ToString()))

# Linux/Mac
openssl rand -base64 32
```

Cole o resultado no `.env`:
```env
JWT_SECRET="sua-chave-gerada-aqui"
JWT_REFRESH_SECRET="outra-chave-gerada-aqui"
```

---

## 📝 Checklist de Instalação

### Backend
- [ ] Node.js 20+ instalado
- [ ] MySQL 8.0+ rodando
- [ ] Dependências instaladas (`npm install`)
- [ ] Arquivo `.env` criado e configurado
- [ ] Prisma Client gerado (`npm run prisma:generate`)
- [ ] Migrations aplicadas (`npm run prisma:migrate`)
- [ ] Seed executado (`npm run prisma:seed`)
- [ ] Servidor rodando (`npm run dev`)
- [ ] Health check OK: http://localhost:3001/health

### Frontend
- [ ] Dependências instaladas (`npm install`)
- [ ] Servidor rodando (`npm run dev`)
- [ ] Aplicação acessível: http://localhost:5173
- [ ] Login funcionando

---

## 🎯 Próximos Passos

### 1. Explorar o Sistema
- Faça login com as credenciais fornecidas
- Navegue pelos módulos
- Crie um aluno de teste
- Lance uma chamada de teste

### 2. Personalizar
- Altere as configurações da escola em `ConfiguraçãoEscola`
- Crie novos usuários e perfis
- Configure turmas e disciplinas

### 3. Integrar
- Configure notificações por email (SMTP)
- Configure SMS (se aplicável)
- Personalize as cores e logo

### 4. Deploy
- Configure ambiente de produção
- Configure backups automáticos
- Configure SSL/HTTPS
- Configure domínio próprio

---

## 📚 Documentação Completa

Para informações detalhadas, consulte:

- **README.md principal** - Visão geral do projeto
- **backend/README.md** - Documentação do backend
- **Docs/REFERENCIA_PROJETO_SGE.md** - Referência técnica completa
- **Docs/DOCUMENTAÇÃO DE ARQUITETURA.txt** - Especificação funcional

---

## 🆘 Precisa de Ajuda?

1. Verifique a documentação na pasta `Docs/`
2. Procure no FAQ (seção de problemas comuns acima)
3. Abra uma issue no repositório
4. Entre em contato com o suporte

---

**Dica:** Execute todos os comandos na ordem apresentada para evitar problemas!

✨ **Boa sorte com seu Sistema de Gerenciamento Escolar!** ✨

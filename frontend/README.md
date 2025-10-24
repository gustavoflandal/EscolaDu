# 🎨 SGE Frontend

Interface web do Sistema de Gerenciamento Escolar construída com Vue 3 + TypeScript + Vite.

## 🚀 Início Rápido

```bash
# Instalar dependências
npm install

# Configurar variáveis de ambiente
cp .env.example .env

# Iniciar servidor de desenvolvimento
npm run dev
```

O frontend estará disponível em: **http://localhost:5173**

## 🛠️ Tecnologias

- **Vue 3** - Framework progressivo
- **TypeScript** - Tipagem estática
- **Vite** - Build tool
- **Vue Router** - Roteamento
- **Pinia** - State management
- **Axios** - HTTP client
- **TailwindCSS** - Styling
- **Chart.js** - Gráficos
- **vue-toastification** - Notificações

## 📁 Estrutura

```
src/
├── assets/          # Arquivos estáticos
├── components/      # Componentes reutilizáveis
├── layouts/         # Layouts da aplicação
├── router/          # Configuração de rotas
├── services/        # Serviços de API
├── stores/          # Stores Pinia
├── types/           # TypeScript types
├── views/           # Páginas/Views
├── App.vue         # Componente raiz
├── main.ts         # Entry point
└── style.css       # Estilos globais
```

## 🎯 Módulos Implementados

### ✅ Autenticação
- Login com JWT
- Refresh token automático
- Guards de rota
- Persistência de sessão

### ✅ Alunos
- Lista com busca e filtros
- Cadastro e edição
- Visualização de detalhes
- Estatísticas de frequência e desempenho

### 🚧 Em Desenvolvimento
- Turmas
- Frequência
- Objetivos de Aprendizagem
- Relatórios
- Dashboard completo

## 🔌 API

O frontend se comunica com o backend via REST API.

**Base URL**: `http://localhost:3001/api/v1`

### Endpoints Principais

```
POST   /auth/login           # Login
POST   /auth/refresh         # Refresh token
GET    /auth/me              # Dados do usuário
GET    /alunos               # Lista de alunos
POST   /alunos               # Criar aluno
GET    /alunos/:id           # Detalhes do aluno
PUT    /alunos/:id           # Atualizar aluno
DELETE /alunos/:id           # Deletar aluno
GET    /alunos/:id/stats     # Estatísticas do aluno
```

## 🎨 Customização

### Cores

Edite `tailwind.config.js` para alterar o tema:

```js
colors: {
  primary: {
    // Suas cores aqui
  }
}
```

### Logo

Substitua o arquivo `public/vite.svg` com seu logo.

## 🔧 Scripts Disponíveis

```bash
npm run dev       # Servidor de desenvolvimento
npm run build     # Build para produção
npm run preview   # Preview do build
npm run lint      # Linting
npm run format    # Formatar código
```

## 📝 Convenções de Código

- **Componentes**: PascalCase (ex: `AlunoCard.vue`)
- **Views**: Sufixo `View` (ex: `AlunosListView.vue`)
- **Stores**: Prefixo `use` (ex: `useAuthStore`)
- **Services**: Sufixo `.service.ts`
- **Types**: `types/index.ts`

## 🐛 Troubleshooting

### Erro de CORS

Verifique se o backend está configurado para aceitar requisições do frontend:

```typescript
// backend/src/config/env.ts
CORS_ORIGIN: process.env.CORS_ORIGIN || 'http://localhost:5173'
```

### Token expirado

O sistema automaticamente tenta renovar o token usando o refresh token. Se falhar, o usuário é redirecionado para o login.

### Erro 401 Unauthorized

Verifique se:
1. O backend está rodando
2. As credenciais estão corretas
3. O token JWT está válido

## 📚 Documentação Adicional

- [Vue 3](https://vuejs.org/)
- [Vite](https://vitejs.dev/)
- [Pinia](https://pinia.vuejs.org/)
- [Vue Router](https://router.vuejs.org/)
- [TailwindCSS](https://tailwindcss.com/)

## 🤝 Contribuindo

1. Crie uma feature branch (`git checkout -b feature/NovaFuncionalidade`)
2. Commit suas mudanças (`git commit -m 'Adiciona nova funcionalidade'`)
3. Push para a branch (`git push origin feature/NovaFuncionalidade`)
4. Abra um Pull Request

---

**Versão**: 1.0.0  
**Status**: MVP Completo ✅

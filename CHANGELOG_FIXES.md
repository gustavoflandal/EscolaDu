# 📝 Changelog - Correções Realizadas

**Data:** 24/10/2025  
**Versão:** 1.0.1

## 🐛 Problemas Corrigidos

### 1. Erro 429 (Too Many Requests) no Login

**Problema:**  
Ao tentar fazer login no sistema, o usuário recebia erro 429 (Too Many Requests), impedindo o acesso à aplicação.

**Causa Raiz:**
- Múltiplas requisições simultâneas ao endpoint de autenticação
- Auto-carregamento do usuário ao inicializar a aplicação conflitava com o login
- Ausência de controle de concorrência para refresh de tokens
- Falta de proteção contra múltiplos cliques no botão de login

**Arquivos Modificados:**
1. `frontend/src/stores/auth.ts`
2. `frontend/src/services/api.ts`
3. `frontend/src/views/auth/LoginView.vue`

**Soluções Implementadas:**

#### ✅ Frontend - Store de Autenticação
**Arquivo:** `frontend/src/stores/auth.ts`

Adicionado delay de 100ms no auto-carregamento do usuário:
```typescript
// Antes
if (token.value) {
  fetchUser()
}

// Depois
if (token.value) {
  setTimeout(() => {
    fetchUser()
  }, 100)
}
```

**Benefício:** Previne conflito entre requisições de login e carregamento automático do perfil.

---

#### ✅ Frontend - Interceptor de API
**Arquivo:** `frontend/src/services/api.ts`

Implementado sistema de fila para refresh tokens:
```typescript
let isRefreshing = false
let failedQueue: any[] = []

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error)
    } else {
      prom.resolve(token)
    }
  })
  failedQueue = []
}
```

**Benefícios:**
- Apenas uma requisição de refresh token por vez
- Requisições falhas são enfileiradas e reprocessadas após o refresh bem-sucedido
- Previne cascata de requisições simultâneas
- Melhora a experiência do usuário

---

#### ✅ Frontend - Tela de Login
**Arquivo:** `frontend/src/views/auth/LoginView.vue`

Adicionada proteção contra múltiplos cliques:
```typescript
async function handleLogin() {
  if (loading.value) return // Previne múltiplos cliques
  
  loading.value = true
  // ... resto do código
}
```

**Benefício:** Impede que o usuário submeta o formulário múltiplas vezes acidentalmente.

---

### 2. Erro de Validação no Login (Campo senha/password)

**Problema:**  
Inconsistência entre os nomes dos campos esperados pelo backend. O controller recebia `password` mas o validator e service esperavam `senha`.

**Causa Raiz:**
- Desalinhamento entre nomes de propriedades no fluxo de autenticação
- Controller extraía `password` do `req.body`
- Validator e Service esperavam `senha`
- Resultado: `undefined` sendo passado para `bcrypt.compare`, gerando erro "Illegal arguments"

**Arquivo Modificado:**
`backend/src/controllers/auth.controller.ts`

**Solução Implementada:**

```typescript
// Antes
const { email, password } = req.body;
const result = await authService.login({ email, password });

// Depois
const { email, senha } = req.body;
const result = await authService.login({ email, senha });
```

**Benefício:** Alinhamento completo entre frontend, validator, controller e service.

---

## 📊 Resultados

### Antes das Correções ❌
- ❌ Erro 429 ao tentar fazer login
- ❌ Múltiplas requisições simultâneas
- ❌ Erro "Illegal arguments: undefined, string"
- ❌ Impossível acessar o sistema

### Depois das Correções ✅
- ✅ Login funcionando perfeitamente
- ✅ Status 200 - Sucesso
- ✅ Tokens gerados corretamente
- ✅ Controle de concorrência implementado
- ✅ Proteção contra múltiplos cliques
- ✅ Mensagens de erro consistentes

---

## 🧪 Testes Realizados

### Teste 1: Login via API
```bash
node test-login.js
```

**Resultado:**
```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "1b716083-2a36-4c0e-88bc-05b425719dc6",
      "email": "admin@sge.com",
      "name": "Administrador do Sistema"
    }
  },
  "message": "Login realizado com sucesso"
}
```

**Status:** ✅ PASSOU

---

## 📚 Arquivos Criados

1. **`TROUBLESHOOTING.md`**
   - Guia completo de resolução de problemas
   - Documentação de erros comuns
   - Soluções passo a passo

2. **`test-login.js`**
   - Script de teste do endpoint de login
   - Útil para debugging e validação rápida

3. **`CHANGELOG_FIXES.md`** (este arquivo)
   - Documentação completa das correções
   - Histórico de mudanças

---

## 🔒 Segurança

As correções implementadas não comprometem a segurança do sistema:
- ✅ Autenticação JWT mantida
- ✅ Validação de credenciais preservada
- ✅ Hashing de senhas com bcrypt inalterado
- ✅ CORS configurado corretamente
- ✅ Helmet habilitado para headers de segurança

---

## 📝 Recomendações Futuras

### Rate Limiting (Opcional)
Para proteção adicional contra ataques de força bruta, considere adicionar rate limiting:

```bash
npm install express-rate-limit
```

```typescript
import rateLimit from 'express-rate-limit';

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 5, // 5 tentativas
  message: 'Muitas tentativas de login. Tente novamente em 15 minutos.'
});

router.post('/login', loginLimiter, validation(loginSchema), ...);
```

### Monitoramento
- Implementar logging de tentativas de login falhadas
- Alertas para múltiplas tentativas do mesmo IP
- Dashboard de métricas de autenticação

---

## 👥 Credenciais de Teste

**Email:** admin@sge.com  
**Senha:** Admin@2024

---

## 🚀 Como Usar

### 1. Limpar cache (se necessário)
```javascript
// No console do navegador (F12)
localStorage.clear()
sessionStorage.clear()
```

### 2. Acessar a aplicação
```
http://localhost:5174
```

### 3. Fazer login
- Usar as credenciais padrão
- Aguardar o carregamento (botão fica desabilitado durante o processo)

---

**Desenvolvido por:** Equipe EscolaDu  
**Última atualização:** 24/10/2025

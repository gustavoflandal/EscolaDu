# 🔧 Guia de Troubleshooting - EscolaDu

## Erro 429 (Too Many Requests) no Login

### Causa Raiz
O erro 429 ocorria devido a múltiplas requisições simultâneas ao tentar fazer login:
1. Auto-carregamento do usuário ao inicializar a aplicação
2. Múltiplas tentativas de refresh token sem controle de concorrência
3. Falta de proteção contra múltiplos cliques no botão de login

### Correções Implementadas ✅

#### 1. Frontend - Store de Autenticação (`frontend/src/stores/auth.ts`)
- Adicionado delay de 100ms no auto-carregamento do usuário
- Previne conflito entre login e carregamento automático

#### 2. Frontend - Interceptor de API (`frontend/src/services/api.ts`)
- Implementado sistema de fila para refresh tokens
- Garante que apenas uma requisição de refresh ocorra por vez
- Requisições falhas são enfileiradas e reprocessadas após o refresh

#### 3. Frontend - Tela de Login (`frontend/src/views/auth/LoginView.vue`)
- Proteção contra múltiplos cliques no botão
- Melhor tratamento de mensagens de erro

### Solução Imediata

Se você ainda está enfrentando o erro 429:

#### Passo 1: Limpar Cache do Navegador
```javascript
// Abra o DevTools (F12) > Console e execute:
localStorage.clear()
sessionStorage.clear()
```

#### Passo 2: Reiniciar os Servidores

**Backend:**
```bash
cd backend
# Parar o servidor (Ctrl+C)
npm run dev
```

**Frontend:**
```bash
cd frontend
# Parar o servidor (Ctrl+C)
npm run dev
```

#### Passo 3: Limpar Cookies e Recarregar
1. Abra DevTools (F12)
2. Vá em "Application" > "Storage"
3. Clique em "Clear site data"
4. Recarregue a página (Ctrl+R ou F5)

### Prevenção de Problemas Futuros

#### Boas Práticas ao Desenvolver:

1. **Sempre use as credenciais padrão para testes:**
   - Email: `admin@sge.com`
   - Senha: `Admin@2024`

2. **Evite múltiplos cliques no botão de login**
   - O botão agora tem proteção, mas aguarde a resposta

3. **Monitore o console do navegador**
   - Verifique se não há erros JavaScript
   - Observe as requisições de rede (aba Network)

4. **Limpe o localStorage periodicamente durante desenvolvimento**
   ```javascript
   localStorage.clear()
   ```

### Verificação de Saúde do Sistema

#### Backend Health Check
```bash
curl http://localhost:3001/health
```

Resposta esperada:
```json
{
  "status": "healthy",
  "timestamp": "2025-10-24T...",
  "uptime": 123.456,
  "environment": "development"
}
```

#### Portas Padrão
- **Backend:** http://localhost:3001
- **Frontend:** http://localhost:5173
- **MySQL:** localhost:3306

### Erros Comuns e Soluções

#### 1. "EADDRINUSE: address already in use"
**Problema:** Porta já está sendo usada por outra aplicação

**Solução:**
```bash
# Windows
netstat -ano | findstr :3001
taskkill /PID <PID> /F

# Ou altere a porta no backend/.env
PORT=3002
```

#### 2. "Failed to fetch" ou "Network Error"
**Problema:** Backend não está rodando ou CORS mal configurado

**Solução:**
1. Verifique se o backend está rodando
2. Confirme a variável `VITE_API_URL` no frontend
3. Verifique `CORS_ORIGIN` no backend/.env

#### 3. "Prisma Client not generated"
**Problema:** Cliente Prisma não foi gerado

**Solução:**
```bash
cd backend
npm run prisma:generate
```

#### 4. Erro 401 (Unauthorized) persistente
**Problema:** Token inválido ou expirado no localStorage

**Solução:**
```javascript
// Console do navegador
localStorage.removeItem('token')
localStorage.removeItem('refreshToken')
// Recarregue a página e faça login novamente
```

#### 5. Erro 500 (Internal Server Error)
**Problema:** Erro no servidor backend

**Solução:**
1. Verifique os logs do terminal do backend
2. Confirme que o MySQL está rodando
3. Verifique a conexão com o banco em `backend/.env`

### Debug de Requisições

#### Habilitar Logs Detalhados no Frontend
```typescript
// Adicione em frontend/src/services/api.ts (temporariamente)
api.interceptors.request.use((config) => {
  console.log('📤 Request:', config.method?.toUpperCase(), config.url)
  return config
})

api.interceptors.response.use((response) => {
  console.log('📥 Response:', response.status, response.config.url)
  return response
})
```

#### Verificar Requisições no DevTools
1. Abra DevTools (F12)
2. Vá em "Network"
3. Filtre por "Fetch/XHR"
4. Observe as requisições sendo feitas
5. Verifique headers, payload e response

### Contato e Suporte

Se o problema persistir:
1. Documente o erro completo (screenshot ou texto)
2. Verifique os logs do backend
3. Verifique o console do navegador
4. Reporte com todas as informações coletadas

---

**Última atualização:** 2025-10-24
**Versão:** 1.0.0

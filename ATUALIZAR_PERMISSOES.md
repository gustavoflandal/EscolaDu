# Atualização de Permissões - Módulo Responsáveis

## 📋 Alterações Realizadas

Foram adicionadas as permissões para o módulo de **Responsáveis** no sistema:

### 🔐 Novas Permissões Criadas

- `responsaveis:create` - Criar responsáveis
- `responsaveis:read` - Visualizar responsáveis
- `responsaveis:update` - Editar responsáveis
- `responsaveis:delete` - Excluir responsáveis

### 👥 Perfis Atualizados

#### **Administrador**
- ✅ Todas as permissões (incluindo responsáveis)

#### **Coordenador**
- ✅ `responsaveis:create`
- ✅ `responsaveis:read`
- ✅ `responsaveis:update`
- ✅ `responsaveis:delete`

#### **Professor**
- ✅ `responsaveis:read` (apenas visualização)

#### **Responsável**
- Sem permissões no módulo (mantido conforme original)

## 🚀 Como Aplicar as Alterações

### Passo 1: Executar o Seed de Permissões

No diretório do **backend**, execute:

```bash
cd backend
npm run prisma:seed-permissions
```

**OU**

```bash
cd backend
npx tsx prisma/seed-permissions.ts
```

### Passo 2: Verificar as Permissões

Após executar o seed, você pode verificar no banco de dados se as permissões foram criadas:

```sql
-- Ver todas as permissões de responsáveis
SELECT * FROM permissions WHERE resource = 'responsaveis';

-- Ver permissões do perfil Coordenador
SELECT p.* 
FROM permissions p
JOIN role_permissions rp ON p.id = rp.permissionId
JOIN roles r ON rp.roleId = r.id
WHERE r.name = 'Coordenador' AND p.resource = 'responsaveis';
```

### Passo 3: Testar no Sistema

1. Faça logout e login novamente para carregar as novas permissões
2. Com usuário **Coordenador**:
   - ✅ Deve ver o menu "Responsáveis"
   - ✅ Deve conseguir criar, editar e excluir responsáveis

3. Com usuário **Professor**:
   - ✅ Deve ver o menu "Responsáveis"
   - ✅ Deve conseguir apenas visualizar (sem botões de criar/editar/excluir)

4. Com usuário **Responsável**:
   - ❌ Não deve ver o menu "Responsáveis"

## 📝 Observações

- As permissões são aplicadas tanto no **menu** (visibilidade) quanto nas **rotas** (acesso direto via URL)
- O sistema verifica se o usuário tem **qualquer permissão** no recurso para exibir o menu
- Dentro da tela, as ações específicas (criar, editar, excluir) podem ser controladas individualmente

## 🔄 Em caso de problemas

Se após executar o seed as permissões não aparecerem:

1. **Limpe o localStorage do navegador:**
   - Abra o Console (F12)
   - Execute: `localStorage.clear()`
   - Recarregue a página

2. **Faça logout e login novamente:**
   - Isso força o carregamento das novas permissões do servidor

3. **Verifique o banco de dados:**
   - Confirme que as permissões foram criadas
   - Confirme que os roles estão associados às permissões

## ✅ Resultado Esperado

Após aplicar as alterações:

- ✅ Menu "Responsáveis" visível para Coordenadores e Professores
- ✅ Coordenadores podem gerenciar responsáveis completamente
- ✅ Professores podem apenas visualizar responsáveis
- ✅ Responsáveis não têm acesso ao módulo
- ✅ Administradores mantêm acesso total

---

**Data da Atualização:** 30 de outubro de 2025
**Módulo:** Sistema de Permissões - Responsáveis
**Branch:** feat/modulo-cadastro-professores

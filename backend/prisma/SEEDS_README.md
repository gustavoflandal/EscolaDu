# 🌱 Seeds do Sistema - Guia Completo

Este diretório contém scripts de seed para popular o banco de dados com dados iniciais e de exemplo. Use estes seeds para rapidamente configurar o sistema com dados de teste completos.

## 🚀 Quick Start - Executar Tudo

Para popular o sistema completo com todos os dados em um único comando:

```bash
npm run prisma:seed-completo
```

Este comando executa:
1. ✅ Seed principal (`seed.ts`) - Estrutura base do sistema
2. ✅ Seed adicional (`seed-dados-adicionais.ts`) - Dados complementares

## 📋 Seeds Disponíveis

### 1. 🎯 `seed.ts` - Seed Principal (RECOMENDADO)

**Comando:**
```bash
npm run prisma:seed
```

**O que cria:**
- ✅ **38 permissões** para todos os recursos
- ✅ **4 perfis** completos (Administrador, Coordenador, Professor, Responsável)
- ✅ **4 usuários** de teste (admin, coordenador, 2 professores)
- ✅ **2 anos letivos** (2024 encerrado, 2025 em andamento) com 3 períodos cada
- ✅ **9 disciplinas** completas (Português, Matemática, Ciências, etc.)
- ✅ **4 objetivos BNCC** de exemplo (1º ano)
- ✅ **2 professores** cadastrados
- ✅ **4 turmas** (1º e 2º ano, turmas A e B)
- ✅ **1 aluno** com responsável e matrícula
- ✅ **7 configurações** da escola

**Credenciais criadas:**
| Perfil | Email | Senha |
|--------|-------|-------|
| Administrador | `admin@escola.com.br` | `Admin@123` |
| Coordenador | `coordenador@escola.com.br` | `Coord@123` |
| Professor 1 | `joao.santos@escola.com.br` | `Prof@123` |
| Professor 2 | `maria.oliveira@escola.com.br` | `Prof@123` |
| Responsável | `carlos.silva@email.com` | `Resp@123` |

---

### 2. 📚 `seed-dados-adicionais.ts` - Dados Complementares

**Comando:**
```bash
npm run prisma:seed-adicional
```

**O que adiciona:**
- ✅ **+5 responsáveis** com usuários
- ✅ **+15 alunos** matriculados e vinculados
- ✅ **+6 turmas** (3º, 4º e 5º anos)
- ✅ **+9 objetivos BNCC** (2º e 3º anos)

**Requisitos:**
- ⚠️ Execute o seed principal primeiro!

---

### 3. 📖 `seed-disciplinas.ts` - Disciplinas e Objetivos BNCC

**Comando:**
```bash
npm run prisma:seed-disciplinas
```

**O que cria:**
- ✅ **9 disciplinas** com carga horária e descrições BNCC
- ✅ **17 objetivos de aprendizagem** (1º ano) com códigos BNCC oficiais
- ✅ Áreas de conhecimento configuradas
- ✅ Competências e habilidades vinculadas

**Disciplinas criadas:**
- Língua Portuguesa (5h/semana)
- Matemática (5h/semana)
- Ciências (3h/semana)
- História (2h/semana)
- Geografia (2h/semana)
- Arte (2h/semana)
- Educação Física (2h/semana)
- Língua Inglesa (2h/semana)
- Ensino Religioso (1h/semana)

---

### 4. 🎓 `seed-turmas.ts` - Turmas Completas

**Comando:**
```bash
npm run prisma:seed-turmas
```

**O que cria:**
- ✅ **33 turmas ativas** para 2025
- ✅ **3 turmas inativas** de 2024 (para testes)
- ✅ Distribuição de professores regentes
- ✅ Anos letivos e períodos configurados

**Turmas por nível:**
- 🧒 Educação Infantil: 6 turmas
- 📚 Fundamental I: 10 turmas
- 📖 Fundamental II: 8 turmas
- 🎓 Ensino Médio: 6 turmas
- 🌙 EJA: 3 turmas (noturno)

**Requisitos:**
- ⚠️ Professores devem existir (seed principal os cria)

---

### 5. 👶 `seed-alunos-exemplo.ts` - Alunos de Exemplo

**Comando:**
```bash
npm run prisma:seed-alunos
```

**O que cria:**
- ✅ **40 alunos** com dados realistas
- ✅ **40 matrículas** nas turmas
- ✅ Distribuição automática respeitando capacidade

**Requisitos:**
- ⚠️ Turmas devem existir (seed principal ou seed-turmas.ts)

---

### 6. 🔐 `seed-permissions.ts` - Apenas Permissões

**Comando:**
```bash
npm run prisma:seed-permissions
```

**O que cria:**
- ✅ Sistema completo de permissões e perfis
- ✅ Associações de permissões por perfil

**Nota:** Este seed está incluído no seed principal.

---

## 🎯 Cenários de Uso

### 📦 Cenário 1: Setup Completo (RECOMENDADO)
Para iniciar o projeto com dados completos:

```bash
npm run prisma:seed-completo
```

**Resultado:**
- 6 responsáveis com usuários
- 16 alunos matriculados
- 10 turmas (1º ao 5º ano)
- 13 objetivos BNCC
- 9 disciplinas completas
- 4 usuários de diferentes perfis

---

### 📦 Cenário 2: Setup Básico
Para começar com o mínimo necessário:

```bash
npm run prisma:seed
```

**Resultado:**
- Estrutura base do sistema
- 1 exemplo de cada entidade
- Pronto para adicionar seus dados

---

### 📦 Cenário 3: Apenas Disciplinas e BNCC
Para focar no módulo acadêmico:

```bash
npm run prisma:seed-disciplinas
```

**Resultado:**
- 9 disciplinas completas
- 17 objetivos BNCC do 1º ano
- Estrutura BNCC configurada

---

### 📦 Cenário 4: Apenas Turmas
Para testar módulo de turmas:

```bash
npm run prisma:seed-turmas
```

**Resultado:**
- 33 turmas ativas
- 3 turmas inativas (teste)
- Vários anos e séries

## 📊 Estatísticas do Seed Completo

Após executar `npm run prisma:seed-completo`, você terá:

| Categoria | Quantidade |
|-----------|------------|
| **Permissões** | 38 |
| **Perfis** | 4 |
| **Usuários** | 9 |
| **Professores** | 2 |
| **Responsáveis** | 6 |
| **Alunos** | 16 |
| **Turmas** | 10 |
| **Disciplinas** | 9 |
| **Objetivos BNCC** | 13 |
| **Anos Letivos** | 2 |
| **Configurações** | 7 |

## 🔄 Re-executar Seeds e Idempotência

### ✅ Seguro para Re-executar

Todos os seeds usam operações **idempotentes** com `upsert()`:

```typescript
// Exemplo: não cria duplicatas
await prisma.disciplina.upsert({
  where: { codigo: 'PORT' },
  update: { nome: 'Língua Portuguesa' },
  create: { codigo: 'PORT', nome: 'Língua Portuguesa' }
})
```

**Comportamento:**
- ✅ **Permissões e perfis** - Atualizados se já existirem
- ✅ **Turmas** - Verificadas por código único
- ✅ **Alunos** - Verificados por CPF
- ✅ **Matrículas** - Não duplicadas (verificação por aluno + turma)

**Benefícios:**
- 🔁 Pode executar múltiplas vezes sem problemas
- 🔄 Atualiza registros se dados mudarem
- 🚫 Não cria duplicatas
- 🛠️ Útil para corrigir dados em desenvolvimento

---

## 🗑️ Limpeza e Reset do Banco

### 🔴 Opção 1: Reset Completo (Recomendado)

Remove TODOS os dados e re-executa migrations + seed principal:

```bash
npx prisma migrate reset
```

⚠️ **ATENÇÃO:** Este comando:
- 🗑️ Apaga TODO o banco de dados
- 🏗️ Re-cria todas as tabelas
- ▶️ Executa automaticamente o seed principal (`seed.ts`)
- ❌ **NÃO executa** seeds adicionais

**Após o reset, para seed completo:**
```bash
npm run prisma:seed-adicional
```

---

### 🟡 Opção 2: Limpar Tabelas Manualmente

Se quiser limpar apenas algumas tabelas:

```bash
# Abrir Prisma Studio (interface visual)
npx prisma studio

# Ou conectar direto no banco e executar SQL
```

---

## 🎓 Dicas de Uso

### 🛠️ Durante Desenvolvimento

```bash
# 1. Sempre que modificar o schema.prisma:
npx prisma migrate dev --name descricao_mudanca

# 2. Para atualizar dados de teste:
npm run prisma:seed-completo

# 3. Para ver os dados no navegador:
npx prisma studio
```

### 🎪 Para Demonstrações

```bash
# Reset limpo + dados completos:
npx prisma migrate reset
npm run prisma:seed-adicional
```

### 🧪 Para Testes Específicos

```bash
# Testar apenas turmas:
npm run prisma:seed-turmas

# Testar apenas disciplinas:
npm run prisma:seed-disciplinas

# Testar apenas alunos:
npm run prisma:seed-alunos
```

---

## 🧪 Casos de Uso

### 1. **Testes de Interface**
Visualização de dados realistas em todas as telas

### 2. **Testes Funcionais**
Operações CRUD completas com dados consistentes

### 3. **Desenvolvimento Ágil**
Dados prontos para trabalhar sem configuração manual

### 4. **Demonstrações**
Sistema populado para apresentações a stakeholders

---

## 📝 Criar Seeds Personalizados

Para criar seus próprios dados:

1. **Copie um seed existente:**
   ```bash
   cp prisma/seed.ts prisma/seed-custom.ts
   ```

2. **Modifique os dados conforme necessário**

3. **Adicione um script no `package.json`:**
   ```json
   "prisma:seed-custom": "tsx prisma/seed-custom.ts"
   ```

4. **Execute:**
   ```bash
   npm run prisma:seed-custom
   ```

---

## ⚠️ Avisos Importantes

| ⚠️ Aviso | Descrição |
|---------|-----------|
| 🚫 **Produção** | **NÃO execute estes seeds em produção** - São apenas para desenvolvimento |
| 🔒 **Segurança** | Senhas de exemplo não são seguras (todas são `@123`) |
| 📧 **Dados Fictícios** | Emails, telefones e CPFs são fictícios |
| 🎭 **Apenas Testes** | Todos os dados são para fins de teste |

---

## � Credenciais de Teste

Todos os usuários criados usam senhas de exemplo:

| Tipo | Padrão |
|------|--------|
| Admin | `Admin@123` |
| Coordenador | `Coord@123` |
| Professor | `Prof@123` |
| Responsável | `Resp@123` |

**⚠️ NUNCA use estas senhas em produção!**

## 📚 Documentação Adicional

Para mais informações sobre o Prisma e seeds:
- [Prisma Seeding Guide](https://www.prisma.io/docs/guides/database/seed-database)
- [Documentação Prisma Client](https://www.prisma.io/docs/concepts/components/prisma-client)

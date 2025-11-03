# 🌱 Seeds do Sistema de Gestão Escolar

Este diretório contém scripts de seed modulares para popular o banco de dados com dados consistentes e bem relacionados.

## 📋 Estrutura dos Seeds

Os seeds são executados em ordem numérica, respeitando as dependências entre módulos:

### 0. Limpeza (`seed-clean.ts`)
- **Execução**: `npx ts-node prisma/seed-clean.ts`
- **Descrição**: Limpa todo o banco de dados, preservando apenas o usuário admin
- **Uso**: Execute antes de recriar dados do zero

### 1. Permissões (`seed-1-permissions.ts`)
- **Execução**: `npx ts-node prisma/seed-1-permissions.ts`
- **Descrição**: Cria estrutura de autenticação e autorização
- **Cria**:
  - 52 permissões (13 recursos × 4 ações: create, read, update, delete)
  - 4 roles: Administrador, Coordenador, Professor, Responsável
  - Usuário admin com todas as permissões
- **Credenciais**: `admin@sge.com` / `Admin@2024`

### 2. Cadastros Básicos (`seed-2-cadastros-basicos.ts`)
- **Execução**: `npx ts-node prisma/seed-2-cadastros-basicos.ts`
- **Descrição**: Estrutura acadêmica e infraestrutura
- **Cria**:
  - 1 ano letivo (2025, 02/01 a 20/12)
  - 4 períodos (bimestres com datas)
  - 5 séries (1º ao 5º Ano - Ensino Fundamental I)
  - 9 salas (6 regulares + 3 especiais: Lab Informática, Lab Ciências, Biblioteca)
  - 12 feriados nacionais e facultativos

### 3. Disciplinas (`seed-3-disciplinas.ts`)
- **Execução**: `npx ts-node prisma/seed-3-disciplinas.ts`
- **Descrição**: Currículo escolar
- **Cria**: 8 disciplinas fundamentais
  - **Linguagens**: Português (5h/sem), Inglês (2h/sem), Arte (2h/sem), Ed. Física (3h/sem)
  - **Matemática**: Matemática (5h/sem)
  - **Ciências da Natureza**: Ciências (3h/sem)
  - **Ciências Humanas**: História (3h/sem), Geografia (3h/sem)

### 4. Professores (`seed-4-professores.ts`)
- **Execução**: `npx ts-node prisma/seed-4-professores.ts`
- **Descrição**: Corpo docente
- **Cria**:
  - 8 professores especializados (1 por disciplina)
  - Contas de usuário para cada professor
  - Role "Professor" atribuído
  - 11 formações acadêmicas (graduação, pós, mestrado)
- **Credenciais**: `[email]` / `Prof@2024`
- **Instituições**: USP, UNICAMP, UNESP, PUC-SP

### 5. Turmas (`seed-5-turmas.ts`)
- **Execução**: `npx ts-node prisma/seed-5-turmas.ts`
- **Descrição**: Classes e horários
- **Cria**:
  - 10 turmas (2 por série: manhã e tarde)
  - Códigos no padrão: 1ANO-M, 1ANO-T, 2ANO-M, etc.
  - Atribuição de salas e professores regentes
  - Vínculos turma-disciplina com horários
  - Grade horária: Manhã (7h-12h), Tarde (13h-18h)

### 6. Alunos (`seed-6-alunos.ts`)
- **Execução**: `npx ts-node prisma/seed-6-alunos.ts`
- **Descrição**: Corpo discente
- **Cria**:
  - ~220 alunos (20-25 por turma)
  - Matrículas vinculadas às turmas
  - ~110 responsáveis (simulando irmãos)
  - Contas de usuário para responsáveis
  - Role "Responsavel" atribuído
- **Credenciais**: `[email]` / `Resp@2024`
- **Dados**: CPF, data nascimento, endereço, telefone, email

### 7. Programas de Ensino (`seed-7-programas.ts`)
- **Execução**: `npx ts-node prisma/seed-7-programas.ts`
- **Descrição**: Planejamento pedagógico
- **Cria**:
  - 16 programas (8 disciplinas × 2 séries)
  - ~80 objetivos de aprendizagem baseados na BNCC
  - Avaliações de objetivos para amostra de alunos
  - Códigos BNCC (EF01LP01, EF01MA01, etc.)
  - Pontuações e indicadores de atingimento

## 🚀 Execução

### Opção 1: Seed Master (Recomendado)
Executa todos os seeds na ordem correta com relatório final:

```bash
cd backend
npx ts-node prisma/seed-master.ts
```

Este comando irá:
1. Limpar o banco de dados
2. Executar todos os 7 seeds sequencialmente
3. Exibir progresso e erros
4. Mostrar resumo final com estatísticas

### Opção 2: Seeds Individuais
Execute seeds específicos conforme necessário:

```bash
# Limpar banco
npx ts-node prisma/seed-clean.ts

# Executar seeds na ordem
npx ts-node prisma/seed-1-permissions.ts
npx ts-node prisma/seed-2-cadastros-basicos.ts
npx ts-node prisma/seed-3-disciplinas.ts
npx ts-node prisma/seed-4-professores.ts
npx ts-node prisma/seed-5-turmas.ts
npx ts-node prisma/seed-6-alunos.ts
npx ts-node prisma/seed-7-programas.ts
```

### Opção 3: Recriar Apenas Alguns Módulos

```bash
# Exemplo: recriar apenas alunos e programas
npx ts-node prisma/seed-6-alunos.ts
npx ts-node prisma/seed-7-programas.ts
```

## 📊 Dados Gerados

Após executar todos os seeds, você terá:

| Categoria | Quantidade |
|-----------|-----------|
| **Autenticação** ||
| Permissões | 52 |
| Roles | 4 |
| Usuários | ~227 (1 admin + 8 professores + ~218 responsáveis) |
| **Acadêmico** ||
| Anos Letivos | 1 (2025) |
| Períodos | 4 (bimestres) |
| Séries | 5 (1º ao 5º ano) |
| Salas | 9 |
| Feriados | 12 |
| **Currículo** ||
| Disciplinas | 8 |
| Turmas | 10 |
| Turma-Disciplina Vínculos | ~80 |
| **Pessoas** ||
| Professores | 8 |
| Formações | 11 |
| Alunos | ~220 |
| Matrículas | ~220 |
| Responsáveis | ~110 |
| **Pedagógico** ||
| Programas de Ensino | 16 |
| Objetivos de Aprendizagem | ~80 |
| Avaliações de Objetivos | Centenas |

## 🔑 Credenciais de Acesso

### Administrador
- **Email**: admin@sge.com
- **Senha**: Admin@2024
- **Permissões**: Todas

### Professores
- **Email**: [nome].[sobrenome]@escola.com
- **Senha**: Prof@2024
- **Exemplos**:
  - maria.silva@escola.com (Português)
  - joao.oliveira@escola.com (Matemática)
  - ana.costa@escola.com (Ciências)

### Responsáveis
- **Email**: [nome].[sobrenome].resp@email.com
- **Senha**: Resp@2024
- **Exemplo**: carlos.silva.resp@email.com

## ⚠️ Notas Importantes

1. **Ordem de Execução**: Sempre execute os seeds na ordem numérica devido às dependências
2. **Limpeza**: Use `seed-clean.ts` apenas quando quiser resetar completamente o banco
3. **Dados Realistas**: Todos os dados são gerados de forma realista com nomes, CPFs, datas válidas
4. **BNCC**: Objetivos de aprendizagem seguem códigos reais da Base Nacional Comum Curricular
5. **Senhas**: Todas as senhas são criptografadas com bcrypt antes de salvar no banco

## 🐛 Troubleshooting

### Erro: "Ano letivo não encontrado"
**Solução**: Execute os seeds em ordem. Seeds 3+ dependem do seed 2.

### Erro: "Role não encontrado"
**Solução**: Execute o seed 1 primeiro para criar roles.

### Erro: "Foreign key constraint fails"
**Solução**: Limpe o banco com `seed-clean.ts` e execute todos os seeds novamente.

### Seed travou
**Solução**: 
1. Cancele com Ctrl+C
2. Execute `seed-clean.ts`
3. Execute `seed-master.ts` novamente

## 📝 Manutenção

### Adicionar Novos Dados
Para adicionar novos registros sem limpar o banco:
1. Execute apenas os seeds necessários
2. Ajuste os dados para evitar conflitos (emails, códigos únicos)

### Modificar Dados Existentes
1. Edite o arquivo de seed correspondente
2. Execute `seed-clean.ts`
3. Execute `seed-master.ts`

### Criar Novo Seed
Siga o padrão:
```typescript
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function seed() {
  console.log('📦 Seed X: Nome\n');
  // Seu código aqui
  console.log('✅ Seed X concluído!\n');
}

seed()
  .catch((e) => {
    console.error('❌ Erro:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```

## 🎯 Próximos Passos

Após executar os seeds:
1. Acesse o sistema com as credenciais do admin
2. Verifique se turmas mostram nomes de séries (não JSON)
3. Acesse a agenda dos professores
4. Teste os módulos de objetivos e avaliações
5. Verifique os relatórios e dashboards

## 📚 Referências

- [Prisma Seeding](https://www.prisma.io/docs/guides/database/seed-database)
- [BNCC - Base Nacional Comum Curricular](http://basenacionalcomum.mec.gov.br/)
- [Documentação do Sistema](../../Docs/ARQUITETURA_BACKEND.md)

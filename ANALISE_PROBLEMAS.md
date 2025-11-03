# Análise de Problemas do Sistema - 02/11/2025

## Problemas Identificados

### 1. **Inconsistência de Schema: Turma.serie**
- **Schema Prisma**: `serie` é um relacionamento com model `Serie` (object)
- **Código Frontend/Backend**: Muitos lugares tratam como string
- **Impacto**: Views mostrando JSON em vez de nome da série

**Locais afetados:**
- `AgendaProfessorView.vue:124` - `{{ aula.turma.serie }}`
- `TurmasListView.vue:103` - `{{ turma.ano }}` (campo não existe)
- `TurmaDetailView.vue:90` - `{{ turma.ano }}`
- Services que não incluem `serie` no Prisma select

### 2. **Campo `ano` não existe em Turma**
- **Schema**: Turma tem `anoLetivoId` (relacionamento)
- **Código**: Vários lugares buscam `turma.ano`
- **Correção**: Usar `turma.anoLetivo.ano`

### 3. **Modais Faltantes**
- Modal de criação de Aula (AulasListView)
- Modal de edição de Aula
- Modal de evidências (AvaliacaoTurmaView) - removido temporariamente

### 4. **Seeds Inconsistentes**
- Programas de ensino sem objetivos
- Turmas sem matrículas
- Dados não sincronizados entre tabelas

### 5. **Queries Prisma Incompletas**
- Falta incluir `serie` em queries de Turma
- Falta incluir `anoLetivo` onde necessário
- Includes aninhados causando erros

## Plano de Correção

### Fase 1: Backend - Schema e Services
1. ✅ Verificar todas as queries Prisma em services
2. ✅ Adicionar includes corretos para `serie`, `anoLetivo`
3. ✅ Corrigir validators que referenciam campos errados

### Fase 2: Frontend - Types e Views
1. ✅ Atualizar interfaces TypeScript
2. ✅ Corrigir todas as views para usar `serie.nome` e `anoLetivo.ano`
3. ✅ Adicionar formatação adequada de dados

### Fase 3: Seeds
1. ✅ Criar seed master consistente
2. ✅ Garantir relacionamentos corretos
3. ✅ Dados realistas e testáveis

### Fase 4: Modais
1. ✅ Implementar modais faltantes
2. ✅ Adicionar validações
3. ✅ Testar fluxos completos

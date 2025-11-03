# Seed 10: Frequência

Este seed cria dados de teste completos para o módulo de Frequência, incluindo aulas, registros de frequência e justificativas.

## 📦 O que é criado

### Aulas
- **Período**: Desde o início do 1º período letivo até 5 dias atrás
- **Quantidade**: Até 15 aulas por disciplina
- **Status**: `REALIZADA` (100% - apenas aulas passadas)
- **Horários**: Distribuídos conforme turno e grade horária
  - Matutino: 07:30 às 12:00 (5 horários)
  - Vespertino: 13:00 às 17:30 (5 horários)
  - Noturno: 19:00 às 22:40 (4 horários)
- **Conteúdo**: Conteúdo programático variado por disciplina
- **Dias da semana**: Respeitam grade realista
  - PORT/MAT: Segunda, Quarta, Sexta
  - CIEN/HIST/GEO: Terça, Quinta
  - ARTE: Quarta, Sexta
  - EDFIS: Terça
  - ING: Quinta

### Registros de Frequência
- **Criado para**: Todas as aulas realizadas
- **Distribuição de status**:
  - 85% - Presente (P)
  - 12% - Falta (F)
  - 3% - Justificada (J)
- **Registrado por**: Professor da disciplina
- **Data de registro**: Mesmo dia da aula

### Justificativas de Falta
- **Quantidade**: ~60% das faltas são justificadas
- **Período**: Referente às datas das aulas
- **Duração**: Um dia (dataInicio = dataFim = data da aula)
- **Motivos**:
  - Atestado médico - consulta de rotina
  - Atestado médico - gripe
  - Atestado médico - exames
  - Declaração de comparecimento - dentista
  - Declaração - compromisso familiar inadiável
  - Atestado médico - febre
  - Declaração - viagem em família
- **Aprovação**: 85% aprovadas automaticamente
- **Vínculo**: Justificativas aprovadas atualizam o status das faltas para "J"

## 🚀 Como executar

### Opção 1: Executar apenas o seed de frequência
```powershell
# Windows PowerShell
.\prisma\seed-frequencia.ps1

# Ou diretamente com ts-node
npx ts-node prisma/seed-10-frequencia.ts
```

### Opção 2: Executar todos os seeds (incluindo frequência)
```powershell
# Windows PowerShell
.\run-seeds.ps1

# Ou com seed-master
npx ts-node prisma/seed-master.ts
```

## ⚠️ Pré-requisitos

Este seed requer que os seguintes seeds já tenham sido executados:
1. `seed-1-permissions.ts` - Permissões e usuários
2. `seed-2-cadastros-basicos.ts` - Ano letivo, períodos, séries, salas
3. `seed-3-disciplinas.ts` - Disciplinas
4. `seed-4-professores.ts` - Professores
5. `seed-5-turmas.ts` - Turmas e vínculos com disciplinas
6. `seed-6-alunos.ts` - Alunos e matrículas

Se não houver:
- Período letivo criado → seed não executa
- Turmas ativas → seed não executa
- Disciplinas vinculadas → pula a turma
- Professores → pula a disciplina
- Alunos matriculados → aulas são criadas sem frequência

## 📊 Dados gerados (aproximado)

Para 10 turmas com ~20 alunos cada e 8 disciplinas:
- **Aulas**: ~1.200 aulas (10 turmas × 8 disciplinas × 15 aulas)
- **Frequência**: ~24.000 registros (1.200 aulas × 20 alunos)
- **Justificativas**: ~1.700 justificativas (12% de ~24.000 = ~2.880 faltas × 60% justificadas)

### Estatísticas esperadas
- Presentes: ~20.400 (85%)
- Faltas: ~2.880 (12%)
- Justificadas: ~720 (3%)

## 🧪 Testando os dados

Após executar o seed, você pode testar:

### Listagem de Aulas
```bash
GET /api/v1/frequencia/aulas
GET /api/v1/frequencia/aulas?dataInicio=2025-02-01&dataFim=2025-04-30
GET /api/v1/frequencia/aulas?turmaId=<id>&status=REALIZADA
GET /api/v1/frequencia/aulas?professorId=<id>
```

### Frequência
```bash
GET /api/v1/frequencia/aula/:aulaId/registros
GET /api/v1/frequencia/aluno/:alunoId/registros
GET /api/v1/frequencia/turma/:turmaId/estatisticas
```

### Justificativas
```bash
GET /api/v1/frequencia/justificativas
GET /api/v1/frequencia/justificativas?aprovada=false
GET /api/v1/frequencia/justificativas/:id
```

### Relatórios
```bash
GET /api/v1/relatorios/frequencia/turma/:turmaId
GET /api/v1/relatorios/frequencia/aluno/:alunoId
GET /api/v1/relatorios/frequencia/geral?dataInicio=xxx&dataFim=xxx
```

## 🔄 Limpeza

Para limpar os dados de frequência:
```powershell
# Opção 1: Limpar tudo e refazer todos os seeds
.\run-seeds.ps1

# Opção 2: Limpar manualmente no banco (cuidado!)
# DELETE FROM justificativa_falta;
# DELETE FROM registro_frequencia;
# DELETE FROM aulas;
```

⚠️ **ATENÇÃO**: Não há seed específico de limpeza apenas de frequência. Use `seed-clean.ts` para limpar tudo.

## 📝 Notas técnicas

### Distribuição realista
- O seed cria aulas **apenas em dias úteis** conforme os dias da semana definidos para cada disciplina
- Não cria aulas para fins de semana ou feriados
- A distribuição de presença/falta é realista (85% presente é uma taxa saudável)

### Grade horária
- Cada turno tem horários específicos e realistas
- Os horários são rotacionados por índice de aula para variar
- Intervalos entre horários são respeitados

### Conteúdo das aulas
- Cada disciplina tem um conjunto de conteúdos variados
- O conteúdo é rotacionado por índice de aula
- Exemplos: "Interpretação de texto narrativo", "Álgebra: Equações do 1º grau", etc.

### Justificativas
- Criadas apenas para 60% das faltas (nem toda falta é justificada)
- 85% são aprovadas automaticamente (processo realista)
- Quando aprovada, a falta (F) vira justificada (J) automaticamente
- O campo `justificativaId` da frequência é preenchido

### Performance
- Limitado a 15 aulas por disciplina para não sobrecarregar
- Usa bulk operations onde possível
- Mostra progresso detalhado no console
- Estatísticas finais com barra de progresso visual

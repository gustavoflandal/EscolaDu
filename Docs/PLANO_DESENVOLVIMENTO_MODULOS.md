# Plano de Desenvolvimento — Próximos Módulos (SGE)

Última atualização: 29 de outubro de 2025

Objetivo: produzir um roteiro técnico e operacional detalhado para implementação dos módulos pendentes do SGE, com prioridades, critérios de aceitação, estimativas de esforço, dependências, testes e entregáveis.

---

## 1. Resumo executivo

Atualmente o backend implementa os módulos centrais de autenticação (`auth`), cadastro de alunos (`alunos`) e dashboard/estatísticas. O banco de dados Prisma já contém um schema amplo que descreve várias entidades do domínio (professores, turmas, disciplinas, matrículas, frequência, objetivos, recuperação, comunicados, notificações, roles/permissions, etc.).

Este plano propõe uma sequência de entregas iterativas, priorizando funcionalidades críticas para operação escolar (cadastro de professores, turmas/matrículas, registro de frequência e objetivos) antes de funcionalidades complementares (comunicados, notificações, recuperação), garantindo testes, documentação e deploy contínuo.

---

## 2. Inventário rápido (mapa do que já existe)

Nota: este inventário foi construído a partir do código lido e das seeds já implementadas.

Implementado / funcional
- Autenticação (`src/controllers/auth.controller.ts`, `src/services/auth.service.ts`, `src/middleware/auth.middleware.ts`, `utils/jwt.util.ts`, `utils/password.util.ts`).
- Módulo Alunos (`controllers/aluno.controller.ts`, `services/aluno.service.ts`, `validators/aluno.validator.ts`, `routes/aluno.routes.ts`).
- Dashboard (`controllers/dashboard.controller.ts`, `services/dashboard.service.ts`, routes adicionadas).
- Prisma com schema amplo e `prisma/seed-full.ts` para popular dados de teste (404 alunos, 18 turmas, 15 professores, etc.).
- Response wrapper (`utils/response.util.ts`), error middleware (`middleware/error.middleware.ts`), logger (`config/logger.ts`) e env validation (`config/env.ts`).

Provavelmente parcialmente implementado (verificar arquivos):
- Roles / Permissions (existência do schema; checar services/controllers)
- Uploads / evidências (evidencia_aprendizagem)

Não implementado (ou não verificado):
- Módulo Professores completo (controllers/services/routes)
- Turmas / Matrículas (controllers/services/routes) — ainda que haja `turmas` no schema
- Disciplinas e vínculo turma-disciplina-professor
- Registro de frequência e justificativas (endpoints para lançar presença/falta/justificar)
- Objetivos de aprendizagem e avaliações por objetivo
- Planos de recuperação / acompanhamento
- Comunicados e leitura (interface para responsáveis)
- Notificações (push/email/SMS)

---

## 3. Critérios de priorização

Priorizar por impacto (operação escolar) e risco técnico:

1. Altamente crítico: Turmas, Matrículas, Professores, Frequência (uso diário)
2. Médio: Disciplinas, Objetivos, Avaliações (uso pedagógico relevante)
3. Baixo/Complementar: Planos de recuperação, Comunicados, Notificações, Evidências multimídia
4. Cross-cutting: Roles/Permissions, Audit Logs, Monitoramento, Testes, CI/CD

Prioridade prática (para as próximas 3 sprints):
- Sprint 1: Professores + Turmas + Matrículas
- Sprint 2: Frequência + Disciplinas + Vínculo Turma-Disciplina
- Sprint 3: Objetivos de Aprendizagem + Avaliações + Evidências
- Sprint 4: Planos de Recuperação + Comunicados + Notificações

---

## 4. Roadmap por módulo (detalhado)

Formato por módulo: descrição, endpoints propostos, alterações de DB/Prisma, critérios de aceitação, estimativa, dependências.

### 4.1 Professores

Descrição: CRUD completo para professores, importação em massa, perfil com disciplinas que lecionam.

Endpoints propostos
- GET /api/v1/professores?page&limit&search
- GET /api/v1/professores/:id
- POST /api/v1/professores
- PUT /api/v1/professores/:id
- DELETE /api/v1/professores/:id (soft-delete)
- POST /api/v1/professores/import (CSV)

Prisma (modelo):
- model Professor { id, nome, cpf?, email?, telefone?, formacao?, ativo, createdAt, updatedAt }
- índice: email, cpf

Critérios de aceitação
- API com validação Joi
- Senha não exposta nos responses
- Endpoint de import devolve relatório (sucesso/falhas)
- Testes unitários para service e integração mínima para CRUD

Estimativa: 2-3 dias de dev (+ 1 dia teste e revisão)
Dependências: Nenhuma crítica (roles se requerido)

### 4.2 Turmas e Matrículas

Descrição: Gerenciar turmas por ano/serie/período, alocar alunos, controle de vagas.

Endpoints Turmas
- GET /api/v1/turmas
- GET /api/v1/turmas/:id
- POST /api/v1/turmas
- PUT /api/v1/turmas/:id
- DELETE /api/v1/turmas/:id
- GET /api/v1/turmas/:id/alunos

Endpoints Matrículas
- POST /api/v1/matriculas (aluno -> turma)
- PUT /api/v1/matriculas/:id (transferências)
- GET /api/v1/alunos/:id/matriculas

Prisma: models Turma, Matricula (com status: MATRICULADO, TRANSFERIDO, EVADIDO)
Índices: turma(serie, ano), alunoId

Critérios de aceitação
- Alocação respeita capacidade da turma
- Paginação e filtros por série, ano e status
- Transação atômica ao matricular (cria matrícula e atualiza vagas)

Estimativa: 3-4 dias
Dependências: Professores (para ligação turma-disciplina), alunos

### 4.3 Disciplinas e Vínculo Turma-Disciplina-Professor

Descrição: Cadastro de disciplinas e atribuição de professores por turma.

Endpoints
- CRUD disciplinas
- POST /api/v1/turmas/:turmaId/disciplinas (vincular professor)
- GET /api/v1/turmas/:turmaId/disciplinas

Prisma: Disciplina, TurmaDisciplina{turmaId, disciplinaId, professorId}

Critérios
- Ao atribuir professor validar que professor existe e está ativo
- Relatório de horários (opcional)

Estimativa: 2 dias
Dependências: Professores, Turmas

### 4.4 Frequência (Registro de Aulas e Presenças)

Descrição: Registra aulas e presença de alunos por aula; permite justificativas.

Endpoints
- POST /api/v1/aulas (criar aula: turmaId, data, disciplinaId)
- GET /api/v1/aulas?turmaId&data
- POST /api/v1/aulas/:aulaId/frequencia (array de {alunoId, status})
- GET /api/v1/alunos/:id/frequencia
- POST /api/v1/faltas/:id/justificativa

Prisma: Aula, RegistroFrequencia (aulaId, alunoId, status:PRESENTE/FALTA/JUSTIFICADA)

Critérios
- Registro em lote eficiente (bulk insert/transaction)
- Relatório de frequência por aluno e por turma
- Média de frequência usada pelo dashboard

Estimativa: 4-6 dias (mais complexo: relatórios e performance)
Dependências: Turmas, Matrículas, Disciplina

### 4.5 Objetivos de Aprendizagem e Avaliações

Descrição: Gerenciar objetivos (BNCC), associar atividades e avaliar desempenho por objetivo.

Endpoints
- CRUD objetivos
- POST /api/v1/alunos/:id/avaliacoes-objetivos
- GET /api/v1/alunos/:id/objetivos

Prisma: ObjetivoAprendizagem, AvaliacaoObjetivo (alunoId, objetivoId, nota/enum)

Critérios
- Registro de evidências (links/paths) vinculado à avaliação
- Relatórios de domínio por aluno/turma

Estimativa: 3-5 dias
Dependências: Alunos, Turmas, Disciplinas

### 4.6 Planos de Recuperação e Acompanhamento

Descrição: Criar planos por aluno para recuperação/ reforço com acompanhamento.

Endpoints
- CRUD planos
- POST /api/v1/planos/:id/acompanhamento

Prisma: PlanoRecuperacao, RecuperacaoAcompanhamento

Estimativa: 2-3 dias
Dependências: Avaliações/Objetivos

### 4.7 Comunicados e Leitura (para Responsáveis)

Descrição: Emitir comunicados e registrar leitura por responsáveis.

Endpoints
- POST /api/v1/comunicados
- GET /api/v1/comunicados (filtros por turma/aluno)
- POST /api/v1/comunicados/:id/leitura

Prisma: Comunicado, ComunicadoLeitura

Critérios
- Permitir envio segmentado (turma/aluno/geral)
- Notificações opcionais

Estimativa: 2 dias

### 4.8 Notificações (Email/SMS/Push)

Descrição: Integração com provedores para envio de notificações; fila/retry.

Componentes
- Service de envio com adaptadores (SMTP, SMS provider, Firebase)
- Job/queue (node-cron ou BullMQ) para retries

Critérios
- Idempotência, logs de envio, retries

Estimativa: 3-5 dias (integração + infra)

### 4.9 Roles & Permissions + Audit Logs

Descrição: RBAC completo e auditoria de ações críticas.

Endpoints
- CRUD roles e permissions
- Assign role to user

Critérios
- Middleware `hasPermission` reutilizável
- Audit log para create/update/delete críticos

Estimativa: 2-3 dias

---

## 5. Tasks técnicas por módulo (exemplo para Turmas/Matrículas)

Para cada módulo criar tarefas similares a:
- 1. Model Prisma e migration
- 2. Service (business logic) com testes unitários
- 3. Controller + validators (Joi) + routes
- 4. Middlewares (permission, limpeza de input)
- 5. Seed scripts para testes e dados de QA
- 6. Integration tests (supertest) cobrindo endpoints críticos
- 7. Documentação OpenAPI / Swagger

Exemplo de checklist (por entidade):
- [ ] Model no `schema.prisma`
- [ ] Migration criada e testada localmente
- [ ] Service com testes unitários (Jest)
- [ ] Controller com respostas padronizadas (`successResponse`)
- [ ] Validators Joi escritos e acoplados
- [ ] Rotas registradas em `app.ts` / router principal
- [ ] Fixtures/seed para testes
- [ ] Testes de integração passando
- [ ] Endpoint documentado no OpenAPI

---

## 6. Qualidade, testes e CI

- Unit tests: Jest + ts-jest. Cobertura alvo: 70%+ inicialmente, 80% meta.
- Integration tests: Supertest para endpoints críticos (login, matricular, lançar frequência).
- E2E: Opcional com Playwright para fluxo login → dashboard → registrar frequência.

CI Pipeline (GitHub Actions) — fases:
1. Checkout
2. Install (npm ci)
3. Lint (eslint)
4. Build (tsc)
5. Test (unit + integration with ephemeral DB or SQLite/ Docker MySQL)
6. Prisma migrate:deploy (apenas em release)
7. Deploy (CD)

---

## 7. Seeds e testes de carga

- Reutilizar `prisma/seed-full.ts` para gerar cenários de teste (404 alunos já existente).
- Criar variantes: small (~500), medium (~5k), large (~50k) para teste de escala.
- Usar scripts de carga (artillery ou k6) para testes de performance em endpoints críticos (login, listagem de alunos, registro de frequência em lote).

---

## 8. Estimativa de roadmap (4 sprints - 2 semanas cada)

Sprint 1 (2 semanas)
- Professores (entrega mínima)
- Turmas + Matrículas (MVP)
- CI básico + testes unitários

Sprint 2 (2 semanas)
- Disciplinas e vínculo Turma-Disciplina-Professor
- Frequência (registro de aula e presença)
- Integração com dashboard para refletir frequência

Sprint 3 (2 semanas)
- Objetivos de Aprendizagem + Avaliações + Evidências
- Planos de Recuperação (MVP)

Sprint 4 (2 semanas)
- Comunicados + Leitura
- Notificações (integração básica)
- Roles & Permissions reforçado + Audit Logs

Observação: cada sprint inclui tarefas de documentação, seeds e pelo menos 1 integração contínua configurada para os novos endpoints.

---

## 9. Riscos e mitigação

1. Crescimento do schema e migrations complexas
   - Mitigação: dividir mudanças em migrations pequenas e testadas em staging
2. Performance em queries agregadas (frequência/objetivos)
   - Mitigação: adicionar índices e usar queries com `select` restrito; considerar materialized views/denormalização
3. Integração com provedores externos (email/SMS)
   - Mitigação: implementar adaptadores e um ambiente de testes que imite provedores (fake provider)
4. Escopo de front-end x API mismatch
   - Mitigação: definir contratos OpenAPI e testes de contrato

---

## 10. Entregáveis para cada módulo

- Código (controllers/services/routes)
- Migration e seed (prisma)
- Testes unitários e de integração
- Documentação (OpenAPI + README do módulo)
- Script de import (quando aplicável)
- Checklist de QA (cenários básicos)

---

## 11. Cronograma de curto prazo (próximos 30 dias)

Semana 1
- Mapear código atual, confirmar gaps (tarefa 1 e 2 do todo list)
- Implementar Professores (CRUD)

Semana 2
- Implementar Turmas e Matrículas (MVP)
- Criar seeds para turmas e matrículas

Semana 3
- Implementar Disciplinas e vínculo Turma-Disciplina
- Início do módulo Frequência (modelo + registro de aulas)

Semana 4
- Finalizar Frequência (registros em lote, relatórios básicos)
- Testes de integração e carga leve

---

## 12. Métricas de sucesso (KPIs)

- Tempo médio para matricular um aluno (meta: < 2s em requests simples)
- Taxa de acerto do endpoint de frequência em lote (meta: 100% sem erros)
- Cobertura de testes: >=70% após sprint 2
- Tempo de resposta médio (p95) de endpoints listados: < 300ms para consultas simples

---

## 13. Próximos passos imediatos (ação)

1. Concluir `id:1` do todo list (mapear arquivos faltantes e confirmar status atual dos módulos).  
2. Executar gap analysis (`id:2`) e atualizar este plano com links para arquivos e exemplos reais.  
3. Escolher prioridade de sprint e começar a tarefa "Professores - CRUD" como P0.

---

## 14. Anexos / Templates úteis

- Exemplo de validação Joi (use `validators/*.ts` como padrão)
- Exemplo de response wrapper: `utils/response.util.ts`
- Exemplo de logger: `src/config/logger.ts`
- Template de migration explicado em `prisma/`

---

## 15. Conclusão

Este documento serve como roteiro técnico e operacional para os próximos módulos. Ele é iterativo: após a conclusão das tarefas de mapeamento e análise de lacunas (já em andamento), irei atualizar estimativas, dependências e dividir as tarefas em tickets menores para implementação.  

Se quiser, posso agora:
- Executar o mapeamento automático do repositório e gerar um relatório mais preciso (arquivos por módulo, coverage atual).  
- Gerar os templates de controller/service/validator para as entidades priorizadas (ex.: `professores`).  
- Criar as migrations iniciais para `professores` e `turmas` e um seed de exemplo.

Escolha uma dessas ações para eu executar em seguida.

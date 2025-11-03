# Módulo de Frequência

Este módulo gerencia a frequência escolar, incluindo:

## Funcionalidades Implementadas

### Backend (✅ Completo)
- **Gestão de Aulas**
  - CRUD completo de aulas
  - Validação de conflitos de horário
  - Status: PLANEJADA, REALIZADA, CANCELADA, REPOSTA
  - Listagem com filtros (data, turma, status)

- **Lançamento de Frequência**
  - Lançamento de chamada em lote
  - Status: P (Presente), F (Falta), J (Justificada)
  - Observações por aluno
  - Edição de frequência já lançada

- **Justificativas de Faltas**
  - Cadastro de justificativas com período
  - Upload de documentos comprobatórios
  - Workflow de aprovação
  - Aplicação automática aos registros de falta

- **Relatórios e Estatísticas**
  - Frequência por aluno com percentuais
  - Frequência por turma com ranking
  - Frequência por disciplina
  - Alertas automáticos para frequência < 75%

### Frontend (✅ Completo)

#### Componentes Criados:
1. **AulasListView.vue**
   - Lista de aulas com filtros
   - Status visual das aulas
   - Botão para lançar frequência
   - Ações: visualizar, editar, excluir

2. **LancarChamadaModal.vue**
   - Modal para lançamento de frequência
   - Botões P/F/J para cada aluno
   - Ações em massa (marcar todos)
   - Campo de observação por aluno
   - Resumo em tempo real

3. **FrequenciaReportView.vue**
   - Cards com estatísticas gerais
   - Tabela de frequência por aluno
   - Alertas de frequência baixa
   - Frequência por disciplina
   - Filtros por turma e período

4. **JustificativasListView.vue**
   - Lista de justificativas
   - Filtros (status, período)
   - Aprovação de justificativas
   - Link para documentos
   - Ações: aprovar, visualizar, editar, excluir

5. **FrequenciaLayout.vue**
   - Layout com submenu de navegação
   - Links para Aulas, Relatórios e Justificativas

#### Rotas Configuradas:
- `/frequencia` → redireciona para `/frequencia/aulas`
- `/frequencia/aulas` → Lista de aulas
- `/frequencia/relatorio` → Relatórios de frequência
- `/frequencia/justificativas` → Gestão de justificativas

#### Menu:
- ✅ Item "Frequência" adicionado ao menu principal do DashboardLayout

## API Endpoints

### Aulas
- `GET /api/v1/frequencia/aulas` - Listar aulas
- `GET /api/v1/frequencia/aulas/:id` - Buscar aula
- `GET /api/v1/frequencia/aulas/hoje` - Aulas do dia
- `POST /api/v1/frequencia/aulas` - Criar aula
- `PUT /api/v1/frequencia/aulas/:id` - Atualizar aula
- `PATCH /api/v1/frequencia/aulas/:id/cancelar` - Cancelar aula
- `DELETE /api/v1/frequencia/aulas/:id` - Excluir aula

### Frequência
- `POST /api/v1/frequencia/lancar-chamada` - Lançar frequência
- `GET /api/v1/frequencia/aula/:aulaId` - Frequência por aula
- `GET /api/v1/frequencia/aluno/:alunoId` - Frequência por aluno
- `GET /api/v1/frequencia/turma/:turmaId` - Relatório de turma

### Justificativas
- `GET /api/v1/frequencia/justificativas` - Listar justificativas
- `GET /api/v1/frequencia/justificativas/pendentes` - Justificativas pendentes
- `GET /api/v1/frequencia/justificativas/:id` - Buscar justificativa
- `POST /api/v1/frequencia/justificativas` - Criar justificativa
- `PUT /api/v1/frequencia/justificativas/:id` - Atualizar justificativa
- `PATCH /api/v1/frequencia/justificativas/:id/aprovar` - Aprovar justificativa
- `DELETE /api/v1/frequencia/justificativas/:id` - Excluir justificativa

## Permissões Necessárias

O módulo utiliza o recurso `frequencia` com as seguintes ações:
- `read` - Visualizar aulas e frequência
- `create` - Criar aulas e lançar frequência
- `update` - Editar aulas e frequência
- `delete` - Excluir aulas e justificativas
- `approve` - Aprovar justificativas (coordenador/admin)

## Próximos Passos (Opcionais)

- [ ] Adicionar gráficos de frequência (Chart.js)
- [ ] Implementar modais de criação/edição de aulas
- [ ] Adicionar modal de criação de justificativas
- [ ] Implementar upload de documentos para justificativas
- [ ] Adicionar exportação de relatórios em PDF/Excel
- [ ] Notificações automáticas para frequência baixa
- [ ] Dashboard de frequência com indicadores gerais

## Testes Recomendados

1. **Backend**: Testar todos os endpoints com Postman/Thunder Client
2. **Permissões**: Verificar se o resource 'frequencia' existe no seed de permissões
3. **Frontend**: Navegar pelas telas e testar fluxo completo
4. **Integração**: Lançar frequência e verificar cálculos de percentual
5. **Workflow**: Criar e aprovar justificativas, verificar aplicação automática

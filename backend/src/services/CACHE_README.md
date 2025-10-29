# Sistema de Cache do Dashboard

## Visão Geral

O sistema de cache foi implementado para otimizar o desempenho das consultas do dashboard, evitando cálculos repetitivos e queries pesadas ao banco de dados.

## Funcionamento

### Cache Manager

O `CacheManager` é uma classe simples que armazena dados em memória (Map) com TTL (Time To Live).

**Características:**
- Armazenamento em memória (volátil)
- TTL configurável por entrada
- Invalidação automática ao expirar
- Métodos para invalidação manual

### Dados Cacheados

#### 1. Dashboard Stats (`dashboard:stats`)
- **TTL:** 5 minutos
- **Dados:** Total de alunos, turmas, frequência média, desempenho médio, alertas
- **Endpoint:** `GET /api/v1/dashboard/stats`
- **Motivo:** Agregações pesadas em múltiplas tabelas

#### 2. Dashboard Alerts (`dashboard:alerts`)
- **TTL:** 10 minutos
- **Dados:** Alertas de frequência baixa e desempenho crítico
- **Endpoint:** `GET /api/v1/dashboard/alerts`
- **Motivo:** Cálculos por aluno que podem ser lentos com muitos registros

## Uso

### Buscar Stats (com cache)
```typescript
const stats = await dashboardService.getGeneralStats();
// 1ª chamada: calcula e armazena no cache
// 2ª chamada (dentro de 5min): retorna do cache
```

### Invalidar Cache Manualmente
```typescript
// Via service
dashboardService.invalidateCache();

// Via endpoint
POST /api/v1/dashboard/refresh-cache
```

## Quando Invalidar o Cache

O cache deve ser invalidado quando dados que afetam o dashboard são modificados:

- Criação/atualização/exclusão de alunos
- Registro de frequência
- Avaliação de objetivos
- Criação/atualização de turmas
- Matrícula/transferência de alunos

**Exemplo em um controller:**
```typescript
import { dashboardService } from '../services/dashboard.service';

// Após criar/atualizar aluno
await alunoService.create(data);
dashboardService.invalidateCache(); // Invalida cache
```

## Logs

O sistema registra eventos de cache:
- `Cache SET: dashboard:stats (TTL: 5min)` - Quando armazena
- `Cache HIT: dashboard:stats` - Quando retorna do cache
- `Cache EXPIRED: dashboard:stats` - Quando expira automaticamente
- `Cache INVALIDATED: dashboard:stats` - Quando invalidado manualmente

## Melhorias Futuras

### Produção (Recomendado)
Para ambientes de produção, considerar:

1. **Redis** - Cache distribuído e persistente
   ```bash
   npm install redis @types/redis
   ```

2. **Node-Cache** - Biblioteca mais robusta
   ```bash
   npm install node-cache @types/node-cache
   ```

3. **Cache por Usuário** - Estatísticas personalizadas
   ```typescript
   cacheManager.set(`dashboard:stats:${userId}`, data, 10);
   ```

4. **Cache de Segundo Nível** - Persistir em arquivo
   ```typescript
   fs.writeFileSync('.cache/dashboard.json', JSON.stringify(data));
   ```

5. **Warming do Cache** - Pré-calcular em background
   ```typescript
   setInterval(() => {
     dashboardService.invalidateCache();
     dashboardService.getGeneralStats(); // Recalcula
   }, 30 * 60 * 1000); // A cada 30min
   ```

## Monitoramento

Para monitorar efetividade do cache:

```typescript
class CacheManager {
  private hits = 0;
  private misses = 0;

  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    if (entry && !this.isExpired(entry)) {
      this.hits++;
      return entry.data;
    }
    this.misses++;
    return null;
  }

  getStats() {
    const total = this.hits + this.misses;
    return {
      hits: this.hits,
      misses: this.misses,
      hitRate: total > 0 ? (this.hits / total) * 100 : 0
    };
  }
}
```

## Testes

```typescript
describe('DashboardService Cache', () => {
  it('deve retornar do cache na segunda chamada', async () => {
    const stats1 = await dashboardService.getGeneralStats();
    const stats2 = await dashboardService.getGeneralStats();
    
    expect(stats1).toEqual(stats2);
    // Verificar logs para confirmar cache HIT
  });

  it('deve recalcular após invalidar cache', async () => {
    await dashboardService.getGeneralStats();
    dashboardService.invalidateCache();
    const stats = await dashboardService.getGeneralStats();
    
    expect(stats).toBeDefined();
    // Verificar logs para confirmar recálculo
  });
});
```

## Configuração

Para ajustar TTL, editar `dashboard.service.ts`:

```typescript
// Stats - atualmente 5 minutos
cacheManager.set(cacheKey, result, 5);

// Alerts - atualmente 10 minutos
cacheManager.set(cacheKey, alertas, 10);
```

**Recomendações de TTL:**
- Desenvolvimento: 1-2 minutos (feedback rápido)
- Staging: 5-10 minutos (balance)
- Produção: 10-30 minutos (performance máxima)

import { prisma } from '../config/database';
import { logger } from '../config/logger';

// Cache em memória com TTL
interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number; // em milissegundos
}

class CacheManager {
  private cache: Map<string, CacheEntry<any>> = new Map();

  set<T>(key: string, data: T, ttlMinutes: number = 5): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl: ttlMinutes * 60 * 1000,
    });
    logger.debug(`Cache SET: ${key} (TTL: ${ttlMinutes}min)`);
  }

  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    
    if (!entry) {
      return null;
    }

    const isExpired = Date.now() - entry.timestamp > entry.ttl;
    
    if (isExpired) {
      this.cache.delete(key);
      logger.debug(`Cache EXPIRED: ${key}`);
      return null;
    }

    logger.debug(`Cache HIT: ${key}`);
    return entry.data as T;
  }

  invalidate(key: string): void {
    this.cache.delete(key);
    logger.debug(`Cache INVALIDATED: ${key}`);
  }

  invalidateAll(): void {
    this.cache.clear();
    logger.debug('Cache CLEARED');
  }
}

const cacheManager = new CacheManager();

export class DashboardService {
  /**
   * Busca estatísticas gerais do sistema
   */
  async getGeneralStats() {
    // Tentar buscar do cache
    const cacheKey = 'dashboard:stats';
    const cached = cacheManager.get<any>(cacheKey);
    
    if (cached) {
      logger.info('Dashboard stats retornadas do cache');
      return cached;
    }

    // Se não estiver no cache, calcular
    logger.info('Calculando dashboard stats...');

    // Total de alunos ativos
    const totalAlunos = await prisma.aluno.count({
      where: { active: true, status: 'ATIVO' },
    });

    // Total de turmas ativas
    const totalTurmas = await prisma.turma.count({
      where: { active: true },
    });

    // Calcular frequência média
    const frequencias = await prisma.registroFrequencia.groupBy({
      by: ['status'],
      _count: true,
    });

    const totalPresencas = frequencias.find(f => f.status === 'P')?._count || 0;
    const totalFaltas = frequencias.find(f => f.status === 'F')?._count || 0;
    const totalJustificadas = frequencias.find(f => f.status === 'J')?._count || 0;
    const totalRegistros = totalPresencas + totalFaltas + totalJustificadas;
    const frequenciaMedia = totalRegistros > 0 
      ? Math.round((totalPresencas / totalRegistros) * 100) 
      : 0;

    // Calcular desempenho médio (objetivos)
    const avaliacoes = await prisma.avaliacaoObjetivo.groupBy({
      by: ['status'],
      _count: true,
    });

    const totalAtingidos = avaliacoes.find(a => a.status === 'A')?._count || 0;
    const totalAvaliacoes = avaliacoes.reduce((sum, a) => sum + a._count, 0);
    const desempenhoMedio = totalAvaliacoes > 0 
      ? Math.round((totalAtingidos / totalAvaliacoes) * 100) 
      : 0;

    // Alunos com frequência abaixo do mínimo
    const alunosFrequenciaBaixa = await this.getAlunosComFrequenciaBaixa();

    // Alunos com desempenho crítico
    const alunosDesempenhoCritico = await this.getAlunosComDesempenhoCritico();

    const result = {
      totalAlunos,
      totalTurmas,
      frequenciaMedia,
      desempenhoMedio,
      alertas: {
        frequenciaBaixa: alunosFrequenciaBaixa.length,
        desempenhoCritico: alunosDesempenhoCritico.length,
      },
    };

    // Armazenar no cache por 5 minutos
    cacheManager.set(cacheKey, result, 5);

    return result;
  }

  /**
   * Busca atividades recentes do sistema
   */
  async getRecentActivities(limit: number = 10) {
    const auditLogs = await prisma.auditLog.findMany({
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    return auditLogs.map(log => ({
      id: log.id,
      action: log.action,
      entity: log.entity,
      userName: log.user?.name || 'Sistema',
      timestamp: log.createdAt,
    }));
  }

  /**
   * Busca alertas do sistema
   */
  async getSystemAlerts() {
    // Tentar buscar do cache
    const cacheKey = 'dashboard:alerts';
    const cached = cacheManager.get<any[]>(cacheKey);
    
    if (cached) {
      logger.info('Dashboard alerts retornados do cache');
      return cached;
    }

    // Se não estiver no cache, calcular
    logger.info('Calculando dashboard alerts...');

    const alertas = [];

    // Alunos com frequência baixa
    const alunosFrequenciaBaixa = await this.getAlunosComFrequenciaBaixa();
    if (alunosFrequenciaBaixa.length > 0) {
      alertas.push({
        tipo: 'FREQUENCIA',
        severidade: 'ALTA',
        mensagem: `${alunosFrequenciaBaixa.length} aluno(s) com frequência abaixo de 75%`,
        detalhes: alunosFrequenciaBaixa.slice(0, 5),
      });
    }

    // Alunos com desempenho crítico
    const alunosDesempenhoCritico = await this.getAlunosComDesempenhoCritico();
    if (alunosDesempenhoCritico.length > 0) {
      alertas.push({
        tipo: 'DESEMPENHO',
        severidade: 'MEDIA',
        mensagem: `${alunosDesempenhoCritico.length} aluno(s) com desempenho crítico`,
        detalhes: alunosDesempenhoCritico.slice(0, 5),
      });
    }

    // Armazenar no cache por 10 minutos
    cacheManager.set(cacheKey, alertas, 10);

    return alertas;
  }

  /**
   * Invalida cache do dashboard (usar após operações que alterem dados)
   */
  invalidateCache(): void {
    cacheManager.invalidate('dashboard:stats');
    cacheManager.invalidate('dashboard:alerts');
    logger.info('Cache do dashboard invalidado');
  }

  /**
   * Busca alunos com frequência abaixo do mínimo
   */
  private async getAlunosComFrequenciaBaixa() {
    const alunos = await prisma.aluno.findMany({
      where: { active: true, status: 'ATIVO' },
      include: {
        frequencias: true,
      },
    });

    const alunosComFrequenciaBaixa = alunos
      .map(aluno => {
        const totalPresencas = aluno.frequencias.filter(f => f.status === 'P').length;
        const totalRegistros = aluno.frequencias.length;
        const percentual = totalRegistros > 0 
          ? (totalPresencas / totalRegistros) * 100 
          : 100;

        return {
          alunoId: aluno.id,
          nome: aluno.nome,
          matricula: aluno.matricula,
          percentual: Math.round(percentual),
        };
      })
      .filter(a => a.percentual < 75)
      .sort((a, b) => a.percentual - b.percentual);

    return alunosComFrequenciaBaixa;
  }

  /**
   * Busca alunos com desempenho crítico
   */
  private async getAlunosComDesempenhoCritico() {
    const alunos = await prisma.aluno.findMany({
      where: { active: true, status: 'ATIVO' },
      include: {
        avaliacoes: true,
      },
    });

    const alunosComDesempenhoCritico = alunos
      .map(aluno => {
        const totalAtingidos = aluno.avaliacoes.filter(a => a.status === 'A').length;
        const totalAvaliacoes = aluno.avaliacoes.length;
        const percentual = totalAvaliacoes > 0 
          ? (totalAtingidos / totalAvaliacoes) * 100 
          : 100;

        const objetivosNaoAtingidos = aluno.avaliacoes.filter(a => a.status === 'N').length;

        return {
          alunoId: aluno.id,
          nome: aluno.nome,
          matricula: aluno.matricula,
          percentual: Math.round(percentual),
          objetivosNaoAtingidos,
        };
      })
      .filter(a => a.percentual < 70 || a.objetivosNaoAtingidos >= 3)
      .sort((a, b) => a.percentual - b.percentual);

    return alunosComDesempenhoCritico;
  }
}

export const dashboardService = new DashboardService();

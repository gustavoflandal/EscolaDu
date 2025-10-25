import { prisma } from '../config/database';
import { logger } from '../config/logger';

export interface DashboardStats {
  totalAlunos: number;
  totalTurmas: number;
  frequenciaMedia: number;
  desempenhoMedio: number;
}

export class DashboardService {
  /**
   * Retorna estatísticas do dashboard
   */
  async getStats(): Promise<DashboardStats> {
    try {
      // Total de alunos ativos
      const totalAlunos = await prisma.aluno.count({
        where: { active: true }
      });

      // Total de turmas ativas
      const totalTurmas = await prisma.turma.count({
        where: { active: true }
      });

      // TODO: Calcular frequência média real quando implementar módulo de frequência
      const frequenciaMedia = 0;

      // TODO: Calcular desempenho médio real quando implementar módulo de objetivos
      const desempenhoMedio = 0;

      return {
        totalAlunos,
        totalTurmas,
        frequenciaMedia,
        desempenhoMedio
      };
    } catch (error) {
      logger.error('Erro ao buscar estatísticas do dashboard:', error);
      throw error;
    }
  }
}

export const dashboardService = new DashboardService();

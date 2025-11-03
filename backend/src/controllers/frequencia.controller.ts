import { Request, Response } from 'express';
import { frequenciaService } from '../services/frequencia.service';
import { successResponse, errorResponse } from '../utils/response.util';
import { logger } from '../config/logger';
import { AuthRequest } from '../middleware/auth.middleware';

export class FrequenciaController {
  /**
   * Lança chamada para uma aula
   * POST /api/v1/frequencia/lancar-chamada
   */
  async lancarChamada(req: AuthRequest, res: Response): Promise<void> {
    try {
      const { aulaId, registros } = req.body;
      const registradoPor = req.userId!;

      const result = await frequenciaService.lancarChamada({
        aulaId,
        registros,
        registradoPor
      });

      successResponse(res, result, 'Chamada lançada com sucesso', 201);
    } catch (error: any) {
      logger.error('Erro ao lançar chamada:', error);
      
      if (error.message.includes('não encontrada') || error.message.includes('não pertencem')) {
        errorResponse(res, 'NOT_FOUND', error.message, 404);
      } else if (error.message.includes('cancelada')) {
        errorResponse(res, 'BAD_REQUEST', error.message, 400);
      } else {
        errorResponse(res, 'LANCAMENTO_ERROR', error.message);
      }
    }
  }

  /**
   * Busca frequência de uma aula
   * GET /api/v1/frequencia/aula/:aulaId
   */
  async getFrequenciaAula(req: Request, res: Response): Promise<void> {
    try {
      const { aulaId } = req.params;
      const result = await frequenciaService.getFrequenciaAula(aulaId);

      successResponse(res, result, 'Frequência da aula obtida com sucesso');
    } catch (error: any) {
      logger.error('Erro ao buscar frequência da aula:', error);
      
      if (error.message === 'Aula não encontrada') {
        errorResponse(res, 'NOT_FOUND', error.message, 404);
      } else {
        errorResponse(res, 'FETCH_ERROR', error.message);
      }
    }
  }

  /**
   * Busca frequência de um aluno
   * GET /api/v1/frequencia/aluno/:alunoId
   */
  async getFrequenciaAluno(req: Request, res: Response): Promise<void> {
    try {
      const { alunoId } = req.params;
      const { dataInicio, dataFim, turmaId, disciplinaId } = req.query;

      const result = await frequenciaService.getFrequenciaAluno({
        alunoId,
        dataInicio: dataInicio ? new Date(dataInicio as string) : undefined,
        dataFim: dataFim ? new Date(dataFim as string) : undefined,
        turmaId: turmaId as string,
        disciplinaId: disciplinaId as string
      });

      successResponse(res, result, 'Frequência do aluno obtida com sucesso');
    } catch (error: any) {
      logger.error('Erro ao buscar frequência do aluno:', error);
      
      if (error.message === 'Aluno não encontrado') {
        errorResponse(res, 'NOT_FOUND', error.message, 404);
      } else {
        errorResponse(res, 'FETCH_ERROR', error.message);
      }
    }
  }

  /**
   * Busca frequência consolidada de uma turma
   * GET /api/v1/frequencia/turma/:turmaId
   */
  async getFrequenciaTurma(req: Request, res: Response): Promise<void> {
    try {
      const { turmaId } = req.params;
      const { dataInicio, dataFim, disciplinaId } = req.query;

      const result = await frequenciaService.getFrequenciaTurma({
        turmaId,
        dataInicio: dataInicio ? new Date(dataInicio as string) : undefined,
        dataFim: dataFim ? new Date(dataFim as string) : undefined,
        disciplinaId: disciplinaId as string
      });

      successResponse(res, result, 'Frequência da turma obtida com sucesso');
    } catch (error: any) {
      logger.error('Erro ao buscar frequência da turma:', error);
      
      if (error.message === 'Turma não encontrada') {
        errorResponse(res, 'NOT_FOUND', error.message, 404);
      } else {
        errorResponse(res, 'FETCH_ERROR', error.message);
      }
    }
  }
}

export const frequenciaController = new FrequenciaController();

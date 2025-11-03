import { Request, Response } from 'express';
import { avaliacaoObjetivoService } from '../services/avaliacao-objetivo.service';
import { AuthRequest } from '../middleware/auth.middleware';

export class AvaliacaoObjetivoController {
  /**
   * Criar ou atualizar avaliação
   */
  async createOrUpdate(req: AuthRequest, res: Response) {
    try {
      const avaliadoPor = req.userId!;
      const data = {
        ...req.body,
        avaliadoPor
      };

      const avaliacao = await avaliacaoObjetivoService.createOrUpdate(data);
      res.status(201).json(avaliacao);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  /**
   * Avaliar múltiplos objetivos em lote
   */
  async avaliarLote(req: AuthRequest, res: Response) {
    try {
      const avaliadoPor = req.userId!;
      const data = {
        ...req.body,
        avaliadoPor
      };

      const resultado = await avaliacaoObjetivoService.avaliarLote(data);
      res.status(201).json(resultado);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  /**
   * Listar avaliações com filtros
   */
  async list(req: Request, res: Response) {
    try {
      const filters = {
        turmaId: req.query.turmaId as string,
        alunoId: req.query.alunoId as string,
        objetivoId: req.query.objetivoId as string,
        programaEnsinoId: req.query.programaEnsinoId as string,
        status: req.query.status as string,
        page: req.query.page ? parseInt(req.query.page as string) : undefined,
        limit: req.query.limit ? parseInt(req.query.limit as string) : undefined
      };

      const result = await avaliacaoObjetivoService.list(filters);
      res.json(result);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  /**
   * Buscar avaliação por ID
   */
  async findById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const avaliacao = await avaliacaoObjetivoService.findById(id);
      res.json(avaliacao);
    } catch (error: any) {
      res.status(404).json({ message: error.message });
    }
  }

  /**
   * Atualizar avaliação
   */
  async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const avaliacao = await avaliacaoObjetivoService.update(id, req.body);
      res.json(avaliacao);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  /**
   * Excluir avaliação
   */
  async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await avaliacaoObjetivoService.delete(id);
      res.status(204).send();
    } catch (error: any) {
      res.status(404).json({ message: error.message });
    }
  }

  /**
   * Obter mapa de proficiência de um aluno
   */
  async getMapaProficiencia(req: Request, res: Response) {
    try {
      const { alunoId } = req.params;
      const { turmaId, programaEnsinoId } = req.query;

      if (!turmaId || !programaEnsinoId) {
        return res.status(400).json({ 
          message: 'turmaId e programaEnsinoId são obrigatórios' 
        });
      }

      const mapa = await avaliacaoObjetivoService.getMapaProficiencia(
        alunoId,
        turmaId as string,
        programaEnsinoId as string
      );

      return res.json(mapa);
    } catch (error: any) {
      return res.status(400).json({ message: error.message });
    }
  }

  /**
   * Obter acompanhamento longitudinal de um aluno
   */
  async getAcompanhamentoLongitudinal(req: Request, res: Response) {
    try {
      const { alunoId } = req.params;
      const { programaEnsinoId } = req.query;

      const acompanhamento = await avaliacaoObjetivoService.getAcompanhamentoLongitudinal(
        alunoId,
        programaEnsinoId as string | undefined
      );

      return res.json(acompanhamento);
    } catch (error: any) {
      return res.status(400).json({ message: error.message });
    }
  }

  /**
   * Obter estatísticas de uma turma
   */
  async getEstatisticasTurma(req: Request, res: Response) {
    try {
      const { turmaId } = req.params;
      const { programaEnsinoId } = req.query;

      if (!programaEnsinoId) {
        return res.status(400).json({ 
          message: 'programaEnsinoId é obrigatório' 
        });
      }

      const stats = await avaliacaoObjetivoService.getEstatisticasTurma(
        turmaId,
        programaEnsinoId as string
      );

      res.json(stats);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }
}

export const avaliacaoObjetivoController = new AvaliacaoObjetivoController();

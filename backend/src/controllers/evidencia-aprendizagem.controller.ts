import { Request, Response } from 'express';
import { evidenciaAprendizagemService } from '../services/evidencia-aprendizagem.service';

export class EvidenciaAprendizagemController {
  /**
   * Criar evidência
   */
  async create(req: Request, res: Response) {
    try {
      const evidencia = await evidenciaAprendizagemService.create(req.body);
      res.status(201).json(evidencia);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  /**
   * Listar evidências com filtros
   */
  async list(req: Request, res: Response) {
    try {
      const filters = {
        avaliacaoObjetivoId: req.query.avaliacaoObjetivoId as string,
        alunoId: req.query.alunoId as string,
        tipo: req.query.tipo as string,
        page: req.query.page ? parseInt(req.query.page as string) : undefined,
        limit: req.query.limit ? parseInt(req.query.limit as string) : undefined
      };

      const result = await evidenciaAprendizagemService.list(filters);
      res.json(result);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  /**
   * Buscar evidência por ID
   */
  async findById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const evidencia = await evidenciaAprendizagemService.findById(id);
      res.json(evidencia);
    } catch (error: any) {
      res.status(404).json({ message: error.message });
    }
  }

  /**
   * Atualizar evidência
   */
  async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const evidencia = await evidenciaAprendizagemService.update(id, req.body);
      res.json(evidencia);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  /**
   * Excluir evidência
   */
  async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await evidenciaAprendizagemService.delete(id);
      res.status(204).send();
    } catch (error: any) {
      res.status(404).json({ message: error.message });
    }
  }

  /**
   * Obter evidências de um aluno agrupadas por objetivo
   */
  async getEvidenciasPorAluno(req: Request, res: Response) {
    try {
      const { alunoId } = req.params;
      const { turmaId } = req.query;

      const evidencias = await evidenciaAprendizagemService.getEvidenciasPorAluno(
        alunoId,
        turmaId as string | undefined
      );

      res.json(evidencias);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  /**
   * Obter estatísticas de evidências
   */
  async getEstatisticas(req: Request, res: Response) {
    try {
      const { turmaId, alunoId } = req.query;

      const stats = await evidenciaAprendizagemService.getEstatisticas({
        turmaId: turmaId as string | undefined,
        alunoId: alunoId as string | undefined
      });

      res.json(stats);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }
}

export const evidenciaAprendizagemController = new EvidenciaAprendizagemController();

import { Request, Response } from 'express';
import professorService from '../services/professor.service';
import { logger } from '../config/logger';

class ProfessorController {
  // Listar professores
  async list(req: Request, res: Response) {
    try {
      const result = await professorService.list(req.query);
      
      res.json({
        success: true,
        data: result
      });
    } catch (error: any) {
      logger.error('Erro ao listar professores:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Erro ao listar professores'
      });
    }
  }

  // Buscar professor por ID
  async getById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const professor = await professorService.getById(id);

      res.json({
        success: true,
        data: professor
      });
    } catch (error: any) {
      logger.error(`Erro ao buscar professor ${req.params.id}:`, error);
      res.status(error.message === 'Professor não encontrado' ? 404 : 500).json({
        success: false,
        message: error.message || 'Erro ao buscar professor'
      });
    }
  }

  // Buscar professor por userId
  async getByUserId(req: Request, res: Response) {
    try {
      const { userId } = req.params;
      const professor = await professorService.getByUserId(userId);

      if (!professor) {
        return res.status(404).json({
          success: false,
          message: 'Professor não encontrado'
        });
      }

      return res.json({
        success: true,
        data: professor
      });
    } catch (error: any) {
      logger.error(`Erro ao buscar professor por userId ${req.params.userId}:`, error);
      return res.status(500).json({
        success: false,
        message: error.message || 'Erro ao buscar professor'
      });
    }
  }

  // Criar professor
  async create(req: Request, res: Response) {
    try {
      const professor = await professorService.create(req.body);

      res.status(201).json({
        success: true,
        message: 'Professor cadastrado com sucesso',
        data: professor
      });
    } catch (error: any) {
      logger.error('Erro ao criar professor:', error);
      res.status(400).json({
        success: false,
        message: error.message || 'Erro ao criar professor'
      });
    }
  }

  // Atualizar professor
  async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const professor = await professorService.update(id, req.body);

      res.json({
        success: true,
        message: 'Professor atualizado com sucesso',
        data: professor
      });
    } catch (error: any) {
      logger.error(`Erro ao atualizar professor ${req.params.id}:`, error);
      res.status(error.message === 'Professor não encontrado' ? 404 : 400).json({
        success: false,
        message: error.message || 'Erro ao atualizar professor'
      });
    }
  }

  // Deletar professor
  async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await professorService.delete(id);

      res.json({
        success: true,
        message: 'Professor inativado com sucesso'
      });
    } catch (error: any) {
      logger.error(`Erro ao deletar professor ${req.params.id}:`, error);
      res.status(error.message === 'Professor não encontrado' ? 404 : 500).json({
        success: false,
        message: error.message || 'Erro ao deletar professor'
      });
    }
  }

  // FORMAÇÕES

  // Listar formações de um professor
  async listFormacoes(req: Request, res: Response) {
    try {
      const { professorId } = req.params;
      const formacoes = await professorService.listFormacoes(professorId);

      res.json({
        success: true,
        data: formacoes
      });
    } catch (error: any) {
      logger.error(`Erro ao listar formações do professor ${req.params.professorId}:`, error);
      res.status(500).json({
        success: false,
        message: error.message || 'Erro ao listar formações'
      });
    }
  }

  // Criar formação
  async createFormacao(req: Request, res: Response) {
    try {
      const formacao = await professorService.createFormacao(req.body);

      res.status(201).json({
        success: true,
        message: 'Formação cadastrada com sucesso',
        data: formacao
      });
    } catch (error: any) {
      logger.error('Erro ao criar formação:', error);
      res.status(400).json({
        success: false,
        message: error.message || 'Erro ao criar formação'
      });
    }
  }

  // Atualizar formação
  async updateFormacao(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const formacao = await professorService.updateFormacao(id, req.body);

      res.json({
        success: true,
        message: 'Formação atualizada com sucesso',
        data: formacao
      });
    } catch (error: any) {
      logger.error(`Erro ao atualizar formação ${req.params.id}:`, error);
      res.status(400).json({
        success: false,
        message: error.message || 'Erro ao atualizar formação'
      });
    }
  }

  // Deletar formação
  async deleteFormacao(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await professorService.deleteFormacao(id);

      res.json({
        success: true,
        message: 'Formação removida com sucesso'
      });
    } catch (error: any) {
      logger.error(`Erro ao deletar formação ${req.params.id}:`, error);
      res.status(500).json({
        success: false,
        message: error.message || 'Erro ao deletar formação'
      });
    }
  }

  // Estatísticas
  async getStats(_req: Request, res: Response) {
    try {
      const stats = await professorService.getStats();

      res.json({
        success: true,
        data: stats
      });
    } catch (error: any) {
      logger.error('Erro ao buscar estatísticas de professores:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Erro ao buscar estatísticas'
      });
    }
  }
}

export default new ProfessorController();

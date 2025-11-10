import { prisma } from '../config/database';
import { logger } from '../config/logger';

export interface CreateEvidenciaInput {
  avaliacaoObjetivoId: string;
  alunoId: string;
  tipo: 'FOTO' | 'VIDEO' | 'DOCUMENTO' | 'TEXTO' | 'ATIVIDADE' | 'PROJETO';
  arquivoUrl?: string;
  descricao?: string;
}

export interface ListEvidenciasFilters {
  avaliacaoObjetivoId?: string;
  alunoId?: string;
  tipo?: string;
  page?: number;
  limit?: number;
}

export class EvidenciaAprendizagemService {
  /**
   * Cria nova evidência de aprendizagem
   */
  async create(data: CreateEvidenciaInput) {
    // Verifica se a avaliação existe
    const avaliacao = await prisma.avaliacaoObjetivo.findUnique({
      where: { id: data.avaliacaoObjetivoId },
      include: {
        objetivo: {
          select: {
            codigoBNCC: true,
            descricao: true
          }
        }
      }
    });

    if (!avaliacao) {
      throw new Error('Avaliação de objetivo não encontrada');
    }

    // Verifica se o aluno é o mesmo da avaliação
    if (avaliacao.alunoId !== data.alunoId) {
      throw new Error('Aluno não corresponde à avaliação');
    }

    // Cria a evidência
    const evidencia = await prisma.evidenciaAprendizagem.create({
      data: {
        avaliacaoObjetivoId: data.avaliacaoObjetivoId,
        alunoId: data.alunoId,
        tipo: data.tipo,
        arquivoUrl: data.arquivoUrl || null,
        descricao: data.descricao || null
      },
      include: {
        avaliacao: {
          include: {
            objetivo: {
              select: {
                codigoBNCC: true,
                descricao: true
              }
            }
          }
        },
        aluno: {
          select: {
            nome: true,
            matricula: true
          }
        }
      }
    });

    logger.info(`Evidência criada: ${evidencia.id} - Tipo: ${data.tipo}`);
    return evidencia;
  }

  /**
   * Lista evidências com filtros
   */
  async list(filters: ListEvidenciasFilters) {
    const {
      avaliacaoObjetivoId,
      alunoId,
      tipo,
      page = 1,
      limit = 20
    } = filters;

    const where: any = {};

    if (avaliacaoObjetivoId) where.avaliacaoObjetivoId = avaliacaoObjetivoId;
    if (alunoId) where.alunoId = alunoId;
    if (tipo) where.tipo = tipo;

    const [evidencias, total] = await Promise.all([
      prisma.evidenciaAprendizagem.findMany({
        where,
        include: {
          avaliacao: {
            include: {
              objetivo: {
                select: {
                  codigoBNCC: true,
                  descricao: true
                }
              },
              turma: {
                select: {
                  nome: true,
                  codigo: true
                }
              }
            }
          },
          aluno: {
            select: {
              nome: true,
              matricula: true
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit
      }),
      prisma.evidenciaAprendizagem.count({ where })
    ]);

    return {
      data: evidencias,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    };
  }

  /**
   * Busca evidência por ID
   */
  async findById(id: string) {
    const evidencia = await prisma.evidenciaAprendizagem.findUnique({
      where: { id },
      include: {
        avaliacao: {
          include: {
            objetivo: {
              include: {
                programaEnsino: {
                  select: {
                    codigo: true,
                    nome: true
                  }
                }
              }
            },
            turma: {
              select: {
                nome: true,
                codigo: true
              }
            }
          }
        },
        aluno: {
          select: {
            id: true,
            nome: true,
            matricula: true
          }
        }
      }
    });

    if (!evidencia) {
      throw new Error('Evidência não encontrada');
    }

    return evidencia;
  }

  /**
   * Atualiza evidência
   */
  async update(id: string, data: Partial<CreateEvidenciaInput>) {
    const evidencia = await prisma.evidenciaAprendizagem.findUnique({
      where: { id }
    });

    if (!evidencia) {
      throw new Error('Evidência não encontrada');
    }

    const updated = await prisma.evidenciaAprendizagem.update({
      where: { id },
      data: {
        tipo: data.tipo,
        arquivoUrl: data.arquivoUrl,
        descricao: data.descricao
      },
      include: {
        avaliacao: {
          include: {
            objetivo: true
          }
        },
        aluno: true
      }
    });

    logger.info(`Evidência ${id} atualizada`);
    return updated;
  }

  /**
   * Exclui evidência
   */
  async delete(id: string) {
    const evidencia = await prisma.evidenciaAprendizagem.findUnique({
      where: { id }
    });

    if (!evidencia) {
      throw new Error('Evidência não encontrada');
    }

    await prisma.evidenciaAprendizagem.delete({
      where: { id }
    });

    logger.info(`Evidência ${id} excluída`);
  }

  /**
   * Obtém evidências de um aluno agrupadas por objetivo
   */
  async getEvidenciasPorAluno(alunoId: string, turmaId?: string) {
    const where: any = {
      alunoId
    };

    if (turmaId) {
      where.avaliacao = {
        turmaId
      };
    }

    const evidencias = await prisma.evidenciaAprendizagem.findMany({
      where,
      include: {
        avaliacao: {
          include: {
            objetivo: {
              select: {
                id: true,
                codigoBNCC: true,
                descricao: true,
                programaEnsino: {
                  select: {
                    codigo: true,
                    nome: true
                  }
                }
              }
            },
            turma: {
              select: {
                nome: true,
                anoLetivoId: true
              }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    // Agrupa por objetivo
    const porObjetivo = evidencias.reduce((acc, ev) => {
      const objId = ev.avaliacao.objetivo.id;
      if (!acc[objId]) {
        acc[objId] = {
          objetivo: ev.avaliacao.objetivo,
          evidencias: []
        };
      }
      acc[objId].evidencias.push({
        id: ev.id,
        tipo: ev.tipo,
        arquivoUrl: ev.arquivoUrl,
        descricao: ev.descricao,
        createdAt: ev.createdAt,
        turma: ev.avaliacao.turma
      });
      return acc;
    }, {} as Record<string, any>);

    // Estatísticas por tipo
    const estatisticasPorTipo = evidencias.reduce((acc, ev) => {
      acc[ev.tipo] = (acc[ev.tipo] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      aluno: await prisma.aluno.findUnique({
        where: { id: alunoId },
        select: {
          id: true,
          nome: true,
          matricula: true
        }
      }),
      totalEvidencias: evidencias.length,
      porObjetivo: Object.values(porObjetivo),
      estatisticasPorTipo
    };
  }

  /**
   * Obtém estatísticas de evidências
   */
  async getEstatisticas(filtros?: { turmaId?: string; alunoId?: string }) {
    const where: any = {};

    if (filtros?.turmaId) {
      where.avaliacao = {
        turmaId: filtros.turmaId
      };
    }

    if (filtros?.alunoId) {
      where.alunoId = filtros.alunoId;
    }

    const evidencias = await prisma.evidenciaAprendizagem.findMany({
      where,
      select: {
        tipo: true,
        createdAt: true
      }
    });

    // Estatísticas por tipo
    const porTipo = evidencias.reduce((acc, ev) => {
      acc[ev.tipo] = (acc[ev.tipo] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Evidências por mês (últimos 6 meses)
    const seisMesesAtras = new Date();
    seisMesesAtras.setMonth(seisMesesAtras.getMonth() - 6);

    const evidenciasRecentes = evidencias.filter(
      ev => new Date(ev.createdAt) >= seisMesesAtras
    );

    const porMes = evidenciasRecentes.reduce((acc, ev) => {
      const mes = new Date(ev.createdAt).toLocaleString('pt-BR', { 
        year: 'numeric', 
        month: 'short' 
      });
      acc[mes] = (acc[mes] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      total: evidencias.length,
      porTipo,
      porMes,
      ultimasEvidencias: evidenciasRecentes.length
    };
  }
}

export const evidenciaAprendizagemService = new EvidenciaAprendizagemService();

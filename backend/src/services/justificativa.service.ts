import { prisma } from '../config/database';
import { logger } from '../config/logger';

export interface CreateJustificativaInput {
  alunoId: string;
  dataInicio: Date;
  dataFim: Date;
  motivo: string;
  documentoUrl?: string;
}

export interface UpdateJustificativaInput {
  motivo?: string;
  documentoUrl?: string;
}

export interface AprovarJustificativaInput {
  aprovadaPor: string;
  aprovada: boolean;
}

export interface ListJustificativasFilters {
  alunoId?: string;
  turmaId?: string;
  aprovada?: boolean;
  dataInicio?: Date;
  dataFim?: Date;
  page?: number;
  limit?: number;
}

export class JustificativaService {
  /**
   * Cria nova justificativa de falta
   */
  async create(data: CreateJustificativaInput) {
    const { alunoId, dataInicio, dataFim, motivo, documentoUrl } = data;

    // Verifica se aluno existe
    const aluno = await prisma.aluno.findUnique({
      where: { id: alunoId }
    });

    if (!aluno) {
      throw new Error('Aluno não encontrado');
    }

    // Valida datas
    if (dataFim < dataInicio) {
      throw new Error('Data final deve ser posterior à data inicial');
    }

    // Cria justificativa
    const justificativa = await prisma.justificativaFalta.create({
      data: {
        alunoId,
        dataInicio,
        dataFim,
        motivo,
        documentoUrl,
        aprovada: false
      }
    });

    logger.info(`Justificativa criada: ${justificativa.id} para aluno ${alunoId}`);
    return justificativa;
  }

  /**
   * Lista justificativas com filtros
   */
  async list(filters: ListJustificativasFilters) {
    const {
      alunoId,
      turmaId,
      aprovada,
      dataInicio,
      dataFim,
      page = 1,
      limit = 20
    } = filters;

    const where: any = {};

    if (alunoId) {
      where.alunoId = alunoId;
    }

    if (turmaId) {
      where.aluno = {
        matriculas: {
          some: {
            turmaId,
            status: 'ATIVO'
          }
        }
      };
    }

    if (aprovada !== undefined) {
      where.aprovada = aprovada;
    }

    if (dataInicio || dataFim) {
      where.AND = [];
      if (dataInicio) {
        where.AND.push({
          dataFim: { gte: dataInicio }
        });
      }
      if (dataFim) {
        where.AND.push({
          dataInicio: { lte: dataFim }
        });
      }
    }

    const [justificativas, total] = await Promise.all([
      prisma.justificativaFalta.findMany({
        where,
        include: {
          registros: {
            include: {
              aula: {
                select: {
                  data: true,
                  turmaDisciplina: {
                    select: {
                      disciplina: {
                        select: {
                          nome: true
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        },
        skip: (page - 1) * limit,
        take: limit
      }),
      prisma.justificativaFalta.count({ where })
    ]);

    // Enriquece dados com informações do aluno
    const justificativasComAluno = await Promise.all(
      justificativas.map(async (just) => {
        const aluno = await prisma.aluno.findUnique({
          where: { id: just.alunoId },
          select: {
            id: true,
            nome: true,
            matricula: true,
            foto: true,
            matriculas: {
              where: { status: 'ATIVO' },
              include: {
                turma: {
                  select: {
                    nome: true,
                    serie: true
                  }
                }
              }
            }
          }
        });

        return {
          ...just,
          aluno,
          quantidadeFaltasJustificadas: just.registros.length
        };
      })
    );

    return {
      data: justificativasComAluno,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    };
  }

  /**
   * Busca justificativa por ID
   */
  async findById(id: string) {
    const justificativa = await prisma.justificativaFalta.findUnique({
      where: { id },
      include: {
        registros: {
          include: {
            aula: {
              include: {
                turmaDisciplina: {
                  include: {
                    disciplina: {
                      select: {
                        nome: true,
                        codigo: true
                      }
                    }
                  }
                },
                turma: {
                  select: {
                    nome: true
                  }
                }
              }
            }
          }
        }
      }
    });

    if (!justificativa) {
      throw new Error('Justificativa não encontrada');
    }

    // Busca dados do aluno
    const aluno = await prisma.aluno.findUnique({
      where: { id: justificativa.alunoId },
      select: {
        id: true,
        nome: true,
        matricula: true,
        foto: true,
        matriculas: {
          where: { status: 'ATIVO' },
          include: {
            turma: {
              select: {
                nome: true,
                serie: true
              }
            }
          }
        }
      }
    });

    // Busca dados de quem aprovou (se aplicável)
    let aprovadoPor = null;
    if (justificativa.aprovadaPor) {
      aprovadoPor = await prisma.user.findUnique({
        where: { id: justificativa.aprovadaPor },
        select: {
          id: true,
          name: true,
          email: true
        }
      });
    }

    return {
      ...justificativa,
      aluno,
      aprovadoPor,
      quantidadeFaltasJustificadas: justificativa.registros.length
    };
  }

  /**
   * Atualiza justificativa
   */
  async update(id: string, data: UpdateJustificativaInput) {
    const justificativa = await prisma.justificativaFalta.findUnique({
      where: { id }
    });

    if (!justificativa) {
      throw new Error('Justificativa não encontrada');
    }

    if (justificativa.aprovada) {
      throw new Error('Não é possível editar justificativa já aprovada');
    }

    const justificativaAtualizada = await prisma.justificativaFalta.update({
      where: { id },
      data
    });

    logger.info(`Justificativa atualizada: ${id}`);
    return justificativaAtualizada;
  }

  /**
   * Aprova ou reprova justificativa
   */
  async aprovar(id: string, data: AprovarJustificativaInput) {
    const { aprovadaPor, aprovada } = data;

    const justificativa = await prisma.justificativaFalta.findUnique({
      where: { id }
    });

    if (!justificativa) {
      throw new Error('Justificativa não encontrada');
    }

    if (justificativa.aprovada) {
      throw new Error('Justificativa já foi processada');
    }

    // Atualiza justificativa
    const justificativaAtualizada = await prisma.justificativaFalta.update({
      where: { id },
      data: {
        aprovada,
        aprovadaPor,
        aprovadaEm: new Date()
      }
    });

    // Se aprovada, atualiza registros de frequência no período
    if (aprovada) {
      await this.aplicarJustificativa(id);
    }

    logger.info(
      `Justificativa ${aprovada ? 'aprovada' : 'reprovada'}: ${id} por ${aprovadaPor}`
    );
    
    return justificativaAtualizada;
  }

  /**
   * Aplica justificativa aos registros de frequência (muda F para J)
   */
  private async aplicarJustificativa(justificativaId: string) {
    const justificativa = await prisma.justificativaFalta.findUnique({
      where: { id: justificativaId }
    });

    if (!justificativa) {
      throw new Error('Justificativa não encontrada');
    }

    // Busca todas as faltas (status F) do aluno no período
    const faltasNoPerido = await prisma.registroFrequencia.findMany({
      where: {
        alunoId: justificativa.alunoId,
        status: 'F',
        aula: {
          data: {
            gte: justificativa.dataInicio,
            lte: justificativa.dataFim
          }
        }
      }
    });

    // Atualiza cada registro para Justificada (J)
    await Promise.all(
      faltasNoPerido.map(falta =>
        prisma.registroFrequencia.update({
          where: { id: falta.id },
          data: {
            status: 'J',
            justificativaId
          }
        })
      )
    );

    logger.info(
      `Justificativa ${justificativaId} aplicada a ${faltasNoPerido.length} registros`
    );
  }

  /**
   * Deleta justificativa (apenas se não aprovada)
   */
  async delete(id: string) {
    const justificativa = await prisma.justificativaFalta.findUnique({
      where: { id }
    });

    if (!justificativa) {
      throw new Error('Justificativa não encontrada');
    }

    if (justificativa.aprovada) {
      throw new Error('Não é possível excluir justificativa aprovada');
    }

    await prisma.justificativaFalta.delete({
      where: { id }
    });

    logger.info(`Justificativa excluída: ${id}`);
  }

  /**
   * Busca justificativas pendentes de aprovação
   */
  async getPendentes(turmaId?: string) {
    const where: any = {
      aprovada: false
    };

    if (turmaId) {
      where.aluno = {
        matriculas: {
          some: {
            turmaId,
            status: 'ATIVO'
          }
        }
      };
    }

    const justificativas = await prisma.justificativaFalta.findMany({
      where,
      include: {
        registros: true
      },
      orderBy: {
        createdAt: 'asc'
      }
    });

    // Enriquece com dados do aluno
    const justificativasComAluno = await Promise.all(
      justificativas.map(async (just) => {
        const aluno = await prisma.aluno.findUnique({
          where: { id: just.alunoId },
          select: {
            id: true,
            nome: true,
            matricula: true,
            foto: true
          }
        });

        return {
          ...just,
          aluno,
          quantidadeFaltasJustificadas: just.registros.length
        };
      })
    );

    return justificativasComAluno;
  }
}

export const justificativaService = new JustificativaService();

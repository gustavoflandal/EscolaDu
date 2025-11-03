import { prisma } from '../config/database';
import { logger } from '../config/logger';

export interface CreateAvaliacaoInput {
  objetivoId: string;
  alunoId: string;
  turmaId: string;
  status: 'A' | 'D' | 'N' | 'NA'; // Atingido, Em Desenvolvimento, Não Atingido, Não Avaliado
  observacao?: string;
  avaliadoPor: string;
}

export interface UpdateAvaliacaoInput {
  status?: 'A' | 'D' | 'N' | 'NA';
  observacao?: string;
  revisado?: boolean;
}

export interface AvaliarLoteInput {
  turmaId: string;
  programaEnsinoId: string;
  avaliacoes: Array<{
    objetivoId: string;
    alunoId: string;
    status: 'A' | 'D' | 'N' | 'NA';
    observacao?: string;
  }>;
  avaliadoPor: string;
}

export interface ListAvaliacoesFilters {
  turmaId?: string;
  alunoId?: string;
  objetivoId?: string;
  programaEnsinoId?: string;
  status?: string;
  page?: number;
  limit?: number;
}

export class AvaliacaoObjetivoService {
  /**
   * Cria ou atualiza avaliação de um objetivo para um aluno
   */
  async createOrUpdate(data: CreateAvaliacaoInput) {
    // Verifica se objetivo existe
    const objetivo = await prisma.objetivoAprendizagem.findUnique({
      where: { id: data.objetivoId }
    });

    if (!objetivo) {
      throw new Error('Objetivo de aprendizagem não encontrado');
    }

    // Verifica se aluno existe
    const aluno = await prisma.aluno.findUnique({
      where: { id: data.alunoId }
    });

    if (!aluno) {
      throw new Error('Aluno não encontrado');
    }

    // Verifica se turma existe
    const turma = await prisma.turma.findUnique({
      where: { id: data.turmaId }
    });

    if (!turma) {
      throw new Error('Turma não encontrada');
    }

    // Cria ou atualiza a avaliação
    const avaliacao = await prisma.avaliacaoObjetivo.upsert({
      where: {
        objetivoId_alunoId_turmaId: {
          objetivoId: data.objetivoId,
          alunoId: data.alunoId,
          turmaId: data.turmaId
        }
      },
      update: {
        status: data.status,
        observacao: data.observacao || null,
        avaliadoPor: data.avaliadoPor,
        avaliadoEm: new Date(),
        revisado: false
      },
      create: {
        objetivoId: data.objetivoId,
        alunoId: data.alunoId,
        turmaId: data.turmaId,
        status: data.status,
        observacao: data.observacao || null,
        avaliadoPor: data.avaliadoPor
      },
      include: {
        objetivo: {
          select: {
            codigoBNCC: true,
            descricao: true
          }
        },
        aluno: {
          select: {
            nome: true,
            matricula: true
          }
        },
        evidencias: {
          orderBy: { createdAt: 'desc' },
          take: 5
        }
      }
    });

    logger.info(`Avaliação de objetivo ${data.status} para aluno ${data.alunoId}`);
    return avaliacao;
  }

  /**
   * Avalia múltiplos objetivos de múltiplos alunos em lote
   */
  async avaliarLote(data: AvaliarLoteInput) {
    const results = [];
    const errors = [];

    for (const avaliacao of data.avaliacoes) {
      try {
        const result = await this.createOrUpdate({
          objetivoId: avaliacao.objetivoId,
          alunoId: avaliacao.alunoId,
          turmaId: data.turmaId,
          status: avaliacao.status,
          observacao: avaliacao.observacao,
          avaliadoPor: data.avaliadoPor
        });
        results.push(result);
      } catch (error: any) {
        errors.push({
          objetivoId: avaliacao.objetivoId,
          alunoId: avaliacao.alunoId,
          erro: error.message
        });
      }
    }

    logger.info(`Avaliação em lote: ${results.length} sucesso, ${errors.length} erros`);
    
    return {
      sucesso: results.length,
      erros: errors.length,
      detalhes: errors
    };
  }

  /**
   * Lista avaliações com filtros
   */
  async list(filters: ListAvaliacoesFilters) {
    const {
      turmaId,
      alunoId,
      objetivoId,
      programaEnsinoId,
      status,
      page = 1,
      limit = 50
    } = filters;

    const where: any = {};

    if (turmaId) where.turmaId = turmaId;
    if (alunoId) where.alunoId = alunoId;
    if (objetivoId) where.objetivoId = objetivoId;
    if (status) where.status = status;

    if (programaEnsinoId) {
      where.objetivo = {
        programaEnsinoId
      };
    }

    const [avaliacoes, total] = await Promise.all([
      prisma.avaliacaoObjetivo.findMany({
        where,
        include: {
          objetivo: {
            select: {
              codigoBNCC: true,
              descricao: true,
              pontuacaoMeta: true
            }
          },
          aluno: {
            select: {
              nome: true,
              matricula: true
            }
          },
          turma: {
            select: {
              nome: true,
              codigo: true
            }
          },
          avaliador: {
            select: {
              name: true
            }
          },
          _count: {
            select: {
              evidencias: true
            }
          }
        },
        orderBy: [
          { avaliadoEm: 'desc' }
        ],
        skip: (page - 1) * limit,
        take: limit
      }),
      prisma.avaliacaoObjetivo.count({ where })
    ]);

    return {
      data: avaliacoes,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    };
  }

  /**
   * Busca avaliação por ID
   */
  async findById(id: string) {
    const avaliacao = await prisma.avaliacaoObjetivo.findUnique({
      where: { id },
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
        aluno: {
          select: {
            id: true,
            nome: true,
            matricula: true,
            dataNascimento: true
          }
        },
        turma: {
          select: {
            id: true,
            nome: true,
            codigo: true
          }
        },
        avaliador: {
          select: {
            name: true,
            email: true
          }
        },
        evidencias: {
          orderBy: { createdAt: 'desc' }
        }
      }
    });

    if (!avaliacao) {
      throw new Error('Avaliação não encontrada');
    }

    return avaliacao;
  }

  /**
   * Atualiza avaliação
   */
  async update(id: string, data: UpdateAvaliacaoInput) {
    const avaliacao = await prisma.avaliacaoObjetivo.findUnique({
      where: { id }
    });

    if (!avaliacao) {
      throw new Error('Avaliação não encontrada');
    }

    const updated = await prisma.avaliacaoObjetivo.update({
      where: { id },
      data: {
        ...data,
        avaliadoEm: data.status ? new Date() : avaliacao.avaliadoEm
      },
      include: {
        objetivo: true,
        aluno: true,
        evidencias: true
      }
    });

    logger.info(`Avaliação ${id} atualizada`);
    return updated;
  }

  /**
   * Exclui avaliação
   */
  async delete(id: string) {
    const avaliacao = await prisma.avaliacaoObjetivo.findUnique({
      where: { id }
    });

    if (!avaliacao) {
      throw new Error('Avaliação não encontrada');
    }

    await prisma.avaliacaoObjetivo.delete({
      where: { id }
    });

    logger.info(`Avaliação ${id} excluída`);
  }

  /**
   * Obtém mapa de proficiência de um aluno em um programa
   * Retorna todos os objetivos do programa com status de avaliação
   */
  async getMapaProficiencia(alunoId: string, turmaId: string, programaEnsinoId: string) {
    // Busca todos os objetivos do programa
    const objetivos = await prisma.objetivoAprendizagem.findMany({
      where: {
        programaEnsinoId,
        active: true
      },
      orderBy: { ordem: 'asc' }
    });

    // Busca todas as avaliações do aluno neste programa
    const avaliacoes = await prisma.avaliacaoObjetivo.findMany({
      where: {
        alunoId,
        turmaId,
        objetivo: {
          programaEnsinoId
        }
      },
      include: {
        evidencias: {
          select: {
            id: true,
            tipo: true,
            createdAt: true
          }
        }
      }
    });

    // Mapeia avaliações por objetivoId
    const avaliacoesMap = new Map(
      avaliacoes.map(av => [av.objetivoId, av])
    );

    // Monta o mapa de proficiência
    const mapa = objetivos.map(obj => {
      const avaliacao = avaliacoesMap.get(obj.id);
      return {
        objetivo: {
          id: obj.id,
          codigoBNCC: obj.codigoBNCC,
          descricao: obj.descricao,
          ordem: obj.ordem,
          pontuacaoMeta: obj.pontuacaoMeta
        },
        status: avaliacao?.status || 'NA',
        observacao: avaliacao?.observacao,
        avaliadoEm: avaliacao?.avaliadoEm,
        quantidadeEvidencias: avaliacao?.evidencias.length || 0,
        revisado: avaliacao?.revisado || false
      };
    });

    // Calcula estatísticas
    const stats = {
      totalObjetivos: objetivos.length,
      atingidos: mapa.filter(m => m.status === 'A').length,
      emDesenvolvimento: mapa.filter(m => m.status === 'D').length,
      naoAtingidos: mapa.filter(m => m.status === 'N').length,
      naoAvaliados: mapa.filter(m => m.status === 'NA').length,
      percentualAtingido: objetivos.length > 0 
        ? ((mapa.filter(m => m.status === 'A').length / objetivos.length) * 100).toFixed(1)
        : '0.0'
    };

    return {
      aluno: await prisma.aluno.findUnique({
        where: { id: alunoId },
        select: {
          id: true,
          nome: true,
          matricula: true
        }
      }),
      programa: await prisma.programaEnsino.findUnique({
        where: { id: programaEnsinoId },
        select: {
          id: true,
          codigo: true,
          nome: true
        }
      }),
      mapa,
      estatisticas: stats
    };
  }

  /**
   * Obtém acompanhamento longitudinal de um aluno
   * Mostra evolução ao longo do tempo
   */
  async getAcompanhamentoLongitudinal(alunoId: string, programaEnsinoId?: string) {
    const where: any = {
      alunoId
    };

    if (programaEnsinoId) {
      where.objetivo = {
        programaEnsinoId
      };
    }

    const avaliacoes = await prisma.avaliacaoObjetivo.findMany({
      where,
      include: {
        objetivo: {
          select: {
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
            ano: true
          }
        },
        evidencias: {
          select: {
            id: true,
            tipo: true,
            createdAt: true
          }
        }
      },
      orderBy: [
        { avaliadoEm: 'asc' }
      ]
    });

    // Agrupa por período (ano letivo)
    const porAno = avaliacoes.reduce((acc, av) => {
      const ano = av.turma.ano;
      if (!acc[ano]) {
        acc[ano] = {
          ano,
          avaliacoes: [],
          estatisticas: {
            atingidos: 0,
            emDesenvolvimento: 0,
            naoAtingidos: 0
          }
        };
      }
      
      acc[ano].avaliacoes.push(av);
      
      if (av.status === 'A') acc[ano].estatisticas.atingidos++;
      if (av.status === 'D') acc[ano].estatisticas.emDesenvolvimento++;
      if (av.status === 'N') acc[ano].estatisticas.naoAtingidos++;
      
      return acc;
    }, {} as Record<number, any>);

    // Linha do tempo
    const timeline = avaliacoes.map(av => ({
      data: av.avaliadoEm,
      objetivoId: av.objetivoId,
      codigoBNCC: av.objetivo.codigoBNCC,
      descricao: av.objetivo.descricao,
      status: av.status,
      turma: av.turma.nome,
      ano: av.turma.ano,
      evidencias: av.evidencias.length
    }));

    return {
      aluno: await prisma.aluno.findUnique({
        where: { id: alunoId },
        select: {
          id: true,
          nome: true,
          matricula: true,
          dataNascimento: true
        }
      }),
      totalAvaliacoes: avaliacoes.length,
      porAno: Object.values(porAno),
      timeline
    };
  }

  /**
   * Obtém estatísticas de uma turma em um programa
   */
  async getEstatisticasTurma(turmaId: string, programaEnsinoId: string) {
    // Busca todos os alunos da turma
    const turma = await prisma.turma.findUnique({
      where: { id: turmaId },
      include: {
        matriculas: {
          where: { status: 'ATIVO' },
          include: {
            aluno: {
              select: {
                id: true,
                nome: true,
                matricula: true
              }
            }
          }
        }
      }
    });

    if (!turma) {
      throw new Error('Turma não encontrada');
    }

    const alunos = turma.matriculas.map(m => m.aluno);

    // Busca objetivos do programa
    const objetivos = await prisma.objetivoAprendizagem.findMany({
      where: {
        programaEnsinoId,
        active: true
      }
    });

    // Busca todas as avaliações da turma neste programa
    const avaliacoes = await prisma.avaliacaoObjetivo.findMany({
      where: {
        turmaId,
        objetivo: {
          programaEnsinoId
        }
      }
    });

    // Estatísticas gerais
    const stats = {
      totalAlunos: alunos.length,
      totalObjetivos: objetivos.length,
      totalAvaliacoes: avaliacoes.length,
      atingidos: avaliacoes.filter(a => a.status === 'A').length,
      emDesenvolvimento: avaliacoes.filter(a => a.status === 'D').length,
      naoAtingidos: avaliacoes.filter(a => a.status === 'N').length,
      naoAvaliados: (alunos.length * objetivos.length) - avaliacoes.length
    };

    // Ranking de alunos (por percentual de objetivos atingidos)
    const rankingAlunos = alunos.map(aluno => {
      const avaliacoesAluno = avaliacoes.filter(a => a.alunoId === aluno.id);
      const atingidos = avaliacoesAluno.filter(a => a.status === 'A').length;
      const percentual = objetivos.length > 0 
        ? ((atingidos / objetivos.length) * 100).toFixed(1)
        : '0.0';

      return {
        aluno,
        totalAvaliacoes: avaliacoesAluno.length,
        atingidos,
        emDesenvolvimento: avaliacoesAluno.filter(a => a.status === 'D').length,
        naoAtingidos: avaliacoesAluno.filter(a => a.status === 'N').length,
        percentualAtingido: parseFloat(percentual)
      };
    }).sort((a, b) => b.percentualAtingido - a.percentualAtingido);

    return {
      turma: {
        id: turma.id,
        nome: turma.nome,
        codigo: turma.codigo
      },
      programa: await prisma.programaEnsino.findUnique({
        where: { id: programaEnsinoId },
        select: {
          codigo: true,
          nome: true
        }
      }),
      estatisticas: stats,
      rankingAlunos
    };
  }
}

export const avaliacaoObjetivoService = new AvaliacaoObjetivoService();

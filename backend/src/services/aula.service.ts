import { prisma } from '../config/database';
import { logger } from '../config/logger';

export interface CreateAulaInput {
  turmaDisciplinaId: string;
  turmaId: string;
  data: Date;
  horaInicio: string;
  horaFim: string;
  conteudo?: string;
  professorId?: string;
}

export interface UpdateAulaInput {
  data?: Date;
  horaInicio?: string;
  horaFim?: string;
  conteudo?: string;
  status?: 'PLANEJADA' | 'REALIZADA' | 'CANCELADA' | 'REPOSTA';
}

export interface ListAulasFilters {
  turmaId?: string;
  turmaDisciplinaId?: string;
  professorId?: string;
  data?: Date; // Filtro por data específica
  dataInicio?: Date;
  dataFim?: Date;
  status?: string;
  page?: number;
  limit?: number;
}

export class AulaService {
  /**
   * Cria uma nova aula
   */
  async create(data: CreateAulaInput) {
    // Verifica se turmaDisciplina existe
    const turmaDisciplina = await prisma.turmaDisciplina.findUnique({
      where: { id: data.turmaDisciplinaId },
      include: {
        turma: true,
        disciplina: true
      }
    });

    if (!turmaDisciplina) {
      throw new Error('Turma/Disciplina não encontrada');
    }

    // Verifica conflito de horário
    const conflito = await prisma.aula.findFirst({
      where: {
        turmaId: data.turmaId,
        data: data.data,
        status: { not: 'CANCELADA' },
        OR: [
          {
            AND: [
              { horaInicio: { lte: data.horaInicio } },
              { horaFim: { gt: data.horaInicio } }
            ]
          },
          {
            AND: [
              { horaInicio: { lt: data.horaFim } },
              { horaFim: { gte: data.horaFim } }
            ]
          }
        ]
      }
    });

    if (conflito) {
      throw new Error('Conflito de horário com outra aula');
    }

    const aula = await prisma.aula.create({
      data: {
        ...data,
        status: 'PLANEJADA' // Aula criada como PLANEJADA inicialmente
      },
      include: {
        turmaDisciplina: {
          include: {
            disciplina: true,
            professor: {
              include: {
                user: {
                  select: {
                    name: true,
                    email: true
                  }
                }
              }
            }
          }
        },
        turma: {
          select: {
            nome: true,
            serie: true
          }
        }
      }
    });

    logger.info(`Aula criada: ${aula.id}`);
    return aula;
  }

  /**
   * Lista aulas com filtros e paginação
   */
  async list(filters: ListAulasFilters) {
    const {
      turmaId,
      turmaDisciplinaId,
      professorId,
      data,
      dataInicio,
      dataFim,
      status,
      page = 1,
      limit = 20
    } = filters;

    const where: any = {};

    if (turmaId) where.turmaId = turmaId;
    if (turmaDisciplinaId) where.turmaDisciplinaId = turmaDisciplinaId;
    if (professorId) where.professorId = professorId;
    if (status) where.status = status;

    // Filtro por data específica ou por range
    if (data) {
      where.data = data;
    } else if (dataInicio || dataFim) {
      where.data = {};
      if (dataInicio) where.data.gte = dataInicio;
      if (dataFim) where.data.lte = dataFim;
    }

    const [aulas, total] = await Promise.all([
      prisma.aula.findMany({
        where,
        include: {
          turmaDisciplina: {
            include: {
              disciplina: { select: { nome: true, codigo: true } },
              professor: {
                include: {
                  user: { select: { name: true } }
                }
              }
            }
          },
          turma: { 
            select: { 
              nome: true, 
              codigo: true,
              serie: {
                select: {
                  id: true,
                  nome: true,
                  codigo: true
                }
              }
            } 
          },
          professor: {
            include: {
              user: { select: { name: true } }
            }
          },
          frequencias: {
            select: {
              id: true,
              status: true
            }
          }
        },
        orderBy: [
          { data: 'desc' },
          { horaInicio: 'asc' }
        ],
        skip: (page - 1) * limit,
        take: limit
      }),
      prisma.aula.count({ where })
    ]);

    // Adiciona flag indicando se a frequência foi lançada
    const aulasComFrequencia = aulas.map(aula => ({
      ...aula,
      frequenciaLancada: aula.frequencias && aula.frequencias.length > 0,
      professor: aula.professor ? {
        nome: aula.professor.user.name
      } : null
    }));

    return {
      data: aulasComFrequencia,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    };
  }

  /**
   * Busca aula por ID
   */
  async findById(id: string) {
    const aula = await prisma.aula.findUnique({
      where: { id },
      include: {
        turmaDisciplina: {
          include: {
            disciplina: true,
            professor: {
              include: {
                user: {
                  select: {
                    name: true,
                    email: true
                  }
                }
              }
            }
          }
        },
        turma: {
          include: {
            matriculas: {
              where: { status: 'ATIVO' },
              include: {
                aluno: {
                  select: {
                    id: true,
                    nome: true,
                    matricula: true,
                    foto: true
                  }
                }
              }
            }
          }
        },
        frequencias: {
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

    if (!aula) {
      throw new Error('Aula não encontrada');
    }

    return aula;
  }

  /**
   * Atualiza aula
   */
  async update(id: string, data: UpdateAulaInput) {
    const aulaExistente = await prisma.aula.findUnique({
      where: { id }
    });

    if (!aulaExistente) {
      throw new Error('Aula não encontrada');
    }

    // Se alterar data/horário, verifica conflito
    if (data.data || data.horaInicio || data.horaFim) {
      const dataCheck = data.data || aulaExistente.data;
      const horaInicioCheck = data.horaInicio || aulaExistente.horaInicio;
      const horaFimCheck = data.horaFim || aulaExistente.horaFim;

      const conflito = await prisma.aula.findFirst({
        where: {
          id: { not: id },
          turmaId: aulaExistente.turmaId,
          data: dataCheck,
          status: { not: 'CANCELADA' },
          OR: [
            {
              AND: [
                { horaInicio: { lte: horaInicioCheck } },
                { horaFim: { gt: horaInicioCheck } }
              ]
            },
            {
              AND: [
                { horaInicio: { lt: horaFimCheck } },
                { horaFim: { gte: horaFimCheck } }
              ]
            }
          ]
        }
      });

      if (conflito) {
        throw new Error('Conflito de horário com outra aula');
      }
    }

    const aula = await prisma.aula.update({
      where: { id },
      data,
      include: {
        turmaDisciplina: {
          include: {
            disciplina: true
          }
        },
        turma: true
      }
    });

    logger.info(`Aula atualizada: ${id}`);
    return aula;
  }

  /**
   * Cancela aula
   */
  async cancel(id: string, motivo?: string) {
    const aula = await prisma.aula.findUnique({
      where: { id }
    });

    if (!aula) {
      throw new Error('Aula não encontrada');
    }

    if (aula.status === 'CANCELADA') {
      throw new Error('Aula já está cancelada');
    }

    const aulaAtualizada = await prisma.aula.update({
      where: { id },
      data: {
        status: 'CANCELADA',
        conteudo: motivo ? `CANCELADA: ${motivo}` : 'CANCELADA'
      }
    });

    logger.info(`Aula cancelada: ${id}`);
    return aulaAtualizada;
  }

  /**
   * Deleta aula (soft delete via cancelamento)
   */
  async delete(id: string) {
    return this.cancel(id, 'Aula excluída');
  }

  /**
   * Busca aulas do dia para uma turma
   */
  async getAulasDoDia(turmaId: string, data: Date) {
    const inicioDia = new Date(data);
    inicioDia.setHours(0, 0, 0, 0);
    
    const fimDia = new Date(data);
    fimDia.setHours(23, 59, 59, 999);

    const aulas = await prisma.aula.findMany({
      where: {
        turmaId,
        data: {
          gte: inicioDia,
          lte: fimDia
        },
        status: { not: 'CANCELADA' }
      },
      include: {
        turmaDisciplina: {
          include: {
            disciplina: true,
            professor: {
              include: {
                user: {
                  select: {
                    name: true
                  }
                }
              }
            }
          }
        },
        frequencias: {
          select: {
            status: true
          }
        }
      },
      orderBy: {
        horaInicio: 'asc'
      }
    });

    return aulas;
  }
}

export const aulaService = new AulaService();

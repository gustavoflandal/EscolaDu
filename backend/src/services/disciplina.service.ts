import { prisma } from '../config/database';
import type { CreateDisciplinaInput, UpdateDisciplinaInput, CreateObjetivoInput, UpdateObjetivoInput } from '../validators/disciplina.validator';

export class DisciplinaService {
  // ==================== DISCIPLINAS ====================

  async findAll(filters: {
    search?: string;
    areaConhecimento?: string;
    ativa?: boolean;
    page?: number;
    limit?: number;
  }) {
    const { search, areaConhecimento, ativa, page = 1, limit = 10 } = filters;

    const where: any = {};

    if (search) {
      where.OR = [
        { codigo: { contains: search } },
        { nome: { contains: search } },
        { descricao: { contains: search } }
      ];
    }

    if (areaConhecimento) {
      where.areaConhecimento = areaConhecimento;
    }

    if (ativa !== undefined) {
      where.active = ativa;
    }

    const [total, data] = await Promise.all([
      prisma.disciplina.count({ where }),
      prisma.disciplina.findMany({
        where,
        include: {
          _count: {
            select: {
              programasEnsino: true,
              turmas: true
            }
          }
        },
        orderBy: { nome: 'asc' },
        skip: (page - 1) * limit,
        take: limit
      })
    ]);

    // Mapear _count.programasEnsino para quantidadeProgramas
    const mappedData = data.map((disciplina: any) => ({
      ...disciplina,
      quantidadeProgramas: disciplina._count?.programasEnsino || 0,
      quantidadeTurmas: disciplina._count?.turmas || 0,
    }));

    return {
      data: mappedData,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    };
  }

  async findById(id: string) {
    const disciplina = await prisma.disciplina.findUnique({
      where: { id },
      include: {
        // @ts-ignore - Tipos serão atualizados após restart do TS Server
        programasEnsino: {
          where: { active: true },
          include: {
            // @ts-ignore
            objetivos: {
              where: { active: true },
              orderBy: [
                // @ts-ignore
                { ordem: 'asc' },
                { codigoBNCC: 'asc' }
              ]
            }
          },
          orderBy: [
            { serie: 'asc' },
            { periodo: 'asc' }
          ]
        },
        turmas: {
          include: {
            turma: {
              select: {
                id: true,
                codigo: true,
                nome: true,
                serie: true
              }
            },
            professor: {
              select: {
                id: true,
                user: {
                  select: {
                    name: true
                  }
                }
              }
            }
          }
        },
        _count: {
          select: {
            // @ts-ignore
            programasEnsino: true,
            turmas: true
          }
        }
      }
    });

    if (!disciplina) {
      throw new Error('Disciplina não encontrada');
    }

    return disciplina;
  }

  async create(data: CreateDisciplinaInput) {
    // Verificar se código já existe
    const existente = await prisma.disciplina.findUnique({
      where: { codigo: data.codigo }
    });

    if (existente) {
      throw new Error('Já existe uma disciplina com este código');
    }

    return prisma.disciplina.create({
      data,
      include: {
        _count: {
          select: {
            objetivos: true,
            turmas: true
          }
        }
      }
    });
  }

  async update(id: string, data: UpdateDisciplinaInput) {
    // Verificar se existe
    const disciplina = await prisma.disciplina.findUnique({ where: { id } });
    if (!disciplina) {
      throw new Error('Disciplina não encontrada');
    }

    // Se está alterando o código, verificar se não conflita com outra
    if (data.codigo && data.codigo !== disciplina.codigo) {
      const existente = await prisma.disciplina.findUnique({
        where: { codigo: data.codigo }
      });
      if (existente) {
        throw new Error('Já existe uma disciplina com este código');
      }
    }

    return prisma.disciplina.update({
      where: { id },
      data,
      include: {
        _count: {
          select: {
            objetivos: true,
            turmas: true
          }
        }
      }
    });
  }

  async delete(id: string) {
    // Verificar se existe
    const disciplina = await prisma.disciplina.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            turmas: true,
            objetivos: true
          }
        }
      }
    });

    if (!disciplina) {
      throw new Error('Disciplina não encontrada');
    }

    // Não permitir exclusão se houver turmas ou objetivos vinculados
    if (disciplina._count.turmas > 0) {
      throw new Error('Não é possível excluir disciplina com turmas vinculadas');
    }

    if (disciplina._count.objetivos > 0) {
      throw new Error('Não é possível excluir disciplina com objetivos cadastrados');
    }

    await prisma.disciplina.delete({ where: { id } });
  }

  async getAreasConhecimento() {
    const disciplinas = await prisma.disciplina.findMany({
      where: { 
        active: true,
        areaConhecimento: { not: null }
      },
      select: { areaConhecimento: true },
      distinct: ['areaConhecimento']
    });

    return disciplinas
      .map(d => d.areaConhecimento)
      .filter(Boolean)
      .sort();
  }

  // ==================== OBJETIVOS DE APRENDIZAGEM ====================

  async findAllObjetivos(filters: {
    search?: string;
    disciplinaId?: string;
    programaEnsinoId?: string;
    page?: number;
    limit?: number;
  }) {
    const { search, disciplinaId, programaEnsinoId, page = 1, limit = 10 } = filters;

    const where: any = {};

    if (search) {
      where.OR = [
        { codigoBNCC: { contains: search } },
        { descricao: { contains: search } },
        { competencia: { contains: search } },
        { habilidade: { contains: search } }
      ];
    }

    // Se filtrar por disciplina, buscar programas dessa disciplina
    if (disciplinaId) {
      // @ts-ignore - Tipos serão atualizados após restart do TS Server
      const programas = await prisma.programaEnsino.findMany({
        where: { disciplinaId, active: true },
        select: { id: true }
      });
      // @ts-ignore
      where.programaEnsinoId = { in: programas.map((p: any) => p.id) };
    }

    if (programaEnsinoId) {
      // @ts-ignore
      where.programaEnsinoId = programaEnsinoId;
    }

    const [total, data] = await Promise.all([
      prisma.objetivoAprendizagem.count({ where }),
      prisma.objetivoAprendizagem.findMany({
        where,
        include: {
          // @ts-ignore - Tipos serão atualizados após restart do TS Server
          programaEnsino: {
            select: {
              id: true,
              codigo: true,
              nome: true,
              serie: true,
              periodo: true,
              disciplina: {
                select: {
                  id: true,
                  codigo: true,
                  nome: true,
                  areaConhecimento: true
                }
              }
            }
          },
          _count: {
            select: {
              avaliacoes: true
            }
          }
        },
        orderBy: [
          // @ts-ignore
          { ordem: 'asc' },
          { codigoBNCC: 'asc' }
        ],
        skip: (page - 1) * limit,
        take: limit
      })
    ]);

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    };
  }

  async findObjetivoById(id: string) {
    const objetivo = await prisma.objetivoAprendizagem.findUnique({
      where: { id },
      include: {
        disciplina: {
          select: {
            id: true,
            codigo: true,
            nome: true,
            areaConhecimento: true
          }
        },
        _count: {
          select: {
            avaliacoes: true
          }
        }
      }
    });

    if (!objetivo) {
      throw new Error('Objetivo de aprendizagem não encontrado');
    }

    return objetivo;
  }

  async createObjetivo(disciplinaId: string, data: CreateObjetivoInput) {
    // Verificar se disciplina existe
    const disciplina = await prisma.disciplina.findUnique({
      where: { id: disciplinaId }
    });

    if (!disciplina) {
      throw new Error('Disciplina não encontrada');
    }

    // Verificar se código BNCC já existe
    const existente = await prisma.objetivoAprendizagem.findUnique({
      where: { codigoBNCC: data.codigoBNCC }
    });

    if (existente) {
      throw new Error('Já existe um objetivo com este código BNCC');
    }

    // @ts-ignore - Tipos serão atualizados após restart do TS Server
    return prisma.objetivoAprendizagem.create({
      data: {
        ...data,
        disciplinaId
      },
      include: {
        // @ts-ignore
        programaEnsino: {
          select: {
            id: true,
            codigo: true,
            nome: true,
            disciplina: {
              select: {
                id: true,
                codigo: true,
                nome: true
              }
            }
          }
        }
      }
    });
  }

  async updateObjetivo(id: string, data: UpdateObjetivoInput) {
    // Verificar se existe
    const objetivo = await prisma.objetivoAprendizagem.findUnique({
      where: { id }
    });

    if (!objetivo) {
      throw new Error('Objetivo de aprendizagem não encontrado');
    }

    // Se está alterando o código BNCC, verificar se não conflita
    if (data.codigoBNCC && data.codigoBNCC !== objetivo.codigoBNCC) {
      const existente = await prisma.objetivoAprendizagem.findUnique({
        where: { codigoBNCC: data.codigoBNCC }
      });
      if (existente) {
        throw new Error('Já existe um objetivo com este código BNCC');
      }
    }

    return prisma.objetivoAprendizagem.update({
      where: { id },
      data,
      include: {
        disciplina: {
          select: {
            id: true,
            codigo: true,
            nome: true
          }
        }
      }
    });
  }

  async deleteObjetivo(id: string) {
    // Verificar se existe
    const objetivo = await prisma.objetivoAprendizagem.findUnique({
      where: { id },
      include: {
        _count: {
          select: { avaliacoes: true }
        }
      }
    });

    if (!objetivo) {
      throw new Error('Objetivo de aprendizagem não encontrado');
    }

    // Não permitir exclusão se houver avaliações
    if (objetivo._count.avaliacoes > 0) {
      throw new Error('Não é possível excluir objetivo com avaliações cadastradas');
    }

    await prisma.objetivoAprendizagem.delete({ where: { id } });
  }

  async getSeries() {
    // @ts-ignore - Tipos serão atualizados após restart do TS Server
    const programas = await prisma.programaEnsino.findMany({
      where: { active: true },
      select: { serie: true },
      distinct: ['serie']
    });

    return programas.map((p: any) => p.serie).sort();
  }

  async getPeriodos() {
    // @ts-ignore - Tipos serão atualizados após restart do TS Server
    const programas = await prisma.programaEnsino.findMany({
      where: { active: true },
      select: { periodo: true },
      distinct: ['periodo']
    });

    // Remover valores nulos e retornar apenas strings
    return programas
      .map((p: any) => p.periodo)
      .filter((p: any): p is string => p !== null)
      .sort();
  }

  async getObjetivosPorDisciplina(disciplinaId: string) {
    // Buscar programas de ensino da disciplina
    // @ts-ignore - Tipos serão atualizados após restart do TS Server
    const programas = await prisma.programaEnsino.findMany({
      where: {
        disciplinaId,
        active: true
      },
      select: { id: true }
    });

    const programaIds = programas.map((p: any) => p.id);

    // Buscar objetivos vinculados a esses programas
    return prisma.objetivoAprendizagem.findMany({
      where: {
        // @ts-ignore
        programaEnsinoId: { in: programaIds },
        active: true
      },
      include: {
        // @ts-ignore
        programaEnsino: {
          select: {
            id: true,
            codigo: true,
            nome: true,
            serie: true,
            periodo: true
          }
        }
      },
      orderBy: [
        // @ts-ignore
        { ordem: 'asc' },
        { codigoBNCC: 'asc' }
      ]
    });
  }
}

export default new DisciplinaService();

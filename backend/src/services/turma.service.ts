import { prisma } from '../config/database';
import { logger } from '../config/logger';

export interface CreateTurmaDTO {
  codigo: string;
  nome: string;
  anoLetivoId: string;
  serie: string; // 1º ANO, 2º ANO, etc
  turno: string; // MANHA, TARDE, NOITE
  capacidadeMaxima?: number;
  sala?: string;
  professorRegenteId?: string;
}

export interface UpdateTurmaDTO {
  nome?: string;
  serie?: string;
  turno?: string;
  capacidadeMaxima?: number;
  sala?: string;
  professorRegenteId?: string;
  active?: boolean;
}

export interface MatricularAlunoDTO {
  alunoId: string;
  dataMatricula?: Date;
}

export class TurmaService {
  /**
   * Lista turmas com filtros e paginação
   */
  async list(filters: {
    search?: string;
    anoLetivoId?: string;
    serie?: string;
    turno?: string;
    page?: number;
    limit?: number;
  }) {
    const { search, anoLetivoId, serie, turno, page = 1, limit = 10 } = filters;
    const skip = (page - 1) * limit;

    const where: any = {};

    if (search) {
      where.OR = [
        { codigo: { contains: search } },
        { nome: { contains: search } },
        { sala: { contains: search } },
      ];
    }

    if (anoLetivoId) {
      where.anoLetivoId = anoLetivoId;
    }

    if (serie) {
      where.serie = serie;
    }

    if (turno) {
      where.turno = turno;
    }

    const [turmas, total] = await Promise.all([
      prisma.turma.findMany({
        where,
        skip,
        take: limit,
        include: {
          anoLetivo: {
            select: {
              id: true,
              ano: true,
              status: true,
            },
          },
          professorRegente: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                },
              },
            },
          },
          matriculas: {
            where: {
              status: 'ATIVO',
            },
            include: {
              aluno: {
                select: {
                  id: true,
                  nome: true,
                  matricula: true,
                },
              },
            },
          },
          _count: {
            select: {
              matriculas: true,
            },
          },
        },
        orderBy: [
          { anoLetivo: { ano: 'desc' } },
          { serie: 'asc' },
          { nome: 'asc' },
        ],
      }),
      prisma.turma.count({ where }),
    ]);

    return {
      data: turmas,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Busca turma por ID
   */
  async getById(id: string) {
    const turma = await prisma.turma.findUnique({
      where: { id },
      include: {
        anoLetivo: true,
        professorRegente: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                phone: true,
              },
            },
          },
        },
        matriculas: {
          where: {
            status: 'ATIVO',
          },
          include: {
            aluno: {
              select: {
                id: true,
                nome: true,
                matricula: true,
                dataNascimento: true,
                genero: true,
                status: true,
              },
            },
          },
          orderBy: {
            aluno: {
              nome: 'asc',
            },
          },
        },
        disciplinas: {
          include: {
            disciplina: true,
            professor: {
              include: {
                user: {
                  select: {
                    name: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!turma) {
      throw new Error('Turma não encontrada');
    }

    return turma;
  }

  /**
   * Cria nova turma
   */
  async create(data: CreateTurmaDTO) {
    // Verifica se já existe turma com este código
    const existingTurma = await prisma.turma.findUnique({
      where: { codigo: data.codigo },
    });

    if (existingTurma) {
      throw new Error('Já existe uma turma com este código');
    }

    // Verifica se ano letivo existe
    const anoLetivo = await prisma.anoLetivo.findUnique({
      where: { id: data.anoLetivoId },
    });

    if (!anoLetivo) {
      throw new Error('Ano letivo não encontrado');
    }

    // Se professor foi informado, verifica se existe
    if (data.professorRegenteId) {
      const professor = await prisma.professor.findUnique({
        where: { id: data.professorRegenteId },
      });

      if (!professor) {
        throw new Error('Professor não encontrado');
      }
    }

    const turma = await prisma.turma.create({
      data: {
        codigo: data.codigo,
        nome: data.nome,
        anoLetivoId: data.anoLetivoId,
        serie: data.serie,
        turno: data.turno,
        capacidadeMaxima: data.capacidadeMaxima || 30,
        sala: data.sala,
        professorRegenteId: data.professorRegenteId,
      },
      include: {
        anoLetivo: true,
        professorRegente: {
          include: {
            user: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });

    logger.info(`Turma criada: ${turma.id}`);
    return turma;
  }

  /**
   * Atualiza turma
   */
  async update(id: string, data: UpdateTurmaDTO) {
    const turma = await prisma.turma.findUnique({
      where: { id },
    });

    if (!turma) {
      throw new Error('Turma não encontrada');
    }

    // Se professor foi informado, verifica se existe
    if (data.professorRegenteId) {
      const professor = await prisma.professor.findUnique({
        where: { id: data.professorRegenteId },
      });

      if (!professor) {
        throw new Error('Professor não encontrado');
      }
    }

    const updated = await prisma.turma.update({
      where: { id },
      data: {
        nome: data.nome,
        serie: data.serie,
        turno: data.turno,
        capacidadeMaxima: data.capacidadeMaxima,
        sala: data.sala,
        professorRegenteId: data.professorRegenteId,
        active: data.active,
      },
      include: {
        anoLetivo: true,
        professorRegente: {
          include: {
            user: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });

    logger.info(`Turma atualizada: ${id}`);
    return updated;
  }

  /**
   * Remove turma (soft delete)
   */
  async delete(id: string) {
    const turma = await prisma.turma.findUnique({
      where: { id },
      include: {
        matriculas: {
          where: { status: 'ATIVO' },
        },
      },
    });

    if (!turma) {
      throw new Error('Turma não encontrada');
    }

    if (turma.matriculas.length > 0) {
      throw new Error('Não é possível excluir turma com alunos matriculados');
    }

    await prisma.turma.update({
      where: { id },
      data: {
        active: false,
      },
    });

    logger.info(`Turma removida: ${id}`);
  }

  /**
   * Matricula aluno na turma
   */
  async matricularAluno(turmaId: string, data: MatricularAlunoDTO) {
    // Verifica se turma existe
    const turma = await prisma.turma.findUnique({
      where: { id: turmaId },
      include: {
        matriculas: {
          where: { status: 'ATIVO' },
        },
      },
    });

    if (!turma) {
      throw new Error('Turma não encontrada');
    }

    // Verifica capacidade
    if (turma.matriculas.length >= turma.capacidadeMaxima) {
      throw new Error('Turma já atingiu capacidade máxima');
    }

    // Verifica se aluno existe
    const aluno = await prisma.aluno.findUnique({
      where: { id: data.alunoId },
    });

    if (!aluno) {
      throw new Error('Aluno não encontrado');
    }

    // Verifica se já existe matrícula ativa
    const matriculaExistente = await prisma.matricula.findFirst({
      where: {
        alunoId: data.alunoId,
        turmaId: turmaId,
        status: 'ATIVO',
      },
    });

    if (matriculaExistente) {
      throw new Error('Aluno já está matriculado nesta turma');
    }

    const matricula = await prisma.matricula.create({
      data: {
        alunoId: data.alunoId,
        turmaId: turmaId,
        dataMatricula: data.dataMatricula || new Date(),
        status: 'ATIVO',
      },
      include: {
        aluno: {
          select: {
            id: true,
            nome: true,
            matricula: true,
          },
        },
      },
    });

    logger.info(`Aluno ${data.alunoId} matriculado na turma ${turmaId}`);
    return matricula;
  }

  /**
   * Remove matrícula do aluno
   */
  async desmatricularAluno(turmaId: string, alunoId: string) {
    const matricula = await prisma.matricula.findFirst({
      where: {
        turmaId: turmaId,
        alunoId: alunoId,
        status: 'ATIVO',
      },
    });

    if (!matricula) {
      throw new Error('Matrícula não encontrada');
    }

    await prisma.matricula.update({
      where: { id: matricula.id },
      data: {
        status: 'INATIVO',
        dataSaida: new Date(),
      },
    });

    logger.info(`Aluno ${alunoId} desmatriculado da turma ${turmaId}`);
  }

  /**
   * Lista alunos matriculados na turma
   */
  async getAlunos(turmaId: string) {
    const turma = await prisma.turma.findUnique({
      where: { id: turmaId },
    });

    if (!turma) {
      throw new Error('Turma não encontrada');
    }

    const matriculas = await prisma.matricula.findMany({
      where: {
        turmaId: turmaId,
        status: 'ATIVO',
      },
      include: {
        aluno: true,
      },
      orderBy: {
        aluno: {
          nome: 'asc',
        },
      },
    });

    return matriculas.map(m => m.aluno);
  }

  /**
   * Lista anos letivos disponíveis
   */
  async getAnosLetivos() {
    return await prisma.anoLetivo.findMany({
      orderBy: { ano: 'desc' },
    });
  }
}

export const turmaService = new TurmaService();

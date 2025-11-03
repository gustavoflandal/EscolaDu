import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

// Interfaces baseadas no schema real
interface CreateTurmaData {
  codigo: string;
  nome: string;
  anoLetivoId: string;
  serie: string;
  turno: string;
  capacidadeMaxima?: number;
  sala?: string | null;
  professorRegenteId?: string | null;
}

interface UpdateTurmaData {
  codigo?: string;
  nome?: string;
  anoLetivoId?: string;
  serie?: string;
  turno?: string;
  capacidadeMaxima?: number;
  sala?: string | null;
  professorRegenteId?: string | null;
  active?: boolean;
}

interface AddAlunoData {
  alunoId: string;
  dataMatricula?: Date;
}

interface QueryFilters {
  page?: number;
  limit?: number;
  search?: string;
  ano?: number;
  periodo?: string;
  ativa?: boolean;
}

/**
 * Service para gerenciamento de turmas
 */
class TurmaService {
  /**
   * Lista todas as turmas com paginação e filtros
   */
  async findAll(filters: QueryFilters) {
    const { page = 1, limit = 10, search, ano, periodo, ativa } = filters;

    const skip = (page - 1) * limit;

    // Construir filtros dinâmicos
    const where: Prisma.TurmaWhereInput = {};

    if (search) {
      where.OR = [
        { nome: { contains: search } },
        { sala: { contains: search } },
        { codigo: { contains: search } },
        { serie: { contains: search } },
      ];
    }

    if (ano !== undefined) {
      where.anoLetivo = {
        ano: ano,
      };
    }

    if (periodo) {
      where.turno = periodo;
    }

    if (ativa !== undefined) {
      where.active = ativa;
    }

    // Buscar turmas
    const [turmas, total] = await Promise.all([
      prisma.turma.findMany({
        where,
        skip,
        take: limit,
        include: {
          anoLetivo: {
            select: {
              ano: true,
              dataInicio: true,
              dataFim: true,
              status: true,
            },
          },
          serie: {
            select: {
              id: true,
              codigo: true,
              nome: true,
            },
          },
          sala: {
            select: {
              nome: true,
              capacidade: true,
            },
          },
          professorRegente: {
            select: {
              id: true,
              user: {
                select: {
                  id: true,
                  name: true,
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
          { codigo: 'desc' },
        ],
      }),
      prisma.turma.count({ where }),
    ]);

    // Formatar resposta
    const turmasFormatadas = turmas.map((turma) => ({
      id: turma.id,
      codigo: turma.codigo,
      nome: turma.nome,
      serie: turma.serie,
      turno: turma.turno,
      sala: turma.sala,
      capacidadeMaxima: turma.capacidadeMaxima,
      active: turma.active,
      ano: turma.anoLetivo.ano,
      anoLetivoId: turma.anoLetivoId,
      anoLetivoStatus: turma.anoLetivo.status,
      professorRegenteId: turma.professorRegenteId,
      professorRegente: turma.professorRegente
        ? {
            id: turma.professorRegente.id,
            userId: turma.professorRegente.user.id,
            nome: turma.professorRegente.user.name,
          }
        : null,
      quantidadeAlunos: turma._count.matriculas,
      createdAt: turma.createdAt,
      updatedAt: turma.updatedAt,
    }));

    return {
      data: turmasFormatadas,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Busca uma turma por ID com todos os seus alunos
   */
  async findById(id: string) {
    const turma = await prisma.turma.findUnique({
      where: { id },
      include: {
        anoLetivo: {
          select: {
            ano: true,
            dataInicio: true,
            dataFim: true,
            status: true,
          },
        },
        serie: {
          select: {
            id: true,
            codigo: true,
            nome: true,
          },
        },
        sala: {
          select: {
            nome: true,
            capacidade: true,
          },
        },
        professorRegente: {
          select: {
            id: true,
            user: {
              select: {
                id: true,
                name: true,
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
                matricula: true,
                nome: true,
                dataNascimento: true,
                status: true,
                telefone: true,
              },
            },
          },
          orderBy: {
            aluno: {
              nome: 'asc',
            },
          },
        },
        _count: {
          select: {
            matriculas: true,
          },
        },
      },
    });

    if (!turma) {
      throw new Error('Turma não encontrada');
    }

    // Formatar resposta
    return {
      id: turma.id,
      codigo: turma.codigo,
      nome: turma.nome,
      serie: turma.serie,
      turno: turma.turno,
      sala: turma.sala,
      capacidadeMaxima: turma.capacidadeMaxima,
      active: turma.active,
      anoLetivoId: turma.anoLetivoId,
      ano: turma.anoLetivo.ano,
      anoLetivoStatus: turma.anoLetivo.status,
      professorRegenteId: turma.professorRegenteId,
      professorRegente: turma.professorRegente
        ? {
            id: turma.professorRegente.id,
            userId: turma.professorRegente.user.id,
            nome: turma.professorRegente.user.name,
          }
        : null,
      quantidadeAlunos: turma._count.matriculas,
      alunos: turma.matriculas.map((m) => ({
        id: m.id,
        alunoId: m.alunoId,
        dataMatricula: m.dataMatricula,
        status: m.status,
        aluno: m.aluno,
      })),
      createdAt: turma.createdAt,
      updatedAt: turma.updatedAt,
    };
  }

  /**
   * Cria uma nova turma
   */
  async create(data: CreateTurmaData) {
    // Verificar se o ano letivo existe
    const anoLetivo = await prisma.anoLetivo.findUnique({
      where: { id: data.anoLetivoId },
    });

    if (!anoLetivo) {
      throw new Error('Ano letivo não encontrado');
    }

    // Verificar se já existe uma turma com o mesmo código
    const turmaExistente = await prisma.turma.findUnique({
      where: { codigo: data.codigo },
    });

    if (turmaExistente) {
      throw new Error('Já existe uma turma com este código');
    }

    // Verificar se o professor existe (se fornecido)
    if (data.professorRegenteId) {
      const professor = await prisma.professor.findUnique({
        where: { id: data.professorRegenteId },
      });

      if (!professor) {
        throw new Error('Professor não encontrado');
      }
    }

    // Criar turma
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
        active: true,
      },
      include: {
        anoLetivo: {
          select: {
            ano: true,
          },
        },
        professorRegente: {
          select: {
            id: true,
            user: {
              select: {
                name: true,
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
    });

    return {
      id: turma.id,
      codigo: turma.codigo,
      nome: turma.nome,
      serie: turma.serie,
      turno: turma.turno,
      sala: turma.sala,
      capacidadeMaxima: turma.capacidadeMaxima,
      active: turma.active,
      ano: turma.anoLetivo.ano,
      anoLetivoId: turma.anoLetivoId,
      professorRegenteId: turma.professorRegenteId,
      professorRegente: turma.professorRegente
        ? {
            id: turma.professorRegente.id,
            nome: turma.professorRegente.user.name,
          }
        : null,
      quantidadeAlunos: turma._count.matriculas,
      createdAt: turma.createdAt,
      updatedAt: turma.updatedAt,
    };
  }

  /**
   * Atualiza uma turma existente
   */
  async update(id: string, data: UpdateTurmaData) {
    // Verificar se a turma existe
    const turmaExistente = await prisma.turma.findUnique({
      where: { id },
    });

    if (!turmaExistente) {
      throw new Error('Turma não encontrada');
    }

    // Se alterou código, verificar se não há conflito
    if (data.codigo && data.codigo !== turmaExistente.codigo) {
      const conflito = await prisma.turma.findUnique({
        where: { codigo: data.codigo },
      });

      if (conflito) {
        throw new Error('Já existe uma turma com este código');
      }
    }

    // Se alterou ano letivo, verificar se existe
    if (data.anoLetivoId && data.anoLetivoId !== turmaExistente.anoLetivoId) {
      const anoLetivo = await prisma.anoLetivo.findUnique({
        where: { id: data.anoLetivoId },
      });

      if (!anoLetivo) {
        throw new Error('Ano letivo não encontrado');
      }
    }

    // Se alterou professor, verificar se existe
    if (data.professorRegenteId) {
      const professor = await prisma.professor.findUnique({
        where: { id: data.professorRegenteId },
      });

      if (!professor) {
        throw new Error('Professor não encontrado');
      }
    }

    // Atualizar turma
    const turma = await prisma.turma.update({
      where: { id },
      data: {
        codigo: data.codigo,
        nome: data.nome,
        anoLetivoId: data.anoLetivoId,
        serie: data.serie,
        turno: data.turno,
        capacidadeMaxima: data.capacidadeMaxima,
        sala: data.sala,
        professorRegenteId: data.professorRegenteId,
        active: data.active,
      },
      include: {
        anoLetivo: {
          select: {
            ano: true,
          },
        },
        professorRegente: {
          select: {
            id: true,
            user: {
              select: {
                name: true,
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
    });

    return {
      id: turma.id,
      codigo: turma.codigo,
      nome: turma.nome,
      serie: turma.serie,
      turno: turma.turno,
      sala: turma.sala,
      capacidadeMaxima: turma.capacidadeMaxima,
      active: turma.active,
      ano: turma.anoLetivo.ano,
      anoLetivoId: turma.anoLetivoId,
      professorRegenteId: turma.professorRegenteId,
      professorRegente: turma.professorRegente
        ? {
            id: turma.professorRegente.id,
            nome: turma.professorRegente.user.name,
          }
        : null,
      quantidadeAlunos: turma._count.matriculas,
      createdAt: turma.createdAt,
      updatedAt: turma.updatedAt,
    };
  }

  /**
   * Exclui uma turma
   */
  async delete(id: string) {
    // Verificar se a turma existe
    const turma = await prisma.turma.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            matriculas: true,
          },
        },
      },
    });

    if (!turma) {
      throw new Error('Turma não encontrada');
    }

    // Não permitir exclusão se houver alunos matriculados
    if (turma._count.matriculas > 0) {
      throw new Error(
        'Não é possível excluir uma turma com alunos matriculados. Remova os alunos primeiro ou desative a turma.'
      );
    }

    // Excluir turma
    await prisma.turma.delete({
      where: { id },
    });

    return { message: 'Turma excluída com sucesso' };
  }

  /**
   * Adiciona um aluno à turma (cria matrícula)
   */
  async addAluno(turmaId: string, data: AddAlunoData) {
    // Verificar se a turma existe e está ativa
    const turma = await prisma.turma.findUnique({
      where: { id: turmaId },
      include: {
        _count: {
          select: {
            matriculas: true,
          },
        },
      },
    });

    if (!turma) {
      throw new Error('Turma não encontrada');
    }

    if (!turma.active) {
      throw new Error('Não é possível adicionar alunos a uma turma inativa');
    }

    // Verificar capacidade
    if (turma._count.matriculas >= turma.capacidadeMaxima) {
      throw new Error('A turma atingiu sua capacidade máxima');
    }

    // Verificar se o aluno existe e está ativo
    const aluno = await prisma.aluno.findUnique({
      where: { id: data.alunoId },
    });

    if (!aluno) {
      throw new Error('Aluno não encontrado');
    }

    if (aluno.status !== 'ATIVO') {
      throw new Error('Não é possível matricular um aluno inativo');
    }

    // Verificar se o aluno já está matriculado na turma
    const matriculaExistente = await prisma.matricula.findFirst({
      where: {
        turmaId,
        alunoId: data.alunoId,
        status: 'ATIVO',
      },
    });

    if (matriculaExistente) {
      throw new Error('Este aluno já está matriculado nesta turma');
    }

    // Criar matrícula
    const matricula = await prisma.matricula.create({
      data: {
        turmaId,
        alunoId: data.alunoId,
        dataMatricula: data.dataMatricula || new Date(),
        status: 'ATIVO',
      },
      include: {
        aluno: {
          select: {
            id: true,
            matricula: true,
            nome: true,
            dataNascimento: true,
            status: true,
            telefone: true,
          },
        },
      },
    });

    return {
      id: matricula.id,
      alunoId: matricula.alunoId,
      turmaId: matricula.turmaId,
      dataMatricula: matricula.dataMatricula,
      status: matricula.status,
      aluno: matricula.aluno,
    };
  }

  /**
   * Remove um aluno da turma (inativa matrícula)
   */
  async removeAluno(turmaId: string, alunoId: string) {
    // Verificar se a matrícula existe
    const matricula = await prisma.matricula.findFirst({
      where: {
        turmaId,
        alunoId,
        status: 'ATIVO',
      },
    });

    if (!matricula) {
      throw new Error('Este aluno não está matriculado nesta turma');
    }

    // Inativar matrícula ao invés de deletar (histórico)
    await prisma.matricula.update({
      where: { id: matricula.id },
      data: {
        status: 'TRANSFERIDO',
        dataSaida: new Date(),
      },
    });

    return { message: 'Aluno removido da turma com sucesso' };
  }

  /**
   * Lista alunos disponíveis para adicionar à turma
   */
  async getAlunosDisponiveis(turmaId: string, search?: string) {
    // Buscar IDs dos alunos já matriculados na turma
    const matriculas = await prisma.matricula.findMany({
      where: {
        turmaId,
        status: 'ATIVO',
      },
      select: { alunoId: true },
    });

    const idsAlunosNaTurma = matriculas.map((m) => m.alunoId);

    // Construir filtro de busca
    const where: Prisma.AlunoWhereInput = {
      status: 'ATIVO',
      id: {
        notIn: idsAlunosNaTurma,
      },
    };

    if (search) {
      where.OR = [
        { nome: { contains: search } },
        { matricula: { contains: search } },
      ];
    }

    // Buscar alunos disponíveis
    const alunos = await prisma.aluno.findMany({
      where,
      select: {
        id: true,
        matricula: true,
        nome: true,
        dataNascimento: true,
        status: true,
        telefone: true,
      },
      orderBy: {
        nome: 'asc',
      },
      take: 50,
    });

    return alunos;
  }

  /**
   * Obtém estatísticas da turma
   */
  async getStats(id: string) {
    const turma = await prisma.turma.findUnique({
      where: { id },
      include: {
        matriculas: {
          where: {
            status: 'ATIVO',
          },
          include: {
            aluno: true,
          },
        },
      },
    });

    if (!turma) {
      throw new Error('Turma não encontrada');
    }

    const totalAlunos = turma.matriculas.length;
    const alunosAtivos = turma.matriculas.filter((m) => m.aluno.status === 'ATIVO').length;
    const alunosInativos = totalAlunos - alunosAtivos;
    const vagasDisponiveis = turma.capacidadeMaxima - totalAlunos;
    const percentualOcupacao = Math.round((totalAlunos / turma.capacidadeMaxima) * 100);

    // Estatísticas por gênero
    const generos = turma.matriculas.reduce((acc, m) => {
      const gen = m.aluno.genero || 'Não informado';
      acc[gen] = (acc[gen] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      totalAlunos,
      alunosAtivos,
      alunosInativos,
      vagasDisponiveis,
      percentualOcupacao,
      capacidade: turma.capacidadeMaxima,
      generos,
    };
  }

  /**
   * Lista anos letivos disponíveis
   */
  async getAnosLetivos() {
    const anos = await prisma.anoLetivo.findMany({
      select: {
        id: true,
        ano: true,
        dataInicio: true,
        dataFim: true,
        status: true,
      },
      orderBy: {
        ano: 'desc',
      },
    });

    return anos;
  }

  /**
   * Lista professores disponíveis para ser regente
   */
  async getProfessoresDisponiveis() {
    const professores = await prisma.professor.findMany({
      where: {
        active: true,
      },
      select: {
        id: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        user: {
          name: 'asc',
        },
      },
    });

    return professores.map((p) => ({
      id: p.id,
      userId: p.user.id,
      nome: p.user.name,
      email: p.user.email,
    }));
  }
}

export default new TurmaService();

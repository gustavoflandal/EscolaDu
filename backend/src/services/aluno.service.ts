import { prisma } from '../config/database';
import { logger } from '../config/logger';

export interface CreateAlunoData {
  matricula: string;
  nome: string;
  cpf?: string | null;
  rg?: string | null;
  dataNascimento: Date;
  genero?: string | null;
  foto?: string | null;
  endereco?: string | null;
  telefone?: string | null;
  email?: string | null;
  necessidadesEspeciais?: string | null;
  restricoesMedicas?: string | null;
  status?: string;
  responsavelPrincipalId?: string | null;
}

export interface UpdateAlunoData extends Partial<CreateAlunoData> {
  active?: boolean;
}

export interface ListAlunosFilters {
  page?: number;
  limit?: number;
  status?: string;
  search?: string;
  turmaId?: string;
}

export class AlunoService {
  /**
   * Lista alunos com filtros
   */
  async list(filters: ListAlunosFilters) {
    const page = filters.page || 1;
    const limit = filters.limit || 20;
    const skip = (page - 1) * limit;

    const where: any = {
      active: true,
    };

    if (filters.status) {
      where.status = filters.status;
    }

    if (filters.search) {
      where.OR = [
        { nome: { contains: filters.search } },
        { matricula: { contains: filters.search } },
        { cpf: { contains: filters.search } },
      ];
    }

    if (filters.turmaId) {
      where.matriculas = {
        some: {
          turmaId: filters.turmaId,
          status: 'ATIVO',
        },
      };
    }

    const [alunos, total] = await Promise.all([
      prisma.aluno.findMany({
        where,
        skip,
        take: limit,
        select: {
          id: true,
          matricula: true,
          nome: true,
          cpf: true,
          dataNascimento: true,
          genero: true,
          foto: true,
          status: true,
          createdAt: true,
          responsavelPrincipal: {
            select: {
              id: true,
              name: true,
              email: true,
              phone: true,
            },
          },
        },
        orderBy: { nome: 'asc' },
      }),
      prisma.aluno.count({ where }),
    ]);

    return {
      data: alunos,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Busca aluno por ID
   */
  async findById(id: string) {
    const aluno = await prisma.aluno.findUnique({
      where: { id },
      include: {
        responsavelPrincipal: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
        responsaveis: {
          include: {
            responsavel: {
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
          },
        },
        matriculas: {
          include: {
            turma: {
              select: {
                id: true,
                codigo: true,
                nome: true,
                serie: true,
                turno: true,
              },
            },
          },
          orderBy: { dataMatricula: 'desc' },
        },
      },
    });

    if (!aluno) {
      throw new Error('Aluno não encontrado');
    }

    return aluno;
  }

  /**
   * Cria novo aluno
   */
  async create(data: CreateAlunoData) {
    // Verifica se matrícula já existe
    const existingAluno = await prisma.aluno.findUnique({
      where: { matricula: data.matricula },
    });

    if (existingAluno) {
      throw new Error('Matrícula já está em uso');
    }

    // Verifica CPF se fornecido
    if (data.cpf) {
      const existingCpf = await prisma.aluno.findUnique({
        where: { cpf: data.cpf },
      });

      if (existingCpf) {
        throw new Error('CPF já está cadastrado');
      }
    }

    const aluno = await prisma.aluno.create({
      data,
      include: {
        responsavelPrincipal: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
      },
    });

    logger.info(`Aluno criado: ${aluno.nome} (${aluno.matricula})`);

    return aluno;
  }

  /**
   * Atualiza aluno
   */
  async update(id: string, data: UpdateAlunoData) {
    // Verifica se aluno existe
    const existingAluno = await prisma.aluno.findUnique({
      where: { id },
    });

    if (!existingAluno) {
      throw new Error('Aluno não encontrado');
    }

    // Verifica matrícula se sendo alterada
    if (data.matricula && data.matricula !== existingAluno.matricula) {
      const matriculaInUse = await prisma.aluno.findUnique({
        where: { matricula: data.matricula },
      });

      if (matriculaInUse) {
        throw new Error('Matrícula já está em uso');
      }
    }

    // Verifica CPF se sendo alterado
    if (data.cpf && data.cpf !== existingAluno.cpf) {
      const cpfInUse = await prisma.aluno.findUnique({
        where: { cpf: data.cpf },
      });

      if (cpfInUse) {
        throw new Error('CPF já está cadastrado');
      }
    }

    const aluno = await prisma.aluno.update({
      where: { id },
      data,
      include: {
        responsavelPrincipal: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
      },
    });

    logger.info(`Aluno atualizado: ${aluno.nome} (${aluno.matricula})`);

    return aluno;
  }

  /**
   * Deleta aluno (soft delete)
   */
  async delete(id: string) {
    const aluno = await prisma.aluno.findUnique({
      where: { id },
    });

    if (!aluno) {
      throw new Error('Aluno não encontrado');
    }

    await prisma.aluno.update({
      where: { id },
      data: { active: false },
    });

    logger.info(`Aluno inativado: ${aluno.nome} (${aluno.matricula})`);
  }

  /**
   * Calcula estatísticas do aluno
   */
  async getStats(id: string) {
    const aluno = await prisma.aluno.findUnique({
      where: { id },
    });

    if (!aluno) {
      throw new Error('Aluno não encontrado');
    }

    // Total de frequências
    const totalFrequencias = await prisma.registroFrequencia.count({
      where: { alunoId: id },
    });

    // Presenças
    const presencas = await prisma.registroFrequencia.count({
      where: {
        alunoId: id,
        status: { in: ['P', 'J'] },
      },
    });

    // Faltas
    const faltas = await prisma.registroFrequencia.count({
      where: {
        alunoId: id,
        status: 'F',
      },
    });

    // Percentual de frequência
    const percentualFrequencia =
      totalFrequencias > 0 ? (presencas / totalFrequencias) * 100 : 0;

    // Avaliações
    const totalAvaliacoes = await prisma.avaliacaoObjetivo.count({
      where: { alunoId: id },
    });

    const atingidos = await prisma.avaliacaoObjetivo.count({
      where: {
        alunoId: id,
        status: 'A',
      },
    });

    const emDesenvolvimento = await prisma.avaliacaoObjetivo.count({
      where: {
        alunoId: id,
        status: 'D',
      },
    });

    const naoAtingidos = await prisma.avaliacaoObjetivo.count({
      where: {
        alunoId: id,
        status: 'N',
      },
    });

    // Percentual de atingimento
    const percentualAtingimento =
      totalAvaliacoes > 0 ? (atingidos / totalAvaliacoes) * 100 : 0;

    return {
      frequencia: {
        total: totalFrequencias,
        presencas,
        faltas,
        percentual: Math.round(percentualFrequencia * 100) / 100,
      },
      objetivos: {
        total: totalAvaliacoes,
        atingidos,
        emDesenvolvimento,
        naoAtingidos,
        percentual: Math.round(percentualAtingimento * 100) / 100,
      },
    };
  }
}

export const alunoService = new AlunoService();

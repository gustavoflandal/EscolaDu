import { prisma } from '../config/database';
import { hashPassword } from '../utils/password.util';
import { logger } from '../config/logger';

export interface CreateResponsavelDTO {
  nome: string;
  email: string;
  senha: string;
  cpf: string;
  rg?: string;
  tipoVinculo: string; // PAI, MAE, AVO, TUTOR, OUTRO
  telefonePrincipal: string;
  telefoneSecundario?: string;
  profissao?: string;
  endereco?: string;
}

export interface UpdateResponsavelDTO {
  nome?: string;
  cpf?: string;
  rg?: string;
  tipoVinculo?: string;
  telefonePrincipal?: string;
  telefoneSecundario?: string;
  profissao?: string;
  endereco?: string;
}

export class ResponsavelService {
  /**
   * Lista responsáveis com filtros e paginação
   */
  async list(filters: {
    search?: string;
    page?: number;
    limit?: number;
  }) {
    const { search, page = 1, limit = 10 } = filters;
    const skip = (page - 1) * limit;

    const where: any = {};

    if (search) {
      where.OR = [
        { user: { name: { contains: search } } },
        { cpf: { contains: search } },
        { user: { email: { contains: search } } },
      ];
    }

    const [responsaveis, total] = await Promise.all([
      prisma.responsavel.findMany({
        where,
        skip,
        take: limit,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              phone: true,
              active: true,
            },
          },
          vinculos: {
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
        },
        orderBy: {
          user: {
            name: 'asc',
          },
        },
      }),
      prisma.responsavel.count({ where }),
    ]);

    return {
      data: responsaveis,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Busca responsável por ID
   */
  async getById(id: string) {
    const responsavel = await prisma.responsavel.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            active: true,
            createdAt: true,
          },
        },
        vinculos: {
          include: {
            aluno: true,
          },
          orderBy: {
            prioridadeContato: 'asc',
          },
        },
      },
    });

    if (!responsavel) {
      throw new Error('Responsável não encontrado');
    }

    return responsavel;
  }

  /**
   * Cria novo responsável
   */
  async create(data: CreateResponsavelDTO) {
    // Verifica se já existe usuário com este email
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      throw new Error('Já existe um usuário com este email');
    }

    // Verifica se já existe responsável com este CPF
    const existingResponsavel = await prisma.responsavel.findUnique({
      where: { cpf: data.cpf },
    });

    if (existingResponsavel) {
      throw new Error('Já existe um responsável com este CPF');
    }

    // Hash da senha
    const hashedPassword = await hashPassword(data.senha);

    // Cria usuário e responsável em uma transação
    const responsavel = await prisma.$transaction(async (tx) => {
      // Cria usuário
      const user = await tx.user.create({
        data: {
          email: data.email,
          password: hashedPassword,
          name: data.nome,
          phone: data.telefonePrincipal,
          active: true,
        },
      });

      // Cria responsável
      const newResponsavel = await tx.responsavel.create({
        data: {
          userId: user.id,
          cpf: data.cpf,
          rg: data.rg,
          tipoVinculo: data.tipoVinculo,
          telefonePrincipal: data.telefonePrincipal,
          telefoneSecundario: data.telefoneSecundario,
          email: data.email,
          profissao: data.profissao,
          endereco: data.endereco,
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              active: true,
            },
          },
        },
      });

      return newResponsavel;
    });

    logger.info(`Responsável criado: ${responsavel.id}`);
    return responsavel;
  }

  /**
   * Atualiza responsável
   */
  async update(id: string, data: UpdateResponsavelDTO) {
    const responsavel = await prisma.responsavel.findUnique({
      where: { id },
      include: { user: true },
    });

    if (!responsavel) {
      throw new Error('Responsável não encontrado');
    }

    // Atualiza em transação
    const updated = await prisma.$transaction(async (tx) => {
      // Atualiza usuário se nome mudou
      if (data.nome) {
        await tx.user.update({
          where: { id: responsavel.userId },
          data: { name: data.nome },
        });
      }

      // Atualiza responsável
      return tx.responsavel.update({
        where: { id },
        data: {
          cpf: data.cpf,
          rg: data.rg,
          tipoVinculo: data.tipoVinculo,
          telefonePrincipal: data.telefonePrincipal,
          telefoneSecundario: data.telefoneSecundario,
          profissao: data.profissao,
          endereco: data.endereco,
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              active: true,
            },
          },
        },
      });
    });

    logger.info(`Responsável atualizado: ${id}`);
    return updated;
  }

  /**
   * Remove responsável
   */
  async delete(id: string) {
    const responsavel = await prisma.responsavel.findUnique({
      where: { id },
      include: {
        vinculos: true,
      },
    });

    if (!responsavel) {
      throw new Error('Responsável não encontrado');
    }

    if (responsavel.vinculos.length > 0) {
      throw new Error('Não é possível remover responsável com alunos vinculados');
    }

    await prisma.$transaction(async (tx) => {
      await tx.responsavel.delete({ where: { id } });
      await tx.user.delete({ where: { id: responsavel.userId } });
    });

    logger.info(`Responsável removido: ${id}`);
  }

  /**
   * Vincula aluno ao responsável
   */
  async vincularAluno(
    responsavelId: string,
    alunoId: string,
    prioridadeContato: number = 1
  ) {
    // Verifica se responsável existe
    const responsavel = await prisma.responsavel.findUnique({
      where: { id: responsavelId },
    });

    if (!responsavel) {
      throw new Error('Responsável não encontrado');
    }

    // Verifica se aluno existe
    const aluno = await prisma.aluno.findUnique({
      where: { id: alunoId },
    });

    if (!aluno) {
      throw new Error('Aluno não encontrado');
    }

    // Verifica se vínculo já existe
    const existingVinculo = await prisma.vinculoResponsabilidade.findUnique({
      where: {
        alunoId_responsavelId: {
          alunoId,
          responsavelId,
        },
      },
    });

    if (existingVinculo) {
      throw new Error('Vínculo já existe');
    }

    // Cria vínculo
    const vinculo = await prisma.vinculoResponsabilidade.create({
      data: {
        alunoId,
        responsavelId,
        prioridadeContato,
        active: true,
      },
      include: {
        aluno: true,
        responsavel: {
          include: {
            user: true,
          },
        },
      },
    });

    logger.info(`Aluno ${alunoId} vinculado ao responsável ${responsavelId}`);
    return vinculo;
  }

  /**
   * Remove vínculo de aluno
   */
  async desvincularAluno(responsavelId: string, alunoId: string) {
    const vinculo = await prisma.vinculoResponsabilidade.findUnique({
      where: {
        alunoId_responsavelId: {
          alunoId,
          responsavelId,
        },
      },
    });

    if (!vinculo) {
      throw new Error('Vínculo não encontrado');
    }

    await prisma.vinculoResponsabilidade.delete({
      where: {
        alunoId_responsavelId: {
          alunoId,
          responsavelId,
        },
      },
    });

    logger.info(`Aluno ${alunoId} desvinculado do responsável ${responsavelId}`);
  }

  /**
   * Lista alunos do responsável
   */
  async getAlunos(responsavelId: string) {
    const vinculos = await prisma.vinculoResponsabilidade.findMany({
      where: {
        responsavelId,
        active: true,
      },
      include: {
        aluno: true,
      },
      orderBy: {
        prioridadeContato: 'asc',
      },
    });

    return vinculos.map((v) => ({
      alunoId: v.alunoId,
      nome: v.aluno.nome,
      matricula: v.aluno.matricula,
      prioridadeContato: v.prioridadeContato,
    }));
  }
}

export const responsavelService = new ResponsavelService();

import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

export interface CreateObjetivoInput {
  codigoBNCC: string;
  descricao: string;
  programaEnsinoId: string;
  ordem?: number;
  competencia?: string | null;
  habilidade?: string | null;
  pontuacaoMeta?: number | null;
}

export interface UpdateObjetivoInput {
  codigoBNCC?: string;
  descricao?: string;
  ordem?: number;
  competencia?: string | null;
  habilidade?: string | null;
  pontuacaoMeta?: number | null;
  active?: boolean;
}

export interface ListObjetivosQuery {
  programaEnsinoId?: string;
  search?: string;
  active?: boolean;
  page?: number;
  limit?: number;
}

export class ObjetivoAprendizagemService {
  /**
   * Criar novo objetivo de aprendizagem
   */
  async create(data: CreateObjetivoInput) {
    // Verificar se o programa existe
    const programa = await prisma.programaEnsino.findUnique({
      where: { id: data.programaEnsinoId },
    });

    if (!programa) {
      throw new Error('Programa de ensino não encontrado');
    }

    // Verificar se já existe objetivo com o mesmo código BNCC
    const existingObjetivo = await prisma.objetivoAprendizagem.findUnique({
      where: { codigoBNCC: data.codigoBNCC },
    });

    if (existingObjetivo) {
      throw new Error('Já existe um objetivo de aprendizagem com este código BNCC');
    }

    // Se ordem não foi informada, buscar a próxima ordem disponível
    let ordem = data.ordem;
    if (ordem === undefined || ordem === null) {
      const ultimoObjetivo = await prisma.objetivoAprendizagem.findFirst({
        where: { programaEnsinoId: data.programaEnsinoId },
        orderBy: { ordem: 'desc' },
      });
      ordem = ultimoObjetivo ? ultimoObjetivo.ordem + 1 : 1;
    }

    // Criar o objetivo
    const objetivo = await prisma.objetivoAprendizagem.create({
      data: {
        codigoBNCC: data.codigoBNCC,
        descricao: data.descricao,
        programaEnsinoId: data.programaEnsinoId,
        ordem,
        competencia: data.competencia || null,
        habilidade: data.habilidade || null,
        pontuacaoMeta: data.pontuacaoMeta !== undefined ? data.pontuacaoMeta : null,
      },
      include: {
        programaEnsino: {
          select: {
            id: true,
            codigo: true,
            nome: true,
            serie: true,
            periodo: true,
          },
        },
      },
    });

    return objetivo;
  }

  /**
   * Listar objetivos de aprendizagem com filtros e paginação
   */
  async list(query?: ListObjetivosQuery) {
    const {
      page = 1,
      limit = 50,
      search,
      programaEnsinoId,
      active,
    } = query || {};

    const skip = (page - 1) * limit;

    // Construir filtros
    const where: Prisma.ObjetivoAprendizagemWhereInput = {};

    if (search) {
      where.OR = [
        { codigoBNCC: { contains: search } },
        { descricao: { contains: search } },
        { competencia: { contains: search } },
        { habilidade: { contains: search } },
      ];
    }

    if (programaEnsinoId) {
      where.programaEnsinoId = programaEnsinoId;
    }

    if (active !== undefined) {
      where.active = active;
    }

    // Buscar objetivos e total
    const [objetivos, total] = await Promise.all([
      prisma.objetivoAprendizagem.findMany({
        where,
        skip,
        take: limit,
        orderBy: [
          { ordem: 'asc' },
          { codigoBNCC: 'asc' },
        ],
        include: {
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
                },
              },
            },
          },
        },
      }),
      prisma.objetivoAprendizagem.count({ where }),
    ]);

    return {
      data: objetivos,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Buscar objetivo de aprendizagem por ID
   */
  async findById(id: string) {
    const objetivo = await prisma.objetivoAprendizagem.findUnique({
      where: { id },
      include: {
        programaEnsino: {
          select: {
            id: true,
            codigo: true,
            nome: true,
            serie: true,
            periodo: true,
            anoLetivo: true,
            disciplina: {
              select: {
                id: true,
                codigo: true,
                nome: true,
                areaConhecimento: true,
              },
            },
          },
        },
      },
    });

    if (!objetivo) {
      throw new Error('Objetivo de aprendizagem não encontrado');
    }

    return objetivo;
  }

  /**
   * Buscar objetivo de aprendizagem por código BNCC
   */
  async findByCodigoBNCC(codigoBNCC: string) {
    const objetivo = await prisma.objetivoAprendizagem.findUnique({
      where: { codigoBNCC },
      include: {
        programaEnsino: true,
      },
    });

    return objetivo;
  }

  /**
   * Atualizar objetivo de aprendizagem
   */
  async update(id: string, data: UpdateObjetivoInput) {
    // Verificar se o objetivo existe
    const existingObjetivo = await prisma.objetivoAprendizagem.findUnique({
      where: { id },
    });

    if (!existingObjetivo) {
      throw new Error('Objetivo de aprendizagem não encontrado');
    }

    // Se está atualizando o código BNCC, verificar duplicação
    if (data.codigoBNCC && data.codigoBNCC !== existingObjetivo.codigoBNCC) {
      const codigoExists = await prisma.objetivoAprendizagem.findUnique({
        where: { codigoBNCC: data.codigoBNCC },
      });

      if (codigoExists) {
        throw new Error('Já existe um objetivo de aprendizagem com este código BNCC');
      }
    }

    // Atualizar o objetivo
    const objetivo = await prisma.objetivoAprendizagem.update({
      where: { id },
      data: {
        ...(data.codigoBNCC && { codigoBNCC: data.codigoBNCC }),
        ...(data.descricao && { descricao: data.descricao }),
        ...(data.ordem !== undefined && { ordem: data.ordem }),
        ...(data.competencia !== undefined && { competencia: data.competencia }),
        ...(data.habilidade !== undefined && { habilidade: data.habilidade }),
        ...(data.pontuacaoMeta !== undefined && { pontuacaoMeta: data.pontuacaoMeta }),
        ...(data.active !== undefined && { active: data.active }),
      },
      include: {
        programaEnsino: {
          select: {
            id: true,
            codigo: true,
            nome: true,
            serie: true,
            periodo: true,
          },
        },
      },
    });

    return objetivo;
  }

  /**
   * Desativar objetivo de aprendizagem (soft delete)
   */
  async deactivate(id: string) {
    const objetivo = await prisma.objetivoAprendizagem.findUnique({
      where: { id },
    });

    if (!objetivo) {
      throw new Error('Objetivo de aprendizagem não encontrado');
    }

    if (!objetivo.active) {
      throw new Error('Objetivo de aprendizagem já está desativado');
    }

    return await prisma.objetivoAprendizagem.update({
      where: { id },
      data: { active: false },
    });
  }

  /**
   * Reativar objetivo de aprendizagem
   */
  async activate(id: string) {
    const objetivo = await prisma.objetivoAprendizagem.findUnique({
      where: { id },
    });

    if (!objetivo) {
      throw new Error('Objetivo de aprendizagem não encontrado');
    }

    if (objetivo.active) {
      throw new Error('Objetivo de aprendizagem já está ativo');
    }

    return await prisma.objetivoAprendizagem.update({
      where: { id },
      data: { active: true },
    });
  }

  /**
   * Deletar objetivo de aprendizagem (hard delete)
   */
  async delete(id: string) {
    // Verificar se o objetivo existe
    const objetivo = await prisma.objetivoAprendizagem.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            avaliacoes: true,
          },
        },
      },
    });

    if (!objetivo) {
      throw new Error('Objetivo de aprendizagem não encontrado');
    }

    // Verificar se tem avaliações vinculadas
    if (objetivo._count.avaliacoes > 0) {
      throw new Error(
        `Não é possível excluir este objetivo pois existem ${objetivo._count.avaliacoes} avaliação(ões) vinculada(s). Desative o objetivo em vez de excluí-lo.`
      );
    }

    // Deletar o objetivo
    await prisma.objetivoAprendizagem.delete({
      where: { id },
    });

    return { message: 'Objetivo de aprendizagem excluído com sucesso' };
  }

  /**
   * Reordenar objetivos de um programa
   */
  async reorder(programaEnsinoId: string, objetivosOrdem: { id: string; ordem: number }[]) {
    // Verificar se o programa existe
    const programa = await prisma.programaEnsino.findUnique({
      where: { id: programaEnsinoId },
    });

    if (!programa) {
      throw new Error('Programa de ensino não encontrado');
    }

    // Atualizar ordem de cada objetivo
    const updates = objetivosOrdem.map(({ id, ordem }) =>
      prisma.objetivoAprendizagem.update({
        where: { id },
        data: { ordem },
      })
    );

    await Promise.all(updates);

    return { message: 'Objetivos reordenados com sucesso' };
  }
}

export default new ObjetivoAprendizagemService();

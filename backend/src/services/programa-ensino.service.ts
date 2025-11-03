import { PrismaClient, Prisma } from '@prisma/client';
import { CreateProgramaEnsinoInput, UpdateProgramaEnsinoInput, ListProgramasEnsinoQuery } from '../validators/programa-ensino.validator';

const prisma = new PrismaClient();

export class ProgramaEnsinoService {
  /**
   * Criar novo programa de ensino
   */
  async create(data: CreateProgramaEnsinoInput) {
    // Verificar se a disciplina existe
    const disciplina = await prisma.disciplina.findUnique({
      where: { id: data.disciplinaId },
    });

    if (!disciplina) {
      throw new Error('Disciplina não encontrada');
    }

    // Verificar se já existe programa com o mesmo código
    const existingPrograma = await prisma.programaEnsino.findUnique({
      where: { codigo: data.codigo },
    });

    if (existingPrograma) {
      throw new Error('Já existe um programa de ensino com este código');
    }

    // Criar o programa
    const programa = await prisma.programaEnsino.create({
      data: {
        codigo: data.codigo,
        nome: data.nome,
        descricao: data.descricao || null,
        disciplinaId: data.disciplinaId,
        serieId: data.serie,
        periodo: data.periodo || null,
        anoLetivo: data.anoLetivo,
        cargaHoraria: data.cargaHoraria || null,
        observacoes: data.observacoes || null,
      },
      include: {
        disciplina: {
          select: {
            id: true,
            codigo: true,
            nome: true,
            areaConhecimento: true,
          },
        },
        serie: {
          select: {
            id: true,
            codigo: true,
            nome: true,
          },
        },
        _count: {
          select: {
            objetivos: true,
          },
        },
      },
    });

    return programa;
  }

  /**
   * Listar programas de ensino com filtros e paginação
   */
  async list(query: ListProgramasEnsinoQuery) {
    const {
      page = 1,
      limit = 10,
      search,
      disciplinaId,
      serie,
      periodo,
      anoLetivo,
      active,
    } = query;

    const skip = (page - 1) * limit;

    // Construir filtros
    const where: Prisma.ProgramaEnsinoWhereInput = {};

    if (search) {
      where.OR = [
        { codigo: { contains: search } },
        { nome: { contains: search } },
        { descricao: { contains: search } },
        { disciplina: { nome: { contains: search } } },
      ];
    }

    if (disciplinaId) {
      where.disciplinaId = disciplinaId;
    }

    if (serie) {
      // Aceita tanto o ID (UUID) quanto o código da série
      const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(serie);
      if (isUUID) {
        where.serieId = serie;
      } else {
        where.serie = {
          codigo: serie
        };
      }
    }

    if (periodo) {
      where.periodo = periodo;
    }

    if (anoLetivo) {
      where.anoLetivo = anoLetivo;
    }

    if (active !== undefined) {
      where.active = active;
    }

    // Buscar programas e total
    const [programas, total] = await Promise.all([
      prisma.programaEnsino.findMany({
        where,
        skip,
        take: limit,
        orderBy: [
          { anoLetivo: 'desc' },
          { serie: { ordem: 'asc' } },
          { periodo: 'asc' },
        ],
        select: {
          id: true,
          codigo: true,
          nome: true,
          descricao: true,
          disciplinaId: true,
          serieId: true,
          periodo: true,
          anoLetivo: true,
          cargaHoraria: true,
          observacoes: true,
          active: true,
          createdAt: true,
          disciplina: {
            select: {
              id: true,
              codigo: true,
              nome: true,
              areaConhecimento: true,
            },
          },
          serie: {
            select: {
              id: true,
              codigo: true,
              nome: true,
            },
          },
          _count: {
            select: {
              objetivos: true,
            },
          },
        },
      }),
      prisma.programaEnsino.count({ where }),
    ]);

    return {
      data: programas,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Buscar programa de ensino por ID
   */
  async findById(id: string) {
    const programa = await prisma.programaEnsino.findUnique({
      where: { id },
      include: {
        disciplina: {
          select: {
            id: true,
            codigo: true,
            nome: true,
            areaConhecimento: true,
            cargaHorariaSemanal: true,
            descricao: true,
          },
        },
        serie: {
          select: {
            id: true,
            codigo: true,
            nome: true,
          },
        },
        objetivos: {
          where: { active: true },
          orderBy: { ordem: 'asc' },
          select: {
            id: true,
            codigoBNCC: true,
            descricao: true,
            ordem: true,
            competencia: true,
            habilidade: true,
            pontuacaoMeta: true,
            active: true,
            createdAt: true,
          },
        },
        _count: {
          select: {
            objetivos: true,
          },
        },
      },
    });

    if (!programa) {
      throw new Error('Programa de ensino não encontrado');
    }

    return programa;
  }

  /**
   * Buscar programa de ensino por código
   */
  async findByCodigo(codigo: string) {
    const programa = await prisma.programaEnsino.findUnique({
      where: { codigo },
      include: {
        disciplina: true,
        serie: {
          select: {
            id: true,
            codigo: true,
            nome: true,
          },
        },
        _count: {
          select: {
            objetivos: true,
          },
        },
      },
    });

    return programa;
  }

  /**
   * Atualizar programa de ensino
   */
  async update(id: string, data: UpdateProgramaEnsinoInput) {
    // Verificar se o programa existe
    const existingPrograma = await prisma.programaEnsino.findUnique({
      where: { id },
    });

    if (!existingPrograma) {
      throw new Error('Programa de ensino não encontrado');
    }

    // Se está atualizando o código, verificar duplicação
    if (data.codigo && data.codigo !== existingPrograma.codigo) {
      const codigoExists = await prisma.programaEnsino.findUnique({
        where: { codigo: data.codigo },
      });

      if (codigoExists) {
        throw new Error('Já existe um programa de ensino com este código');
      }
    }

    // Se está atualizando a disciplina, verificar se existe
    if (data.disciplinaId) {
      const disciplina = await prisma.disciplina.findUnique({
        where: { id: data.disciplinaId },
      });

      if (!disciplina) {
        throw new Error('Disciplina não encontrada');
      }
    }

    // Atualizar o programa
    const programa = await prisma.programaEnsino.update({
      where: { id },
      data: {
        ...(data.codigo && { codigo: data.codigo }),
        ...(data.nome && { nome: data.nome }),
        ...(data.descricao !== undefined && { descricao: data.descricao }),
        ...(data.disciplinaId && { disciplinaId: data.disciplinaId }),
        ...(data.serie && { serieId: data.serie }),
        ...(data.periodo !== undefined && { periodo: data.periodo }),
        ...(data.anoLetivo && { anoLetivo: data.anoLetivo }),
        ...(data.cargaHoraria !== undefined && { cargaHoraria: data.cargaHoraria }),
        ...(data.observacoes !== undefined && { observacoes: data.observacoes }),
        ...(data.active !== undefined && { active: data.active }),
      },
      include: {
        disciplina: {
          select: {
            id: true,
            codigo: true,
            nome: true,
            areaConhecimento: true,
          },
        },
        _count: {
          select: {
            objetivos: true,
          },
        },
      },
    });

    return programa;
  }

  /**
   * Desativar programa de ensino (soft delete)
   */
  async deactivate(id: string) {
    const programa = await prisma.programaEnsino.findUnique({
      where: { id },
    });

    if (!programa) {
      throw new Error('Programa de ensino não encontrado');
    }

    if (!programa.active) {
      throw new Error('Programa de ensino já está desativado');
    }

    return await prisma.programaEnsino.update({
      where: { id },
      data: { active: false },
      include: {
        disciplina: {
          select: {
            id: true,
            codigo: true,
            nome: true,
          },
        },
      },
    });
  }

  /**
   * Reativar programa de ensino
   */
  async activate(id: string) {
    const programa = await prisma.programaEnsino.findUnique({
      where: { id },
    });

    if (!programa) {
      throw new Error('Programa de ensino não encontrado');
    }

    if (programa.active) {
      throw new Error('Programa de ensino já está ativo');
    }

    return await prisma.programaEnsino.update({
      where: { id },
      data: { active: true },
      include: {
        disciplina: {
          select: {
            id: true,
            codigo: true,
            nome: true,
          },
        },
      },
    });
  }

  /**
   * Deletar programa de ensino (hard delete)
   */
  async delete(id: string) {
    // Verificar se o programa existe
    const programa = await prisma.programaEnsino.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            objetivos: true,
          },
        },
      },
    });

    if (!programa) {
      throw new Error('Programa de ensino não encontrado');
    }

    // Verificar se tem objetivos vinculados
    if (programa._count.objetivos > 0) {
      throw new Error(
        `Não é possível excluir este programa pois existem ${programa._count.objetivos} objetivo(s) de aprendizagem vinculado(s). Remova os objetivos primeiro ou desative o programa.`
      );
    }

    // Deletar o programa
    await prisma.programaEnsino.delete({
      where: { id },
    });

    return { message: 'Programa de ensino excluído com sucesso' };
  }

  /**
   * Buscar séries disponíveis
   */
  async getSeries() {
    const series = await prisma.programaEnsino.findMany({
      select: { 
        serie: {
          select: {
            id: true,
            codigo: true,
            nome: true,
          },
        },
      },
      distinct: ['serieId'],
      orderBy: { serie: { ordem: 'asc' } },
    });

    return series.map((s) => s.serie);
  }

  /**
   * Buscar anos letivos disponíveis
   */
  async getAnosLetivos() {
    const anos = await prisma.programaEnsino.findMany({
      select: { anoLetivo: true },
      distinct: ['anoLetivo'],
      orderBy: { anoLetivo: 'desc' },
    });

    return anos.map((a) => a.anoLetivo);
  }
}

export default new ProgramaEnsinoService();

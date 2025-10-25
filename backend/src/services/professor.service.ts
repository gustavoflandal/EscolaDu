import { prisma } from '../config/database';
import { hashPassword } from '../utils/password.util';
import { logger } from '../config/logger';

export interface CreateProfessorDTO {
  nome: string;
  email: string;
  senha: string;
  cpf?: string;
  telefone?: string;
  registroProfissional?: string;
  especialidade?: string;
  cargaHoraria?: number;
}

export interface UpdateProfessorDTO {
  nome?: string;
  telefone?: string;
  registroProfissional?: string;
  especialidade?: string;
  cargaHoraria?: number;
  active?: boolean;
}

export interface CreateFormacaoDTO {
  nivel: string; // FUNDAMENTAL, MEDIO, TECNICO, GRADUACAO, POS_GRADUACAO, MESTRADO, DOUTORADO
  curso: string;
  instituicao: string;
  areaConhecimento?: string;
  dataInicio: Date;
  dataConclusao?: Date;
  emAndamento: boolean;
  cargaHoraria?: number;
  observacoes?: string;
}

export interface UpdateFormacaoDTO {
  nivel?: string;
  curso?: string;
  instituicao?: string;
  areaConhecimento?: string;
  dataInicio?: Date;
  dataConclusao?: Date;
  emAndamento?: boolean;
  cargaHoraria?: number;
  observacoes?: string;
}

export class ProfessorService {
  /**
   * Lista professores com filtros e paginação
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
        { user: { email: { contains: search } } },
        { user: { cpf: { contains: search } } },
        { registroProfissional: { contains: search } },
      ];
    }

    const [professores, total] = await Promise.all([
      prisma.professor.findMany({
        where,
        skip,
        take: limit,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              cpf: true,
              phone: true,
              active: true,
            },
          },
          formacoes: {
            orderBy: {
              dataInicio: 'desc',
            },
          },
        },
        orderBy: {
          user: {
            name: 'asc',
          },
        },
      }),
      prisma.professor.count({ where }),
    ]);

    return {
      data: professores,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Busca professor por ID
   */
  async getById(id: string) {
    const professor = await prisma.professor.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            cpf: true,
            phone: true,
            active: true,
            createdAt: true,
          },
        },
        formacoes: {
          orderBy: {
            dataInicio: 'desc',
          },
        },
      },
    });

    if (!professor) {
      throw new Error('Professor não encontrado');
    }

    return professor;
  }

  /**
   * Cria novo professor
   */
  async create(data: CreateProfessorDTO) {
    // Verifica se já existe usuário com este email
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      throw new Error('Já existe um usuário com este email');
    }

    // Se CPF foi fornecido, verifica se já existe
    if (data.cpf) {
      const existingUserWithCpf = await prisma.user.findUnique({
        where: { cpf: data.cpf },
      });

      if (existingUserWithCpf) {
        throw new Error('Já existe um usuário com este CPF');
      }
    }

    // Hash da senha
    const hashedPassword = await hashPassword(data.senha);

    // Cria usuário e professor em uma transação
    const professor = await prisma.$transaction(async (tx) => {
      // Cria usuário
      const user = await tx.user.create({
        data: {
          email: data.email,
          password: hashedPassword,
          name: data.nome,
          cpf: data.cpf,
          phone: data.telefone,
          active: true,
        },
      });

      // Cria professor
      const newProfessor = await tx.professor.create({
        data: {
          userId: user.id,
          registroProfissional: data.registroProfissional,
          especialidade: data.especialidade,
          cargaHoraria: data.cargaHoraria,
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              cpf: true,
              phone: true,
              active: true,
            },
          },
        },
      });

      return newProfessor;
    });

    logger.info(`Professor criado: ${professor.id}`);
    return professor;
  }

  /**
   * Atualiza professor
   */
  async update(id: string, data: UpdateProfessorDTO) {
    const professor = await prisma.professor.findUnique({
      where: { id },
      include: { user: true },
    });

    if (!professor) {
      throw new Error('Professor não encontrado');
    }

    const updated = await prisma.$transaction(async (tx) => {
      // Atualiza dados do usuário
      if (data.nome || data.telefone !== undefined) {
        await tx.user.update({
          where: { id: professor.userId },
          data: {
            name: data.nome,
            phone: data.telefone,
          },
        });
      }

      // Atualiza dados do professor
      const updatedProfessor = await tx.professor.update({
        where: { id },
        data: {
          registroProfissional: data.registroProfissional,
          especialidade: data.especialidade,
          cargaHoraria: data.cargaHoraria,
          active: data.active,
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              cpf: true,
              phone: true,
              active: true,
            },
          },
        },
      });

      return updatedProfessor;
    });

    logger.info(`Professor atualizado: ${id}`);
    return updated;
  }

  /**
   * Remove professor (soft delete)
   */
  async delete(id: string) {
    const professor = await prisma.professor.findUnique({
      where: { id },
    });

    if (!professor) {
      throw new Error('Professor não encontrado');
    }

    await prisma.professor.update({
      where: { id },
      data: {
        active: false,
      },
    });

    logger.info(`Professor removido: ${id}`);
  }

  /**
   * Adiciona formação ao professor
   */
  async addFormacao(professorId: string, data: CreateFormacaoDTO) {
    // Verifica se professor existe
    const professor = await prisma.professor.findUnique({
      where: { id: professorId },
    });

    if (!professor) {
      throw new Error('Professor não encontrado');
    }

    const formacao = await prisma.formacao.create({
      data: {
        professorId,
        nivel: data.nivel,
        curso: data.curso,
        instituicao: data.instituicao,
        areaConhecimento: data.areaConhecimento,
        dataInicio: data.dataInicio,
        dataConclusao: data.dataConclusao,
        emAndamento: data.emAndamento,
        cargaHoraria: data.cargaHoraria,
        observacoes: data.observacoes,
      },
    });

    logger.info(`Formação adicionada ao professor ${professorId}: ${formacao.id}`);
    return formacao;
  }

  /**
   * Atualiza formação do professor
   */
  async updateFormacao(professorId: string, formacaoId: string, data: UpdateFormacaoDTO) {
    // Verifica se a formação pertence ao professor
    const formacao = await prisma.formacao.findFirst({
      where: {
        id: formacaoId,
        professorId: professorId,
      },
    });

    if (!formacao) {
      throw new Error('Formação não encontrada');
    }

    const updated = await prisma.formacao.update({
      where: { id: formacaoId },
      data: {
        nivel: data.nivel,
        curso: data.curso,
        instituicao: data.instituicao,
        areaConhecimento: data.areaConhecimento,
        dataInicio: data.dataInicio,
        dataConclusao: data.dataConclusao,
        emAndamento: data.emAndamento,
        cargaHoraria: data.cargaHoraria,
        observacoes: data.observacoes,
      },
    });

    logger.info(`Formação atualizada: ${formacaoId}`);
    return updated;
  }

  /**
   * Remove formação do professor
   */
  async deleteFormacao(professorId: string, formacaoId: string) {
    // Verifica se a formação pertence ao professor
    const formacao = await prisma.formacao.findFirst({
      where: {
        id: formacaoId,
        professorId: professorId,
      },
    });

    if (!formacao) {
      throw new Error('Formação não encontrada');
    }

    await prisma.formacao.delete({
      where: { id: formacaoId },
    });

    logger.info(`Formação removida: ${formacaoId}`);
  }

  /**
   * Lista formações do professor
   */
  async getFormacoes(professorId: string) {
    const professor = await prisma.professor.findUnique({
      where: { id: professorId },
    });

    if (!professor) {
      throw new Error('Professor não encontrado');
    }

    const formacoes = await prisma.formacao.findMany({
      where: { professorId },
      orderBy: {
        dataInicio: 'desc',
      },
    });

    return formacoes;
  }
}

export const professorService = new ProfessorService();

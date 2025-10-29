import { prisma } from '../config/database';
import { logger } from '../config/logger';
import { hashPassword } from '../utils/password.util';

export interface CreateResponsavelDto {
  // Dados do User
  name: string;
  email: string;
  password: string;
  cpf: string;
  phone: string;
  
  // Dados específicos do Responsável
  tipoVinculo: 'PAI' | 'MAE' | 'AVO' | 'TUTOR' | 'OUTRO';
  rg?: string;
  telefoneSecundario?: string;
  profissao?: string;
  endereco?: string;
}

export interface UpdateResponsavelDto {
  name?: string;
  email?: string;
  phone?: string;
  tipoVinculo?: 'PAI' | 'MAE' | 'AVO' | 'TUTOR' | 'OUTRO';
  rg?: string;
  telefoneSecundario?: string;
  profissao?: string;
  endereco?: string;
  active?: boolean;
}

export interface ListResponsaveisFilters {
  search?: string;
  active?: boolean;
  page?: number;
  limit?: number;
}

export interface VinculoResponsavelDto {
  alunoId: string;
  responsavelId: string;
  prioridadeContato?: number;
}

export class ResponsavelService {
  /**
   * Lista responsáveis com paginação e filtros
   */
  async list(filters: ListResponsaveisFilters = {}) {
    const { search, active, page = 1, limit = 10 } = filters;
    const skip = (page - 1) * limit;

    const where: any = {};

    // Filtro de busca (nome, email, CPF)
    if (search) {
      where.OR = [
        { user: { name: { contains: search } } },
        { user: { email: { contains: search } } },
        { cpf: { contains: search } }
      ];
    }

    // Filtro de status
    if (active !== undefined) {
      where.user = { ...where.user, active };
    }

    const [total, responsaveisRaw] = await Promise.all([
      prisma.responsavel.count({ where }),
      prisma.responsavel.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              phone: true,
              active: true,
              createdAt: true,
              updatedAt: true
            }
          },
          vinculos: {
            where: { active: true },
            include: {
              aluno: {
                select: {
                  id: true,
                  nome: true,
                  matricula: true,
                  status: true
                }
              }
            }
          },
          _count: {
            select: {
              vinculos: {
                where: { active: true }
              }
            }
          }
        },
        orderBy: { user: { name: 'asc' } },
        skip,
        take: limit
      })
    ]);

    // Transformar dados para formato flat
    const responsaveis = responsaveisRaw.map(resp => ({
      id: resp.id,
      userId: resp.userId,
      name: resp.user.name,
      email: resp.user.email,
      phone: resp.user.phone,
      cpf: resp.cpf,
      rg: resp.rg,
      tipoVinculo: resp.tipoVinculo,
      telefonePrincipal: resp.telefonePrincipal,
      telefoneSecundario: resp.telefoneSecundario,
      profissao: resp.profissao,
      endereco: resp.endereco,
      active: resp.user.active,
      createdAt: resp.createdAt,
      updatedAt: resp.updatedAt,
      alunosVinculados: resp.vinculos.length,
      alunos: resp.vinculos.map(v => ({
        id: v.aluno.id,
        nome: v.aluno.nome,
        matricula: v.aluno.matricula,
        status: v.aluno.status,
        prioridadeContato: v.prioridadeContato
      }))
    }));

    return {
      data: responsaveis,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    };
  }

  /**
   * Busca responsável por ID
   */
  async findById(id: string) {
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
            updatedAt: true
          }
        },
        vinculos: {
          where: { active: true },
          include: {
            aluno: {
              select: {
                id: true,
                nome: true,
                matricula: true,
                status: true,
                foto: true,
                dataNascimento: true
              }
            }
          },
          orderBy: { prioridadeContato: 'asc' }
        }
      }
    });

    if (!responsavel) {
      throw new Error('Responsável não encontrado');
    }

    return {
      id: responsavel.id,
      userId: responsavel.userId,
      name: responsavel.user.name,
      email: responsavel.user.email,
      phone: responsavel.user.phone,
      cpf: responsavel.cpf,
      rg: responsavel.rg,
      tipoVinculo: responsavel.tipoVinculo,
      telefonePrincipal: responsavel.telefonePrincipal,
      telefoneSecundario: responsavel.telefoneSecundario,
      profissao: responsavel.profissao,
      endereco: responsavel.endereco,
      active: responsavel.user.active,
      createdAt: responsavel.createdAt,
      updatedAt: responsavel.updatedAt,
      alunos: responsavel.vinculos.map(v => ({
        vinculoId: v.id,
        alunoId: v.aluno.id,
        nome: v.aluno.nome,
        matricula: v.aluno.matricula,
        status: v.aluno.status,
        foto: v.aluno.foto,
        dataNascimento: v.aluno.dataNascimento,
        prioridadeContato: v.prioridadeContato,
        createdAt: v.createdAt
      }))
    };
  }

  /**
   * Busca responsável por CPF
   */
  async findByCPF(cpf: string) {
    const responsavel = await prisma.responsavel.findUnique({
      where: { cpf },
      include: {
        user: true,
        vinculos: {
          where: { active: true },
          include: {
            aluno: true
          }
        }
      }
    });

    if (!responsavel) {
      return null;
    }

    return {
      id: responsavel.id,
      userId: responsavel.userId,
      name: responsavel.user.name,
      email: responsavel.user.email,
      cpf: responsavel.cpf,
      telefone: responsavel.telefonePrincipal,
      alunosVinculados: responsavel.vinculos.length
    };
  }

  /**
   * Cria novo responsável
   */
  async create(data: CreateResponsavelDto) {
    // Verificar se CPF já existe
    const cpfExists = await prisma.responsavel.findUnique({
      where: { cpf: data.cpf }
    });

    if (cpfExists) {
      throw new Error('CPF já cadastrado');
    }

    // Verificar se email já existe
    const emailExists = await prisma.user.findUnique({
      where: { email: data.email }
    });

    if (emailExists) {
      throw new Error('Email já cadastrado');
    }

    // Hash da senha
    const hashedPassword = await hashPassword(data.password);

    // Criar User e Responsavel em transação
    const responsavel = await prisma.$transaction(async (tx) => {
      // Criar User
      const user = await tx.user.create({
        data: {
          name: data.name,
          email: data.email,
          password: hashedPassword,
          cpf: data.cpf,
          phone: data.phone,
          active: true
        }
      });

      // Criar Responsavel
      const resp = await tx.responsavel.create({
        data: {
          userId: user.id,
          cpf: data.cpf,
          rg: data.rg,
          tipoVinculo: data.tipoVinculo,
          telefonePrincipal: data.phone,
          telefoneSecundario: data.telefoneSecundario,
          email: data.email,
          profissao: data.profissao,
          endereco: data.endereco
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              phone: true,
              active: true,
              createdAt: true,
              updatedAt: true
            }
          }
        }
      });

      // Atribuir role de Responsável
      const roleResponsavel = await tx.role.findFirst({
        where: { name: 'Responsável' }
      });

      if (roleResponsavel) {
        await tx.userRole.create({
          data: {
            userId: user.id,
            roleId: roleResponsavel.id
          }
        });
      }

      return resp;
    });

    logger.info('Responsável criado', { id: responsavel.id, cpf: data.cpf });

    return {
      id: responsavel.id,
      userId: responsavel.userId,
      name: responsavel.user.name,
      email: responsavel.user.email,
      phone: responsavel.user.phone,
      cpf: responsavel.cpf,
      rg: responsavel.rg,
      telefonePrincipal: responsavel.telefonePrincipal,
      telefoneSecundario: responsavel.telefoneSecundario,
      profissao: responsavel.profissao,
      endereco: responsavel.endereco,
      active: responsavel.user.active,
      createdAt: responsavel.createdAt,
      updatedAt: responsavel.updatedAt
    };
  }

  /**
   * Atualiza responsável
   */
  async update(id: string, data: UpdateResponsavelDto) {
    const responsavel = await prisma.responsavel.findUnique({
      where: { id },
      include: { user: true }
    });

    if (!responsavel) {
      throw new Error('Responsável não encontrado');
    }

    // Verificar se email já existe (se mudou)
    if (data.email && data.email !== responsavel.user.email) {
      const emailExists = await prisma.user.findUnique({
        where: { email: data.email }
      });

      if (emailExists) {
        throw new Error('Email já cadastrado');
      }
    }

    // Atualizar em transação
    const updated = await prisma.$transaction(async (tx) => {
      // Atualizar User
      const userUpdateData: any = {};
      if (data.name) userUpdateData.name = data.name;
      if (data.email) userUpdateData.email = data.email;
      if (data.phone) userUpdateData.phone = data.phone;
      if (data.active !== undefined) userUpdateData.active = data.active;

      if (Object.keys(userUpdateData).length > 0) {
        await tx.user.update({
          where: { id: responsavel.userId },
          data: userUpdateData
        });
      }

      // Atualizar Responsavel
      const responsavelUpdateData: any = {};
      if (data.rg !== undefined) responsavelUpdateData.rg = data.rg;
      if (data.tipoVinculo) responsavelUpdateData.tipoVinculo = data.tipoVinculo;
      if (data.telefoneSecundario !== undefined) responsavelUpdateData.telefoneSecundario = data.telefoneSecundario;
      if (data.profissao !== undefined) responsavelUpdateData.profissao = data.profissao;
      if (data.endereco !== undefined) responsavelUpdateData.endereco = data.endereco;
      if (data.phone) responsavelUpdateData.telefonePrincipal = data.phone;
      if (data.email) responsavelUpdateData.email = data.email;

      if (Object.keys(responsavelUpdateData).length > 0) {
        return await tx.responsavel.update({
          where: { id },
          data: responsavelUpdateData,
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                active: true,
                createdAt: true,
                updatedAt: true
              }
            }
          }
        });
      }

      return await tx.responsavel.findUnique({
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
              updatedAt: true
            }
          }
        }
      });
    });

    logger.info('Responsável atualizado', { id });

    return {
      id: updated!.id,
      userId: updated!.userId,
      name: updated!.user.name,
      email: updated!.user.email,
      phone: updated!.user.phone,
      cpf: updated!.cpf,
      rg: updated!.rg,
      tipoVinculo: updated!.tipoVinculo,
      telefonePrincipal: updated!.telefonePrincipal,
      telefoneSecundario: updated!.telefoneSecundario,
      profissao: updated!.profissao,
      endereco: updated!.endereco,
      active: updated!.user.active,
      createdAt: updated!.createdAt,
      updatedAt: updated!.updatedAt
    };
  }

  /**
   * Remove responsável (soft delete)
   */
  async delete(id: string) {
    const responsavel = await prisma.responsavel.findUnique({
      where: { id },
      include: {
        vinculos: {
          where: { active: true }
        }
      }
    });

    if (!responsavel) {
      throw new Error('Responsável não encontrado');
    }

    // Verificar se tem alunos vinculados
    if (responsavel.vinculos.length > 0) {
      throw new Error('Não é possível excluir responsável com alunos vinculados');
    }

    // Soft delete do User
    await prisma.user.update({
      where: { id: responsavel.userId },
      data: { active: false }
    });

    logger.info('Responsável removido (soft delete)', { id });
  }

  /**
   * Cria vínculo entre responsável e aluno
   */
  async createVinculo(data: VinculoResponsavelDto) {
    // Verificar se responsável existe
    const responsavel = await prisma.responsavel.findUnique({
      where: { id: data.responsavelId }
    });

    if (!responsavel) {
      throw new Error('Responsável não encontrado');
    }

    // Verificar se aluno existe
    const aluno = await prisma.aluno.findUnique({
      where: { id: data.alunoId }
    });

    if (!aluno) {
      throw new Error('Aluno não encontrado');
    }

    // Verificar se vínculo já existe
    const vinculoExistente = await prisma.vinculoResponsabilidade.findUnique({
      where: {
        alunoId_responsavelId: {
          alunoId: data.alunoId,
          responsavelId: data.responsavelId
        }
      }
    });

    if (vinculoExistente) {
      if (vinculoExistente.active) {
        throw new Error('Vínculo já existe entre este aluno e responsável');
      } else {
        // Reativar vínculo
        const vinculo = await prisma.vinculoResponsabilidade.update({
          where: { id: vinculoExistente.id },
          data: {
            active: true,
            prioridadeContato: data.prioridadeContato || 1
          },
          include: {
            aluno: {
              select: {
                id: true,
                nome: true,
                matricula: true,
                status: true
              }
            },
            responsavel: {
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
        });

        logger.info('Vínculo reativado', { 
          vinculoId: vinculo.id, 
          alunoId: data.alunoId, 
          responsavelId: data.responsavelId 
        });

        return vinculo;
      }
    }

    // Criar novo vínculo
    const vinculo = await prisma.vinculoResponsabilidade.create({
      data: {
        alunoId: data.alunoId,
        responsavelId: data.responsavelId,
        prioridadeContato: data.prioridadeContato || 1,
        active: true
      },
      include: {
        aluno: {
          select: {
            id: true,
            nome: true,
            matricula: true,
            status: true
          }
        },
        responsavel: {
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
    });

    logger.info('Vínculo criado', { 
      vinculoId: vinculo.id, 
      alunoId: data.alunoId, 
      responsavelId: data.responsavelId 
    });

    return vinculo;
  }

  /**
   * Remove vínculo (soft delete)
   */
  async removeVinculo(vinculoId: string) {
    const vinculo = await prisma.vinculoResponsabilidade.findUnique({
      where: { id: vinculoId }
    });

    if (!vinculo) {
      throw new Error('Vínculo não encontrado');
    }

    await prisma.vinculoResponsabilidade.update({
      where: { id: vinculoId },
      data: { active: false }
    });

    logger.info('Vínculo removido', { vinculoId });
  }

  /**
   * Atualiza vínculo (apenas prioridade de contato)
   */
  async updateVinculo(
    vinculoId: string, 
    data: { prioridadeContato?: number }
  ) {
    const vinculo = await prisma.vinculoResponsabilidade.findUnique({
      where: { id: vinculoId }
    });

    if (!vinculo) {
      throw new Error('Vínculo não encontrado');
    }

    const updated = await prisma.vinculoResponsabilidade.update({
      where: { id: vinculoId },
      data,
      include: {
        aluno: {
          select: {
            id: true,
            nome: true,
            matricula: true
          }
        },
        responsavel: {
          include: {
            user: {
              select: {
                name: true
              }
            }
          }
        }
      }
    });

    logger.info('Vínculo atualizado', { vinculoId });

    return updated;
  }

  /**
   * Lista alunos de um responsável
   */
  async getAlunosByResponsavel(responsavelId: string) {
    const vinculos = await prisma.vinculoResponsabilidade.findMany({
      where: {
        responsavelId,
        active: true
      },
      include: {
        aluno: {
          select: {
            id: true,
            matricula: true,
            nome: true,
            dataNascimento: true,
            foto: true,
            status: true,
            telefone: true,
            email: true
          }
        }
      },
      orderBy: { prioridadeContato: 'asc' }
    });

    return vinculos.map(v => ({
      vinculoId: v.id,
      prioridadeContato: v.prioridadeContato,
      aluno: v.aluno
    }));
  }
}

export const responsavelService = new ResponsavelService();

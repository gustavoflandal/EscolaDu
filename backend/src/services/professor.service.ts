import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface CreateProfessorDto {
  userId: string;
  registroProfissional: string;
  cargaHoraria: number;
  active?: boolean;
}

interface UpdateProfessorDto {
  registroProfissional?: string;
  cargaHoraria?: number;
  active?: boolean;
}

interface CreateFormacaoDto {
  professorId: string;
  nome: string;
  descricao?: string;
}

interface UpdateFormacaoDto {
  nome?: string;
  descricao?: string;
}

interface ListProfessoresQuery {
  search?: string;
  active?: string;
  page?: string;
  limit?: string;
}

// Cache simples em memória
const cache = new Map<string, { data: any; timestamp: number }>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutos

class ProfessorService {
  // Limpar cache
  private clearCache() {
    cache.clear();
    console.log('[Cache] Cache de professores limpo');
  }

  private getCacheKey(key: string): string {
    return `professor:${key}`;
  }

  private getFromCache<T>(key: string): T | null {
    const cached = cache.get(this.getCacheKey(key));
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      console.log(`[Cache] HIT: ${key}`);
      return cached.data as T;
    }
    console.log(`[Cache] MISS: ${key}`);
    return null;
  }

  private setCache(key: string, data: any): void {
    cache.set(this.getCacheKey(key), {
      data,
      timestamp: Date.now()
    });
  }

  // Listar professores com filtros e paginação
  async list(query: ListProfessoresQuery) {
    const page = parseInt(query.page || '1');
    const limit = parseInt(query.limit || '10');
    const skip = (page - 1) * limit;

    const where: any = {};

    // Filtro de busca
    if (query.search) {
      where.user = {
        OR: [
          { name: { contains: query.search, mode: 'insensitive' } },
          { email: { contains: query.search, mode: 'insensitive' } },
          { cpf: { contains: query.search } }
        ]
      };
    }

    // Filtro de status
    if (query.active !== undefined) {
      where.active = query.active === 'true';
    }

    // Buscar total e dados
    const [total, professores] = await Promise.all([
      prisma.professor.count({ where }),
      prisma.professor.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              cpf: true,
              phone: true,
              avatar: true,
              active: true
            }
          },
          _count: {
            select: {
              turmasRegente: true,
              disciplinas: true,
              formacoes: true
            }
          }
        },
        skip,
        take: limit,
        orderBy: {
          user: {
            name: 'asc'
          }
        }
      })
    ]);

    return {
      data: professores,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    };
  }

  // Buscar professor por ID
  async getById(id: string) {
    const cacheKey = `detail:${id}`;
    const cached = this.getFromCache(cacheKey);
    if (cached) return cached;

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
            avatar: true,
            active: true,
            createdAt: true,
            updatedAt: true
          }
        },
        formacoes: {
          select: {
            id: true,
            nome: true,
            descricao: true,
            createdAt: true
          },
          orderBy: {
            nome: 'asc'
          }
        },
        turmasRegente: {
          select: {
            id: true,
            nome: true,
            turno: true,
            anoLetivo: {
              select: {
                ano: true
              }
            }
          }
        },
        _count: {
          select: {
            turmasRegente: true,
            disciplinas: true,
            formacoes: true
          }
        }
      }
    });

    if (!professor) {
      throw new Error('Professor não encontrado');
    }

    this.setCache(cacheKey, professor);
    return professor;
  }

  // Buscar professor por userId
  async getByUserId(userId: string) {
    const professor = await prisma.professor.findUnique({
      where: { userId },
      include: {
        user: true,
        formacoes: true,
        _count: {
          select: {
            turmasRegente: true,
            disciplinas: true
          }
        }
      }
    });

    return professor;
  }

  // Criar professor
  async create(data: CreateProfessorDto) {
    // Verificar se o usuário já possui perfil de professor
    const existingProfessor = await prisma.professor.findUnique({
      where: { userId: data.userId }
    });

    if (existingProfessor) {
      throw new Error('Este usuário já possui um perfil de professor');
    }

    // Verificar se o usuário existe
    const user = await prisma.user.findUnique({
      where: { id: data.userId }
    });

    if (!user) {
      throw new Error('Usuário não encontrado');
    }

    const professor = await prisma.professor.create({
      data: {
        userId: data.userId,
        registroProfissional: data.registroProfissional,
        cargaHoraria: data.cargaHoraria,
        active: data.active ?? true
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            cpf: true,
            phone: true,
            avatar: true,
            active: true
          }
        },
        formacoes: true
      }
    });

    this.clearCache();
    return professor;
  }

  // Atualizar professor
  async update(id: string, data: UpdateProfessorDto) {
    // Verificar se existe
    const existing = await prisma.professor.findUnique({
      where: { id }
    });

    if (!existing) {
      throw new Error('Professor não encontrado');
    }

    const professor = await prisma.professor.update({
      where: { id },
      data,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            cpf: true,
            phone: true,
            avatar: true,
            active: true
          }
        },
        formacoes: true
      }
    });

    this.clearCache();
    return professor;
  }

  // Deletar professor (soft delete)
  async delete(id: string) {
    // Verificar se existe
    const existing = await prisma.professor.findUnique({
      where: { id }
    });

    if (!existing) {
      throw new Error('Professor não encontrado');
    }

    await prisma.professor.update({
      where: { id },
      data: { active: false }
    });

    this.clearCache();
  }

  // FORMAÇÕES

  // Listar formações de um professor
  async listFormacoes(professorId: string) {
    const formacoes = await prisma.formacao.findMany({
      where: { professorId },
      orderBy: {
        nome: 'asc'
      }
    });

    return formacoes;
  }

  // Criar formação
  async createFormacao(data: CreateFormacaoDto) {
    // Verificar se o professor existe
    const professor = await prisma.professor.findUnique({
      where: { id: data.professorId }
    });

    if (!professor) {
      throw new Error('Professor não encontrado');
    }

    const formacao = await prisma.formacao.create({
      data: {
        professorId: data.professorId,
        nome: data.nome,
        descricao: data.descricao
      }
    });

    this.clearCache();
    return formacao;
  }

  // Atualizar formação
  async updateFormacao(id: string, data: UpdateFormacaoDto) {
    const formacao = await prisma.formacao.update({
      where: { id },
      data
    });

    this.clearCache();
    return formacao;
  }

  // Deletar formação
  async deleteFormacao(id: string) {
    await prisma.formacao.delete({
      where: { id }
    });

    this.clearCache();
  }

  // Estatísticas
  async getStats() {
    const cacheKey = 'stats';
    const cached = this.getFromCache(cacheKey);
    if (cached) return cached;

    const [total, ativos, inativos, totalFormacoes] = await Promise.all([
      prisma.professor.count(),
      prisma.professor.count({ where: { active: true } }),
      prisma.professor.count({ where: { active: false } }),
      prisma.formacao.count()
    ]);

    const stats = {
      total,
      ativos,
      inativos,
      totalFormacoes
    };

    this.setCache(cacheKey, stats);
    return stats;
  }

  // Agenda
  async getAgenda(professorId: string, filters?: {
    dataInicio?: string;
    dataFim?: string;
  }) {
    // Verificar se professor existe
    const professor = await prisma.professor.findUnique({
      where: { id: professorId },
      include: {
        user: {
          select: {
            name: true,
            email: true
          }
        }
      }
    });

    if (!professor) {
      throw new Error('Professor não encontrado');
    }

    // Buscar todos os vínculos turma-disciplina do professor
    const vinculos = await prisma.turmaDisciplina.findMany({
      where: {
        professorId
      },
      include: {
        turma: {
          select: {
            id: true,
            codigo: true,
            nome: true,
            turno: true,
            sala: {
              select: {
                nome: true
              }
            },
            serie: {
              select: {
                id: true,
                nome: true,
                codigo: true
              }
            },
            anoLetivo: {
              select: {
                ano: true,
                status: true
              }
            }
          }
        },
        disciplina: {
          select: {
            id: true,
            codigo: true,
            nome: true,
            cargaHorariaSemanal: true
          }
        }
      },
      orderBy: [
        { diaSemana: 'asc' },
        { horarioInicio: 'asc' }
      ]
    });

    // Agrupar por dia da semana
    const agendaSemanal = Array.from({ length: 7 }, (_, i) => ({
      diaSemana: i + 1,
      diaSemanaLabel: this.getDiaSemanaLabel(i + 1),
      aulas: [] as any[]
    }));

    vinculos.forEach(vinculo => {
      if (vinculo.diaSemana) {
        const diaIndex = vinculo.diaSemana - 1;
        agendaSemanal[diaIndex].aulas.push({
          id: vinculo.id,
          disciplina: vinculo.disciplina,
          turma: vinculo.turma,
          horarioInicio: vinculo.horarioInicio,
          horarioFim: vinculo.horarioFim
        });
      }
    });

    return {
      professor: {
        id: professor.id,
        nome: professor.user.name,
        email: professor.user.email,
        registroProfissional: professor.registroProfissional,
        cargaHoraria: professor.cargaHoraria
      },
      agendaSemanal,
      totalAulas: vinculos.length,
      filtros: filters
    };
  }

  private getDiaSemanaLabel(dia: number): string {
    const dias = ['', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado', 'Domingo'];
    return dias[dia] || '';
  }
}

export default new ProfessorService();

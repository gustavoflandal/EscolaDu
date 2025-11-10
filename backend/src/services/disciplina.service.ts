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
            { serieId: 'asc' },
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
            programasEnsino: true,
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
            programasEnsino: true,
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
            programasEnsino: true
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

    if (disciplina._count.programasEnsino > 0) {
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
        programaEnsino: {
          select: {
            id: true,
            codigo: true,
            nome: true,
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

    // Criar objetivo vinculado ao programa de ensino, não diretamente à disciplina
    // @ts-ignore - Tipos serão atualizados após restart do TS Server
    return prisma.objetivoAprendizagem.create({
      data: {
        ...data
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
      select: { serieId: true },
      distinct: ['serieId']
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

  // ==================== TURMAS ====================

  async getTurmas(disciplinaId: string) {
    const disciplina = await prisma.disciplina.findUnique({
      where: { id: disciplinaId },
      include: {
        turmas: {
          include: {
            turma: {
              select: {
                id: true,
                codigo: true,
                nome: true,
                serie: true,
                turno: true,
                capacidadeMaxima: true,
                active: true
              }
            },
            professor: {
              select: {
                id: true,
                user: {
                  select: {
                    name: true,
                    email: true
                  }
                }
              }
            }
          },
          orderBy: {
            turma: {
              codigo: 'asc'
            }
          }
        }
      }
    });

    if (!disciplina) {
      throw new Error('Disciplina não encontrada');
    }

    return disciplina.turmas;
  }

  async vincularTurma(disciplinaId: string, data: {
    turmaId: string;
    professorId: string;
    diaSemana?: number;
    horarioInicio?: string;
    horarioFim?: string;
  }) {
    // Verificar se disciplina existe
    const disciplina = await prisma.disciplina.findUnique({
      where: { id: disciplinaId }
    });

    if (!disciplina) {
      throw new Error('Disciplina não encontrada');
    }

    // Verificar se turma existe
    const turma = await prisma.turma.findUnique({
      where: { id: data.turmaId }
    });

    if (!turma) {
      throw new Error('Turma não encontrada');
    }

    // Verificar se professor existe
    const professor = await prisma.professor.findUnique({
      where: { id: data.professorId }
    });

    if (!professor) {
      throw new Error('Professor não encontrado');
    }

    // Verificar se já existe vínculo
    const vinculoExistente = await prisma.turmaDisciplina.findUnique({
      where: {
        turmaId_disciplinaId: {
          turmaId: data.turmaId,
          disciplinaId
        }
      }
    });

    if (vinculoExistente) {
      throw new Error('Esta turma já está vinculada a esta disciplina');
    }

    // Verificar conflito de horários do professor
    if (data.diaSemana && data.horarioInicio && data.horarioFim) {
      const conflito = await this.verificarConflitoHorario(
        data.professorId,
        data.diaSemana,
        data.horarioInicio,
        data.horarioFim
      );

      if (conflito) {
        throw new Error(
          `Conflito de horário: O professor já possui aula(s) no(a) ${this.getDiaSemanaLabel(data.diaSemana)} ` +
          `das ${data.horarioInicio} às ${data.horarioFim} na disciplina "${conflito.disciplina.nome}" ` +
          `com a turma "${conflito.turma.nome}"`
        );
      }
    }

    // Criar vínculo
    return prisma.turmaDisciplina.create({
      data: {
        turmaId: data.turmaId,
        disciplinaId,
        professorId: data.professorId,
        diaSemana: data.diaSemana,
        horarioInicio: data.horarioInicio,
        horarioFim: data.horarioFim
      },
      include: {
        turma: {
          select: {
            id: true,
            codigo: true,
            nome: true,
            serie: true,
            turno: true
          }
        },
        disciplina: {
          select: {
            id: true,
            codigo: true,
            nome: true
          }
        },
        professor: {
          select: {
            id: true,
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
  }

  async atualizarVinculoTurma(disciplinaId: string, vinculoId: string, data: {
    professorId?: string;
    diaSemana?: number;
    horarioInicio?: string;
    horarioFim?: string;
  }) {
    // Verificar se vínculo existe
    const vinculo = await prisma.turmaDisciplina.findUnique({
      where: { id: vinculoId }
    });

    if (!vinculo || vinculo.disciplinaId !== disciplinaId) {
      throw new Error('Vínculo não encontrado');
    }

    // Se está alterando professor, verificar se existe
    if (data.professorId) {
      const professor = await prisma.professor.findUnique({
        where: { id: data.professorId }
      });

      if (!professor) {
        throw new Error('Professor não encontrado');
      }
    }

    // Verificar conflito de horários se estiver alterando horário ou professor
    const professorId = data.professorId || vinculo.professorId;
    const diaSemana = data.diaSemana !== undefined ? data.diaSemana : vinculo.diaSemana;
    const horarioInicio = data.horarioInicio || vinculo.horarioInicio;
    const horarioFim = data.horarioFim || vinculo.horarioFim;

    if (diaSemana && horarioInicio && horarioFim) {
      const conflito = await this.verificarConflitoHorario(
        professorId,
        diaSemana,
        horarioInicio,
        horarioFim,
        vinculoId // Excluir o próprio vínculo da verificação
      );

      if (conflito) {
        throw new Error(
          `Conflito de horário: O professor já possui aula(s) no(a) ${this.getDiaSemanaLabel(diaSemana)} ` +
          `das ${horarioInicio} às ${horarioFim} na disciplina "${conflito.disciplina.nome}" ` +
          `com a turma "${conflito.turma.nome}"`
        );
      }
    }

    // Atualizar vínculo
    return prisma.turmaDisciplina.update({
      where: { id: vinculoId },
      data,
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
    });
  }

  async getTurmasVinculadas(disciplinaId: string) {
    // Verificar se disciplina existe
    const disciplina = await prisma.disciplina.findUnique({
      where: { id: disciplinaId }
    });

    if (!disciplina) {
      throw new Error('Disciplina não encontrada');
    }

    // Buscar turmas vinculadas
    return prisma.turmaDisciplina.findMany({
      where: { disciplinaId },
      select: {
        id: true,
        turmaId: true,
        professorId: true,
        diaSemana: true,
        horarioInicio: true,
        horarioFim: true,
        turma: {
          select: {
            id: true,
            codigo: true,
            nome: true,
            serie: {
              select: {
                codigo: true,
                nome: true,
                ordem: true
              }
            }
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
      },
      orderBy: {
        turma: {
          codigo: 'asc'
        }
      }
    });
  }

  async desvincularTurma(disciplinaId: string, turmaId: string) {
    // Verificar se vínculo existe
    const vinculo = await prisma.turmaDisciplina.findUnique({
      where: {
        turmaId_disciplinaId: {
          turmaId,
          disciplinaId
        }
      },
      include: {
        _count: {
          select: {
            aulas: true
          }
        }
      }
    });

    if (!vinculo) {
      throw new Error('Vínculo não encontrado');
    }

    // Verificar se há aulas cadastradas
    if (vinculo._count.aulas > 0) {
      throw new Error('Não é possível desvincular turma com aulas cadastradas');
    }

    // Remover vínculo
    await prisma.turmaDisciplina.delete({
      where: {
        turmaId_disciplinaId: {
          turmaId,
          disciplinaId
        }
      }
    });
  }

  async getTurmasDisponiveis(disciplinaId: string) {
    // Verificar se disciplina existe
    const disciplina = await prisma.disciplina.findUnique({
      where: { id: disciplinaId }
    });

    if (!disciplina) {
      throw new Error('Disciplina não encontrada');
    }

    // Buscar turmas já vinculadas
    const turmasVinculadas = await prisma.turmaDisciplina.findMany({
      where: { disciplinaId },
      select: { turmaId: true }
    });

    const turmaIds = turmasVinculadas.map(tv => tv.turmaId);

    // Buscar turmas ativas que não estão vinculadas
    return prisma.turma.findMany({
      where: {
        active: true,
        id: {
          notIn: turmaIds
        }
      },
      select: {
        id: true,
        codigo: true,
        nome: true,
        serie: {
          select: {
            codigo: true,
            nome: true,
            ordem: true
          }
        },
        turno: true,
        capacidadeMaxima: true,
        sala: true
      },
      orderBy: {
        codigo: 'asc'
      }
    });
  }

  // ==================== FUNÇÕES AUXILIARES ====================

  private async verificarConflitoHorario(
    professorId: string,
    diaSemana: number,
    horarioInicio: string,
    horarioFim: string,
    excluirVinculoId?: string
  ) {
    // Buscar todos os vínculos do professor no mesmo dia da semana
    const vinculos = await prisma.turmaDisciplina.findMany({
      where: {
        professorId,
        diaSemana,
        ...(excluirVinculoId && { id: { not: excluirVinculoId } })
      },
      include: {
        disciplina: {
          select: {
            nome: true
          }
        },
        turma: {
          select: {
            nome: true
          }
        }
      }
    });

    // Verificar se há conflito de horários
    for (const vinculo of vinculos) {
      if (!vinculo.horarioInicio || !vinculo.horarioFim) continue;

      const inicio1 = this.timeToMinutes(horarioInicio);
      const fim1 = this.timeToMinutes(horarioFim);
      const inicio2 = this.timeToMinutes(vinculo.horarioInicio);
      const fim2 = this.timeToMinutes(vinculo.horarioFim);

      // Verifica se há sobreposição de horários
      // Conflito ocorre se: (inicio1 < fim2) E (fim1 > inicio2)
      if (inicio1 < fim2 && fim1 > inicio2) {
        return vinculo;
      }
    }

    return null;
  }

  private timeToMinutes(time: string): number {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  }

  private getDiaSemanaLabel(dia: number): string {
    const dias = ['', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado', 'Domingo'];
    return dias[dia] || '';
  }
}

export default new DisciplinaService();

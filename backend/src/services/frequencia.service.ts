import { prisma } from '../config/database';
import { logger } from '../config/logger';

export interface LancarChamadaInput {
  aulaId: string;
  registros: {
    alunoId: string;
    status: 'P' | 'F' | 'J';
    observacao?: string;
  }[];
  registradoPor: string;
}

export interface FrequenciaAlunoFilters {
  alunoId: string;
  dataInicio?: Date;
  dataFim?: Date;
  turmaId?: string;
  disciplinaId?: string;
}

export interface FrequenciaTurmaFilters {
  turmaId: string;
  dataInicio?: Date;
  dataFim?: Date;
  disciplinaId?: string;
}

export class FrequenciaService {
  /**
   * Lança chamada para uma aula (cria/atualiza múltiplos registros)
   */
  async lancarChamada(data: LancarChamadaInput) {
    const { aulaId, registros, registradoPor } = data;

    // Verifica se a aula existe
    const aula = await prisma.aula.findUnique({
      where: { id: aulaId },
      include: {
        turma: {
          include: {
            matriculas: {
              where: { status: 'ATIVO' },
              select: { alunoId: true }
            }
          }
        }
      }
    });

    if (!aula) {
      throw new Error('Aula não encontrada');
    }

    if (aula.status === 'CANCELADA') {
      throw new Error('Não é possível lançar frequência em aula cancelada');
    }

    // Valida se todos os alunos pertencem à turma
    const alunosVinculados = aula.turma.matriculas.map(m => m.alunoId);
    const alunosInvalidos = registros.filter(r => !alunosVinculados.includes(r.alunoId));

    if (alunosInvalidos.length > 0) {
      throw new Error('Um ou mais alunos não pertencem a esta turma');
    }

    // Processa cada registro
    const frequenciasProcessadas = await Promise.all(
      registros.map(async (registro) => {
        // Verifica se já existe registro
        const existente = await prisma.registroFrequencia.findUnique({
          where: {
            aulaId_alunoId: {
              aulaId,
              alunoId: registro.alunoId
            }
          }
        });

        if (existente) {
          // Atualiza registro existente
          return prisma.registroFrequencia.update({
            where: { id: existente.id },
            data: {
              status: registro.status,
              observacao: registro.observacao,
              registradoPor,
              registradoEm: new Date()
            },
            include: {
              aluno: {
                select: {
                  id: true,
                  nome: true,
                  matricula: true
                }
              }
            }
          });
        } else {
          // Cria novo registro
          return prisma.registroFrequencia.create({
            data: {
              aulaId,
              alunoId: registro.alunoId,
              status: registro.status,
              observacao: registro.observacao,
              registradoPor,
              registradoEm: new Date()
            },
            include: {
              aluno: {
                select: {
                  id: true,
                  nome: true,
                  matricula: true
                }
              }
            }
          });
        }
      })
    );

    logger.info(`Chamada lançada para aula ${aulaId}: ${registros.length} registros`);
    
    return frequenciasProcessadas;
  }

  /**
   * Busca frequência de uma aula específica
   */
  async getFrequenciaAula(aulaId: string) {
    const aula = await prisma.aula.findUnique({
      where: { id: aulaId },
      include: {
        frequencias: {
          include: {
            aluno: {
              select: {
                id: true,
                nome: true,
                matricula: true,
                foto: true
              }
            },
            justificativa: {
              select: {
                id: true,
                motivo: true,
                aprovada: true
              }
            }
          },
          orderBy: {
            aluno: {
              nome: 'asc'
            }
          }
        },
        turma: {
          include: {
            matriculas: {
              where: { status: 'ATIVO' },
              include: {
                aluno: {
                  select: {
                    id: true,
                    nome: true,
                    matricula: true,
                    foto: true
                  }
                }
              }
            }
          }
        }
      }
    });

    if (!aula) {
      throw new Error('Aula não encontrada');
    }

    // Monta lista completa de alunos com suas presenças
    const frequenciaCompleta = aula.turma.matriculas.map(matricula => {
      const registroFrequencia = aula.frequencias.find(
        f => f.alunoId === matricula.aluno.id
      );

      return {
        aluno: matricula.aluno,
        status: registroFrequencia?.status || null,
        observacao: registroFrequencia?.observacao || null,
        justificativa: registroFrequencia?.justificativa || null,
        registradoEm: registroFrequencia?.registradoEm || null
      };
    });

    return {
      aula: {
        id: aula.id,
        data: aula.data,
        horaInicio: aula.horaInicio,
        horaFim: aula.horaFim,
        conteudo: aula.conteudo,
        status: aula.status
      },
      frequencias: frequenciaCompleta,
      estatisticas: {
        total: frequenciaCompleta.length,
        presentes: frequenciaCompleta.filter(f => f.status === 'P').length,
        faltas: frequenciaCompleta.filter(f => f.status === 'F').length,
        justificadas: frequenciaCompleta.filter(f => f.status === 'J').length,
        semRegistro: frequenciaCompleta.filter(f => !f.status).length
      }
    };
  }

  /**
   * Busca frequência de um aluno (consolidado)
   */
  async getFrequenciaAluno(filters: FrequenciaAlunoFilters) {
    const { alunoId, dataInicio, dataFim, turmaId, disciplinaId } = filters;

    // Verifica se aluno existe
    const aluno = await prisma.aluno.findUnique({
      where: { id: alunoId },
      select: {
        id: true,
        nome: true,
        matricula: true,
        foto: true
      }
    });

    if (!aluno) {
      throw new Error('Aluno não encontrado');
    }

    // Monta filtros para busca
    const where: any = {
      alunoId
    };

    if (dataInicio || dataFim) {
      where.aula = {
        data: {}
      };
      if (dataInicio) where.aula.data.gte = dataInicio;
      if (dataFim) where.aula.data.lte = dataFim;
    }

    if (turmaId) {
      where.aula = { ...where.aula, turmaId };
    }

    if (disciplinaId) {
      where.aula = {
        ...where.aula,
        turmaDisciplina: {
          disciplinaId
        }
      };
    }

    // Busca registros de frequência
    const registros = await prisma.registroFrequencia.findMany({
      where,
      include: {
        aula: {
          include: {
            turmaDisciplina: {
              include: {
                disciplina: {
                  select: {
                    nome: true,
                    codigo: true
                  }
                }
              }
            },
            turma: {
              select: {
                nome: true
              }
            }
          }
        },
        justificativa: {
          select: {
            id: true,
            motivo: true,
            aprovada: true
          }
        }
      },
      orderBy: {
        aula: {
          data: 'desc'
        }
      }
    });

    // Calcula estatísticas
    const total = registros.length;
    const presentes = registros.filter(r => r.status === 'P').length;
    const faltas = registros.filter(r => r.status === 'F').length;
    const justificadas = registros.filter(r => r.status === 'J').length;

    const percentualPresenca = total > 0 ? (presentes / total) * 100 : 0;
    const percentualFaltas = total > 0 ? (faltas / total) * 100 : 0;

    // Agrupa por disciplina
    const porDisciplina: Record<string, any> = {};
    registros.forEach(registro => {
      const disciplinaId = registro.aula.turmaDisciplina.disciplina.codigo;
      const disciplinaNome = registro.aula.turmaDisciplina.disciplina.nome;

      if (!porDisciplina[disciplinaId]) {
        porDisciplina[disciplinaId] = {
          disciplina: { codigo: disciplinaId, nome: disciplinaNome },
          total: 0,
          presentes: 0,
          faltas: 0,
          justificadas: 0
        };
      }

      porDisciplina[disciplinaId].total++;
      if (registro.status === 'P') porDisciplina[disciplinaId].presentes++;
      if (registro.status === 'F') porDisciplina[disciplinaId].faltas++;
      if (registro.status === 'J') porDisciplina[disciplinaId].justificadas++;
    });

    // Calcula percentuais por disciplina
    Object.values(porDisciplina).forEach((disc: any) => {
      disc.percentualPresenca = (disc.presentes / disc.total) * 100;
      disc.percentualFaltas = (disc.faltas / disc.total) * 100;
    });

    return {
      aluno,
      periodo: {
        dataInicio: dataInicio || registros[registros.length - 1]?.aula.data,
        dataFim: dataFim || registros[0]?.aula.data
      },
      estatisticas: {
        total,
        presentes,
        faltas,
        justificadas,
        percentualPresenca: Number(percentualPresenca.toFixed(2)),
        percentualFaltas: Number(percentualFaltas.toFixed(2)),
        alertaFrequenciaBaixa: percentualPresenca < 75
      },
      porDisciplina: Object.values(porDisciplina),
      registros: registros.map(r => ({
        id: r.id,
        data: r.aula.data,
        disciplina: r.aula.turmaDisciplina.disciplina.nome,
        turma: r.aula.turma.nome,
        status: r.status,
        observacao: r.observacao,
        justificativa: r.justificativa
      }))
    };
  }

  /**
   * Busca frequência consolidada de uma turma
   */
  async getFrequenciaTurma(filters: FrequenciaTurmaFilters) {
    const { turmaId, dataInicio, dataFim, disciplinaId } = filters;

    // Verifica se turma existe
    const turma = await prisma.turma.findUnique({
      where: { id: turmaId },
      include: {
        matriculas: {
          where: { status: 'ATIVO' },
          include: {
            aluno: {
              select: {
                id: true,
                nome: true,
                matricula: true
              }
            }
          }
        }
      }
    });

    if (!turma) {
      throw new Error('Turma não encontrada');
    }

    // Busca todas as aulas no período
    const whereAulas: any = {
      turmaId,
      status: { not: 'CANCELADA' }
    };

    if (dataInicio || dataFim) {
      whereAulas.data = {};
      if (dataInicio) whereAulas.data.gte = dataInicio;
      if (dataFim) whereAulas.data.lte = dataFim;
    }

    if (disciplinaId) {
      whereAulas.turmaDisciplina = { disciplinaId };
    }

    const aulas = await prisma.aula.findMany({
      where: whereAulas,
      include: {
        frequencias: {
          select: {
            alunoId: true,
            status: true
          }
        }
      }
    });

    const totalAulas = aulas.length;

    // Calcula frequência por aluno
    const frequenciaPorAluno = turma.matriculas.map(matricula => {
      const registros = aulas.flatMap(aula =>
        aula.frequencias.filter(f => f.alunoId === matricula.aluno.id)
      );

      const presentes = registros.filter(r => r.status === 'P').length;
      const faltas = registros.filter(r => r.status === 'F').length;
      const justificadas = registros.filter(r => r.status === 'J').length;
      const semRegistro = totalAulas - registros.length;

      const percentualPresenca = totalAulas > 0 ? (presentes / totalAulas) * 100 : 0;

      return {
        aluno: matricula.aluno,
        estatisticas: {
          totalAulas,
          presentes,
          faltas,
          justificadas,
          semRegistro,
          percentualPresenca: Number(percentualPresenca.toFixed(2)),
          alertaFrequenciaBaixa: percentualPresenca < 75
        }
      };
    });

    // Ordena por percentual de presença (menor primeiro para destacar problemas)
    frequenciaPorAluno.sort((a, b) =>
      a.estatisticas.percentualPresenca - b.estatisticas.percentualPresenca
    );

    // Estatísticas gerais da turma
    const mediaTurma = frequenciaPorAluno.reduce((acc, item) =>
      acc + item.estatisticas.percentualPresenca, 0
    ) / frequenciaPorAluno.length;

    const alunosComFrequenciaBaixa = frequenciaPorAluno.filter(
      item => item.estatisticas.percentualPresenca < 75
    ).length;

    return {
      turma: {
        id: turma.id,
        nome: turma.nome,
        serie: turma.serieId
      },
      periodo: {
        dataInicio,
        dataFim,
        totalAulas
      },
      estatisticasGerais: {
        totalAlunos: frequenciaPorAluno.length,
        mediaPresenca: Number(mediaTurma.toFixed(2)),
        alunosComFrequenciaBaixa
      },
      frequenciaAlunos: frequenciaPorAluno
    };
  }
}

export const frequenciaService = new FrequenciaService();

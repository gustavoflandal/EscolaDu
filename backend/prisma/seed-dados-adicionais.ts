import { PrismaClient } from '@prisma/client';
import { hashPassword } from '../src/utils/password.util';

const prisma = new PrismaClient();

/**
 * Script para popular o banco com mais dados de exemplo
 * Execute após o seed principal para ter um sistema mais completo
 */

async function main() {
  console.log('🌱 Iniciando seed de dados adicionais...\n');

  // Buscar dados existentes
  const anoLetivo2025 = await prisma.anoLetivo.findFirst({ where: { ano: 2025 } });
  const professores = await prisma.professor.findMany({ include: { user: true } });
  const turmas = await prisma.turma.findMany();
  const responsavelRole = await prisma.role.findFirst({ where: { name: 'Responsável' } });

  if (!anoLetivo2025 || !responsavelRole) {
    console.error('❌ Execute o seed principal primeiro (npm run prisma:seed)');
    return;
  }

  // ============================================
  // CRIAR MAIS RESPONSÁVEIS
  // ============================================
  console.log('👨‍👩‍👧‍👦 Criando mais responsáveis...');
  const responsaveis = [];
  const nomes = [
    { nome: 'Ana Paula Santos', email: 'ana.santos@email.com', cpf: '666.666.666-66', tipo: 'MAE' },
    { nome: 'Roberto Costa', email: 'roberto.costa@email.com', cpf: '777.777.777-77', tipo: 'PAI' },
    { nome: 'Juliana Ferreira', email: 'juliana.ferreira@email.com', cpf: '888.888.888-88', tipo: 'MAE' },
    { nome: 'Fernando Lima', email: 'fernando.lima@email.com', cpf: '999.999.999-99', tipo: 'PAI' },
    { nome: 'Patricia Alves', email: 'patricia.alves@email.com', cpf: '101.101.101-10', tipo: 'MAE' },
  ];

  const respPassword = await hashPassword('Resp@123');

  for (const info of nomes) {
    const user = await prisma.user.create({
      data: {
        email: info.email,
        password: respPassword,
        name: info.nome,
        cpf: info.cpf,
        phone: '(11) 99999-9999',
        active: true,
      },
    });

    const responsavel = await prisma.responsavel.create({
      data: {
        userId: user.id,
        cpf: info.cpf,
        rg: info.cpf.replace(/\D/g, '').substring(0, 9),
        tipoVinculo: info.tipo,
        telefonePrincipal: '(11) 99999-9999',
        email: info.email,
        profissao: ['Engenheiro', 'Advogada', 'Professor', 'Médico', 'Empresária'][Math.floor(Math.random() * 5)],
        endereco: 'Rua Exemplo, 100',
      },
    });

    await prisma.userRole.create({
      data: {
        userId: user.id,
        roleId: responsavelRole.id,
      },
    });

    responsaveis.push(responsavel);
  }

  console.log(`✅ ${nomes.length} responsáveis adicionais criados\n`);

  // ============================================
  // CRIAR MAIS ALUNOS
  // ============================================
  console.log('👶 Criando mais alunos...');
  const alunosNomes = [
    { nome: 'João Pedro Silva', nascimento: '2018-05-20', genero: 'M' },
    { nome: 'Maria Eduarda Costa', nascimento: '2018-07-15', genero: 'F' },
    { nome: 'Lucas Gabriel Oliveira', nascimento: '2018-02-10', genero: 'M' },
    { nome: 'Ana Clara Santos', nascimento: '2018-09-25', genero: 'F' },
    { nome: 'Pedro Henrique Lima', nascimento: '2018-11-30', genero: 'M' },
    { nome: 'Isabela Cristina Alves', nascimento: '2018-04-18', genero: 'F' },
    { nome: 'Gabriel Ferreira', nascimento: '2018-08-22', genero: 'M' },
    { nome: 'Beatriz Souza', nascimento: '2018-06-12', genero: 'F' },
    { nome: 'Rafael Mendes', nascimento: '2018-03-08', genero: 'M' },
    { nome: 'Larissa Rodrigues', nascimento: '2018-10-05', genero: 'F' },
    { nome: 'Felipe Costa', nascimento: '2017-05-14', genero: 'M' },
    { nome: 'Camila Barbosa', nascimento: '2017-07-20', genero: 'F' },
    { nome: 'Thiago Martins', nascimento: '2017-02-28', genero: 'M' },
    { nome: 'Julia Santos', nascimento: '2017-09-10', genero: 'F' },
    { nome: 'Vinicius Pereira', nascimento: '2017-11-18', genero: 'M' },
  ];

  let matriculaNum = 2;
  const todosAlunos = [];

  for (const info of alunosNomes) {
    const aluno = await prisma.aluno.create({
      data: {
        nome: info.nome,
        dataNascimento: new Date(info.nascimento),
        matricula: `ALU2025${String(matriculaNum).padStart(3, '0')}`,
        genero: info.genero,
        telefone: '(11) 99999-9999',
        endereco: 'Rua Exemplo, 100',
        status: 'ATIVO',
      },
    });

    // Vincular a um responsável aleatório
    const respIndex = Math.floor(Math.random() * responsaveis.length);
    await prisma.vinculoResponsabilidade.create({
      data: {
        alunoId: aluno.id,
        responsavelId: responsaveis[respIndex].id,
        prioridadeContato: 1,
      },
    });

    // Matricular em uma turma (distribuir entre as turmas)
    const turmaIndex = matriculaNum % turmas.length;
    await prisma.matricula.create({
      data: {
        alunoId: aluno.id,
        turmaId: turmas[turmaIndex].id,
        dataMatricula: new Date('2025-02-01'),
        status: 'ATIVO',
      },
    });

    todosAlunos.push(aluno);
    matriculaNum++;
  }

  console.log(`✅ ${alunosNomes.length} alunos adicionais criados e matriculados\n`);

  // ============================================
  // CRIAR MAIS TURMAS
  // ============================================
  console.log('🏫 Criando mais turmas...');
  const novasTurmas = [
    { codigo: '3A-2025', nome: '3º Ano A', serie: '3º Ano', turno: 'MANHA' as const, capacidadeMaxima: 30, sala: 'Sala 301' },
    { codigo: '3B-2025', nome: '3º Ano B', serie: '3º Ano', turno: 'TARDE' as const, capacidadeMaxima: 30, sala: 'Sala 302' },
    { codigo: '4A-2025', nome: '4º Ano A', serie: '4º Ano', turno: 'MANHA' as const, capacidadeMaxima: 30, sala: 'Sala 401' },
    { codigo: '4B-2025', nome: '4º Ano B', serie: '4º Ano', turno: 'TARDE' as const, capacidadeMaxima: 30, sala: 'Sala 402' },
    { codigo: '5A-2025', nome: '5º Ano A', serie: '5º Ano', turno: 'MANHA' as const, capacidadeMaxima: 30, sala: 'Sala 501' },
    { codigo: '5B-2025', nome: '5º Ano B', serie: '5º Ano', turno: 'TARDE' as const, capacidadeMaxima: 30, sala: 'Sala 502' },
  ];

  const turmasCriadas = [];
  for (const turma of novasTurmas) {
    const professorIndex = turmasCriadas.length % professores.length;
    const t = await prisma.turma.create({
      data: {
        ...turma,
        anoLetivoId: anoLetivo2025.id,
        professorRegenteId: professores[professorIndex].id,
      },
    });
    turmasCriadas.push(t);
  }

  console.log(`✅ ${turmasCriadas.length} turmas adicionais criadas\n`);

  // ============================================
  // CRIAR MAIS OBJETIVOS BNCC
  // ============================================
  console.log('🎯 Criando mais objetivos BNCC...');
  const disciplinas = await prisma.disciplina.findMany();
  const portugues = disciplinas.find(d => d.codigo === 'PORT')!;
  const matematica = disciplinas.find(d => d.codigo === 'MAT')!;
  const ciencias = disciplinas.find(d => d.codigo === 'CIEN')!;

  const maisObjetivos = [
    // Português
    { codigoBNCC: 'EF02LP01', descricao: 'Utilizar, ao produzir o texto, grafia correta de palavras conhecidas ou com estruturas silábicas já dominadas.', serie: '2º Ano', periodo: '1º Bimestre', disciplinaId: portugues.id },
    { codigoBNCC: 'EF02LP02', descricao: 'Segmentar palavras em sílabas e remover e substituir sílabas iniciais, mediais ou finais para criar novas palavras.', serie: '2º Ano', periodo: '1º Bimestre', disciplinaId: portugues.id },
    { codigoBNCC: 'EF03LP01', descricao: 'Ler e escrever palavras com correspondências regulares contextuais entre grafemas e fonemas.', serie: '3º Ano', periodo: '1º Semestre', disciplinaId: portugues.id },
    
    // Matemática
    { codigoBNCC: 'EF02MA01', descricao: 'Comparar e ordenar números naturais (até a ordem de centenas) pela compreensão de características do sistema de numeração decimal.', serie: '2º Ano', periodo: '1º Bimestre', disciplinaId: matematica.id },
    { codigoBNCC: 'EF02MA05', descricao: 'Construir fatos básicos da adição e subtração e utilizá-los no cálculo mental ou escrito.', serie: '2º Ano', periodo: '2º Bimestre', disciplinaId: matematica.id },
    { codigoBNCC: 'EF03MA01', descricao: 'Ler, escrever e comparar números naturais de até a ordem de unidade de milhar, estabelecendo relações entre os registros numéricos e em língua materna.', serie: '3º Ano', periodo: '1º Semestre', disciplinaId: matematica.id },
    
    // Ciências
    { codigoBNCC: 'EF02CI01', descricao: 'Identificar de que materiais (metais, madeira, vidro etc.) são feitos os objetos que fazem parte da vida cotidiana.', serie: '2º Ano', periodo: '1º Bimestre', disciplinaId: ciencias.id },
    { codigoBNCC: 'EF02CI04', descricao: 'Descrever características de plantas e animais (tamanho, forma, cor, fase da vida, local onde se desenvolvem etc.).', serie: '2º Ano', periodo: '2º Bimestre', disciplinaId: ciencias.id },
    { codigoBNCC: 'EF03CI01', descricao: 'Produzir diferentes sons a partir da vibração de variados objetos e identificar variáveis que influem nesse fenômeno.', serie: '3º Ano', periodo: '1º Semestre', disciplinaId: ciencias.id },
  ];

  for (const obj of maisObjetivos) {
    await prisma.objetivoAprendizagem.create({
      data: obj,
    });
  }

  console.log(`✅ ${maisObjetivos.length} objetivos BNCC adicionais criados\n`);

  // ============================================
  // RESUMO
  // ============================================
  console.log('✅ Seed de dados adicionais concluído!\n');
  console.log('=' .repeat(60));
  console.log('📊 RESUMO ADICIONAL');
  console.log('=' .repeat(60));
  console.log(`✅ +${nomes.length} responsáveis`);
  console.log(`✅ +${alunosNomes.length} alunos`);
  console.log(`✅ +${turmasCriadas.length} turmas`);
  console.log(`✅ +${maisObjetivos.length} objetivos BNCC`);
  console.log('=' .repeat(60));
  console.log('\n🎉 Sistema agora tem dados mais completos para testes!\n');
}

main()
  .catch((e) => {
    console.error('❌ Erro no seed adicional:', e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

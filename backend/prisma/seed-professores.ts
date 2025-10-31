import { PrismaClient } from '@prisma/client';
import { hashSync } from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed de professores...');

  // Buscar ou criar perfil de Professor
  let perfilProfessor = await prisma.role.findFirst({
    where: { name: 'Professor' }
  });

  if (!perfilProfessor) {
    perfilProfessor = await prisma.role.create({
      data: {
        name: 'Professor',
        description: 'Professor do sistema',
        active: true
      }
    });
  }

  const professores = [
    { name: 'Prof. Carlos Silva', email: 'carlos.silva@escola.com', cpf: '11122233344', phone: '11987654321', registroProfissional: 'RP001', cargaHoraria: 40 },
    { name: 'Prof. Ana Santos', email: 'ana.santos@escola.com', cpf: '22233344455', phone: '11987654322', registroProfissional: 'RP002', cargaHoraria: 30 },
    { name: 'Prof. João Oliveira', email: 'joao.oliveira@escola.com', cpf: '33344455566', phone: '11987654323', registroProfissional: 'RP003', cargaHoraria: 40 },
    { name: 'Prof. Maria Costa', email: 'maria.costa@escola.com', cpf: '44455566677', phone: '11987654324', registroProfissional: 'RP004', cargaHoraria: 20 },
    { name: 'Prof. Pedro Alves', email: 'pedro.alves@escola.com', cpf: '55566677788', phone: '11987654325', registroProfissional: 'RP005', cargaHoraria: 40 },
    { name: 'Prof. Julia Martins', email: 'julia.martins@escola.com', cpf: '66677788899', phone: '11987654326', registroProfissional: 'RP006', cargaHoraria: 30 },
    { name: 'Prof. Lucas Rodrigues', email: 'lucas.rodrigues@escola.com', cpf: '77788899900', phone: '11987654327', registroProfissional: 'RP007', cargaHoraria: 40 },
    { name: 'Prof. Fernanda Lima', email: 'fernanda.lima@escola.com', cpf: '88899900011', phone: '11987654328', registroProfissional: 'RP008', cargaHoraria: 20 },
    { name: 'Prof. Ricardo Souza', email: 'ricardo.souza@escola.com', cpf: '99900011122', phone: '11987654329', registroProfissional: 'RP009', cargaHoraria: 40 },
    { name: 'Prof. Beatriz Ferreira', email: 'beatriz.ferreira@escola.com', cpf: '00011122233', phone: '11987654330', registroProfissional: 'RP010', cargaHoraria: 30 },
    { name: 'Prof. Gabriel Mendes', email: 'gabriel.mendes@escola.com', cpf: '11122233355', phone: '11987654331', registroProfissional: 'RP011', cargaHoraria: 40 },
    { name: 'Prof. Camila Barros', email: 'camila.barros@escola.com', cpf: '22233344466', phone: '11987654332', registroProfissional: 'RP012', cargaHoraria: 20 },
    { name: 'Prof. Felipe Gomes', email: 'felipe.gomes@escola.com', cpf: '33344455577', phone: '11987654333', registroProfissional: 'RP013', cargaHoraria: 40 },
    { name: 'Prof. Larissa Cardoso', email: 'larissa.cardoso@escola.com', cpf: '44455566688', phone: '11987654334', registroProfissional: 'RP014', cargaHoraria: 30 },
    { name: 'Prof. Thiago Ribeiro', email: 'thiago.ribeiro@escola.com', cpf: '55566677799', phone: '11987654335', registroProfissional: 'RP015', cargaHoraria: 40 },
  ];

  let count = 0;
  const senhaHash = hashSync('Prof@2024', 10);

  for (const prof of professores) {
    try {
      // Verificar se o usuário já existe
      const userExiste = await prisma.user.findFirst({
        where: {
          OR: [
            { email: prof.email },
            { cpf: prof.cpf }
          ]
        }
      });

      if (userExiste) {
        console.log(`⚠️  Professor ${prof.name} já existe`);
        continue;
      }

      // Criar usuário
      const user = await prisma.user.create({
        data: {
          name: prof.name,
          email: prof.email,
          password: senhaHash,
          cpf: prof.cpf,
          phone: prof.phone,
          active: true
        }
      });

      // Vincular perfil
      await prisma.userRole.create({
        data: {
          userId: user.id,
          roleId: perfilProfessor.id
        }
      });

      // Criar perfil de professor
      await prisma.professor.create({
        data: {
          userId: user.id,
          registroProfissional: prof.registroProfissional,
          cargaHoraria: prof.cargaHoraria,
          active: true
        }
      });

      count++;
      console.log(`✅ Professor ${prof.name} criado com sucesso`);
    } catch (error) {
      console.error(`❌ Erro ao criar professor ${prof.name}:`, error);
    }
  }

  console.log(`\n✅ Seed de professores concluído!`);
  console.log(`📊 Total de professores criados: ${count}`);
  console.log(`\n📋 Credenciais de acesso para todos os professores:`);
  console.log(`   Senha: Prof@2024`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

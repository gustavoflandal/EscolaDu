import { PrismaClient } from '@prisma/client';
import { hashSync } from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed de usuário admin...');

  // Verificar se o usuário admin já existe
  const adminExiste = await prisma.user.findUnique({
    where: { email: 'admin@sge.com' }
  });

  if (adminExiste) {
    console.log('⚠️  Usuário admin já existe');
    return;
  }

  // Buscar ou criar perfil de Administrador
  let perfilAdmin = await prisma.role.findFirst({
    where: { name: 'Administrador' }
  });

  if (!perfilAdmin) {
    perfilAdmin = await prisma.role.create({
      data: {
        name: 'Administrador',
        description: 'Administrador do sistema',
        active: true
      }
    });
    console.log('✅ Perfil Administrador criado');
  }

  // Criar usuário admin
  const senhaHash = hashSync('Admin@2024', 10);
  
  const admin = await prisma.user.create({
    data: {
      name: 'Administrador',
      email: 'admin@sge.com',
      password: senhaHash,
      cpf: '00000000000',
      phone: '11999999999',
      active: true
    }
  });

  // Vincular perfil
  await prisma.userRole.create({
    data: {
      userId: admin.id,
      roleId: perfilAdmin.id
    }
  });

  console.log('✅ Usuário admin criado com sucesso!');
  console.log('\n📋 Credenciais de acesso:');
  console.log('   Email: admin@sge.com');
  console.log('   Senha: Admin@2024');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

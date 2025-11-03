/**
 * SEED MASTER
 * Executa todos os seeds na ordem correta
 * Executa: npx ts-node prisma/seed-master.ts
 */

import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

interface SeedConfig {
  name: string;
  file: string;
  description: string;
}

const seeds: SeedConfig[] = [
  {
    name: '0. Limpeza',
    file: 'seed-clean.ts',
    description: 'Limpar banco de dados'
  },
  {
    name: '1. Permissões',
    file: 'seed-1-permissions.ts',
    description: 'Criar permissões, roles e admin'
  },
  {
    name: '2. Cadastros Básicos',
    file: 'seed-2-cadastros-basicos.ts',
    description: 'Criar ano letivo, períodos, séries, salas e feriados'
  },
  {
    name: '3. Disciplinas',
    file: 'seed-3-disciplinas.ts',
    description: 'Criar disciplinas'
  },
  {
    name: '4. Professores',
    file: 'seed-4-professores.ts',
    description: 'Criar professores com formações'
  },
  {
    name: '5. Turmas',
    file: 'seed-5-turmas.ts',
    description: 'Criar turmas e vínculos com disciplinas'
  },
  {
    name: '6. Alunos',
    file: 'seed-6-alunos.ts',
    description: 'Criar alunos, matrículas e responsáveis'
  },
  {
    name: '7. Programas de Ensino',
    file: 'seed-7-programas.ts',
    description: 'Criar programas, objetivos e avaliações'
  }
];

async function runSeed(seedFile: string): Promise<void> {
  const { stdout, stderr } = await execAsync(`npx ts-node prisma/${seedFile}`);
  if (stdout) console.log(stdout);
  if (stderr) console.error(stderr);
}

async function main() {
  console.log('🚀 SEED MASTER - Executando todos os seeds\n');
  console.log('═'.repeat(60));
  console.log('\n');

  const startTime = Date.now();
  let successCount = 0;

  for (const seed of seeds) {
    console.log(`\n${'='.repeat(60)}`);
    console.log(`📦 ${seed.name}: ${seed.description}`);
    console.log(`${'='.repeat(60)}\n`);

    try {
      await runSeed(seed.file);
      successCount++;
      console.log(`\n✅ ${seed.name} concluído!\n`);
    } catch (error) {
      console.error(`\n❌ Erro no ${seed.name}:`, error);
      console.log('\n⚠️  Processo interrompido devido a erro.\n');
      process.exit(1);
    }
  }

  const endTime = Date.now();
  const duration = ((endTime - startTime) / 1000).toFixed(2);

  console.log('\n' + '═'.repeat(60));
  console.log('🎉 SEED MASTER CONCLUÍDO COM SUCESSO!');
  console.log('═'.repeat(60));
  console.log(`\n✅ ${successCount}/${seeds.length} seeds executados`);
  console.log(`⏱️  Tempo total: ${duration}s\n`);

  console.log('📊 Resumo do que foi criado:');
  console.log('   • Permissões e Roles (Admin, Coordenador, Professor, Responsável)');
  console.log('   • Usuário Admin (admin@sge.com / Admin@2024)');
  console.log('   • Ano Letivo 2025 com 4 Períodos (Bimestres)');
  console.log('   • 5 Séries (1º ao 5º Ano)');
  console.log('   • 9 Salas (6 regulares + 3 especiais)');
  console.log('   • 12 Feriados nacionais');
  console.log('   • 8 Disciplinas do Ensino Fundamental I');
  console.log('   • 8 Professores com formações');
  console.log('   • 10 Turmas (2 por série - Manhã e Tarde)');
  console.log('   • ~220 Alunos matriculados');
  console.log('   • ~110 Responsáveis');
  console.log('   • 16 Programas de Ensino (disciplinas × séries)');
  console.log('   • ~80 Objetivos de Aprendizagem BNCC');
  console.log('   • Avaliações de objetivos para alunos\n');

  console.log('🎓 Sistema pronto para uso!\n');
  console.log('📝 Credenciais de acesso:');
  console.log('   Admin:        admin@sge.com / Admin@2024');
  console.log('   Professores:  [email] / Prof@2024');
  console.log('   Responsáveis: [email] / Resp@2024\n');
}

main()
  .catch((error) => {
    console.error('❌ Erro fatal:', error);
    process.exit(1);
  });

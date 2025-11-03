# Script para executar todos os seeds sequencialmente
Write-Host "🚀 Executando Seeds..." -ForegroundColor Cyan
Write-Host ""

$seeds = @(
    "seed-clean.ts",
    "seed-1-permissions.ts",
    "seed-2-cadastros-basicos.ts",
    "seed-3-disciplinas.ts",
    "seed-4-professores.ts",
    "seed-5-turmas.ts",
    "seed-6-alunos.ts",
    "seed-7-programas.ts",
    "seed-10-frequencia.ts"
)

foreach ($seed in $seeds) {
    Write-Host "📦 Executando $seed..." -ForegroundColor Yellow
    npx ts-node "prisma/$seed"
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Erro ao executar $seed" -ForegroundColor Red
        exit 1
    }
    Write-Host ""
}

Write-Host "✅ Todos os seeds executados com sucesso!" -ForegroundColor Green

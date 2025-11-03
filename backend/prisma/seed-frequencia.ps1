# Script para executar apenas o seed de frequência
# Uso: .\prisma\seed-frequencia.ps1

Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host "📅  SEED 10: Aulas e Frequência" -ForegroundColor Cyan
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host ""

# Executar o seed
npx ts-node prisma/seed-10-frequencia.ts

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "✅ Seed de frequência concluído com sucesso!" -ForegroundColor Green
} else {
    Write-Host ""
    Write-Host "❌ Erro ao executar seed de frequência" -ForegroundColor Red
    exit 1
}

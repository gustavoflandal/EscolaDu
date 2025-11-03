# Script para executar apenas o seed de frequência
Write-Host "🚀 Executando Seed de Frequência..." -ForegroundColor Cyan
Write-Host ""

Write-Host "📦 Criando aulas, registros de frequência e justificativas..." -ForegroundColor Yellow
npx ts-node prisma/seed-11-frequencia.ts

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Erro ao executar seed de frequência" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "✅ Seed de frequência executado com sucesso!" -ForegroundColor Green
Write-Host ""
Write-Host "📊 Dados criados:" -ForegroundColor Cyan
Write-Host "   • Aulas dos últimos 30 dias" -ForegroundColor White
Write-Host "   • Aulas planejadas para os próximos 7 dias" -ForegroundColor White
Write-Host "   • Registros de frequência (P, F, J)" -ForegroundColor White
Write-Host "   • Justificativas de falta (aprovadas e pendentes)" -ForegroundColor White
Write-Host ""

$body = @{
    email = "admin@sge.com"
    senha = "Admin@2024"
} | ConvertTo-Json

Write-Host "Testando login..." -ForegroundColor Cyan
Write-Host "Body: $body" -ForegroundColor Yellow

try {
    $response = Invoke-RestMethod -Uri "http://localhost:3001/api/v1/auth/login" -Method Post -Body $body -ContentType "application/json"
    Write-Host "`nLogin bem-sucedido!" -ForegroundColor Green
    Write-Host "Token: $($response.data.accessToken.Substring(0, 50))..." -ForegroundColor Green
    Write-Host "Usuário: $($response.data.user.name)" -ForegroundColor Green
} catch {
    Write-Host "`nErro no login:" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
}

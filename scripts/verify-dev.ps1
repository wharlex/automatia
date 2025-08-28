# Verificación rápida para desarrollo local en Windows
# Uso: .\scripts\verify-dev.ps1

param(
    [string]$BaseUrl = "http://localhost:3004"
)

Write-Host "🔍 Verificando $BaseUrl..." -ForegroundColor Cyan
Write-Host ""

$passed = 0
$total = 0

function Test-Endpoint {
    param(
        [string]$Path,
        [int]$ExpectedStatus = 200
    )
    
    $global:total++
    try {
        $response = Invoke-WebRequest -Uri "$BaseUrl$Path" -Method GET -UseBasicParsing
        if ($response.StatusCode -eq $ExpectedStatus) {
            Write-Host "✓ $Path" -ForegroundColor Green
            $global:passed++
            return $true
        } else {
            Write-Host "❌ $Path → $($response.StatusCode) (esperado $ExpectedStatus)" -ForegroundColor Red
            return $false
        }
    } catch {
        Write-Host "❌ $Path`: $($_.Exception.Message)" -ForegroundColor Red
        return $false
    }
}

function Test-ChatbotTest {
    $global:total++
    try {
        $body = @{ text = "hola" } | ConvertTo-Json
        $response = Invoke-WebRequest -Uri "$BaseUrl/api/chatbot/test" -Method POST -Body $body -ContentType "application/json" -UseBasicParsing
        
        if ($response.StatusCode -eq 200) {
            $data = $response.Content | ConvertFrom-Json
            if ($data.reply -and $data.reply.GetType().Name -eq "String") {
                Write-Host "✓ /api/chatbot/test" -ForegroundColor Green
                $global:passed++
                return $true
            } else {
                Write-Host "❌ /api/chatbot/test: no devuelve reply string" -ForegroundColor Red
                return $false
            }
        } else {
            Write-Host "❌ /api/chatbot/test: $($response.StatusCode)" -ForegroundColor Red
            return $false
        }
    } catch {
        Write-Host "❌ /api/chatbot/test: $($_.Exception.Message)" -ForegroundColor Red
        return $false
    }
}

# Ejecutar verificaciones
Test-Endpoint "/api/healthz"
Test-Endpoint "/api/readyz"
Test-Endpoint "/api/status"
Test-ChatbotTest

Write-Host ""
Write-Host "📊 Resultado: $passed/$total checks pasaron" -ForegroundColor Yellow

if ($passed -eq $total) {
    Write-Host "✅ Todos los checks pasaron - Sistema funcionando correctamente" -ForegroundColor Green
    exit 0
} else {
    Write-Host "❌ Algunos checks fallaron - Revisar logs arriba" -ForegroundColor Red
    exit 1
}

# Script de configuración para Render CLI
Write-Host "🚀 Configurando Render CLI..." -ForegroundColor Cyan

# 1. Verificar si render-cli está instalado
$renderCli = Get-Command render -ErrorAction SilentlyContinue

if (-not $renderCli) {
    Write-Host "🔍 Instalando Render CLI..." -ForegroundColor Yellow
    npm install -g render-cli
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Error al instalar Render CLI" -ForegroundColor Red
        exit 1
    }
}

# 2. Iniciar sesión en Render
Write-Host "🔑 Iniciando sesión en Render..." -ForegroundColor Yellow
Write-Host "📢 Se abrirá una ventana del navegador para autenticarte" -ForegroundColor Yellow

# Iniciar el proceso de login
$process = Start-Process -FilePath "render" -ArgumentList "login" -NoNewWindow -PassThru

# Esperar a que el usuario complete el inicio de sesión
Write-Host "🔄 Esperando a que completes el inicio de sesión en el navegador..." -ForegroundColor Yellow
Write-Host "   - Usuario: jorgebestel@gmail.com" -ForegroundColor Yellow
Write-Host "   - Contraseña: ********" -ForegroundColor Yellow

# Verificar la autenticación
Start-Sleep -Seconds 10
$user = render whoami 2>&1

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Autenticación exitosa como: $user" -ForegroundColor Green
    
    # Mostrar información de la cuenta
    Write-Host "\n🔍 Verificando cuenta de Render..." -ForegroundColor Cyan
    render services list
    
    Write-Host "\n🎉 Configuración completada con éxito!" -ForegroundColor Green
    Write-Host "Puedes desplegar tu aplicación con: render deploy" -ForegroundColor Cyan
} else {
    Write-Host "❌ No se pudo completar la autenticación automática" -ForegroundColor Red
    Write-Host "Por favor, inicia sesión manualmente ejecutando: render login" -ForegroundColor Yellow
}

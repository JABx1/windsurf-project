# Script de despliegue automático para ABITARE
# ===========================================

# Configuración
$config = Get-Content -Path ".\deploy-config.json" -Raw | ConvertFrom-Json

# Función para mostrar mensajes con formato
function Show-Header {
    param([string]$Title)
    Write-Host "`n"
    Write-Host "=======================================" -ForegroundColor Cyan
    Write-Host "  $Title" -ForegroundColor Cyan
    Write-Host "=======================================" -ForegroundColor Cyan
    Write-Host "`n"
}

# 1. Verificar dependencias
Show-Header "VERIFICANDO DEPENDENCIAS"
$dependencies = @("git", "node", "npm")
foreach ($dep in $dependencies) {
    try {
        $version = & $dep --version 2>&1
        Write-Host "✅ $dep $($version[0])" -ForegroundColor Green
    } catch {
        Write-Host "❌ $dep no está instalado" -ForegroundColor Red
        exit 1
    }
}

# 2. Inicializar repositorio Git si no existe
if (-not (Test-Path ".git")) {
    Show-Header "INICIALIZANDO REPOSITORIO GIT"
    git init
    git add .
    git commit -m "Initial commit"
    git branch -M main
    
    $repoUrl = Read-Host "Ingresa la URL de tu repositorio de GitHub (ej: https://github.com/tu-usuario/tu-repositorio.git)"
    if ($repoUrl) {
        git remote add origin $repoUrl
        git push -u origin main
    } else {
        Write-Host "⚠️  No se proporcionó URL de GitHub. Continuando sin configuración de remoto." -ForegroundColor Yellow
    }
}

# 3. Configuración de Render (Backend)
Show-Header "CONFIGURANDO RENDER (BACKEND)"
Write-Host "Por favor, sigue estos pasos para configurar el backend:" -ForegroundColor Yellow
Write-Host "1. Ve a https://dashboard.render.com/" -ForegroundColor Cyan
Write-Host "2. Haz clic en 'New' > 'Web Service'" -ForegroundColor Cyan
Write-Host "3. Conecta tu repositorio de GitHub" -ForegroundColor Cyan
Write-Host "4. Configura el servicio con los siguientes parámetros:" -ForegroundColor Cyan
Write-Host "   - Name: $($config.render.serviceName)" -ForegroundColor Cyan
Write-Host "   - Region: $($config.render.region)" -ForegroundColor Cyan
Write-Host "   - Branch: $($config.github.branch)" -ForegroundColor Cyan
Write-Host "   - Build Command: cd backend && npm install" -ForegroundColor Cyan
Write-Host "   - Start Command: node server.js" -ForegroundColor Cyan
Write-Host "5. Añade las siguientes variables de entorno:" -ForegroundColor Cyan
$config.render.env.PSObject.Properties | ForEach-Object {
    Write-Host "   - $($_.Name) = $($_.Value)" -ForegroundColor Cyan
}

# 4. Configuración de Vercel (Frontend)
Show-Header "CONFIGURANDO VERCEL (FRONTEND)"
Write-Host "Por favor, sigue estos pasos para configurar el frontend:" -ForegroundColor Yellow
Write-Host "1. Ve a https://vercel.com/new" -ForegroundColor Cyan
Write-Host "2. Conecta tu repositorio de GitHub" -ForegroundColor Cyan
Write-Host "3. Configura el proyecto con los siguientes parámetros:" -ForegroundColor Cyan
Write-Host "   - Framework: $($config.vercel.framework)" -ForegroundColor Cyan
Write-Host "   - Root Directory: frontend" -ForegroundColor Cyan
Write-Host "   - Build Command: $($config.vercel.buildCommand)" -ForegroundColor Cyan
Write-Host "   - Output Directory: $($config.vercel.outputDirectory)" -ForegroundColor Cyan
Write-Host "4. Añade las siguientes variables de entorno:" -ForegroundColor Cyan
Write-Host "   - VITE_API_URL = https://$($config.render.serviceName).onrender.com/api" -ForegroundColor Cyan

# 5. Despliegue manual
Show-Header "DESPLIEGUE MANUAL"
Write-Host "Para completar el despliegue:" -ForegroundColor Yellow
Write-Host "1. Asegúrate de que tu código está en GitHub" -ForegroundColor Cyan
Write-Host "2. Configura los servicios en Render y Vercel como se indicó" -ForegroundColor Cyan
Write-Host "3. Los despliegues se realizarán automáticamente con cada push" -ForegroundColor Cyan

# 6. Comandos útiles
Show-Header "COMANDOS ÚTILES"
Write-Host "Para hacer push de cambios:" -ForegroundColor Yellow
Write-Host "  git add ." -ForegroundColor Green
Write-Host "  git commit -m 'Mensaje descriptivo'" -ForegroundColor Green
Write-Host "  git push" -ForegroundColor Green

Write-Host "`n¡Listo! Tu aplicación estará disponible en las URLs que te proporcionen Render y Vercel." -ForegroundColor Green

# 7. Abrir paneles de control
$openDashboards = Read-Host "¿Quieres abrir los paneles de control de Render y Vercel? (s/n)"
if ($openDashboards -eq 's') {
    Start-Process "https://dashboard.render.com/"
    Start-Process "https://vercel.com/dashboard"
}

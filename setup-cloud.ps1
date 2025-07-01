# Script de configuración en la nube para ABITARE
# ===========================================

# Configuración
$config = @{
    github = @{
        repo = ""
        branch = "main"
    }
    render = @{
        serviceName = "abitare-backend"
        region = "oregon"
        env = @{
            NODE_ENV = "production"
            MONGODB_URI = "mongodb+srv://Zkyhewbf:64740429-f602-4388-bcba-30706fe842b8@cluster0.00zixai.mongodb.net/abitare?retryWrites=true&w=majority"
            JWT_SECRET = [System.Guid]::NewGuid().ToString()
            JWT_EXPIRE = "30d"
            PORT = "10000"
        }
    }
    vercel = @{
        projectName = "abitare-frontend"
        framework = "vite"
        buildCommand = "npm run build"
        outputDirectory = "dist"
    }
}

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
$allDependenciesOk = $true

foreach ($dep in $dependencies) {
    $command = if ($dep -eq "npm") { "npm --version" } else { "$dep --version" }
    try {
        $version = Invoke-Expression $command 2>&1
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✅ $dep $($version[0])" -ForegroundColor Green
        } else {
            throw "Error"
        }
    } catch {
        Write-Host "❌ $dep no está instalado o no está en el PATH" -ForegroundColor Red
        $allDependenciesOk = $false
    }
}

if (-not $allDependenciesOk) {
    Write-Host "`n⚠️  Instala las dependencias faltantes y vuelve a intentarlo." -ForegroundColor Red
    exit 1
}

# 2. Configurar Git
Show-Header "CONFIGURANDO GIT"
$gitUser = git config --global user.name
$gitEmail = git config --global user.email

if (-not $gitUser) {
    $gitUser = Read-Host "Ingresa tu nombre para Git"
    git config --global user.name $gitUser
}

if (-not $gitEmail) {
    $gitEmail = Read-Host "Ingresa tu correo para Git"
    git config --global user.email $gitEmail
}

Write-Host "✅ Git configurado: $gitUser <$gitEmail>" -ForegroundColor Green

# 3. Inicializar repositorio Git
Show-Header "INICIALIZANDO REPOSITORIO GIT"
if (-not (Test-Path ".git")) {
    git init
    git add .
    git commit -m "Initial commit"
    git branch -M main
    Write-Host "✅ Repositorio Git inicializado" -ForegroundColor Green
} else {
    Write-Host "✅ Repositorio Git ya está inicializado" -ForegroundColor Green
}

# 4. Configuración de GitHub
Show-Header "CONFIGURACIÓN DE GITHUB"
$githubRepo = Read-Host "¿Deseas conectar con un repositorio de GitHub? (s/n)"
if ($githubRepo -eq 's') {
    $repoUrl = Read-Host "Ingresa la URL de tu repositorio de GitHub (ej: https://github.com/tu-usuario/tu-repositorio.git)"
    if ($repoUrl) {
        git remote remove origin 2>$null
        git remote add origin $repoUrl
        git push -u origin main
        Write-Host "✅ Repositorio de GitHub configurado" -ForegroundColor Green
    }
}

# 5. Configuración de Render (Backend)
Show-Header "CONFIGURACIÓN DE RENDER (BACKEND)"
Write-Host "🔧 Configurando el backend en Render..." -ForegroundColor Yellow
Write-Host "`n🔗 Por favor, sigue estos pasos:" -ForegroundColor Cyan
Write-Host "1. Abre https://dashboard.render.com/ en tu navegador" -ForegroundColor Cyan
Write-Host "2. Haz clic en 'New' > 'Web Service'" -ForegroundColor Cyan
Write-Host "3. Conecta tu repositorio de GitHub" -ForegroundColor Cyan
Write-Host "4. Configura el servicio con estos parámetros:" -ForegroundColor Cyan
Write-Host "   - Name: $($config.render.serviceName)" -ForegroundColor Cyan
Write-Host "   - Region: $($config.render.region)" -ForegroundColor Cyan
Write-Host "   - Branch: $($config.github.branch)" -ForegroundColor Cyan
Write-Host "   - Build Command: cd backend && npm install" -ForegroundColor Cyan
Write-Host "   - Start Command: node server.js" -ForegroundColor Cyan
Write-Host "5. Añade estas variables de entorno:" -ForegroundColor Cyan
$config.render.env.GetEnumerator() | ForEach-Object {
    Write-Host "   - $($_.Key) = $($_.Value)" -ForegroundColor Cyan
}

# 6. Configuración de Vercel (Frontend)
Show-Header "CONFIGURACIÓN DE VERCEL (FRONTEND)"
Write-Host "🎨 Configurando el frontend en Vercel..." -ForegroundColor Yellow
Write-Host "`n🔗 Por favor, sigue estos pasos:" -ForegroundColor Cyan
Write-Host "1. Abre https://vercel.com/new en tu navegador" -ForegroundColor Cyan
Write-Host "2. Conecta tu repositorio de GitHub" -ForegroundColor Cyan
Write-Host "3. Configura el proyecto con estos parámetros:" -ForegroundColor Cyan
Write-Host "   - Framework: $($config.vercel.framework)" -ForegroundColor Cyan
Write-Host "   - Root Directory: frontend" -ForegroundColor Cyan
Write-Host "   - Build Command: $($config.vercel.buildCommand)" -ForegroundColor Cyan
Write-Host "   - Output Directory: $($config.vercel.outputDirectory)" -ForegroundColor Cyan
Write-Host "4. Añade esta variable de entorno:" -ForegroundColor Cyan
Write-Host "   - VITE_API_URL = https://$($config.render.serviceName).onrender.com/api" -ForegroundColor Cyan

# 7. Finalización
Show-Header "¡CONFIGURACIÓN COMPLETADA!"
Write-Host "✅ La configuración en la nube está lista" -ForegroundColor Green
Write-Host "`n🔗 URLs importantes:" -ForegroundColor Cyan
Write-Host "- Backend: https://$($config.render.serviceName).onrender.com" -ForegroundColor Cyan
Write-Host "- Frontend: [Se proporcionará después del despliegue en Vercel]" -ForegroundColor Cyan

# 8. Abrir paneles de control
$openDashboards = Read-Host "`n¿Quieres abrir los paneles de control de Render y Vercel? (s/n)"
if ($openDashboards -eq 's') {
    Start-Process "https://dashboard.render.com/"
    Start-Process "https://vercel.com/dashboard"
}

Write-Host "`n¡Listo! Sigue las instrucciones anteriores para completar el despliegue en la nube." -ForegroundColor Green

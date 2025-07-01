# Script de configuración en la nube simplificado
# ===========================================

# Mostrar encabezado
Write-Host "`n"
Write-Host "=======================================" -ForegroundColor Cyan
Write-Host "  CONFIGURACIÓN EN LA NUBE - ABITARE" -ForegroundColor Cyan
Write-Host "=======================================" -ForegroundColor Cyan
Write-Host "`n"

# 1. Verificar Git
Write-Host "1. VERIFICANDO GIT..." -ForegroundColor Yellow
$gitVersion = git --version
if ($?) {
    Write-Host "✅ Git instalado: $gitVersion" -ForegroundColor Green
} else {
    Write-Host "❌ Git no está instalado. Por favor instala Git primero." -ForegroundColor Red
    exit 1
}

# 2. Verificar rama actual
try {
    $currentBranch = git rev-parse --abbrev-ref HEAD
    Write-Host "✅ Rama actual: $currentBranch" -ForegroundColor Green
} catch {
    Write-Host "❌ Error al verificar la rama: $_" -ForegroundColor Red
    exit 1
}

# 3. Configuración de Render (Backend)
Write-Host "`n2. CONFIGURACIÓN DE RENDER (BACKEND)" -ForegroundColor Yellow
Write-Host "`n🔗 Sigue estos pasos para configurar el backend en Render:" -ForegroundColor Cyan
Write-Host "1. Abre https://dashboard.render.com/" -ForegroundColor Cyan
Write-Host "2. Haz clic en 'New' > 'Web Service'" -ForegroundColor Cyan
Write-Host "3. Conecta tu repositorio de GitHub: JABx1/windsurf-project" -ForegroundColor Cyan
Write-Host "4. Configura el servicio con estos parámetros:" -ForegroundColor Cyan
Write-Host "   - Name: abitare-backend" -ForegroundColor Cyan
Write-Host "   - Region: oregon (o la más cercana a ti)" -ForegroundColor Cyan
Write-Host "   - Branch: main" -ForegroundColor Cyan
Write-Host "   - Build Command: cd backend && npm install" -ForegroundColor Cyan
Write-Host "   - Start Command: node server.js" -ForegroundColor Cyan
Write-Host "5. Añade estas variables de entorno:" -ForegroundColor Cyan
Write-Host "   - NODE_ENV = production" -ForegroundColor Cyan
Write-Host "   - MONGODB_URI = mongodb+srv://Zkyhewbf:64740429-f602-4388-bcba-30706fe842b8@cluster0.00zixai.mongodb.net/abitare?retryWrites=true&w=majority" -ForegroundColor Cyan
Write-Host "   - JWT_SECRET = [genera uno con: [System.Guid]::NewGuid().ToString()]" -ForegroundColor Cyan
Write-Host "   - JWT_EXPIRE = 30d" -ForegroundColor Cyan
Write-Host "   - PORT = 10000" -ForegroundColor Cyan

# 4. Configuración de Vercel (Frontend)
Write-Host "`n3. CONFIGURACIÓN DE VERCEL (FRONTEND)" -ForegroundColor Yellow
Write-Host "`n🔗 Sigue estos pasos para configurar el frontend en Vercel:" -ForegroundColor Cyan
Write-Host "1. Abre https://vercel.com/new" -ForegroundColor Cyan
Write-Host "2. Importa tu repositorio de GitHub: JABx1/windsurf-project" -ForegroundColor Cyan
Write-Host "3. Configura el proyecto con estos parámetros:" -ForegroundColor Cyan
Write-Host "   - Framework: Vite" -ForegroundColor Cyan
Write-Host "   - Root Directory: frontend" -ForegroundColor Cyan
Write-Host "   - Build Command: npm run build" -ForegroundColor Cyan
Write-Host "   - Output Directory: dist" -ForegroundColor Cyan
Write-Host "4. Añade esta variable de entorno:" -ForegroundColor Cyan
Write-Host "   - VITE_API_URL = https://abitare-backend.onrender.com/api" -ForegroundColor Cyan

# 5. Instrucciones finales
Write-Host "`n4. INSTRUCCIONES FINALES" -ForegroundColor Yellow
Write-Host "`n✅ Una vez completados los pasos anteriores:" -ForegroundColor Green
Write-Host "- Tu backend estará disponible en: https://abitare-backend.onrender.com" -ForegroundColor Cyan
Write-Host "- Tu frontend se desplegará automáticamente en Vercel" -ForegroundColor Cyan
Write-Host "- Asegúrate de que la URL del backend en las variables de entorno del frontend sea la correcta" -ForegroundColor Yellow

# Preguntar si desea abrir los paneles
$openDashboards = Read-Host "`n¿Quieres abrir los paneles de control de Render y Vercel? (s/n)"
if ($openDashboards -eq 's') {
    Start-Process "https://dashboard.render.com/"
    Start-Process "https://vercel.com/dashboard"
}

Write-Host "`n¡Configuración completada! Sigue las instrucciones anteriores para completar el despliegue." -ForegroundColor Green

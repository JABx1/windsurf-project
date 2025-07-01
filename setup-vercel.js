const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔄 Configurando Vercel para el frontend...');

// 1. Verificar que estamos en el directorio correcto
const frontendPath = path.join(__dirname, 'frontend');
if (!fs.existsSync(frontendPath)) {
  console.error('❌ No se encontró el directorio frontend');
  process.exit(1);
}

// 2. Crear archivo de configuración de Vercel
const vercelConfig = {
  version: 2,
  build: {
    env: {
      VITE_API_URL: 'https://abitare-backend.onrender.com/api'
    }
  },
  builds: [
    {
      src: 'package.json',
      use: '@vercel/static-build',
      config: {
        distDir: 'dist'
      }
    }
  ],
  routes: [
    { handle: 'filesystem' },
    { src: '/.*', dest: '/index.html' }
  ]
};

fs.writeFileSync(
  path.join(frontendPath, 'vercel.json'),
  JSON.stringify(vercelConfig, null, 2)
);
console.log('✅ Archivo vercel.json creado');

// 3. Instalar dependencias
console.log('📦 Instalando dependencias...');
try {
  execSync('npm install', { cwd: frontendPath, stdio: 'inherit' });
  console.log('✅ Dependencias instaladas');
} catch (error) {
  console.error('❌ Error al instalar dependencias:', error);
  process.exit(1);
}

// 4. Iniciar sesión en Vercel
console.log('🔑 Iniciando sesión en Vercel...');
try {
  execSync('vercel login', { stdio: 'inherit' });
  console.log('✅ Sesión iniciada en Vercel');
} catch (error) {
  console.error('❌ Error al iniciar sesión en Vercel:', error);
  process.exit(1);
}

// 5. Desplegar en Vercel
console.log('🚀 Desplegando en Vercel...');
try {
  execSync('vercel --confirm --prod', { 
    cwd: frontendPath, 
    stdio: 'inherit' 
  });
  console.log('✅ Despliegue en Vercel completado');
} catch (error) {
  console.error('❌ Error al desplegar en Vercel:', error);
  process.exit(1);
}

console.log('✨ ¡Configuración de Vercel completada con éxito!');
console.log('🌐 Tu aplicación estará disponible en la URL proporcionada por Vercel');

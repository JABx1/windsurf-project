const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Starting Vercel build process...');

// Install root dependencies
console.log('📦 Installing root dependencies...');
try {
  execSync('npm install', { stdio: 'inherit' });
} catch (error) {
  console.error('❌ Failed to install root dependencies');
  process.exit(1);
}

// Install frontend dependencies
console.log('📦 Installing frontend dependencies...');
try {
  execSync('cd frontend && npm install', { stdio: 'inherit' });
} catch (error) {
  console.error('❌ Failed to install frontend dependencies');
  process.exit(1);
}

// Build the frontend
console.log('🔨 Building the frontend application...');
try {
  execSync('cd frontend && npm run build', { stdio: 'inherit' });
} catch (error) {
  console.error('❌ Frontend build failed');
  process.exit(1);
}

// Verify the build output
const distPath = path.join(__dirname, 'frontend', 'dist');
if (!fs.existsSync(distPath)) {
  console.error('❌ Build failed: dist directory not found');
  process.exit(1);
}

console.log('✅ Build completed successfully!');

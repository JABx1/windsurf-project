const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('Starting Vercel build process...');

// Install dependencies
console.log('Installing dependencies...');
execSync('cd frontend && npm install', { stdio: 'inherit' });

// Build the app
console.log('Building the application...');
execSync('cd frontend && npm run build', { stdio: 'inherit' });

// Verify the build output
const distPath = path.join(__dirname, 'frontend', 'dist');
if (!fs.existsSync(distPath)) {
  console.error('Build failed: dist directory not found');
  process.exit(1);
}

console.log('Build completed successfully!');

#!/bin/bash
set -e

echo "Starting Vercel build..."

# Navigate to frontend directory
cd frontend

# Install dependencies
echo "Installing dependencies..."
npm install

# Build the application
echo "Building application..."
npm run build

# Verify build output
if [ ! -d "dist" ]; then
  echo "Build failed: dist directory not found"
  exit 1
fi

echo "Build completed successfully!"

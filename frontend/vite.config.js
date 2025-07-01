import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default ({ mode }) => {
  // Cargar variables de entorno
  const env = loadEnv(mode, process.cwd(), '');

  return defineConfig({
    plugins: [
      react({
        jsxRuntime: 'classic',
        babel: {
          plugins: [
            ['@babel/plugin-transform-runtime', { regenerator: true }]
          ]
        }
      })
    ],
    server: {
      port: parseInt(env.PORT) || 3000,
      open: true,
      host: true
    },
    build: {
      outDir: 'dist',
      emptyOutDir: true,
      sourcemap: mode !== 'production',
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: mode === 'production',
          drop_debugger: mode === 'production'
        }
      },
      rollupOptions: {
        output: {
          manualChunks: {
            react: ['react', 'react-dom', 'react-router-dom'],
            vendor: ['axios', 'bootstrap', 'react-bootstrap']
          }
        }
      },
      chunkSizeWarningLimit: 1000
    },
    base: '/',
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src')
      }
    },
    esbuild: {
      jsxInject: `import React from 'react'`
    },
    define: {
      'process.env': {}
    }
  });
};

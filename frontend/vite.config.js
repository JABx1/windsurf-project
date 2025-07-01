import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [
    react({
      // Usar el nuevo JSX transform
      jsxRuntime: 'automatic',
      // Deshabilitar Fast Refresh temporalmente para pruebas
      fastRefresh: false,
    })
  ],
  
  // Configuración del servidor de desarrollo
  server: {
    port: 3000,
    open: true,
    host: true,
    strictPort: true,
    hmr: {
      overlay: true
    }
  },
  
  // Configuración de construcción
  build: {
    target: 'esnext',
    outDir: 'dist',
    sourcemap: true,
    minify: 'esbuild',
    chunkSizeWarningLimit: 1000,
    emptyOutDir: true,
    
    // Optimización de chunks
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-dom', 'react-router-dom'],
          vendor: ['axios', 'bootstrap', 'react-bootstrap']
        },
        // Mejorar el hashing de archivos para cache
        entryFileNames: 'assets/[name].[hash].js',
        chunkFileNames: 'assets/[name].[hash].js',
        assetFileNames: 'assets/[name].[hash].[ext]'
      }
    },
    
    // Deshabilitar la generación de manifiesto para simplificar
    manifest: false,
    
    // Configuración de Terser para mejor minificación
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    }
  },
  
  // Configuración de resolución de módulos
  resolve: {
    alias: {
      // Los alias de React se manejarán automáticamente
    }
  },
  
  // Configuración de entorno
  define: {
    'process.env': {},
    'import.meta.env.MODE': JSON.stringify(process.env.NODE_ENV || 'production')
  },
  
  // Configuración base para rutas
  base: '/',
  
  // Configuración de optimización
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom'],
    force: true
  }
});

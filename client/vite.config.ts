import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const isDev = mode === 'development';

  const proxyConfig = {
    target: 'https://localhost:3444',
    changeOrigin: true,
    secure: false, // Allow self-signed certificates
    // Don't rewrite the path, let the backend handle the /api prefix
    // rewrite: (path: string) => path.replace(/^\/api/, ''),
    configure: (proxy: any, _options: any) => {
      proxy.on('error', (err: any, _req: any, _res: any) => {
        console.error('Proxy error:', err);
      });
      proxy.on('proxyReq', (proxyReq: any, req: any) => {
        console.log('[PROXY] Sending Request:', req.method, req.url);
      });
      proxy.on('proxyRes', (proxyRes: any, req: any) => {
        console.log('[PROXY] Received Response:', proxyRes.statusCode, req.url);
      });
    },
  };

  return {
    plugins: [react()],
    server: {
      port: 3000,
      proxy: {
        // Proxy API requests to the backend
        '^/api': proxyConfig,
        '/api': proxyConfig,
      },
      cors: true,
      strictPort: true,
      host: true,
    },
    define: {
      'process.env.NODE_ENV': `"${mode}"`,
      'process.env': process.env,
    },
    build: {
      outDir: 'dist',
      assetsDir: 'assets',
      sourcemap: isDev,
      minify: !isDev,
      rollupOptions: {
        output: {
          manualChunks: {
            react: ['react', 'react-dom', 'react-router-dom'],
            vendor: ['axios', 'jwt-decode'],
          },
        },
      },
    },
    optimizeDeps: {
      esbuildOptions: {
        // Node.js global to browser globalThis
        define: {
          global: 'globalThis',
        },
      },
    },
  };
});

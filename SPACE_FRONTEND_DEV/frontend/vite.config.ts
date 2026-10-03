import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url'

// Vite config tuned for the Emergent preview proxy (HTTPS on 443) and future
// Capacitor packaging (a clean `dist/` build with root-relative assets).
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    host: '0.0.0.0',
    port: 3000,
    strictPort: true,
    // Allow the dynamic *.preview.emergentagent.com host through the dev server.
    allowedHosts: true,
    // The public preview is served over HTTPS/443, so the HMR websocket must
    // connect back on the secure port rather than the internal 3000.
    hmr: {
      clientPort: 443,
      protocol: 'wss',
    },
    // Containerised filesystems need polling for reliable hot reload.
    watch: {
      usePolling: true,
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
  },
})

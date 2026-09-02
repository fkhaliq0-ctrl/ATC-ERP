import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { normalizePath } from 'vite'

export default defineConfig({
  server: {
    force: true,
  },
  plugins: [
    react(),
    {
      name: 'fix-windows-css-hmr',
      hotUpdate({ modules, file }) {
        // Normalize the path to use forward slashes
        const relativePath = normalizePath(path.relative(process.cwd(), file));
        const virtualId = `\0virtual:css:${relativePath}`;
        const mod = this.environment.moduleGraph.getModuleById(virtualId);
        if (mod) {
          this.environment.moduleGraph.invalidateModule(mod);
          return [...modules, mod];
        }
        return modules;
      }
    }
  ],
  build: {
    outDir: 'dist',
    rollupOptions: {
      output: {
        entryFileNames: 'assets/[name]-[hash].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]'
      }
    }
  }
})
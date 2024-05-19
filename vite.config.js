import { defineConfig } from 'vite'
import { fileURLToPath, URL } from "node:url";
import vue from '@vitejs/plugin-vue'
import vuetify from 'vite-plugin-vuetify'
import svgLoader from 'vite-svg-loader'

export default defineConfig({
  plugins: [
    vue(),
    vuetify({
      autoImport: true,
    }),
    svgLoader()
  ],
  define: { "process.env": {} },
  resolve: {
      alias: {
          "@": fileURLToPath(new URL("./src", import.meta.url)),
      },
      extensions: [".js", ".json", ".jsx", ".mjs", ".ts", ".tsx", ".vue"],
  },
  server: {
    host: '0.0.0.0',
    port: 5173
  },
  optimizeDeps: {
    esbuildOptions: {
        target: 'esnext'
    }
  },
  build: {
      target: 'esnext'
  },
})

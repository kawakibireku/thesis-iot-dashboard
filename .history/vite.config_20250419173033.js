import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import viteFastifyVue from '@fastify/vue/plugin';
import viteVue from '@vitejs/plugin-vue';
import tailwindcss from "@tailwindcss/vite"

// Convert import.meta.url to a file path
const __dirname = dirname(fileURLToPath(import.meta.url));

export default {
  root: join(__dirname, 'client'),
  plugins: [viteFastifyVue(), viteVue(), tailwindcss()],
  resolve: {
    alias: {
      '@': join(__dirname, 'client'),
    },
  },
  ssr: false,
};
import vue from '@vitejs/plugin-vue';
import { defineConfig } from 'vite';


export default defineConfig({
  build: {
    lib: {
      entry: 'src/vue-custom-highlight.ts',
      name: 'VueCustomHighlight',
      formats: ['es', 'cjs'],
    },
    rollupOptions: {
      external: ['vue'],
    },
  },
  plugins: [vue()],
});

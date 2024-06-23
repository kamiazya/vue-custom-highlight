import vue from "@vitejs/plugin-vue";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

export default defineConfig({
  build: {
    lib: {
      entry: "src/vue-highlight.ts",
      name: "VueHighlight",
      formats: ["es", "cjs"],
    },
    rollupOptions: {
      external: ["vue"],
    },
  },
  plugins: [
    vue(),
    dts({
      rollupTypes: true,
      include: "src/**",
    }),
  ],
});

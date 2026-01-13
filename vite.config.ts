import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "node:path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "/sc-datav/",
  resolve: {
    alias: {
      "@": resolve("src"),
    },
  },
  css: {
    preprocessorOptions: {
      less: {
        // 支持内联 JavaScript (某些库如 Ant Design 需要)
        javascriptEnabled: true,
        // 如果你有全局变量文件，可以在这里引入
        // additionalData: `@import "./src/styles/variables.less";`
      },
    },
  },
});

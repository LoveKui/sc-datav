import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "node:path";
import compression from "vite-plugin-compression";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    compression({
      // gzip 压缩选项
      verbose: true, // 是否在控制台输出压缩信息
      disable: false, // 是否禁用压缩
      threshold: 10240, // 只有大于 10kb 的文件才会被压缩
      algorithm: "gzip", // 使用 gzip 压缩
      ext: ".gz", // 压缩后的文件扩展名
    }),
  ],
  base: "/sc-datav/",
  resolve: {
    alias: {
      "@": resolve("src"),
    },
  },
  //  esbuild: {
  //     drop: isDevelopment ? [] : ["console", "debugger"],
  //     //drop: ["console", "debugger"],

  //   },
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

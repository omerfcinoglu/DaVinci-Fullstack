import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  resolve: {
    alias: { "@": "/src" },
    dedupe: ["react", "react-dom"],
  },
  base: "./",
  build: {
    outDir: "dist",
    assetsDir: "assets",
    emptyOutDir: true,
    rollupOptions: {
      output: {
        assetFileNames: "assets/[name].[hash][extname]",
        chunkFileNames: "assets/[name].[hash].js",
        entryFileNames: "assets/[name].[hash].js",
      },
    },
  },
  optimizeDeps: {
    include: [
      "react",
      "react-dom",
      "react-redux",
      "@reduxjs/toolkit",
      "react-router-dom",
      "@heroui/react",
      "clsx",
      "framer-motion",
    ],
  },
});

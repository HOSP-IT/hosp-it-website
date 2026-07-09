import path from "path"
import react from "@vitejs/plugin-react"
import vitePrerender from 'vite-plugin-prerender'
import { defineConfig } from "vite"
import { inspectAttr } from 'kimi-plugin-inspect-react'

// https://vite.dev/config/
export default defineConfig({
  base: './',
plugins: [
      inspectAttr(), 
      react(),
      vitePrerender({
        staticDir: path.resolve(__dirname, 'dist'),
        routes: ['/', '/integrasi-satusehat'],
      })
    ],
  server: {
    port: 3000,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});

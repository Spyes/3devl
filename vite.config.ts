import { UserConfig } from "vite";

export default {
  root: 'src',
  publicDir: '../static/',
  server: {
    host: true,
    open: true,
  },
  build: {
    outDir: '../dist',
    emptyOutDir: true,
    sourcemap: true,
  },
} satisfies UserConfig
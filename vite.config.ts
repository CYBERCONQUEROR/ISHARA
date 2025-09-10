import path from "path";
import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vite";

export default defineConfig({
  server: { 
    host: '0.0.0.0',
    port: 3000,
    watch: {
      ignored: ['**/env/**']
    },
    allowedHosts: ['.onrender.com', 'ishara-27a6.onrender.com'] // 👈 add this
  },
  build: {
    chunkSizeWarningLimit: 1600, // increase limit (default 500kb)
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});

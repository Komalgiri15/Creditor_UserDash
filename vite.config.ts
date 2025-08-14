import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  
  server: {
    host: "::",
    port: 3000,
  },
  base: '/',
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  define: {
    'import.meta.env.VITE_API_BASE_URL': JSON.stringify('https://sharebackend-sdkp.onrender.com'),
  },
}));

// https://sharebackend-sdkp.onrender.com
// https://creditor-backend-1-iijy.onrender.com
// https://creditor-backend-9upi.onrender.com


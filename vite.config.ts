import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: true, // Permite acesso externo
    allowedHosts: ["sistema.evoresult.com.br"], // Adiciona seu domínio à lista de hosts permitidos
    hmr: false,
  },
});

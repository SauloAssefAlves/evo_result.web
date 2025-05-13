import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: true,
    allowedHosts: ["sistema.evoresult.com.br"],
    hmr: {
      protocol: "ws",
      host: "sistema.evoresult.com.br",
      port: 1212, // porta onde o Vite está rodando
    },
  },
});

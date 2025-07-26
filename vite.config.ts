import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  // proxy: {
  //   "/api": {
  //     target: "http://localhost:3001",
  //     changeOrigin: true,
  //   },
  // },
  // server: {
  //   port: 3000,
  //   open: true,
  // }
});

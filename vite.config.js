import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          charts: ["recharts"],
          exercises: ["@bryllim/workout-guide"],
          vendor: [
            "react",
            "react-dom",
            "react-router-dom",
            "lucide-react",
            "idb",
          ],
        },
      },
    },
  },
});

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  const isDevelopment = mode === "development";

  return {
    plugins: [react()],
    server: {
      port: parseInt(process.env.VITE_PORT || "3006"),
      host: true,
      watch: {
        usePolling: true,
      },
    },
    define: {
      __DEV__: isDevelopment,
    },
  };
});

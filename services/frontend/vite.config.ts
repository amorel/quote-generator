import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  const isDevelopment = mode === "development";

  return {
    plugins: [
      react(),
      {
        name: "inject-config-script",
        transformIndexHtml(html) {
          return html.replace(
            "</head>",
            '<script src="/config.js"></script></head>'
          );
        },
      },
    ],
    server: {
      port: parseInt(process.env.VITE_PORT || "3006"),
      host: "0.0.0.0", // Important pour Kubernetes
      watch: {
        usePolling: true,
      },
    },
    define: {
      __DEV__: isDevelopment,
    },
  };
});

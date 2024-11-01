import { build } from "./app";
import { config } from "dotenv";

// Charger les variables d'environnement
config();

const start = async () => {
  try {
    const port = parseInt(process.env.PORT || "3002", 10);
    const host = process.env.HOST || "0.0.0.0";

    const app = await build();

    await app.listen({
      port,
      host,
    });

    // Logs plus détaillés
    console.log(`🚀 Server running on http://${host}:${port}`);
    console.log(
      `📚 Documentation available on http://${host}:${port}/documentation`
    );
    console.log(`🔧 Environment: ${process.env.NODE_ENV || "development"}`);
  } catch (err) {
    console.error("Error starting server:", err);
    process.exit(1);
  }
};

// Gestion des erreurs non capturées
process.on("unhandledRejection", (err) => {
  console.error("Unhandled rejection:", err);
  process.exit(1);
});

process.on("SIGTERM", async () => {
  console.log("SIGTERM signal received: closing HTTP server");
  process.exit(0);
});

start();

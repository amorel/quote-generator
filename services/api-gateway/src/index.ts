import { build } from "./app";
import { config } from "dotenv";

// Charger les variables d'environnement
config();

const start = async () => {
  try {
    const app = await build();
    await app.listen({ port: 3000, host: "0.0.0.0" });
    console.log("Server running on port 3000");
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

start();

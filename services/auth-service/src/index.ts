import { build } from "./app";
import { connectDB } from './config/database';

const start = async () => {
  try {
    await connectDB();
    const app = await build();
    await app.listen({ port: 3001, host: "0.0.0.0" });
    console.log("Server running on port 3001");
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

start();

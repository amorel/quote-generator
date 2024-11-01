// services/auth-service/src/config/database.ts
import mongoose from "mongoose";

export async function connectDB() {
  try {
    const username = process.env.MONGO_INITDB_ROOT_USERNAME || "admin";
    const password = process.env.MONGO_INITDB_ROOT_PASSWORD || "password";
    const host = process.env.MONGO_HOST || "auth-db";
    const port = process.env.MONGO_PORT || "27017";
    const database = process.env.MONGO_DATABASE || "auth";

    const uri = `mongodb://${username}:${password}@${host}:${port}/${database}?authSource=admin`;

    await mongoose.connect(uri);
    console.log("Connected to MongoDB (auth-service)");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
}

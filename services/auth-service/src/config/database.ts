import mongoose from "mongoose";

export async function connectDB() {
  try {
    await mongoose.connect(
      process.env.DB_CONNECTION || "mongodb://auth-db:27017/auth"
    );
    console.log("📦 Connected to MongoDB (Auth Service)");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
}

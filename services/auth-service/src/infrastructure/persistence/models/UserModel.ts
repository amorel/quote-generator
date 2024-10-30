import mongoose, { Document } from "mongoose";

export interface IUserDocument extends Document {
  email: string;
  password: string;
  role: string;
}

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, required: true, default: "user" },
});

export const UserModel = mongoose.model<IUserDocument>("User", userSchema);

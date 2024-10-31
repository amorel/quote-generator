import mongoose, { Document, Schema } from "mongoose";

// Interface de base pour les données utilisateur
export interface IUser {
  email: string;
  password: string;
  role: string;
}

// Interface pour le document Mongoose
export interface IUserDocument extends IUser, Document {
  _id: Schema.Types.ObjectId;
}

const userSchema = new Schema<IUserDocument>({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: "user" },
});

export const UserModel = mongoose.model<IUserDocument>("User", userSchema);

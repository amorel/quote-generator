import mongoose, { Document, Schema } from "mongoose";

export interface IAuthorDocument extends Document {
  _id: string;
  name: string;
  link?: string;
  bio: string;
  description: string;
}

const authorSchema = new Schema(
  {
    _id: { type: String, required: true },
    name: { type: String, required: true },
    link: { type: String },
    bio: { type: String, required: true },
    description: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

export const AuthorModel = mongoose.model<IAuthorDocument>(
  "Author",
  authorSchema
);

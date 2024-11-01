import mongoose, { Document, Schema } from "mongoose";

export interface ITagDocument extends Document {
  _id: string;
  name: string;
}

const tagSchema = new Schema(
  {
    _id: { type: String, required: true },
    name: { type: String, required: true, unique: true },
  },
  {
    timestamps: true,
  }
);

export const TagModel = mongoose.model<ITagDocument>("Tag", tagSchema);

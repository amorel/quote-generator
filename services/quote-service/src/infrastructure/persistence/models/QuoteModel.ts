import mongoose, { Document, Schema } from "mongoose";

export interface IQuoteDocument extends Document {
  _id: string;
  content: string;
  author: string;
  tags: string[];
}

const quoteSchema = new Schema({
  _id: { type: String, required: true },
  content: { type: String, required: true },
  author: { type: String, required: true },
  tags: { type: [String], default: [] },
});

export const QuoteModel = mongoose.model<IQuoteDocument>("Quote", quoteSchema);

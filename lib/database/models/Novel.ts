import mongoose, { Schema, Document, models } from "mongoose";

export interface INovel extends Document {
  userId: string;
  genre: string;
  title: string;
  age: number;
  mood: string;
  summary: string;
  textChunkIds: mongoose.Types.ObjectId[];
  imageIds: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const NovelSchema: Schema = new Schema(
  {
    userId: { type: String, required: true },
    genre: { type: String, required: true },
    title: { type: String, required: true },
    age: { type: Number, required: true },
    mood: { type: String, required: true },
    summary: { type: String, required: true },
    textChunkIds: [{ type: Schema.Types.ObjectId, ref: "TextChunk" }],
    imageIds: [{ type: Schema.Types.ObjectId, ref: "Image" }],
  },
  { timestamps: true }
);
const Novel = models?.Novel || mongoose.model<INovel>("Novel", NovelSchema);

export default Novel;

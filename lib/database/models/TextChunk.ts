import mongoose, { Schema, Document, models } from "mongoose";

export interface ITextChunk extends Document {
  novelId: mongoose.Types.ObjectId;
  index: number;
  text: string;
  createdAt: Date;
  updatedAt: Date;
}

const TextChunkSchema: Schema = new Schema(
  {
    novelId: { type: Schema.Types.ObjectId, ref: "Novel", required: true },
    index: { type: Number, required: true },
    text: { type: String, required: true },
  },
  { timestamps: true }
);

const TextChunk =
  models?.TextChunk || mongoose.model<ITextChunk>("TextChunk", TextChunkSchema);

export default TextChunk;

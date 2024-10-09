import mongoose, { Schema, Document, models } from "mongoose";

export interface IImage extends Document {
  novelId: mongoose.Types.ObjectId;
  index: number;
  imageUrl: string;
  createdAt: Date;
  updatedAt: Date;
}

const ImageSchema: Schema = new Schema(
  {
    novelId: { type: Schema.Types.ObjectId, ref: "Novel", required: true },
    index: { type: Number, required: true },
    imageUrl: { type: String, required: true },
  },
  { timestamps: true }
);

const Image = models?.Image || mongoose.model<IImage>("Image", ImageSchema);

export default Image;

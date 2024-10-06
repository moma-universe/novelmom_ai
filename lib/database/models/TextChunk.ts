import { ObjectId } from "mongodb";

export interface TextChunk {
  _id?: ObjectId;
  novelId: ObjectId;
  index: number;
  text: string;
  createdAt: Date;
  updatedAt: Date;
}

export function createTextChunk(
  novelId: ObjectId,
  index: number,
  text: string,
  updatedAt: Date = new Date(),
  createdAt: Date = new Date()
): TextChunk {
  return {
    novelId,
    index,
    text,
    createdAt,
    updatedAt,
  };
}

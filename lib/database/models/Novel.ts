import { ObjectId } from "mongodb";

export interface Novel {
  _id?: ObjectId;
  genre: string;
  title: string;
  age: number;
  mood: string;
  summary: string;
  textChunkIds: ObjectId[];
  imageIds: ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

export function createNovel(
  genre: string,
  title: string,
  age: number,
  mood: string,
  summary: string,
  textChunkIds: ObjectId[] = [],
  imageIds: ObjectId[] = [],
  updatedAt: Date = new Date(),
  createdAt: Date = new Date()
): Novel {
  return {
    genre,
    title,
    age,
    mood,
    summary,
    textChunkIds,
    imageIds,
    createdAt,
    updatedAt,
  };
}

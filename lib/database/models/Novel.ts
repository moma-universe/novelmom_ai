import { ObjectId } from "mongodb";

export interface Novel {
  _id?: ObjectId;
  userId: string;
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
  userId: string, // 사용자 ID 매개변수 추가
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
    userId,
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

import { ObjectId } from "mongodb";

export interface Image {
  _id?: ObjectId;
  novelId: ObjectId;
  index: number;
  imageUrl: string;
  createdAt: Date;
  updatedAt: Date;
}

export function createImage(
  novelId: ObjectId,
  index: number,
  imageUrl: string,
  updatedAt: Date = new Date(),
  createdAt: Date = new Date()
): Image {
  return {
    novelId,
    index,
    imageUrl,
    createdAt,
    updatedAt,
  };
}

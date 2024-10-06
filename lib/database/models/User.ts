import { ObjectId } from "mongodb";

// 사용자 데이터의 TypeScript 인터페이스 정의
export interface User {
  _id?: ObjectId; // MongoDB에서 자동 생성하는 _id 필드
  clerkId: string;
  email: string;
  lastName: string;
  imageUrl: string;
  createdAt: Date;
  updatedAt: Date;
  // 추가적인 사용자 데이터를 여기에 정의할 수 있습니다.
}

export function createUser(
  clerkId: string,
  email: string,
  lastName: string,
  imageUrl: string,
  createdAt: Date = new Date(),
  updatedAt: Date = new Date()
): User {
  return {
    clerkId,
    email,
    lastName,
    imageUrl,
    createdAt,
    updatedAt,
  };
}

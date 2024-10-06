import mongoose, { Document, models, Schema } from "mongoose";

// User 인터페이스 정의
export interface IUser extends Document {
  clerkId: string;
  email: string;
  lastName: string;
  imageUrl: string;
  novels: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

// User 스키마 정의
const UserSchema: Schema = new Schema(
  {
    clerkId: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    lastName: { type: String, required: true },
    imageUrl: { type: String, required: true },
    novels: [{ type: Schema.Types.ObjectId, ref: "Novel" }],
  },
  {
    timestamps: true, // createdAt과 updatedAt을 자동으로 관리
  }
);

// User 모델 생성 및 내보내기
const User = models?.User || mongoose.model<IUser>("User", UserSchema);

export default User;

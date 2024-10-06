import User, { IUser } from "../database/models/user.model";

export async function createUser(
  clerkId: string,
  email: string,
  lastName: string,
  imageUrl: string
): Promise<IUser> {
  try {
    const newUser = new User({
      clerkId,
      email,
      lastName,
      imageUrl,
    });

    const savedUser = await newUser.save();
    return savedUser;
  } catch (error) {
    console.error("사용자 생성 중 오류 발생:", error);
    throw error;
  }
}

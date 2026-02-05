import { prisma } from "../config/db";
import bcrypt from "bcryptjs";
import { SignupInput } from "../schemas/auth.schema";

export const signup = async (data: SignupInput) => {
  const { email, password, firstName, lastName, role } = data;

  const isUserExists = await prisma.user.findUnique({
    where: { email },
  });
  if (isUserExists) {
    return { error: "USER_ALREADY_EXISTS" };
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      lastName,
      firstName,
      role,
    },
  });
  return user;
};

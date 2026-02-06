import { prisma } from "../config/db";
import bcrypt from "bcryptjs";
import { SignupInput, LoginInput } from "../schemas/auth.schema";
import generateToken from "../utils/generateToken";

export const signup = async (data: SignupInput) => {
  const { email, password, firstName, lastName, role } = data;

  const isUserExists = await prisma.user.findUnique({
    where: { email },
  });
  if (isUserExists) {
    return { error: "USER_ALREADY_EXISTS", user: null, token: null };
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

  const token = generateToken(user.id);
  return { user, error: null, token: token };
};

export const login = async (data: LoginInput) => {
  const { email, password } = data;
  const user = await prisma.user.findUnique({
    where: { email },
  });
  const isPasswordValid = await bcrypt.compare(password, user?.password || "");

  if (!user || !isPasswordValid) {
    return { error: "INVALID_EMAIL_OR_PASSWORD", user: null, token: null };
  }

  const token = generateToken(user.id);
  return { user, error: null, token };
};

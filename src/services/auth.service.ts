import bcrypt from "bcryptjs";
import { prisma } from "../config/db";
import { verifyToken } from "../utils/verifyToken";
const JWT_SECRET = process.env.JWT_SECRET || "supersecret";
import jwt from "jsonwebtoken";
import { generateRefreshToken, generateToken } from "../utils/generateToken";
import type { SignupInput } from "../inputSchemas/auth.schema";

export async function signup(input: SignupInput) {
  const { email, password } = input;
  const isUserExists = await prisma.user.findUnique({
    where: { email },
  });

  if (isUserExists) {
    throw new Error("Email already in use");
  }
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const user = await prisma.user.create({
    data: { ...input, password: hashedPassword },
  });
  const safeUser = { ...user, password: "_" };
  const token = generateToken(user.id);
  const refreshToken = generateRefreshToken(user.id);

  return { token, refreshToken, user: safeUser };
}

export async function login(input: { email: string; password: string }) {
  const user = await prisma.user.findUnique({ where: { email: input.email } });
  if (!user) throw new Error("Invalid password or email");

  const valid = await bcrypt.compare(input.password, user.password);
  if (!valid) throw new Error("Invalid password or email");

  const token = generateToken(user.id);
  const refreshToken = generateRefreshToken(user.id);

  return { token, refreshToken, user };
}

export async function refreshTheToken(refreshToken: string) {
  try {
    const JwtUser = verifyToken(refreshToken);

    const user = await prisma.user.findUnique({
      where: { id: JwtUser.userId },
    });
    if (!user) throw new Error("User not found");

    const newToken = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, {
      expiresIn: "1h",
    });
    const newRefreshToken = generateRefreshToken(JwtUser.userId);

    return { token: newToken, refreshToken: newRefreshToken, user };
  } catch (err) {
    throw new Error("Invalid refresh token", { cause: err });
  }
}

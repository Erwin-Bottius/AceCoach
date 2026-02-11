import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET!;

export interface JwtIdUser {
  userId: string;
}

export function verifyToken(token: string): JwtIdUser {
  return jwt.verify(token, JWT_SECRET) as JwtIdUser;
}

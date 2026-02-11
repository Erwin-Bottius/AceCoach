import { Request, Response } from "express";
import { verifyToken, JwtIdUser } from "../utils/verifyToken";
import { prisma } from "../config/db";
import { Role } from "../generated/prisma/enums";

export interface MyContext {
  req: Request;
  res: Response;
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: Role;
  } | null;
}

export async function createContext({
  req,
  res,
}: {
  req: Request;
  res: Response;
}): Promise<MyContext> {
  const authHeader = req.headers.authorization;
  if (!authHeader) return { req, res, user: null };

  const token = authHeader.replace("Bearer ", "");

  try {
    const JwtUserId = verifyToken(token);
    let user = null;
    if (JwtUserId) {
      user = await prisma.user.findUnique({
        where: { id: JwtUserId.userId },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          role: true,
        },
      });
    }
    console.log("User in context:", user, JwtUserId); // Debug log
    return {
      req,
      res,
      user,
    };
  } catch {
    return { req, res, user: null };
  }
}

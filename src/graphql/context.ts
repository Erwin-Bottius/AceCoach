import type { Request, Response } from "express";
import { verifyToken } from "../utils/verifyToken";
import { prisma } from "../config/db";
import type { Role } from "../generated/prisma/enums";

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
  error: Error | null;
}

export async function createContext({
  req,
  res,
}: {
  req: Request;
  res: Response;
}): Promise<MyContext> {
  const authHeader = req.headers.authorization;
  if (!authHeader) return { req, res, user: null, error: new Error("Invalid token") };
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

    return {
      req,
      res,
      user,
      error: null,
    };
  } catch (err: unknown) {
    const error = err instanceof Error ? err : new Error("Unknown error");
    return { req, res, user: null, error };
  }
}

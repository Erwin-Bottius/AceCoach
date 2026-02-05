import { Request, Response, NextFunction } from "express";
import { signup } from "../services/auth.service";

export const signupController = async (req: Request, res: Response) => {
  const user = await signup(req.body);
  if ("error" in user) {
    return res.status(400).json({
      status: "error",
      message: user.error,
    });
  }
  return res.status(201).json({
    status: "success",
    data: {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
    },
  });
};

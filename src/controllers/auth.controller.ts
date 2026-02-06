import { Request, Response, NextFunction } from "express";
import { signup, login } from "../services/auth.service";

export const signupController = async (req: Request, res: Response) => {
  const { user, token, error } = await signup(req.body);
  if (error || !user || !token) {
    return res.status(400).json({
      status: "error",
      message: error,
    });
  }

  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 24 * 60 * 60 * 1000 * 7, // 7 days
  });

  res.status(201).json({
    status: "success",
    data: {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      token,
    },
  });
};

export const loginController = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const { user, token, error } = await login({ email, password });

  if (error || !user || !token) {
    return res.status(401).json({
      status: "error",
      message: "INVALID_EMAIL_OR_PASSWORD",
    });
  }

  res.json({
    status: "success",
    data: {
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      token,
    },
  });
};

export const logoutController = (req: Request, res: Response) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });
  res.status(200).json({
    status: "success",
    message: "Logged out successfully",
  });
};

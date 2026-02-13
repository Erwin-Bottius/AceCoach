import jwt from "jsonwebtoken";

export const generateToken = (userId: string) => {
  const secret = process.env.JWT_SECRET || "dnwodnwdhe>.whdiuewdlk!@*)(*ndnawjfbski";
  const payload = { userId };

  const token = jwt.sign(payload, secret, { expiresIn: "24h" });

  return token;
};

export const generateRefreshToken = (userId: string) => {
  const secret = process.env.JWT_SECRET || "dnwodnwdhe>.whdiuewdlk!@*)(*ndnawjfbski";
  const payload = { userId };

  const refreshToken = jwt.sign(payload, secret, { expiresIn: "7d" });

  return refreshToken;
};

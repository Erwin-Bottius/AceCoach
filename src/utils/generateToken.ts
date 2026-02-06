import jwt from "jsonwebtoken";

const generateToken = (userId: string) => {
  const secret =
    process.env.JWT_SECRET || "dnwodnwdhe>.whdiuewdlk!@*)(*ndnawjfbski";
  const payload = { userId };

  const token = jwt.sign(payload, secret, { expiresIn: "24h" });

  return token;
};

export default generateToken;

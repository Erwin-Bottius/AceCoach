import { prisma } from "../../config/db";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { signup } from "../../services/auth.service";
import {
  LoginInput,
  SignupInput,
  signupSchema,
} from "../../inputSchemas/auth.schema";

const JWT_SECRET = process.env.JWT_SECRET || "supersecret";

const authResolvers = {
  Mutation: {
    signup: async (_: any, args: SignupInput) => {
      const zodValidation = signupSchema.safeParse(args);
      if (!zodValidation.success) {
        const errorMessages = zodValidation.error!.issues;
        throw new Error(errorMessages.map((issue) => issue.message).join("."));
      }
      return signup(args);
    },
    login: async (_parent: any, args: LoginInput) => {
      const { email, password } = args;

      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) throw new Error("No user found with this email");

      const valid = await bcrypt.compare(password, user.password);
      if (!valid) throw new Error("Invalid password");

      const token = jwt.sign({ userId: user.id }, JWT_SECRET, {
        expiresIn: "7d",
      });

      return { user, token };
    },
  },
};

export default authResolvers;

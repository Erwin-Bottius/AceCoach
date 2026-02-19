import { prisma } from "../../config/db";

import { userUpateSchema, type UserUpdateInput } from "../../inputSchemas/user.schema";
import { requireAuth } from "../../utils/authWrapper";
import type { MyContext } from "../context";

const userResolvers = {
  Query: {
    getAllUsers: requireAuth(async () => {
      return prisma.user.findMany({
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          role: true,
          classesJoined: {
            select: {
              id: true,
              name: true,
              theme: true,
              date: true,
              duration: true,
              capacity: true,
              level: true,
              teacherID: true,
            },
          },
          classesTaught: {
            select: {
              id: true,
              name: true,
              theme: true,
              date: true,
              duration: true,
              capacity: true,
              level: true,
              teacherID: true,
            },
          },
        },
      });
    }),
    getMe: async (_parent: any, _args: any, context: MyContext) => {
      return context.user || null;
    },
  },
  Mutation: {
    updateUser: requireAuth(async (_parent: any, args: UserUpdateInput, context: MyContext) => {
      const userId = context.user?.id;
      if (!userId) throw new Error("Unauthorized");
      const zodValidation = userUpateSchema.safeParse(args);
      if (!zodValidation.success) {
        const errorMessages = zodValidation.error!.issues;
        throw new Error(errorMessages.map((issue) => issue.message).join("."));
      }
      const existingUser = await prisma.user.findUnique({
        where: { id: userId },
      });
      if (!existingUser) throw new Error("User not found");

      return prisma.user.update({
        where: { id: userId },
        data: {
          email: args.email,
          firstName: args.firstName,
          lastName: args.lastName,
        },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          role: true,
        },
      });
    }),
  },
};

export default userResolvers;

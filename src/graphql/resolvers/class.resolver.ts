import { prisma } from "../../config/db";

import { ClassInput, ClassUpdateInput } from "../../inputSchemas/class.schema";
import { requireAuth } from "../../utils/authWrapper";
import { MyContext } from "../context";

const classResolvers = {
  Query: {
    getAllClasses: requireAuth(async () => {
      return prisma.class.findMany({
        include: {
          teacher: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              role: true,
              email: true,
            },
          },
          students: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              role: true,
              email: true,
            },
          },
        },
      });
    }),
  },
  Mutation: {
    createClass: requireAuth(
      async (_parent: any, args: ClassInput, context: MyContext) => {
        const user = context.user;

        if (!user || !user.id) throw new Error("Unauthorized");
        if (user.role !== "TEACHER") throw new Error("Forbidden");

        return prisma.class.create({
          data: {
            name: args.name,
            theme: args.theme,
            date: args.date,
            duration: args.duration,
            capacity: args.capacity,
            level: args.level,
            teacherID: user.id,
          },
          include: {
            teacher: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                role: true,
              },
            },
          },
        });
      },
    ),

    updateClass: requireAuth(
      async (_parent: any, args: ClassUpdateInput, context: any) => {
        const userId = context.user?.id;
        if (!userId) throw new Error("Unauthorized");

        const existingClass = await prisma.class.findUnique({
          where: { id: args.id },
          select: { teacherID: true },
        });

        if (!existingClass) throw new Error("Class not found");

        if (existingClass.teacherID !== userId) {
          throw new Error("Forbidden");
        }

        return prisma.class.update({
          where: { id: args.id },
          data: {
            name: args.name ?? undefined,
            theme: args.theme ?? undefined,
            date: args.date ?? undefined,
            duration: args.duration ?? undefined,
            capacity: args.capacity ?? undefined,
            level: args.level ?? undefined,
            teacherID: args.teacherID ?? undefined,
          },
          include: {
            teacher: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                role: true,
              },
            },
          },
        });
      },
    ),
    deleteClass: requireAuth(
      async (_parent: any, args: { id: string }, context: any) => {
        const userId = context.user?.id;
        if (!userId) throw new Error("Unauthorized");

        const existingClass = await prisma.class.findUnique({
          where: { id: args.id },
          select: {
            teacherID: true,
          },
        });
        if (!existingClass) throw new Error("Class not found");
        if (existingClass.teacherID !== userId) {
          throw new Error("Forbidden");
        }

        return await prisma.class.delete({
          where: { id: args.id },
        });
      },
    ),

    joinClass: requireAuth(
      async (_parent: any, args: { classID: string }, context: any) => {
        const userId = context.user?.id;
        if (!userId) throw new Error("Unauthorized");
        if (context.user?.role !== "STUDENT")
          throw new Error("Forbidden, you cannot join a class as a teacher");
        const existingClass = await prisma.class.findUnique({
          where: { id: args.classID },
        });
        if (!existingClass) throw new Error("Class not found");
        const isStudentInClass = await prisma.class.findFirst({
          where: {
            id: args.classID,
            students: {
              some: {
                id: userId,
              },
            },
          },
        });
        if (isStudentInClass)
          throw new Error("You are already a student in this class");

        return prisma.class.update({
          where: { id: args.classID },
          data: { students: { connect: { id: userId } } },
          include: {
            teacher: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                role: true,
              },
            },
            students: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                role: true,
              },
            },
          },
        });
      },
    ),
    leaveClass: requireAuth(
      async (_parent: any, args: { classID: string }, context: any) => {
        const userId = context.user?.id;
        if (!userId) throw new Error("Unauthorized");
        if (context.user?.role !== "STUDENT")
          throw new Error("Forbidden, you cannot leave a class as a teacher");
        const existingClass = await prisma.class.findUnique({
          where: { id: args.classID },
        });
        if (!existingClass) throw new Error("Class not found");
        const isStudentInClass = await prisma.class.findFirst({
          where: {
            id: args.classID,
            students: {
              some: {
                id: userId,
              },
            },
          },
        });
        if (!isStudentInClass)
          throw new Error(
            "You are not a student in this class, so you cannot leave it",
          );
        return prisma.class.update({
          where: { id: args.classID },
          data: { students: { disconnect: { id: userId } } },
          include: {
            teacher: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                role: true,
              },
            },
            students: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                role: true,
              },
            },
          },
        });
      },
    ),
  },
};

export default classResolvers;

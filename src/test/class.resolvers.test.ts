import { prisma } from "../test/setup";
import classResolvers from "../graphql/resolvers/class.resolver";
import type { GraphQLResolveInfo } from "graphql";
import type { Request, Response } from "express";
import type { ClassInput, ClassUpdateInput } from "../inputSchemas/class.schema";
import type { Class } from "../types/class";

// =============================================
// 1. Initial Setup and Cleanup
// =============================================
describe("Class Resolvers", () => {
  let teacher: any;
  let student: any;
  const prepareCreateClass = async () => {
    return await prisma.class.create({
      data: {
        name: "Pilates",
        theme: "Fitness",
        date: new Date().toISOString(),
        duration: 60,
        capacity: 10,
        level: "BEGINNER",
        teacherID: teacher.id,
      },
    });
  };

  beforeAll(async () => {
    // Create a teacher and a student for testing
    teacher = await prisma.user.create({
      data: {
        email: "teacherClassResolver1@example.com",
        role: "TEACHER",
        firstName: "John",
        lastName: "Doe",
        password: "password123",
      },
    });
    student = await prisma.user.create({
      data: {
        email: "studentClassResolver@example.com",
        role: "STUDENT",
        firstName: "Jane",
        lastName: "Doe",
        password: "password123",
      },
    });
  });

  // =============================================
  // 2. Tests for `createClass` Resolver
  // =============================================
  describe("createClass", () => {
    it("✅ Should create a class if the user is a teacher", async () => {
      const context = {
        user: teacher,
        req: {} as Request,
        res: {} as Response,
      };
      const args = {
        name: "Yoga",
        theme: "Relaxation",
        date: new Date().toISOString(),
        duration: 60,
        capacity: 10,
        level: "BEGINNER",
      };
      const result = (await classResolvers.Mutation.createClass(
        null,
        args as ClassInput,
        context,
        {} as GraphQLResolveInfo,
      )) as Class;
      expect(result.name).toBe("Yoga");
      expect(result.teacher.id).toBe(teacher.id);
    });

    it("❌ Should throw Unauthorized if the user is not authenticated", async () => {
      const context = { user: null, req: {} as Request, res: {} as Response };
      const args = {
        name: "Yoga",
        theme: "Relaxation",
        date: new Date().toISOString(),
        duration: 60,
        capacity: 10,
        level: "BEGINNER",
      };
      await expect(
        classResolvers.Mutation.createClass(
          null,
          args as ClassInput,
          context,
          {} as GraphQLResolveInfo,
        ),
      ).rejects.toThrow("Unauthorized");
    });

    it("❌ Should throw Forbidden if the user is not a teacher", async () => {
      const context = {
        user: student,
        req: {} as Request,
        res: {} as Response,
      };
      const args = {
        name: "Yoga",
        theme: "Relaxation",
        date: new Date().toISOString(),
        duration: 60,
        capacity: 10,
        level: "BEGINNER",
      };
      await expect(
        classResolvers.Mutation.createClass(
          null,
          args as ClassInput,
          context,
          {} as GraphQLResolveInfo,
        ),
      ).rejects.toThrow("Forbidden");
    });
  });

  // =============================================
  // 3. Tests for `updateClass` Resolver
  // =============================================
  describe("updateClass", () => {
    it("✅ Should update a class if the user is the teacher", async () => {
      const createdClass = await prepareCreateClass();
      const context = {
        user: teacher,
        req: {} as Request,
        res: {} as Response,
      };
      const args = {
        id: createdClass.id,
        name: "Yoga Updated",
      };
      const result = (await classResolvers.Mutation.updateClass(
        null,
        args as ClassUpdateInput,
        context,
        {} as GraphQLResolveInfo,
      )) as Class;
      expect(result.name).toBe("Yoga Updated");
    });

    it("❌ Should throw Unauthorized if the user is not authenticated", async () => {
      const context = { user: null, req: {} as Request, res: {} as Response };
      const createdClass = await prepareCreateClass();
      const args = {
        id: createdClass.id,
        name: "Yoga Updated",
      };
      await expect(
        classResolvers.Mutation.updateClass(
          null,
          args as ClassUpdateInput,
          context,
          {} as GraphQLResolveInfo,
        ),
      ).rejects.toThrow("Unauthorized");
    });

    it("❌ Should throw Forbidden if the user is not the teacher of the class", async () => {
      const createdClass = await prepareCreateClass();
      const context = {
        user: student,
        req: {} as Request,
        res: {} as Response,
      };
      const args = {
        id: createdClass.id,
        name: "Yoga Updated",
      };
      await expect(
        classResolvers.Mutation.updateClass(
          null,
          args as ClassUpdateInput,
          context,
          {} as GraphQLResolveInfo,
        ),
      ).rejects.toThrow("Forbidden");
    });

    it("❌ Should throw 'Class not found' if the class does not exist", async () => {
      const context = {
        user: teacher,
        req: {} as Request,
        res: {} as Response,
      };
      const args = {
        id: "non-existent-id",
        name: "Yoga Updated",
      };
      await expect(
        classResolvers.Mutation.updateClass(
          null,
          args as ClassUpdateInput,
          context,
          {} as GraphQLResolveInfo,
        ),
      ).rejects.toThrow("Class not found");
    });
  });

  // =============================================
  // 4. Tests for `deleteClass` Resolver
  // =============================================
  describe("deleteClass", () => {
    it("❌ Should throw Unauthorized if the user is not authenticated", async () => {
      const createdClass = await prepareCreateClass();
      const context = { user: null, req: {} as Request, res: {} as Response };
      const args = { id: createdClass.id };
      await expect(
        classResolvers.Mutation.deleteClass(null, args, context, {} as GraphQLResolveInfo),
      ).rejects.toThrow("Unauthorized");
    });

    it("❌ Should throw Forbidden if the user is not the teacher of the class", async () => {
      const createdClass = await prepareCreateClass();
      const context = {
        user: student,
        req: {} as Request,
        res: {} as Response,
      };
      const args = { id: createdClass.id };
      await expect(
        classResolvers.Mutation.deleteClass(null, args, context, {} as GraphQLResolveInfo),
      ).rejects.toThrow("Forbidden");
    });

    it("❌ Should throw 'Class not found' if the class does not exist", async () => {
      const context = {
        user: teacher,
        req: {} as Request,
        res: {} as Response,
      };
      const args = { id: "non-existent-id" };
      await expect(
        classResolvers.Mutation.deleteClass(null, args, context, {} as GraphQLResolveInfo),
      ).rejects.toThrow("Class not found");
    });
    it("✅ Should delete a class if the user is the teacher", async () => {
      const createdClass = await prepareCreateClass();
      const context = {
        user: teacher,
        req: {} as Request,
        res: {} as Response,
      };
      const args = { id: createdClass.id };
      const result = (await classResolvers.Mutation.deleteClass(
        null,
        args,
        context,
        {} as GraphQLResolveInfo,
      )) as { id: string };
      expect(result.id).toBe(createdClass.id);
    });
  });

  // =============================================
  // 5. Tests for `joinClass` Resolver
  // =============================================
  describe("joinClass", () => {
    it("✅ Should allow a student to join a class", async () => {
      const createdClass = await prepareCreateClass();

      const context = {
        user: student,
        req: {} as Request,
        res: {} as Response,
      };
      const args = { classID: createdClass.id };
      const result = (await classResolvers.Mutation.joinClass(
        null,
        args,
        context,
        {} as GraphQLResolveInfo,
      )) as Class;
      expect(result.students.some((s: any) => s.id === student.id)).toBe(true);
    });

    it("❌ Should throw Unauthorized if the user is not authenticated", async () => {
      const createdClass = await prepareCreateClass();
      const context = { user: null, req: {} as Request, res: {} as Response };
      const args = { classID: createdClass.id };
      await expect(
        classResolvers.Mutation.joinClass(null, args, context, {} as GraphQLResolveInfo),
      ).rejects.toThrow("Unauthorized");
    });

    it("❌ Should throw Forbidden if the user is not a student", async () => {
      const createdClass = await prepareCreateClass();
      const context = {
        user: teacher,
        req: {} as Request,
        res: {} as Response,
      };
      const args = { classID: createdClass.id };
      await expect(
        classResolvers.Mutation.joinClass(null, args, context, {} as GraphQLResolveInfo),
      ).rejects.toThrow("Forbidden");
    });

    it("❌ Should throw 'Class not found' if the class does not exist", async () => {
      const context = {
        user: student,
        req: {} as Request,
        res: {} as Response,
      };
      const args = { classID: "non-existent-id" };
      await expect(
        classResolvers.Mutation.joinClass(null, args, context, {} as GraphQLResolveInfo),
      ).rejects.toThrow("Class not found");
    });

    it("❌ Should throw an error if the student is already in the class", async () => {
      const createdClass = await prepareCreateClass();
      const context = {
        user: student,
        req: {} as Request,
        res: {} as Response,
      };
      const args = { classID: createdClass.id };
      // First join
      await classResolvers.Mutation.joinClass(null, args, context, {} as GraphQLResolveInfo);
      // Second join (should fail)
      await expect(
        classResolvers.Mutation.joinClass(null, args, context, {} as GraphQLResolveInfo),
      ).rejects.toThrow("You are already a student in this class");
    });
  });

  // =============================================
  // 6. Tests for `leaveClass` Resolver
  // =============================================
  describe("leaveClass", () => {
    it("✅ Should allow a student to leave a class", async () => {
      const createdClass = await prepareCreateClass();
      const context = {
        user: student,
        req: {} as Request,
        res: {} as Response,
      };
      const args = { classID: createdClass.id };
      // first join
      await classResolvers.Mutation.joinClass(null, args, context, {} as GraphQLResolveInfo);
      const result = (await classResolvers.Mutation.leaveClass(
        null,
        args,
        context,
        {} as GraphQLResolveInfo,
      )) as Class;
      expect(result.students.some((s: any) => s.id === student.id)).toBe(false);
    });

    it("❌ Should throw Unauthorized if the user is not authenticated", async () => {
      const createdClass = await prepareCreateClass();
      const context = { user: null, req: {} as Request, res: {} as Response };
      const args = { classID: createdClass.id };
      await expect(
        classResolvers.Mutation.leaveClass(null, args, context, {} as GraphQLResolveInfo),
      ).rejects.toThrow("Unauthorized");
    });

    it("❌ Should throw Forbidden if the user is not a student", async () => {
      const createdClass = await prepareCreateClass();
      const context = {
        user: teacher,
        req: {} as Request,
        res: {} as Response,
      };
      const args = { classID: createdClass.id };
      await expect(
        classResolvers.Mutation.leaveClass(null, args, context, {} as GraphQLResolveInfo),
      ).rejects.toThrow("Forbidden");
    });

    it("❌ Should throw 'Class not found' if the class does not exist", async () => {
      const context = {
        user: student,
        req: {} as Request,
        res: {} as Response,
      };
      const args = { classID: "non-existent-id" };
      await expect(
        classResolvers.Mutation.leaveClass(null, args, context, {} as GraphQLResolveInfo),
      ).rejects.toThrow("Class not found");
    });

    it("❌ Should throw an error if the student is not in the class", async () => {
      const createdClass = await prepareCreateClass();
      const context = {
        user: student,
        req: {} as Request,
        res: {} as Response,
      };
      const args = { classID: createdClass.id };
      // // Ensure the student is not in the class
      // await prisma.class.update({
      //   where: { id: createdClass.id },
      //   data: { students: { disconnect: { id: student.id } } },
      // });
      await expect(
        classResolvers.Mutation.leaveClass(null, args, context, {} as GraphQLResolveInfo),
      ).rejects.toThrow("You are not a student in this class");
    });
  });

  // =============================================
  // 7. Tests for `getAllClasses` Resolver
  // =============================================
  describe("getAllClasses", () => {
    it("✅ Should return all classes if the user is authenticated", async () => {
      const context = {
        user: teacher,
        req: {} as Request,
        res: {} as Response,
      };
      const result = await classResolvers.Query.getAllClasses(
        null,
        {},
        context,
        {} as GraphQLResolveInfo,
      );
      expect(Array.isArray(result)).toBe(true);
    });

    it("❌ Should throw Unauthorized if the user is not authenticated", async () => {
      const context = { user: null, req: {} as Request, res: {} as Response };
      await expect(
        classResolvers.Query.getAllClasses(null, {}, context, {} as GraphQLResolveInfo),
      ).rejects.toThrow("Unauthorized");
    });
  });
});

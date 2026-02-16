import { prisma } from "../config/db";
import "../../env.setup";
import "dotenv/config";

beforeAll(async () => {
  await prisma.$executeRaw`TRUNCATE TABLE "_ClassStudents" CASCADE;`;
  await prisma.$executeRaw`TRUNCATE TABLE "_TeacherStudents" CASCADE;`;
  await prisma.$executeRaw`TRUNCATE TABLE "Class" CASCADE;`;
  await prisma.$executeRaw`TRUNCATE TABLE "User" CASCADE;`;
});

afterAll(async () => {
  await prisma.$disconnect(); // Ferme la connexion Prisma
});

export { prisma };

import { prisma } from "../config/db";
import { execSync } from "child_process";

beforeAll(async () => {
  execSync("npx prisma migrate dev --name init", { env: { ...process.env } });
});

afterAll(async () => {
  await prisma.$disconnect();
});

export { prisma };

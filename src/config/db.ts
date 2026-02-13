import "dotenv/config";
import { PrismaClient } from "../generated/prisma/client";

const prisma = new PrismaClient({
  log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
});

const connectToDB = async () => {
  try {
    await prisma.$connect();
  } catch (error) {
    console.error("Error connecting to the database:", error);
    process.exit(1);
  }
};

const disconnectFromDB = async () => {
  await prisma.$disconnect();
};

export { prisma, connectToDB, disconnectFromDB };

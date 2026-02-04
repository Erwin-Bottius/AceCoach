import { PrismaClient } from "@prisma/client/extension";

const prisma = new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
});

const connectToDB = async () => {
    try {
        await prisma.$connect();
        console.log("Connected to the database successfully.");
    } catch (error) {
        console.error("Error connecting to the database:", error);
        process.exit(1);
    }
}

const disconnectFromDB = async () => {
   
        await prisma.$disconnect();
     
}

export  {prisma, connectToDB, disconnectFromDB};
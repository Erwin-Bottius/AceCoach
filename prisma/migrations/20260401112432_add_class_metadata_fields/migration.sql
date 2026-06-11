-- AlterTable
ALTER TABLE "Class" ADD COLUMN     "isPublished" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "location" TEXT,
ADD COLUMN     "price" INTEGER;

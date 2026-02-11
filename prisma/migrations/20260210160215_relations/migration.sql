/*
  Warnings:

  - You are about to drop the column `ownerId` on the `Class` table. All the data in the column will be lost.
  - Added the required column `level` to the `Class` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `Class` table without a default value. This is not possible if the table is not empty.
  - Added the required column `teacherID` to the `Class` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Class" DROP CONSTRAINT "Class_ownerId_fkey";

-- DropIndex
DROP INDEX "Class_ownerId_idx";

-- AlterTable
ALTER TABLE "Class" DROP COLUMN "ownerId",
ADD COLUMN     "level" TEXT NOT NULL,
ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "teacherID" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "_TeacherStudents" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_TeacherStudents_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_ClassStudents" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_ClassStudents_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_TeacherStudents_B_index" ON "_TeacherStudents"("B");

-- CreateIndex
CREATE INDEX "_ClassStudents_B_index" ON "_ClassStudents"("B");

-- CreateIndex
CREATE INDEX "Class_teacherID_idx" ON "Class"("teacherID");

-- AddForeignKey
ALTER TABLE "Class" ADD CONSTRAINT "Class_teacherID_fkey" FOREIGN KEY ("teacherID") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_TeacherStudents" ADD CONSTRAINT "_TeacherStudents_A_fkey" FOREIGN KEY ("A") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_TeacherStudents" ADD CONSTRAINT "_TeacherStudents_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ClassStudents" ADD CONSTRAINT "_ClassStudents_A_fkey" FOREIGN KEY ("A") REFERENCES "Class"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ClassStudents" ADD CONSTRAINT "_ClassStudents_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

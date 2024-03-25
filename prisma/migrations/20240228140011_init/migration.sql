/*
  Warnings:

  - You are about to drop the `QandAData` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "QandAData";

-- CreateTable
CREATE TABLE "QAData" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "lang" TEXT NOT NULL,
    "tof" BOOLEAN NOT NULL,
    "question" TEXT NOT NULL,
    "answer" TEXT NOT NULL,
    "modelAns" TEXT NOT NULL,
    "comment" TEXT NOT NULL,

    CONSTRAINT "QAData_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "QAData" ADD CONSTRAINT "QAData_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Authenticate"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

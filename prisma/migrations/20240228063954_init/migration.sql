-- CreateTable
CREATE TABLE "QandAData" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "lang" TEXT NOT NULL,
    "tof" BOOLEAN NOT NULL,
    "question" TEXT NOT NULL,
    "answer" TEXT NOT NULL,
    "model_answer" TEXT NOT NULL,
    "comment" TEXT NOT NULL,

    CONSTRAINT "QandAData_pkey" PRIMARY KEY ("id")
);

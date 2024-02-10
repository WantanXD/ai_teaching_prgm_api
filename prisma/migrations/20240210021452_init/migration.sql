-- CreateTable
CREATE TABLE "Authenticate" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "pass" TEXT NOT NULL,
    "salt" TEXT NOT NULL,

    CONSTRAINT "Authenticate_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Authenticate_email_key" ON "Authenticate"("email");

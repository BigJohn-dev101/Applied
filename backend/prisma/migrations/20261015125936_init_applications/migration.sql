-- CreateEnum
CREATE TYPE "Stage" AS ENUM ('wishlist', 'applied', 'interview', 'offer', 'closed');

-- CreateTable
CREATE TABLE "Application" (
    "id" TEXT NOT NULL,
    "company" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "link" TEXT,
    "dateSent" DATE NOT NULL,
    "stage" "Stage" NOT NULL DEFAULT 'wishlist',
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Application_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Application_stage_idx" ON "Application"("stage");

-- CreateIndex
CREATE INDEX "Application_createdAt_idx" ON "Application"("createdAt");

-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "icon" TEXT;

-- CreateTable
CREATE TABLE "Experience" (
    "id" SERIAL NOT NULL,
    "role" TEXT NOT NULL,
    "company" TEXT NOT NULL,
    "period" TEXT NOT NULL,
    "location" TEXT,
    "logo" TEXT,
    "tech" TEXT NOT NULL DEFAULT '',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Experience_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Skill" (
    "id" SERIAL NOT NULL,
    "category" TEXT NOT NULL,
    "icon" TEXT,
    "items" TEXT NOT NULL DEFAULT '',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Skill_pkey" PRIMARY KEY ("id")
);

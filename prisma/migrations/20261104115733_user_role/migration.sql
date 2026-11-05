-- CreateEnum
CREATE TYPE "userRole" AS ENUM ('user', 'admin');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "role" "userRole" NOT NULL DEFAULT 'user';

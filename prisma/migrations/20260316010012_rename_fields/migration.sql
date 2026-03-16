/*
  Warnings:

  - You are about to drop the column `sessionCategory` on the `Session` table. All the data in the column will be lost.
  - You are about to drop the column `sessionLength` on the `Session` table. All the data in the column will be lost.
  - You are about to drop the column `sessionName` on the `Session` table. All the data in the column will be lost.
  - You are about to drop the column `sessionRating` on the `Session` table. All the data in the column will be lost.
  - Added the required column `category` to the `Session` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `Session` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Session" DROP COLUMN "sessionCategory",
DROP COLUMN "sessionLength",
DROP COLUMN "sessionName",
DROP COLUMN "sessionRating",
ADD COLUMN     "category" TEXT NOT NULL,
ADD COLUMN     "length" DOUBLE PRECISION,
ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "rating" INTEGER;

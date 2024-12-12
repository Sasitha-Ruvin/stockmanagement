/*
  Warnings:

  - You are about to drop the column `unitprice` on the `materialstock` table. All the data in the column will be lost.
  - Added the required column `unitPrice` to the `MaterialStock` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `materialstock` DROP COLUMN `unitprice`,
    ADD COLUMN `unitPrice` INTEGER NOT NULL;

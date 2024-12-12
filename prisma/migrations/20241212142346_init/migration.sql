/*
  Warnings:

  - You are about to drop the column `price` on the `materialstock` table. All the data in the column will be lost.
  - Added the required column `unitprice` to the `MaterialStock` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `materialstock` DROP COLUMN `price`,
    ADD COLUMN `unitprice` INTEGER NOT NULL;

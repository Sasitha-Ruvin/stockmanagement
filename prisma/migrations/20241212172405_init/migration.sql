/*
  Warnings:

  - You are about to alter the column `unitPrice` on the `material` table. The data in that column could be lost. The data in that column will be cast from `Double` to `VarChar(191)`.

*/
-- AlterTable
ALTER TABLE `material` MODIFY `unitPrice` VARCHAR(191) NOT NULL;

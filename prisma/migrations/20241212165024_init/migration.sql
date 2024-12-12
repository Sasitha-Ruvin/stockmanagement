/*
  Warnings:

  - You are about to alter the column `unitPrice` on the `materialstock` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Double`.

*/
-- AlterTable
ALTER TABLE `materialstock` MODIFY `description` VARCHAR(191) NULL,
    MODIFY `quantity` VARCHAR(191) NOT NULL,
    MODIFY `unitPrice` DOUBLE NOT NULL;

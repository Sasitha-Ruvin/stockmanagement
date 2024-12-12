/*
  Warnings:

  - You are about to alter the column `quantity` on the `material` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - You are about to alter the column `unitPrice` on the `material` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Double`.

*/
-- AlterTable
ALTER TABLE `material` MODIFY `quantity` INTEGER NOT NULL,
    MODIFY `unitPrice` DOUBLE NOT NULL;

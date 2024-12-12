/*
  Warnings:

  - You are about to drop the column `dateAdded` on the `equipmentstock` table. All the data in the column will be lost.
  - You are about to alter the column `quantity` on the `equipmentstock` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - You are about to alter the column `unitPrice` on the `equipmentstock` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Double`.
  - You are about to drop the column `dateAdded` on the `rentalstocks` table. All the data in the column will be lost.
  - You are about to alter the column `quantity` on the `rentalstocks` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - Made the column `unitPrice` on table `rentalstocks` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `equipmentstock` DROP COLUMN `dateAdded`,
    MODIFY `quantity` INTEGER NOT NULL,
    MODIFY `unitPrice` DOUBLE NOT NULL;

-- AlterTable
ALTER TABLE `rentalstocks` DROP COLUMN `dateAdded`,
    MODIFY `quantity` INTEGER NOT NULL,
    MODIFY `unitPrice` DOUBLE NOT NULL;

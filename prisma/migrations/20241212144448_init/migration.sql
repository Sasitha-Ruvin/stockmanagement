-- AlterTable
ALTER TABLE `equipmentstock` ADD COLUMN `isDeleted` BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE `materialstock` ADD COLUMN `isDeleted` BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE `rentalstocks` ADD COLUMN `isDeleted` BOOLEAN NOT NULL DEFAULT false;

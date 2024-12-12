/*
  Warnings:

  - You are about to drop the `stockissuance` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `stocktransaction` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `price` to the `Stock` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `stockissuance` DROP FOREIGN KEY `StockIssuance_stockId_fkey`;

-- DropForeignKey
ALTER TABLE `stocktransaction` DROP FOREIGN KEY `StockTransaction_stockId_fkey`;

-- AlterTable
ALTER TABLE `stock` ADD COLUMN `price` INTEGER NOT NULL,
    MODIFY `dateAdded` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3);

-- DropTable
DROP TABLE `stockissuance`;

-- DropTable
DROP TABLE `stocktransaction`;

-- CreateTable
CREATE TABLE `Supplier` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `contact` VARCHAR(191) NOT NULL,
    `address` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

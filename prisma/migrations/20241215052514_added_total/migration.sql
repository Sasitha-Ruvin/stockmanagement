-- AlterTable
ALTER TABLE `purchase` ADD COLUMN `total` DOUBLE NULL;

-- AlterTable
ALTER TABLE `purchaseitem` ADD COLUMN `unitPrice` DOUBLE NULL,
    ADD COLUMN `unitTotal` DOUBLE NULL;

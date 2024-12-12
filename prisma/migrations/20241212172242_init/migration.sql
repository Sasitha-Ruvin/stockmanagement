/*
  Warnings:

  - You are about to drop the `materialstock` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE `materialstock`;

-- CreateTable
CREATE TABLE `Material` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `quantity` VARCHAR(191) NOT NULL,
    `supplier` VARCHAR(191) NULL,
    `unitPrice` DOUBLE NOT NULL,
    `isDeleted` BOOLEAN NOT NULL DEFAULT false,

    UNIQUE INDEX `Material_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Purchase` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `purchaseDate` DATETIME(3) NOT NULL,
    `totalCost` DOUBLE NOT NULL,
    `materialId` INTEGER NULL,
    `equipmentId` INTEGER NULL,
    `quantity` INTEGER NOT NULL,
    `itemType` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Purchase` ADD CONSTRAINT `Purchase_materialId_fkey` FOREIGN KEY (`materialId`) REFERENCES `Material`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Purchase` ADD CONSTRAINT `Purchase_equipmentId_fkey` FOREIGN KEY (`equipmentId`) REFERENCES `EquipmentStock`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

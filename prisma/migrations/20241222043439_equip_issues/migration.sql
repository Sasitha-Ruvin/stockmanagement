-- CreateTable
CREATE TABLE `EquipmentIssue` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `issueDate` DATETIME(3) NOT NULL,
    `issueReason` VARCHAR(191) NULL,
    `returnDate` DATETIME(3) NULL,
    `issuedTo` VARCHAR(191) NOT NULL,
    `issuedBy` VARCHAR(191) NOT NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'On Issue',

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `EquipmentIssueItems` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `quantity` INTEGER NOT NULL,
    `returnedQuantity` INTEGER NULL,
    `equipmentId` INTEGER NOT NULL,
    `issueId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `EquipmentIssueItems` ADD CONSTRAINT `EquipmentIssueItems_equipmentId_fkey` FOREIGN KEY (`equipmentId`) REFERENCES `EquipmentStock`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `EquipmentIssueItems` ADD CONSTRAINT `EquipmentIssueItems_issueId_fkey` FOREIGN KEY (`issueId`) REFERENCES `EquipmentIssue`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

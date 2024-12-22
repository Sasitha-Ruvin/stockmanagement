-- DropForeignKey
ALTER TABLE `equipmentitem` DROP FOREIGN KEY `EquipmentItem_equipmentId_fkey`;

-- DropForeignKey
ALTER TABLE `equipmentitem` DROP FOREIGN KEY `EquipmentItem_purchaseId_fkey`;

-- DropForeignKey
ALTER TABLE `issueitems` DROP FOREIGN KEY `IssueItems_materialId_fkey`;

-- DropForeignKey
ALTER TABLE `issueitems` DROP FOREIGN KEY `IssueItems_materialissueId_fkey`;

-- DropForeignKey
ALTER TABLE `purchaseitem` DROP FOREIGN KEY `PurchaseItem_materialId_fkey`;

-- DropForeignKey
ALTER TABLE `purchaseitem` DROP FOREIGN KEY `PurchaseItem_purchaseId_fkey`;

-- AddForeignKey
ALTER TABLE `IssueItems` ADD CONSTRAINT `IssueItems_materialId_fkey` FOREIGN KEY (`materialId`) REFERENCES `Material`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `IssueItems` ADD CONSTRAINT `IssueItems_materialissueId_fkey` FOREIGN KEY (`materialissueId`) REFERENCES `MaterialIssue`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PurchaseItem` ADD CONSTRAINT `PurchaseItem_materialId_fkey` FOREIGN KEY (`materialId`) REFERENCES `Material`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PurchaseItem` ADD CONSTRAINT `PurchaseItem_purchaseId_fkey` FOREIGN KEY (`purchaseId`) REFERENCES `Purchase`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `EquipmentItem` ADD CONSTRAINT `EquipmentItem_equipmentId_fkey` FOREIGN KEY (`equipmentId`) REFERENCES `EquipmentStock`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `EquipmentItem` ADD CONSTRAINT `EquipmentItem_purchaseId_fkey` FOREIGN KEY (`purchaseId`) REFERENCES `EquipPurchase`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

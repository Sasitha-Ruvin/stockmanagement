-- CreateTable
CREATE TABLE `MaterialIssue` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `issueDate` DATETIME(3) NOT NULL,
    `issueReason` VARCHAR(191) NULL,
    `issuedBy` VARCHAR(191) NULL,
    `issuedTo` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `IssueItems` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `quantity` INTEGER NOT NULL,
    `materialId` INTEGER NOT NULL,
    `materialissueId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `IssueItems` ADD CONSTRAINT `IssueItems_materialId_fkey` FOREIGN KEY (`materialId`) REFERENCES `Material`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `IssueItems` ADD CONSTRAINT `IssueItems_materialissueId_fkey` FOREIGN KEY (`materialissueId`) REFERENCES `MaterialIssue`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

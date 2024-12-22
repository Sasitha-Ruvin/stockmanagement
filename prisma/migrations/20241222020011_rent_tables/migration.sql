-- CreateTable
CREATE TABLE `RentalPurchase` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `purchaseDate` DATETIME(3) NOT NULL,
    `total` DOUBLE NULL,
    `supplier` VARCHAR(191) NULL,
    `reason` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `RentalPurchaseItem` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `quantity` INTEGER NOT NULL,
    `unitPrice` DOUBLE NULL,
    `unitTotal` DOUBLE NULL,
    `rentalstockid` INTEGER NOT NULL,
    `rentalpurchaseid` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `RentOrder` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `issueDate` DATETIME(3) NOT NULL,
    `returnDate` DATETIME(3) NULL,
    `client` VARCHAR(191) NOT NULL,
    `clinetContact` VARCHAR(191) NOT NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'On Rent',

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `RentItems` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `quantity` INTEGER NOT NULL,
    `rentalstockid` INTEGER NOT NULL,
    `rentalorderid` INTEGER NOT NULL,
    `returnedQuantity` INTEGER NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `RentalPurchaseItem` ADD CONSTRAINT `RentalPurchaseItem_rentalstockid_fkey` FOREIGN KEY (`rentalstockid`) REFERENCES `RentalStocks`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RentalPurchaseItem` ADD CONSTRAINT `RentalPurchaseItem_rentalpurchaseid_fkey` FOREIGN KEY (`rentalpurchaseid`) REFERENCES `RentalPurchase`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RentItems` ADD CONSTRAINT `RentItems_rentalstockid_fkey` FOREIGN KEY (`rentalstockid`) REFERENCES `RentalStocks`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RentItems` ADD CONSTRAINT `RentItems_rentalorderid_fkey` FOREIGN KEY (`rentalorderid`) REFERENCES `RentOrder`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

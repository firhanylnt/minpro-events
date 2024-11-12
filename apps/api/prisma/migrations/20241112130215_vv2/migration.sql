/*
  Warnings:

  - You are about to drop the column `available_end_date` on the `Events` table. All the data in the column will be lost.
  - You are about to drop the column `available_start_date` on the `Events` table. All the data in the column will be lost.
  - You are about to drop the column `event_category` on the `Events` table. All the data in the column will be lost.
  - You are about to drop the column `event_type` on the `Events` table. All the data in the column will be lost.
  - You are about to alter the column `start_date` on the `Events` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `end_date` on the `Events` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `deletedAt` on the `Events` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `expired_at` on the `Points` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `start_date` on the `Promotions` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `end_date` on the `Promotions` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `deletedAt` on the `Promotions` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `valid_until` on the `Tickets` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `deletedAt` on the `Tickets` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to drop the column `payment_method` on the `Transactions` table. All the data in the column will be lost.
  - You are about to alter the column `deletedAt` on the `Transactions` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `deletedAt` on the `Users` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `start_date` on the `Vouchers` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `end_date` on the `Vouchers` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - You are about to alter the column `deletedAt` on the `Vouchers` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - Added the required column `payment_method_id` to the `Transactions` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Events` DROP COLUMN `available_end_date`,
    DROP COLUMN `available_start_date`,
    DROP COLUMN `event_category`,
    DROP COLUMN `event_type`,
    ADD COLUMN `event_category_id` INTEGER NULL,
    ADD COLUMN `event_type_id` INTEGER NULL,
    MODIFY `start_date` DATETIME NOT NULL,
    MODIFY `end_date` DATETIME NOT NULL,
    MODIFY `deletedAt` DATETIME NULL;

-- AlterTable
ALTER TABLE `Points` MODIFY `expired_at` DATETIME NOT NULL;

-- AlterTable
ALTER TABLE `Promotions` MODIFY `event_id` INTEGER NULL,
    MODIFY `start_date` DATETIME NOT NULL,
    MODIFY `end_date` DATETIME NOT NULL,
    MODIFY `deletedAt` DATETIME NULL;

-- AlterTable
ALTER TABLE `Tickets` MODIFY `valid_until` DATETIME NOT NULL,
    MODIFY `deletedAt` DATETIME NULL;

-- AlterTable
ALTER TABLE `Transactions` DROP COLUMN `payment_method`,
    ADD COLUMN `payment_method_id` INTEGER NOT NULL,
    MODIFY `deletedAt` DATETIME NULL;

-- AlterTable
ALTER TABLE `Users` MODIFY `deletedAt` DATETIME NULL;

-- AlterTable
ALTER TABLE `Vouchers` MODIFY `user_id` INTEGER NULL,
    MODIFY `start_date` DATETIME NOT NULL,
    MODIFY `end_date` DATETIME NOT NULL,
    MODIFY `deletedAt` DATETIME NULL;

-- AddForeignKey
ALTER TABLE `Events` ADD CONSTRAINT `Events_event_type_id_fkey` FOREIGN KEY (`event_type_id`) REFERENCES `Event_type`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Events` ADD CONSTRAINT `Events_event_category_id_fkey` FOREIGN KEY (`event_category_id`) REFERENCES `Event_category`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Events` ADD CONSTRAINT `Events_city_id_fkey` FOREIGN KEY (`city_id`) REFERENCES `Cities`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Event_reviews_ratings` ADD CONSTRAINT `Event_reviews_ratings_event_id_fkey` FOREIGN KEY (`event_id`) REFERENCES `Events`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Regions` ADD CONSTRAINT `Regions_country_id_fkey` FOREIGN KEY (`country_id`) REFERENCES `Countries`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Cities` ADD CONSTRAINT `Cities_region_id_fkey` FOREIGN KEY (`region_id`) REFERENCES `Regions`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Transactions` ADD CONSTRAINT `Transactions_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `Users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Transactions` ADD CONSTRAINT `Transactions_payment_method_id_fkey` FOREIGN KEY (`payment_method_id`) REFERENCES `Payment_method`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Promotions` ADD CONSTRAINT `Promotions_event_id_fkey` FOREIGN KEY (`event_id`) REFERENCES `Events`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Vouchers` ADD CONSTRAINT `Vouchers_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `Users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Vouchers` ADD CONSTRAINT `Vouchers_promotion_id_fkey` FOREIGN KEY (`promotion_id`) REFERENCES `Promotions`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Points` ADD CONSTRAINT `Points_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `Users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Tickets` ADD CONSTRAINT `Tickets_transaction_id_fkey` FOREIGN KEY (`transaction_id`) REFERENCES `Transactions`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Tickets` ADD CONSTRAINT `Tickets_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `Users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Tickets` ADD CONSTRAINT `Tickets_event_id_fkey` FOREIGN KEY (`event_id`) REFERENCES `Events`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

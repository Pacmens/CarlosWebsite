/*
  Warnings:

  - You are about to drop the column `code` on the `room` table. All the data in the column will be lost.
  - You are about to drop the column `modCode` on the `room` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX `Room_code_key` ON `room`;

-- DropIndex
DROP INDEX `Room_modCode_key` ON `room`;

-- AlterTable
ALTER TABLE `room` DROP COLUMN `code`,
    DROP COLUMN `modCode`;

-- CreateTable
CREATE TABLE `RoomInvite` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `code` VARCHAR(191) NOT NULL,
    `roomId` INTEGER NOT NULL,
    `level` ENUM('USER', 'MODERATOR', 'ADMIN', 'BACHELOR') NOT NULL,

    UNIQUE INDEX `RoomInvite_code_key`(`code`),
    UNIQUE INDEX `RoomInvite_roomId_level_key`(`roomId`, `level`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `RoomInvite` ADD CONSTRAINT `RoomInvite_roomId_fkey` FOREIGN KEY (`roomId`) REFERENCES `Room`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

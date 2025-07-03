/*
  Warnings:

  - You are about to drop the column `otp_secret` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `User` DROP COLUMN `otp_secret`,
    ADD COLUMN `otp` INTEGER NULL,
    ADD COLUMN `otp_verified` BOOLEAN NOT NULL DEFAULT false;

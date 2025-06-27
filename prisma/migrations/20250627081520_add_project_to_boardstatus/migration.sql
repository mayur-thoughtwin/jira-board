-- AlterTable
ALTER TABLE `BoardStatus` ADD COLUMN `project_id` BIGINT NULL;

-- AddForeignKey
ALTER TABLE `BoardStatus` ADD CONSTRAINT `BoardStatus_project_id_fkey` FOREIGN KEY (`project_id`) REFERENCES `Project`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

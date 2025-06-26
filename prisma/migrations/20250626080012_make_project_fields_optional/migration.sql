-- DropForeignKey
ALTER TABLE `Project` DROP FOREIGN KEY `Project_project_category_id_fkey`;

-- DropIndex
DROP INDEX `Project_project_category_id_fkey` ON `Project`;

-- AlterTable
ALTER TABLE `Project` MODIFY `project_category_id` BIGINT NULL;

-- AddForeignKey
ALTER TABLE `Project` ADD CONSTRAINT `Project_project_category_id_fkey` FOREIGN KEY (`project_category_id`) REFERENCES `ProjectCategory`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

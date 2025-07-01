/*
  Warnings:

  - Added the required column `project_id` to the `UserCollaborator` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `UserCollaborator` ADD COLUMN `project_id` BIGINT NOT NULL;

-- AddForeignKey
ALTER TABLE `UserCollaborator` ADD CONSTRAINT `UserCollaborator_project_id_fkey` FOREIGN KEY (`project_id`) REFERENCES `Project`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

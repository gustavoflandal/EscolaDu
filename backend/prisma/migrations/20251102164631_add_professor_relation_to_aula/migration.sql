/*
  Warnings:

  - You are about to drop the column `sala_old` on the `turmas` table. All the data in the column will be lost.
  - You are about to drop the column `serie_old` on the `turmas` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `aulas` MODIFY `status` VARCHAR(191) NOT NULL DEFAULT 'REALIZADA';

-- AlterTable
ALTER TABLE `turmas` DROP COLUMN `sala_old`,
    DROP COLUMN `serie_old`;

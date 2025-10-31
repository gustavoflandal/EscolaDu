/*
  Warnings:

  - You are about to drop the `professor_formacoes` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `professorId` to the `formacoes` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `professor_formacoes` DROP FOREIGN KEY `professor_formacoes_formacaoId_fkey`;

-- DropForeignKey
ALTER TABLE `professor_formacoes` DROP FOREIGN KEY `professor_formacoes_professorId_fkey`;

-- DropIndex
DROP INDEX `formacoes_nome_key` ON `formacoes`;

-- AlterTable
ALTER TABLE `formacoes` ADD COLUMN `professorId` VARCHAR(191) NOT NULL;

-- DropTable
DROP TABLE `professor_formacoes`;

-- CreateIndex
CREATE INDEX `formacoes_professorId_idx` ON `formacoes`(`professorId`);

-- AddForeignKey
ALTER TABLE `formacoes` ADD CONSTRAINT `formacoes_professorId_fkey` FOREIGN KEY (`professorId`) REFERENCES `professores`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

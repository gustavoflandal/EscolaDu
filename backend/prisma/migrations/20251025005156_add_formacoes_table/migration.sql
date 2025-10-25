/*
  Warnings:

  - You are about to drop the column `formacao` on the `professores` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `professores` DROP COLUMN `formacao`,
    ADD COLUMN `especialidade` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `responsaveis` ALTER COLUMN `tipoVinculo` DROP DEFAULT;

-- CreateTable
CREATE TABLE `formacoes` (
    `id` VARCHAR(191) NOT NULL,
    `professorId` VARCHAR(191) NOT NULL,
    `nivel` VARCHAR(191) NOT NULL,
    `curso` VARCHAR(191) NOT NULL,
    `instituicao` VARCHAR(191) NOT NULL,
    `areaConhecimento` VARCHAR(191) NULL,
    `dataInicio` DATETIME(3) NOT NULL,
    `dataConclusao` DATETIME(3) NULL,
    `emAndamento` BOOLEAN NOT NULL DEFAULT false,
    `cargaHoraria` INTEGER NULL,
    `observacoes` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `formacoes_professorId_idx`(`professorId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `formacoes` ADD CONSTRAINT `formacoes_professorId_fkey` FOREIGN KEY (`professorId`) REFERENCES `professores`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

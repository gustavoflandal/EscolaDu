/*
  Warnings:

  - You are about to drop the column `formacao` on the `professores` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `justificativa_falta` MODIFY `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- AlterTable
ALTER TABLE `professores` DROP COLUMN `formacao`;

-- CreateTable
CREATE TABLE `formacoes` (
    `id` VARCHAR(191) NOT NULL,
    `nome` VARCHAR(191) NOT NULL,
    `descricao` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `formacoes_nome_key`(`nome`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `professor_formacoes` (
    `id` VARCHAR(191) NOT NULL,
    `professorId` VARCHAR(191) NOT NULL,
    `formacaoId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `professor_formacoes_professorId_formacaoId_key`(`professorId`, `formacaoId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `professor_formacoes` ADD CONSTRAINT `professor_formacoes_professorId_fkey` FOREIGN KEY (`professorId`) REFERENCES `professores`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `professor_formacoes` ADD CONSTRAINT `professor_formacoes_formacaoId_fkey` FOREIGN KEY (`formacaoId`) REFERENCES `formacoes`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

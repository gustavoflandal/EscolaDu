/*
  Warnings:

  - You are about to drop the column `disciplinaId` on the `objetivo_aprendizagem` table. All the data in the column will be lost.
  - You are about to drop the column `periodo` on the `objetivo_aprendizagem` table. All the data in the column will be lost.
  - You are about to drop the column `serie` on the `objetivo_aprendizagem` table. All the data in the column will be lost.
  - Added the required column `programaEnsinoId` to the `objetivo_aprendizagem` table without a default value. This is not possible if the table is not empty.

*/

-- Passo 1: Criar a tabela programa_ensino
CREATE TABLE `programa_ensino` (
    `id` VARCHAR(191) NOT NULL,
    `codigo` VARCHAR(191) NOT NULL,
    `nome` VARCHAR(191) NOT NULL,
    `descricao` TEXT NULL,
    `disciplinaId` VARCHAR(191) NOT NULL,
    `serie` VARCHAR(191) NOT NULL,
    `periodo` VARCHAR(191) NULL,
    `anoLetivo` INTEGER NOT NULL,
    `cargaHoraria` INTEGER NULL,
    `observacoes` TEXT NULL,
    `active` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `programa_ensino_codigo_key`(`codigo`),
    INDEX `programa_ensino_disciplinaId_idx`(`disciplinaId`),
    INDEX `programa_ensino_serie_idx`(`serie`),
    INDEX `programa_ensino_anoLetivo_idx`(`anoLetivo`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Passo 2: Adicionar FK da tabela programa_ensino
ALTER TABLE `programa_ensino` ADD CONSTRAINT `programa_ensino_disciplinaId_fkey` 
    FOREIGN KEY (`disciplinaId`) REFERENCES `disciplinas`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- Passo 3: Criar programas de ensino a partir dos objetivos existentes
INSERT INTO `programa_ensino` (`id`, `codigo`, `nome`, `disciplinaId`, `serie`, `periodo`, `anoLetivo`, `active`, `createdAt`, `updatedAt`)
SELECT 
    UUID() as id,
    CONCAT(d.codigo, '-', o.serie, '-', COALESCE(o.periodo, 'GERAL')) as codigo,
    CONCAT(d.nome, ' - ', o.serie, COALESCE(CONCAT(' - ', o.periodo), '')) as nome,
    o.disciplinaId,
    o.serie,
    o.periodo,
    2025 as anoLetivo,
    true as active,
    NOW() as createdAt,
    NOW() as updatedAt
FROM `objetivo_aprendizagem` o
INNER JOIN `disciplinas` d ON d.id = o.disciplinaId
GROUP BY o.disciplinaId, o.serie, o.periodo;

-- Passo 4: Adicionar coluna temporária para mapear programaEnsinoId
ALTER TABLE `objetivo_aprendizagem` ADD COLUMN `programaEnsinoId` VARCHAR(191) NULL;

-- Passo 5: Popular programaEnsinoId nos objetivos existentes
UPDATE `objetivo_aprendizagem` o
INNER JOIN `programa_ensino` p ON 
    p.disciplinaId = o.disciplinaId 
    AND p.serie = o.serie 
    AND (p.periodo = o.periodo OR (p.periodo IS NULL AND o.periodo IS NULL))
SET o.programaEnsinoId = p.id;

-- Passo 6: Tornar programaEnsinoId obrigatório
ALTER TABLE `objetivo_aprendizagem` MODIFY `programaEnsinoId` VARCHAR(191) NOT NULL;

-- Passo 7: Remover a FK antiga
ALTER TABLE `objetivo_aprendizagem` DROP FOREIGN KEY `objetivo_aprendizagem_disciplinaId_fkey`;

-- Passo 8: Remover índice antigo
DROP INDEX `objetivo_aprendizagem_serie_idx` ON `objetivo_aprendizagem`;

-- Passo 9: Remover colunas antigas e adicionar campo ordem
ALTER TABLE `objetivo_aprendizagem` 
    DROP COLUMN `disciplinaId`,
    DROP COLUMN `periodo`,
    DROP COLUMN `serie`,
    ADD COLUMN `ordem` INTEGER NOT NULL DEFAULT 0;

-- Passo 10: Criar novo índice
CREATE INDEX `objetivo_aprendizagem_programaEnsinoId_idx` ON `objetivo_aprendizagem`(`programaEnsinoId`);

-- Passo 11: Adicionar nova FK
ALTER TABLE `objetivo_aprendizagem` ADD CONSTRAINT `objetivo_aprendizagem_programaEnsinoId_fkey` 
    FOREIGN KEY (`programaEnsinoId`) REFERENCES `programa_ensino`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

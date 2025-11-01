-- AlterTable turmas - Adicionar novas colunas
ALTER TABLE `turmas` ADD COLUMN `serieId` VARCHAR(191) NULL;
ALTER TABLE `turmas` ADD COLUMN `salaId` VARCHAR(191) NULL;
ALTER TABLE `turmas` ADD COLUMN `serie_old` VARCHAR(191) NULL;
ALTER TABLE `turmas` ADD COLUMN `sala_old` VARCHAR(191) NULL;

-- Backup dos dados antigos
UPDATE `turmas` SET `serie_old` = `serie`;
UPDATE `turmas` SET `sala_old` = `sala`;

-- Migrar dados de serie (string) para serieId quando houver match
UPDATE `turmas` t
INNER JOIN `Serie` s ON t.`serie` = s.`nome`
SET t.`serieId` = s.`id`;

-- Para turmas sem match, tentar com código
UPDATE `turmas` t
INNER JOIN `Serie` s ON t.`serie` = s.`codigo`
SET t.`serieId` = s.`id`
WHERE t.`serieId` IS NULL;

-- Definir série padrão (1º Ano) para turmas ainda sem serieId
UPDATE `turmas` t
SET t.`serieId` = (SELECT `id` FROM `Serie` WHERE `codigo` = '1ANO' LIMIT 1)
WHERE t.`serieId` IS NULL;

-- Migrar dados de sala (string) para salaId
UPDATE `turmas` t
INNER JOIN `Sala` sa ON t.`sala` = sa.`nome`
SET t.`salaId` = sa.`id`
WHERE t.`sala` IS NOT NULL;

-- Tentar match por código se não achou pelo nome
UPDATE `turmas` t
INNER JOIN `Sala` sa ON t.`sala` = sa.`codigo`
SET t.`salaId` = sa.`id`
WHERE t.`sala` IS NOT NULL AND t.`salaId` IS NULL;

-- Tornar serieId NOT NULL após migração
ALTER TABLE `turmas` MODIFY COLUMN `serieId` VARCHAR(191) NOT NULL;

-- Remover colunas antigas
ALTER TABLE `turmas` DROP COLUMN `serie`;
ALTER TABLE `turmas` DROP COLUMN `sala`;

-- Criar índices
CREATE INDEX `turmas_serieId_idx` ON `turmas`(`serieId`);
CREATE INDEX `turmas_salaId_idx` ON `turmas`(`salaId`);

-- Adicionar foreign keys
ALTER TABLE `turmas` ADD CONSTRAINT `turmas_serieId_fkey` FOREIGN KEY (`serieId`) REFERENCES `Serie`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE `turmas` ADD CONSTRAINT `turmas_salaId_fkey` FOREIGN KEY (`salaId`) REFERENCES `Sala`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
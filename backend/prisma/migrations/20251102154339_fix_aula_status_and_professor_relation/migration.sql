-- Altera o default do status de aulas para PLANEJADA
ALTER TABLE `aulas` MODIFY COLUMN `status` VARCHAR(191) NOT NULL DEFAULT 'PLANEJADA';

-- Cria índice para professorId em aulas
CREATE INDEX `aulas_professorId_idx` ON `aulas`(`professorId`);

-- Adiciona foreign key para professor em aulas
ALTER TABLE `aulas` ADD CONSTRAINT `aulas_professorId_fkey` FOREIGN KEY (`professorId`) REFERENCES `professores`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

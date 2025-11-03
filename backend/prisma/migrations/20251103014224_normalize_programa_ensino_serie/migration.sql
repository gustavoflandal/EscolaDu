/*
  Warnings:

  - You are about to drop the column `serie` on the `programa_ensino` table. All the data in the column will be lost.
  - Added the required column `serieId` to the `programa_ensino` table without a default value. This is not possible if the table is not empty.

*/

-- Step 1: Add new column serieId (nullable temporarily)
ALTER TABLE `programa_ensino` ADD COLUMN `serieId` VARCHAR(191);

-- Step 2: Migrate data - Map serie strings to Serie IDs
UPDATE `programa_ensino` pe
INNER JOIN `Serie` s ON pe.`serie` = s.`codigo`
SET pe.`serieId` = s.`id`;

-- Step 3: Make serieId NOT NULL
ALTER TABLE `programa_ensino` MODIFY COLUMN `serieId` VARCHAR(191) NOT NULL;

-- Step 4: Drop old index and column
DROP INDEX `programa_ensino_serie_idx` ON `programa_ensino`;
ALTER TABLE `programa_ensino` DROP COLUMN `serie`;

-- Step 5: Create new index
CREATE INDEX `programa_ensino_serieId_idx` ON `programa_ensino`(`serieId`);

-- Step 6: Add foreign key constraint
ALTER TABLE `programa_ensino` ADD CONSTRAINT `programa_ensino_serieId_fkey` FOREIGN KEY (`serieId`) REFERENCES `Serie`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

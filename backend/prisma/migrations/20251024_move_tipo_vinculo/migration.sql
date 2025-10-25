-- AlterTable: Adiciona coluna tipoVinculo na tabela responsaveis com valor padrão temporário
ALTER TABLE `responsaveis` ADD COLUMN `tipoVinculo` VARCHAR(191) NOT NULL DEFAULT 'OUTRO';

-- Migra dados: Atualiza tipoVinculo do responsavel baseado no primeiro vínculo
UPDATE `responsaveis` r
INNER JOIN (
    SELECT responsavelId, tipoVinculo
    FROM `vinculo_responsabilidade`
    WHERE id IN (
        SELECT MIN(id)
        FROM `vinculo_responsabilidade`
        GROUP BY responsavelId
    )
) v ON r.id = v.responsavelId
SET r.tipoVinculo = v.tipoVinculo;

-- AlterTable: Remove coluna tipoVinculo da tabela vinculo_responsabilidade
ALTER TABLE `vinculo_responsabilidade` DROP COLUMN `tipoVinculo`;
